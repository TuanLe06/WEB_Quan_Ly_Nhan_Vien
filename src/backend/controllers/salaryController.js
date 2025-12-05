const db = require('../config/database');

// Tính lương cho một nhân viên (CÓ BẢO VỆ TRẠNG THÁI)
exports.calculateSalary = async (req, res) => {
  try {
    const { ma_nv, thang, nam, force = false } = req.body;
    const userRole = req.user.vai_tro;
    const username = req.user.username;

    if (!ma_nv || !thang || !nam) {
      return res.status(400).json({ 
        success: false,
        message: 'Vui lòng cung cấp đầy đủ thông tin' 
      });
    }

    const [existing] = await db.query(
      'SELECT trang_thai FROM LUONG WHERE ma_nv = ? AND thang = ? AND nam = ?',
      [ma_nv, thang, nam]
    );

    if (existing.length > 0) {
      const currentStatus = existing[0].trang_thai;

      // ✅ FIX: Khớp với DB ENUM
      if (currentStatus === 'Đã khóa') {
        if (userRole !== 'Admin') {
          return res.status(403).json({
            success: false,
            message: `Lương tháng ${thang}/${nam} đã bị khóa. Chỉ Admin mới có thể tính lại.`,
            locked: true
          });
        }

        if (!force) {
          return res.status(400).json({
            success: false,
            message: `Lương tháng ${thang}/${nam} đã bị khóa. Bạn có chắc muốn tính lại?`,
            needConfirm: true,
            locked: true
          });
        }
      }

      if (currentStatus === 'Đã xác nhận' && !['Admin', 'KeToan'].includes(userRole)) {
        return res.status(403).json({
          success: false,
          message: `Lương tháng ${thang}/${nam} đã được xác nhận. Chỉ Admin/Kế toán mới có thể tính lại.`,
          confirmed: true
        });
      }
    }

    await db.query(
      'CALL TinhLuongThang(?, ?, ?)', 
      [ma_nv, thang, nam]
    );

    const [salary] = await db.query(`
      SELECT 
        l.*,
        nv.ten_nv,
        nv.luong_co_ban,
        pb.ten_phong,
        cv.ten_chuc_vu
      FROM LUONG l
      JOIN NHANVIEN nv ON l.ma_nv = nv.ma_nv
      JOIN PHONGBAN pb ON nv.ma_phong = pb.ma_phong
      JOIN CHUCVU cv ON nv.ma_chucvu = cv.ma_chuc_vu
      WHERE l.ma_nv = ? AND l.thang = ? AND l.nam = ?
    `, [ma_nv, thang, nam]);

    res.json({ 
      success: true,
      message: force ? 'Tính lại lương thành công (forced)' : 'Tính lương thành công',
      data: salary[0],
      forced: force
    });
  } catch (error) {
    console.error('Calculate salary error:', error);

    if (error.sqlState === '45000' || error.sqlState === '45001') {
      return res.status(403).json({ 
        success: false,
        message: error.message,
        needConfirm: error.sqlState === '45001'
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};

// Tính lương cho tất cả nhân viên
exports.calculateAllSalary = async (req, res) => {
  try {
    const { thang, nam, force = false } = req.body;
    const userRole = req.user.vai_tro;
    const username = req.user.username;

    if (!thang || !nam) {
      return res.status(400).json({ 
        success: false,
        message: 'Vui lòng cung cấp tháng và năm' 
      });
    }

    // ✅ FIX: Khớp với DB ENUM
    const [lockedCheck] = await db.query(
      'SELECT COUNT(*) as count FROM LUONG WHERE thang = ? AND nam = ? AND trang_thai = ?',
      [thang, nam, 'Đã khóa']
    );

    if (lockedCheck[0].count > 0) {
      if (userRole !== 'Admin') {
        return res.status(403).json({
          success: false,
          message: `Có ${lockedCheck[0].count} bản ghi lương đã bị khóa. Chỉ Admin mới có thể tính lại.`,
          locked: true
        });
      }

      if (!force) {
        return res.status(400).json({
          success: false,
          message: `Có ${lockedCheck[0].count} bản ghi đã bị khóa. Bạn có chắc muốn tính lại tất cả?`,
          needConfirm: true,
          lockedCount: lockedCheck[0].count
        });
      }
    }

    const [employees] = await db.query(
      'SELECT ma_nv FROM NHANVIEN WHERE trang_thai = 1'
    );

    let successCount = 0;
    let errorCount = 0;
    let skippedCount = 0;
    const errors = [];

    for (const emp of employees) {
      try {
        await db.query(
          'CALL TinhLuongThang(?, ?, ?)', 
          [emp.ma_nv, thang, nam]
        );
        successCount++;
      } catch (err) {
        if (err.sqlState === '45000' || err.sqlState === '45001') {
          skippedCount++;
          errors.push({ ma_nv: emp.ma_nv, reason: 'locked' });
        } else {
          errorCount++;
          errors.push({ ma_nv: emp.ma_nv, error: err.message });
        }
      }
    }

    res.json({ 
      success: true,
      message: 'Tính lương hoàn tất',
      data: {
        total: employees.length,
        success: successCount,
        skipped: skippedCount,
        error: errorCount,
        forced: force
      },
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error('Calculate all salary error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};

// Lock lương tháng
exports.lockSalary = async (req, res) => {
  try {
    const { thang, nam, ghi_chu } = req.body;
    const username = req.user.username;

    if (!thang || !nam) {
      return res.status(400).json({ success: false, message: 'Vui lòng cung cấp tháng và năm' });
    }

    await db.query('CALL LockLuong(?, ?, ?, ?)',
      [thang, nam, username, ghi_chu || 'Khóa lương']
    );

    res.json({ success: true, message: `Đã khóa lương tháng ${thang}/${nam}` });
  } catch (error) {
    console.error('Lock salary error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};

// Unlock
exports.unlockSalary = async (req, res) => {
  try {
    const { thang, nam, ly_do } = req.body;
    const username = req.user.username;
    const userRole = req.user.vai_tro;

    if (userRole !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Chỉ Admin mới có thể mở khóa lương' });
    }

    if (!thang || !nam) return res.status(400).json({ success: false, message: 'Thiếu dữ liệu' });
    if (!ly_do) return res.status(400).json({ success: false, message: 'Thiếu lý do mở khóa' });

    await db.query('CALL UnlockLuong(?, ?, ?, ?)',
      [thang, nam, username, ly_do]
    );

    res.json({ success: true, message: `Đã mở khóa lương tháng ${thang}/${nam}` });
  } catch (error) {
    console.error('Unlock salary error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};

// Confirm
exports.confirmSalary = async (req, res) => {
  try {
    const { thang, nam } = req.body;
    const username = req.user.username;

    if (!thang || !nam)
      return res.status(400).json({ success: false, message: 'Thiếu dữ liệu' });

    await db.query('CALL ConfirmLuong(?, ?, ?)', [thang, nam, username]);

    res.json({ success: true, message: `Đã xác nhận lương tháng ${thang}/${nam}` });
  } catch (error) {
    console.error('Confirm salary error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};

// Xem bảng lương tháng
exports.getMonthlySalary = async (req, res) => {
  try {
    const { thang, nam, ma_phong } = req.query;

    if (!thang || !nam)
      return res.status(400).json({ success: false, message: 'Thiếu dữ liệu' });

    let query = `
      SELECT 
        l.*,
        nv.ten_nv,
        nv.ma_phong,
        pb.ten_phong,
        cv.ten_chuc_vu,
        nv.luong_co_ban
      FROM LUONG l
      JOIN NHANVIEN nv ON l.ma_nv = nv.ma_nv
      JOIN PHONGBAN pb ON nv.ma_phong = pb.ma_phong
      JOIN CHUCVU cv ON nv.ma_chucvu = cv.ma_chuc_vu
      WHERE l.thang = ? AND l.nam = ?
    `;
    const params = [thang, nam];

    if (ma_phong) {
      query += ' AND nv.ma_phong = ?';
      params.push(ma_phong);
    }

    query += ' ORDER BY l.luong_thuc_nhan DESC';

    const [salaries] = await db.query(query, params);

    const tongLuong = salaries.reduce((s, v) => s + +v.luong_thuc_nhan, 0);
    const tongTruLuong = salaries.reduce((s, v) => s + +(v.tru_luong || 0), 0);
    const soNVBiTru = salaries.filter(s => +s.tru_luong > 0).length;

    // ✅ FIX: Trả về đúng tên trạng thái như DB
    const statusCount = {
      'Nháp': salaries.filter(s => s.trang_thai === 'Nháp').length,
      'Đã xác nhận': salaries.filter(s => s.trang_thai === 'Đã xác nhận').length,
      'Đã khóa': salaries.filter(s => s.trang_thai === 'Đã khóa').length
    };

    res.json({
      success: true,
      count: salaries.length,
      tongLuong,
      tongTruLuong,
      soNVBiTru,
      statusCount,
      data: salaries
    });
  } catch (error) {
    console.error('Get monthly salary error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};

// Xem chi tiết lương nhân viên
exports.getEmployeeSalary = async (req, res) => {
  try {
    const { ma_nv } = req.params;
    const { thang, nam } = req.query;

    let query = `
      SELECT 
        l.*,
        nv.ten_nv,
        nv.luong_co_ban,
        pb.ten_phong,
        cv.ten_chuc_vu
      FROM LUONG l
      JOIN NHANVIEN nv ON l.ma_nv = nv.ma_nv
      JOIN PHONGBAN pb ON nv.ma_phong = pb.ma_phong
      JOIN CHUCVU cv ON nv.ma_chucvu = cv.ma_chuc_vu
      WHERE l.ma_nv = ?
    `;
    const params = [ma_nv];

    if (thang && nam) {
      query += ' AND l.thang = ? AND l.nam = ?';
      params.push(thang, nam);
    }

    query += ' ORDER BY l.nam DESC, l.thang DESC';

    const [salaries] = await db.query(query, params);

    if (salaries.length === 0)
      return res.status(404).json({ success: false, message: 'Không tìm thấy bảng lương' });

    res.json({ success: true, count: salaries.length, data: salaries });
  } catch (error) {
    console.error('Get employee salary error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};

// Top lương cao nhất
exports.getTopSalary = async (req, res) => {
  try {
    const { thang, nam, limit = 10 } = req.query;

    const [salaries] = await db.query(`
      SELECT 
        l.ma_nv,
        nv.ten_nv,
        pb.ten_phong,
        cv.ten_chuc_vu,
        l.tong_gio,
        nv.luong_co_ban,
        l.luong_them,
        l.tru_luong,
        l.luong_thuc_nhan,
        l.trang_thai
      FROM LUONG l
      JOIN NHANVIEN nv ON l.ma_nv = nv.ma_nv
      JOIN PHONGBAN pb ON nv.ma_phong = pb.ma_phong
      JOIN CHUCVU cv ON nv.ma_chucvu = cv.ma_chuc_vu
      WHERE l.thang = ? AND l.nam = ?
      ORDER BY l.luong_thuc_nhan DESC
      LIMIT ?
    `, [thang, nam, +limit]);

    res.json({ success: true, count: salaries.length, data: salaries });
  } catch (error) {
    console.error('Get top salary error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};

// DS nhân viên bị trừ lương
exports.getDeductedSalary = async (req, res) => {
  try {
    const { thang, nam } = req.query;

    const [salaries] = await db.query(`
      SELECT 
        l.ma_nv,
        nv.ten_nv,
        pb.ten_phong,
        cv.ten_chuc_vu,
        l.tong_gio,
        nv.luong_co_ban,
        l.tru_luong,
        l.luong_thuc_nhan,
        l.trang_thai,
        (40 - l.tong_gio) as gio_thieu
      FROM LUONG l
      JOIN NHANVIEN nv ON l.ma_nv = nv.ma_nv
      JOIN PHONGBAN pb ON nv.ma_phong = pb.ma_phong
      JOIN CHUCVU cv ON nv.ma_chucvu = cv.ma_chuc_vu
      WHERE l.thang = ? AND l.nam = ? AND l.tru_luong > 0
      ORDER BY l.tru_luong DESC
    `, [thang, nam]);

    const tongTruLuong = salaries.reduce((s, v) => s + +v.tru_luong, 0);

    res.json({
      success: true,
      count: salaries.length,
      tongTruLuong,
      data: salaries
    });
  } catch (error) {
    console.error('Get deducted salary error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};

// Quỹ lương theo phòng ban
exports.getSalaryByDepartment = async (req, res) => {
  try {
    const { thang, nam } = req.query;

    const [stats] = await db.query(`
      SELECT 
        pb.ma_phong,
        pb.ten_phong,
        COUNT(l.id) as so_nhan_vien,
        SUM(l.luong_thuc_nhan) as tong_quy_luong,
        SUM(l.tru_luong) as tong_tru_luong,
        AVG(l.luong_thuc_nhan) as luong_trung_binh,
        MAX(l.luong_thuc_nhan) as luong_cao_nhat,
        MIN(l.luong_thuc_nhan) as luong_thap_nhat
      FROM LUONG l
      JOIN NHANVIEN nv ON l.ma_nv = nv.ma_nv
      JOIN PHONGBAN pb ON nv.ma_phong = pb.ma_phong
      WHERE l.thang = ? AND l.nam = ?
      GROUP BY pb.ma_phong, pb.ten_phong
      ORDER BY tong_quy_luong DESC
    `, [thang, nam]);

    const tongQuyLuong = stats.reduce((s, v) => s + +v.tong_quy_luong, 0);

    res.json({ success: true, count: stats.length, tongQuyLuong, data: stats });
  } catch (error) {
    console.error('Get salary by department error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};

// So sánh lương theo tháng
exports.compareSalary = async (req, res) => {
  try {
    const { nam, soThang = 6 } = req.query;

    const [stats] = await db.query(`
      SELECT 
        l.thang,
        l.nam,
        COUNT(DISTINCT l.ma_nv) as so_nhan_vien,
        SUM(l.luong_thuc_nhan) as tong_quy_luong,
        SUM(l.tru_luong) as tong_tru_luong,
        AVG(l.luong_thuc_nhan) as luong_trung_binh
      FROM LUONG l
      WHERE l.nam = ?
      GROUP BY l.nam, l.thang
      ORDER BY l.nam DESC, l.thang DESC
      LIMIT ?
    `, [nam, +soThang]);

    res.json({ success: true, count: stats.length, data: stats.reverse() });
  } catch (error) {
    console.error('Compare salary error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};

// Xóa bảng lương
exports.deleteSalary = async (req, res) => {
  try {
    const { id } = req.params;

    const [salary] = await db.query(
      'SELECT trang_thai FROM LUONG WHERE id = ?', 
      [id]
    );

    if (salary.length === 0)
      return res.status(404).json({ success: false, message: 'Không tìm thấy bảng lương' });

    // ✅ FIX: Khớp với DB ENUM
    if (salary[0].trang_thai === 'Đã khóa') {
      return res.status(403).json({ 
        success: false,
        message: 'Không thể xóa bảng lương đã bị khóa' 
      });
    }

    const [result] = await db.query('DELETE FROM LUONG WHERE id = ?', [id]);

    if (result.affectedRows === 0)
      return res.status(404).json({ success: false, message: 'Không tìm thấy bảng lương' });

    res.json({ success: true, message: 'Xóa bảng lương thành công' });
  } catch (error) {
    console.error('Delete salary error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};