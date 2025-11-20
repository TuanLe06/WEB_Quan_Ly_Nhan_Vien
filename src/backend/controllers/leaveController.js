const db = require('../config/database');

// Gửi yêu cầu nghỉ phép
exports.createLeaveRequest = async (req, res) => {
  try {
    const { ma_nv, ngay_bat_dau, ngay_ket_thuc, loai_phep, ly_do } = req.body;

    // Validate
    if (!ma_nv || !ngay_bat_dau || !ngay_ket_thuc || !loai_phep) {
      return res.status(400).json({ 
        success: false,
        message: 'Vui lòng nhập đầy đủ thông tin' 
      });
    }

    // Kiểm tra ngày hợp lệ
    if (new Date(ngay_ket_thuc) < new Date(ngay_bat_dau)) {
      return res.status(400).json({ 
        success: false,
        message: 'Ngày kết thúc phải sau ngày bắt đầu' 
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
        message: 'Nhân viên không tồn tại' 
      });
    }

    // Kiểm tra trùng lịch nghỉ phép
    const [overlap] = await db.query(`
      SELECT * FROM NGHIPHEP 
      WHERE ma_nv = ? 
        AND trang_thai != 'Từ chối'
        AND (
          (ngay_bat_dau BETWEEN ? AND ?)
          OR (ngay_ket_thuc BETWEEN ? AND ?)
          OR (? BETWEEN ngay_bat_dau AND ngay_ket_thuc)
        )
    `, [ma_nv, ngay_bat_dau, ngay_ket_thuc, ngay_bat_dau, ngay_ket_thuc, ngay_bat_dau]);

    if (overlap.length > 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Đã có yêu cầu nghỉ phép trong khoảng thời gian này' 
      });
    }

    // Tạo yêu cầu nghỉ phép
    await db.query(`
      INSERT INTO NGHIPHEP (ma_nv, ngay_bat_dau, ngay_ket_thuc, loai_phep, ly_do, trang_thai)
      VALUES (?, ?, ?, ?, ?, 'Chờ duyệt')
    `, [ma_nv, ngay_bat_dau, ngay_ket_thuc, loai_phep, ly_do]);

    res.status(201).json({ 
      success: true,
      message: 'Gửi yêu cầu nghỉ phép thành công' 
    });
  } catch (error) {
    console.error('Create leave request error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};

// Lấy danh sách yêu cầu nghỉ phép
exports.getLeaveRequests = async (req, res) => {
  try {
    const { trang_thai, ma_nv, ma_phong } = req.query;

    let query = `
      SELECT 
        np.*,
        nv.ten_nv,
        pb.ten_phong,
        cv.ten_chuc_vu,
        DATEDIFF(np.ngay_ket_thuc, np.ngay_bat_dau) + 1 as so_ngay
      FROM NGHIPHEP np
      JOIN NHANVIEN nv ON np.ma_nv = nv.ma_nv
      JOIN PHONGBAN pb ON nv.ma_phong = pb.ma_phong
      JOIN CHUCVU cv ON nv.ma_chucvu = cv.ma_chuc_vu
      WHERE 1=1
    `;
    const params = [];

    if (trang_thai) {
      query += ' AND np.trang_thai = ?';
      params.push(trang_thai);
    }

    if (ma_nv) {
      query += ' AND np.ma_nv = ?';
      params.push(ma_nv);
    }

    if (ma_phong) {
      query += ' AND nv.ma_phong = ?';
      params.push(ma_phong);
    }

    query += ' ORDER BY np.ngay_tao DESC';

    const [requests] = await db.query(query, params);

    res.json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (error) {
    console.error('Get leave requests error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};

// Lấy chi tiết yêu cầu nghỉ phép
exports.getLeaveRequestById = async (req, res) => {
  try {
    const { id } = req.params;

    const [requests] = await db.query(`
      SELECT 
        np.*,
        nv.ten_nv,
        pb.ten_phong,
        cv.ten_chuc_vu,
        DATEDIFF(np.ngay_ket_thuc, np.ngay_bat_dau) + 1 as so_ngay
      FROM NGHIPHEP np
      JOIN NHANVIEN nv ON np.ma_nv = nv.ma_nv
      JOIN PHONGBAN pb ON nv.ma_phong = pb.ma_phong
      JOIN CHUCVU cv ON nv.ma_chucvu = cv.ma_chuc_vu
      WHERE np.id = ?
    `, [id]);

    if (requests.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Không tìm thấy yêu cầu nghỉ phép' 
      });
    }

    res.json({
      success: true,
      data: requests[0]
    });
  } catch (error) {
    console.error('Get leave request by id error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};

// Duyệt/Từ chối yêu cầu nghỉ phép
exports.updateLeaveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { trang_thai, ghi_chu } = req.body;

    // Validate
    if (!['Đã duyệt', 'Từ chối'].includes(trang_thai)) {
      return res.status(400).json({ 
        success: false,
        message: 'Trạng thái không hợp lệ. Chỉ chấp nhận: Đã duyệt, Từ chối' 
      });
    }

    // Kiểm tra yêu cầu tồn tại
    const [existing] = await db.query(
      'SELECT * FROM NGHIPHEP WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Không tìm thấy yêu cầu nghỉ phép' 
      });
    }

    // Kiểm tra trạng thái hiện tại
    if (existing[0].trang_thai !== 'Chờ duyệt') {
      return res.status(400).json({ 
        success: false,
        message: `Yêu cầu đã được xử lý (${existing[0].trang_thai})` 
      });
    }

    // Cập nhật trạng thái
    let query = 'UPDATE NGHIPHEP SET trang_thai = ?';
    const params = [trang_thai];

    if (ghi_chu) {
      query += ', ly_do = CONCAT(ly_do, "\n\nGhi chú: ", ?)';
      params.push(ghi_chu);
    }

    query += ' WHERE id = ?';
    params.push(id);

    await db.query(query, params);

    res.json({ 
      success: true,
      message: `${trang_thai === 'Đã duyệt' ? 'Duyệt' : 'Từ chối'} yêu cầu nghỉ phép thành công` 
    });
  } catch (error) {
    console.error('Update leave status error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};

// Thống kê nghỉ phép theo nhân viên
exports.getLeaveStats = async (req, res) => {
  try {
    const { nam } = req.query;

    if (!nam) {
      return res.status(400).json({ 
        success: false,
        message: 'Vui lòng cung cấp năm' 
      });
    }

    const [stats] = await db.query(`
      SELECT 
        nv.ma_nv,
        nv.ten_nv,
        pb.ten_phong,
        COUNT(np.id) as so_lan_nghi,
        COALESCE(SUM(DATEDIFF(np.ngay_ket_thuc, np.ngay_bat_dau) + 1), 0) as tong_ngay_nghi,
        COALESCE(SUM(CASE WHEN np.loai_phep = 'Nghỉ phép năm' THEN DATEDIFF(np.ngay_ket_thuc, np.ngay_bat_dau) + 1 ELSE 0 END), 0) as nghi_phep,
        COALESCE(SUM(CASE WHEN np.loai_phep = 'Nghỉ ốm' THEN DATEDIFF(np.ngay_ket_thuc, np.ngay_bat_dau) + 1 ELSE 0 END), 0) as nghi_om
      FROM NHANVIEN nv
      JOIN PHONGBAN pb ON nv.ma_phong = pb.ma_phong
      LEFT JOIN NGHIPHEP np ON nv.ma_nv = np.ma_nv
        AND YEAR(np.ngay_bat_dau) = ?
        AND np.trang_thai = 'Đã duyệt'
      WHERE nv.trang_thai = 1
      GROUP BY nv.ma_nv, nv.ten_nv, pb.ten_phong
      ORDER BY tong_ngay_nghi DESC
    `, [nam]);

    res.json({
      success: true,
      count: stats.length,
      data: stats
    });
  } catch (error) {
    console.error('Get leave stats error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};

// Ai đang nghỉ phép hôm nay
exports.getTodayLeave = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const [leaves] = await db.query(`
      SELECT 
        nv.ma_nv,
        nv.ten_nv,
        pb.ten_phong,
        cv.ten_chuc_vu,
        np.loai_phep,
        np.ngay_bat_dau,
        np.ngay_ket_thuc,
        DATEDIFF(np.ngay_ket_thuc, np.ngay_bat_dau) + 1 as so_ngay
      FROM NGHIPHEP np
      JOIN NHANVIEN nv ON np.ma_nv = nv.ma_nv
      JOIN PHONGBAN pb ON nv.ma_phong = pb.ma_phong
      JOIN CHUCVU cv ON nv.ma_chucvu = cv.ma_chuc_vu
      WHERE ? BETWEEN np.ngay_bat_dau AND np.ngay_ket_thuc
        AND np.trang_thai = 'Đã duyệt'
    `, [today]);

    res.json({
      success: true,
      count: leaves.length,
      data: leaves
    });
  } catch (error) {
    console.error('Get today leave error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};

// Cập nhật yêu cầu nghỉ phép (trước khi duyệt)
exports.updateLeaveRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { ngay_bat_dau, ngay_ket_thuc, loai_phep, ly_do } = req.body;

    // Kiểm tra yêu cầu tồn tại
    const [existing] = await db.query(
      'SELECT * FROM NGHIPHEP WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Không tìm thấy yêu cầu nghỉ phép' 
      });
    }

    // Chỉ cho phép cập nhật nếu đang chờ duyệt
    if (existing[0].trang_thai !== 'Chờ duyệt') {
      return res.status(400).json({ 
        success: false,
        message: 'Chỉ có thể cập nhật yêu cầu đang chờ duyệt' 
      });
    }

    // Xây dựng query update
    const updates = {};
    if (ngay_bat_dau) updates.ngay_bat_dau = ngay_bat_dau;
    if (ngay_ket_thuc) updates.ngay_ket_thuc = ngay_ket_thuc;
    if (loai_phep) updates.loai_phep = loai_phep;
    if (ly_do) updates.ly_do = ly_do;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Không có thông tin cần cập nhật' 
      });
    }

    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(updates), id];

    await db.query(`UPDATE NGHIPHEP SET ${fields} WHERE id = ?`, values);

    res.json({ 
      success: true,
      message: 'Cập nhật yêu cầu nghỉ phép thành công' 
    });
  } catch (error) {
    console.error('Update leave request error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};

// Xóa yêu cầu nghỉ phép (chỉ khi chờ duyệt)
exports.deleteLeaveRequest = async (req, res) => {
  try {
    const { id } = req.params;

    // Kiểm tra yêu cầu tồn tại
    const [existing] = await db.query(
      'SELECT * FROM NGHIPHEP WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Không tìm thấy yêu cầu nghỉ phép' 
      });
    }

    // Chỉ cho phép xóa nếu đang chờ duyệt
    if (existing[0].trang_thai !== 'Chờ duyệt') {
      return res.status(400).json({ 
        success: false,
        message: 'Chỉ có thể xóa yêu cầu đang chờ duyệt' 
      });
    }

    await db.query('DELETE FROM NGHIPHEP WHERE id = ?', [id]);

    res.json({ 
      success: true,
      message: 'Xóa yêu cầu nghỉ phép thành công' 
    });
  } catch (error) {
    console.error('Delete leave request error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};