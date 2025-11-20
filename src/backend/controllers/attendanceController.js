const db = require('../config/database');

// Check-in
exports.checkIn = async (req, res) => {
  try {
    const { ma_nv } = req.body;
    const ngay_lam = new Date().toISOString().split('T')[0];
    const gio_vao = new Date().toTimeString().split(' ')[0];

    // Validate
    if (!ma_nv) {
      return res.status(400).json({ 
        success: false,
        message: 'Vui lòng cung cấp mã nhân viên' 
      });
    }

    // Kiểm tra nhân viên tồn tại
    const [employee] = await db.query(
      'SELECT * FROM NHANVIEN WHERE ma_nv = ? AND trang_thai = 1',
      [ma_nv]
    );

    if (employee.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Nhân viên không tồn tại hoặc đã nghỉ việc' 
      });
    }

    // Kiểm tra đã check-in hôm nay chưa
    const [existing] = await db.query(
      'SELECT * FROM CHAMCONG WHERE ma_nv = ? AND ngay_lam = ?',
      [ma_nv, ngay_lam]
    );

    if (existing.length > 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Bạn đã check-in hôm nay rồi',
        data: existing[0]
      });
    }

    // Check-in
    await db.query(
      'INSERT INTO CHAMCONG (ma_nv, ngay_lam, gio_vao, so_gio) VALUES (?, ?, ?, 0)',
      [ma_nv, ngay_lam, gio_vao]
    );

    res.json({ 
      success: true,
      message: 'Check-in thành công',
      data: {
        ma_nv,
        ngay_lam,
        gio_vao
      }
    });
  } catch (error) {
    console.error('Check-in error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};

// Check-out
exports.checkOut = async (req, res) => {
  try {
    const { ma_nv } = req.body;
    const ngay_lam = new Date().toISOString().split('T')[0];
    const gio_ra = new Date().toTimeString().split(' ')[0];

    // Validate
    if (!ma_nv) {
      return res.status(400).json({ 
        success: false,
        message: 'Vui lòng cung cấp mã nhân viên' 
      });
    }

    // Kiểm tra đã check-in chưa
    const [existing] = await db.query(
      'SELECT * FROM CHAMCONG WHERE ma_nv = ? AND ngay_lam = ? AND gio_ra IS NULL',
      [ma_nv, ngay_lam]
    );

    if (existing.length === 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Bạn chưa check-in hôm nay hoặc đã check-out rồi' 
      });
    }

    // Check-out và tính số giờ làm
    const [result] = await db.query(`
      UPDATE CHAMCONG 
      SET gio_ra = ?,
          so_gio = TIMESTAMPDIFF(MINUTE, gio_vao, ?) / 60
      WHERE ma_nv = ? AND ngay_lam = ? AND gio_ra IS NULL
    `, [gio_ra, gio_ra, ma_nv, ngay_lam]);

    if (result.affectedRows === 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Không thể check-out' 
      });
    }

    // Lấy thông tin sau khi update
    const [updated] = await db.query(
      'SELECT * FROM CHAMCONG WHERE ma_nv = ? AND ngay_lam = ?',
      [ma_nv, ngay_lam]
    );

    res.json({ 
      success: true,
      message: 'Check-out thành công',
      data: updated[0]
    });
  } catch (error) {
    console.error('Check-out error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};

// Lấy lịch sử chấm công
exports.getAttendanceHistory = async (req, res) => {
  try {
    const { ma_nv } = req.params;
    const { thang, nam } = req.query;

    let query = `
      SELECT 
        cc.*,
        nv.ten_nv
      FROM CHAMCONG cc
      JOIN NHANVIEN nv ON cc.ma_nv = nv.ma_nv
      WHERE cc.ma_nv = ?
    `;
    const params = [ma_nv];

    if (thang && nam) {
      query += ' AND MONTH(cc.ngay_lam) = ? AND YEAR(cc.ngay_lam) = ?';
      params.push(thang, nam);
    }

    query += ' ORDER BY cc.ngay_lam DESC';

    const [records] = await db.query(query, params);

    res.json({
      success: true,
      count: records.length,
      data: records
    });
  } catch (error) {
    console.error('Get attendance history error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};

// Lấy chấm công hôm nay
exports.getTodayAttendance = async (req, res) => {
  try {
    const ngay_lam = new Date().toISOString().split('T')[0];

    const [records] = await db.query(`
      SELECT 
        cc.*,
        nv.ten_nv,
        pb.ten_phong,
        CASE 
          WHEN cc.gio_ra IS NULL THEN 'Chưa checkout'
          WHEN cc.so_gio >= 8 THEN 'Đủ giờ'
          ELSE 'Thiếu giờ'
        END as trang_thai
      FROM CHAMCONG cc
      JOIN NHANVIEN nv ON cc.ma_nv = nv.ma_nv
      JOIN PHONGBAN pb ON nv.ma_phong = pb.ma_phong
      WHERE cc.ngay_lam = ?
      ORDER BY cc.gio_vao
    `, [ngay_lam]);

    res.json({
      success: true,
      count: records.length,
      data: records
    });
  } catch (error) {
    console.error('Get today attendance error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};

// Thống kê chấm công tháng
exports.getMonthlyStats = async (req, res) => {
  try {
    const { thang, nam } = req.query;

    if (!thang || !nam) {
      return res.status(400).json({ 
        success: false,
        message: 'Vui lòng cung cấp tháng và năm' 
      });
    }

    const [stats] = await db.query(`
      SELECT 
        nv.ma_nv,
        nv.ten_nv,
        pb.ten_phong,
        cv.ten_chuc_vu,
        COUNT(cc.id) as so_ngay_lam,
        COALESCE(SUM(cc.so_gio), 0) as tong_gio,
        COALESCE(AVG(cc.so_gio), 0) as gio_tb_ngay,
        CASE 
          WHEN COALESCE(SUM(cc.so_gio), 0) >= 160 THEN 'Đủ giờ'
          ELSE 'Thiếu giờ'
        END as danh_gia
      FROM NHANVIEN nv
      JOIN PHONGBAN pb ON nv.ma_phong = pb.ma_phong
      JOIN CHUCVU cv ON nv.ma_chucvu = cv.ma_chuc_vu
      LEFT JOIN CHAMCONG cc ON nv.ma_nv = cc.ma_nv
        AND MONTH(cc.ngay_lam) = ?
        AND YEAR(cc.ngay_lam) = ?
      WHERE nv.trang_thai = 1
      GROUP BY nv.ma_nv, nv.ten_nv, pb.ten_phong, cv.ten_chuc_vu
      ORDER BY tong_gio DESC
    `, [thang, nam]);

    res.json({
      success: true,
      count: stats.length,
      data: stats
    });
  } catch (error) {
    console.error('Get monthly stats error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};

// Nhân viên đi làm muộn
exports.getLateEmployees = async (req, res) => {
  try {
    const { thang, nam } = req.query;
    const gioVaoChuan = '08:15:00';

    let query = `
      SELECT 
        cc.ngay_lam,
        cc.ma_nv,
        nv.ten_nv,
        pb.ten_phong,
        cc.gio_vao,
        TIMEDIFF(cc.gio_vao, '08:00:00') as tre_phut
      FROM CHAMCONG cc
      JOIN NHANVIEN nv ON cc.ma_nv = nv.ma_nv
      JOIN PHONGBAN pb ON nv.ma_phong = pb.ma_phong
      WHERE cc.gio_vao > ?
    `;
    const params = [gioVaoChuan];

    if (thang && nam) {
      query += ' AND MONTH(cc.ngay_lam) = ? AND YEAR(cc.ngay_lam) = ?';
      params.push(thang, nam);
    }

    query += ' ORDER BY cc.ngay_lam DESC, cc.gio_vao DESC';

    const [records] = await db.query(query, params);

    res.json({
      success: true,
      count: records.length,
      data: records
    });
  } catch (error) {
    console.error('Get late employees error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};

// Nhân viên chưa checkout
exports.getNotCheckedOut = async (req, res) => {
  try {
    const ngay_lam = new Date().toISOString().split('T')[0];

    const [records] = await db.query(`
      SELECT 
        cc.ma_nv,
        nv.ten_nv,
        pb.ten_phong,
        cc.ngay_lam,
        cc.gio_vao,
        TIMEDIFF(CURTIME(), cc.gio_vao) as da_lam
      FROM CHAMCONG cc
      JOIN NHANVIEN nv ON cc.ma_nv = nv.ma_nv
      JOIN PHONGBAN pb ON nv.ma_phong = pb.ma_phong
      WHERE cc.gio_ra IS NULL AND cc.ngay_lam = ?
      ORDER BY cc.gio_vao
    `, [ngay_lam]);

    res.json({
      success: true,
      count: records.length,
      data: records
    });
  } catch (error) {
    console.error('Get not checked out error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};

// Cập nhật chấm công (Admin)
exports.updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { gio_vao, gio_ra } = req.body;

    // Kiểm tra bản ghi tồn tại
    const [existing] = await db.query('SELECT * FROM CHAMCONG WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Không tìm thấy bản ghi chấm công' 
      });
    }

    // Cập nhật
    await db.query(`
      UPDATE CHAMCONG 
      SET gio_vao = ?, 
          gio_ra = ?,
          so_gio = CASE 
            WHEN ? IS NOT NULL THEN TIMESTAMPDIFF(MINUTE, ?, ?) / 60
            ELSE 0 
          END
      WHERE id = ?
    `, [gio_vao, gio_ra, gio_ra, gio_vao, gio_ra, id]);

    res.json({ 
      success: true,
      message: 'Cập nhật chấm công thành công' 
    });
  } catch (error) {
    console.error('Update attendance error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};

// Xóa bản ghi chấm công (Admin)
exports.deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query('DELETE FROM CHAMCONG WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Không tìm thấy bản ghi chấm công' 
      });
    }

    res.json({ 
      success: true,
      message: 'Xóa bản ghi chấm công thành công' 
    });
  } catch (error) {
    console.error('Delete attendance error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};