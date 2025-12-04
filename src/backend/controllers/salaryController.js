const db = require('../config/database');

// Tính lương cho một nhân viên
exports.calculateSalary = async (req, res) => {
  try {
    const { ma_nv, thang, nam } = req.body;

    if (!ma_nv || !thang || !nam) {
      return res.status(400).json({ 
        success: false,
        message: 'Vui lòng cung cấp đầy đủ thông tin' 
      });
    }

    // Gọi stored procedure
    await db.query('CALL TinhLuongThang(?, ?, ?)', [ma_nv, thang, nam]);

    // Lấy kết quả vừa tính
    const [salary] = await db.query(`
      SELECT * FROM LUONG 
      WHERE ma_nv = ? AND thang = ? AND nam = ?
    `, [ma_nv, thang, nam]);

    res.json({ 
      success: true,
      message: 'Tính lương thành công',
      data: salary[0]
    });
  } catch (error) {
    console.error('Calculate salary error:', error);
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
    const { thang, nam } = req.body;

    if (!thang || !nam) {
      return res.status(400).json({ 
        success: false,
        message: 'Vui lòng cung cấp tháng và năm' 
      });
    }

    const [employees] = await db.query(
      'SELECT ma_nv FROM NHANVIEN WHERE trang_thai = 1'
    );

    let successCount = 0;
    let errorCount = 0;

    for (const emp of employees) {
      try {
        await db.query('CALL TinhLuongThang(?, ?, ?)', [emp.ma_nv, thang, nam]);
        successCount++;
      } catch (err) {
        console.error(`Error calculating salary for ${emp.ma_nv}:`, err);
        errorCount++;
      }
    }

    res.json({ 
      success: true,
      message: 'Tính lương hoàn tất',
      data: {
        total: employees.length,
        success: successCount,
        error: errorCount
      }
    });
  } catch (error) {
    console.error('Calculate all salary error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};

// Xem bảng lương tháng
exports.getMonthlySalary = async (req, res) => {
  try {
    const { thang, nam, ma_phong } = req.query;

    if (!thang || !nam) {
      return res.status(400).json({ 
        success: false,
        message: 'Vui lòng cung cấp tháng và năm' 
      });
    }

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

    // Tính tổng
    const tongLuong = salaries.reduce((sum, item) => sum + parseFloat(item.luong_thuc_nhan), 0);
    const tongTruLuong = salaries.reduce((sum, item) => sum + parseFloat(item.tru_luong || 0), 0);
    const soNVBiTru = salaries.filter(item => parseFloat(item.tru_luong || 0) > 0).length;

    res.json({
      success: true,
      count: salaries.length,
      tongLuong: tongLuong,
      tongTruLuong: tongTruLuong,
      soNVBiTru: soNVBiTru,
      data: salaries
    });
  } catch (error) {
    console.error('Get monthly salary error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};

// Xem chi tiết lương của một nhân viên
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

    if (salaries.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Không tìm thấy bảng lương' 
      });
    }

    res.json({
      success: true,
      count: salaries.length,
      data: salaries
    });
  } catch (error) {
    console.error('Get employee salary error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};

// Top nhân viên lương cao nhất
exports.getTopSalary = async (req, res) => {
  try {
    const { thang, nam, limit = 10 } = req.query;

    if (!thang || !nam) {
      return res.status(400).json({ 
        success: false,
        message: 'Vui lòng cung cấp tháng và năm' 
      });
    }

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
        l.luong_thuc_nhan
      FROM LUONG l
      JOIN NHANVIEN nv ON l.ma_nv = nv.ma_nv
      JOIN PHONGBAN pb ON nv.ma_phong = pb.ma_phong
      JOIN CHUCVU cv ON nv.ma_chucvu = cv.ma_chuc_vu
      WHERE l.thang = ? AND l.nam = ?
      ORDER BY l.luong_thuc_nhan DESC
      LIMIT ?
    `, [thang, nam, parseInt(limit)]);

    res.json({
      success: true,
      count: salaries.length,
      data: salaries
    });
  } catch (error) {
    console.error('Get top salary error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};

// Danh sách nhân viên bị trừ lương
exports.getDeductedSalary = async (req, res) => {
  try {
    const { thang, nam } = req.query;

    if (!thang || !nam) {
      return res.status(400).json({ 
        success: false,
        message: 'Vui lòng cung cấp tháng và năm' 
      });
    }

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
        (40 - l.tong_gio) as gio_thieu
      FROM LUONG l
      JOIN NHANVIEN nv ON l.ma_nv = nv.ma_nv
      JOIN PHONGBAN pb ON nv.ma_phong = pb.ma_phong
      JOIN CHUCVU cv ON nv.ma_chucvu = cv.ma_chuc_vu
      WHERE l.thang = ? AND l.nam = ? AND l.tru_luong > 0
      ORDER BY l.tru_luong DESC
    `, [thang, nam]);

    const tongTruLuong = salaries.reduce((sum, item) => sum + parseFloat(item.tru_luong), 0);

    res.json({
      success: true,
      count: salaries.length,
      tongTruLuong: tongTruLuong,
      data: salaries
    });
  } catch (error) {
    console.error('Get deducted salary error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};

// Tổng quỹ lương theo phòng ban
exports.getSalaryByDepartment = async (req, res) => {
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

    const tongQuyLuong = stats.reduce((sum, item) => sum + parseFloat(item.tong_quy_luong), 0);

    res.json({
      success: true,
      count: stats.length,
      tongQuyLuong: tongQuyLuong,
      data: stats
    });
  } catch (error) {
    console.error('Get salary by department error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};

// So sánh lương theo tháng
exports.compareSalary = async (req, res) => {
  try {
    const { nam, soThang = 6 } = req.query;

    if (!nam) {
      return res.status(400).json({ 
        success: false,
        message: 'Vui lòng cung cấp năm' 
      });
    }

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
    `, [nam, parseInt(soThang)]);

    res.json({
      success: true,
      count: stats.length,
      data: stats.reverse()
    });
  } catch (error) {
    console.error('Compare salary error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};

// Xóa bảng lương (Admin)
exports.deleteSalary = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query('DELETE FROM LUONG WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Không tìm thấy bảng lương' 
      });
    }

    res.json({ 
      success: true,
      message: 'Xóa bảng lương thành công' 
    });
  } catch (error) {
    console.error('Delete salary error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};