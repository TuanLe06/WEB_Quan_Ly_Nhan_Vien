const db = require('../config/database');

// Lấy danh sách tất cả nhân viên
exports.getAllEmployees = async (req, res) => {
  try {
    const { trang_thai, ma_phong, keyword } = req.query;
    
    let query = `
      SELECT 
        nv.ma_nv,
        nv.ten_nv,
        nv.ngay_sinh,
        nv.gioi_tinh,
        nv.ma_phong,
        pb.ten_phong,
        nv.ma_chucvu,
        cv.ten_chuc_vu,
        nv.luong_co_ban,
        nv.ngay_vao_lam,
        nv.trang_thai,
        TIMESTAMPDIFF(YEAR, nv.ngay_vao_lam, CURDATE()) as nam_cong_tac
      FROM NHANVIEN nv
      JOIN PHONGBAN pb ON nv.ma_phong = pb.ma_phong
      JOIN CHUCVU cv ON nv.ma_chucvu = cv.ma_chuc_vu
      WHERE 1=1
    `;
    const params = [];

    // Filter theo trạng thái
    if (trang_thai !== undefined) {
      query += ' AND nv.trang_thai = ?';
      params.push(trang_thai);
    } else {
      query += ' AND nv.trang_thai = 1'; // Mặc định lấy nhân viên đang làm
    }

    // Filter theo phòng ban
    if (ma_phong) {
      query += ' AND nv.ma_phong = ?';
      params.push(ma_phong);
    }

    // Tìm kiếm theo tên
    if (keyword) {
      query += ' AND nv.ten_nv LIKE ?';
      params.push(`%${keyword}%`);
    }

    query += ' ORDER BY nv.ngay_vao_lam DESC';

    const [employees] = await db.query(query, params);
    
    res.json({
      success: true,
      count: employees.length,
      data: employees
    });
  } catch (error) {
    console.error('Get all employees error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};

// Lấy thông tin chi tiết 1 nhân viên
exports.getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [employees] = await db.query(`
      SELECT 
        nv.*,
        pb.ten_phong,
        cv.ten_chuc_vu,
        TIMESTAMPDIFF(YEAR, nv.ngay_sinh, CURDATE()) as tuoi,
        TIMESTAMPDIFF(YEAR, nv.ngay_vao_lam, CURDATE()) as nam_cong_tac
      FROM NHANVIEN nv
      JOIN PHONGBAN pb ON nv.ma_phong = pb.ma_phong
      JOIN CHUCVU cv ON nv.ma_chucvu = cv.ma_chuc_vu
      WHERE nv.ma_nv = ?
    `, [id]);
    
    if (employees.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Không tìm thấy nhân viên' 
      });
    }
    
    res.json({
      success: true,
      data: employees[0]
    });
  } catch (error) {
    console.error('Get employee by id error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};

// Thêm nhân viên mới
exports.createEmployee = async (req, res) => {
  try {
    const { 
      ten_nv, 
      ngay_sinh, 
      gioi_tinh, 
      ma_phong, 
      ma_chucvu, 
      luong_co_ban, 
      ngay_vao_lam 
    } = req.body;

    // Validate input
    if (!ten_nv || !ngay_sinh || !gioi_tinh || !ma_phong || !ma_chucvu || !luong_co_ban || !ngay_vao_lam) {
      return res.status(400).json({ 
        success: false,
        message: 'Vui lòng nhập đầy đủ thông tin' 
      });
    }

    // Kiểm tra phòng ban tồn tại
    const [phongBan] = await db.query('SELECT * FROM PHONGBAN WHERE ma_phong = ?', [ma_phong]);
    if (phongBan.length === 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Mã phòng ban không tồn tại' 
      });
    }

    // Kiểm tra chức vụ tồn tại
    const [chucVu] = await db.query('SELECT * FROM CHUCVU WHERE ma_chuc_vu = ?', [ma_chucvu]);
    if (chucVu.length === 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Mã chức vụ không tồn tại' 
      });
    }
    
    // Sinh mã nhân viên tự động: <Mã phòng><Mã chức vụ><STT>
    const [result] = await db.query(`
      SELECT COUNT(*) as count 
      FROM NHANVIEN 
      WHERE ma_phong = ? AND ma_chucvu = ?
    `, [ma_phong, ma_chucvu]);
    
    const stt = String(result[0].count + 1).padStart(4, '0');
    const ma_nv = `${ma_phong}${ma_chucvu}${stt}`;

    // Kiểm tra mã nhân viên đã tồn tại chưa (phòng trường hợp)
    const [existing] = await db.query('SELECT * FROM NHANVIEN WHERE ma_nv = ?', [ma_nv]);
    if (existing.length > 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Mã nhân viên đã tồn tại, vui lòng thử lại' 
      });
    }
    
    // Thêm nhân viên mới
    await db.query(`
      INSERT INTO NHANVIEN 
      (ma_nv, ten_nv, ngay_sinh, gioi_tinh, ma_phong, ma_chucvu, luong_co_ban, ngay_vao_lam, trang_thai)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
    `, [ma_nv, ten_nv, ngay_sinh, gioi_tinh, ma_phong, ma_chucvu, luong_co_ban, ngay_vao_lam]);
    
    res.status(201).json({ 
      success: true,
      message: 'Thêm nhân viên thành công', 
      data: { ma_nv, ten_nv }
    });
  } catch (error) {
    console.error('Create employee error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};

// Cập nhật thông tin nhân viên
exports.updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Kiểm tra nhân viên tồn tại
    const [existing] = await db.query('SELECT * FROM NHANVIEN WHERE ma_nv = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Không tìm thấy nhân viên' 
      });
    }

    // Không cho phép cập nhật ma_nv
    delete updates.ma_nv;

    // Kiểm tra phòng ban nếu có thay đổi
    if (updates.ma_phong) {
      const [phongBan] = await db.query('SELECT * FROM PHONGBAN WHERE ma_phong = ?', [updates.ma_phong]);
      if (phongBan.length === 0) {
        return res.status(400).json({ 
          success: false,
          message: 'Mã phòng ban không tồn tại' 
        });
      }
    }

    // Kiểm tra chức vụ nếu có thay đổi
    if (updates.ma_chucvu) {
      const [chucVu] = await db.query('SELECT * FROM CHUCVU WHERE ma_chuc_vu = ?', [updates.ma_chucvu]);
      if (chucVu.length === 0) {
        return res.status(400).json({ 
          success: false,
          message: 'Mã chức vụ không tồn tại' 
        });
      }
    }

    // Xây dựng câu query update
    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(updates), id];
    
    await db.query(`UPDATE NHANVIEN SET ${fields} WHERE ma_nv = ?`, values);
    
    res.json({ 
      success: true,
      message: 'Cập nhật thông tin nhân viên thành công' 
    });
  } catch (error) {
    console.error('Update employee error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};

// Xóa nhân viên (soft delete)
exports.deleteEmployee = async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    const { id } = req.params;

    await connection.beginTransaction();

    // Kiểm tra nhân viên tồn tại
    const [employees] = await connection.query(
      'SELECT ma_nv, ten_nv FROM NHANVIEN WHERE ma_nv = ?',
      [id]
    );

    if (employees.length === 0) {
      await connection.rollback();
      return res.status(404).json({ 
        success: false,
        message: 'Không tìm thấy nhân viên' 
      });
    }

    console.log(`Đang xóa nhân viên: ${employees[0].ten_nv} (${id})`);

    // Xóa theo thứ tự
    // 1. Xóa lương
    const [luongResult] = await connection.query(
      'DELETE FROM LUONG WHERE ma_nv = ?',
      [id]
    );
    console.log(`Đã xóa ${luongResult.affectedRows} bản ghi lương`);

    // 2. Xóa chấm công
    const [chamCongResult] = await connection.query(
      'DELETE FROM CHAMCONG WHERE ma_nv = ?',
      [id]
    );
    console.log(`Đã xóa ${chamCongResult.affectedRows} bản ghi chấm công`);

    // 3. Xóa nghỉ phép
    const [nghiPhepResult] = await connection.query(
      'DELETE FROM NGHIPHEP WHERE ma_nv = ?',
      [id]
    );
    console.log(`Đã xóa ${nghiPhepResult.affectedRows} bản ghi nghỉ phép`);

    // 4. Xóa hợp đồng
    const [hopDongResult] = await connection.query(
      'DELETE FROM HOPDONG WHERE ma_nv = ?',
      [id]
    );
    console.log(`Đã xóa ${hopDongResult.affectedRows} hợp đồng`);

    // 5. Xóa tài khoản
    const [nguoiDungResult] = await connection.query(
      'DELETE FROM NGUOIDUNG WHERE ma_nv = ?',
      [id]
    );
    console.log(`Đã xóa ${nguoiDungResult.affectedRows} tài khoản`);

    // 6. Xóa nhân viên
    const [nhanVienResult] = await connection.query(
      'DELETE FROM NHANVIEN WHERE ma_nv = ?',
      [id]
    );
    console.log(`Đã xóa nhân viên`);

    await connection.commit();
    
    res.json({ 
      success: true,
      message: `Đã xóa nhân viên ${employees[0].ten_nv} và tất cả dữ liệu liên quan`,
      deleted: {
        nhan_vien: nhanVienResult.affectedRows,
        tai_khoan: nguoiDungResult.affectedRows,
        luong: luongResult.affectedRows,
        cham_cong: chamCongResult.affectedRows,
        nghi_phep: nghiPhepResult.affectedRows,
        hop_dong: hopDongResult.affectedRows
      }
    });
  } catch (error) {
    await connection.rollback();
    console.error('Delete employee error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi xóa nhân viên', 
      error: error.message 
    });
  } finally {
    connection.release();
  }
};

// Khôi phục nhân viên đã xóa
exports.restoreEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await db.query('SELECT * FROM NHANVIEN WHERE ma_nv = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Không tìm thấy nhân viên' 
      });
    }

    await db.query('UPDATE NHANVIEN SET trang_thai = 1 WHERE ma_nv = ?', [id]);
    
    res.json({ 
      success: true,
      message: 'Khôi phục nhân viên thành công' 
    });
  } catch (error) {
    console.error('Restore employee error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};

// Thống kê nhân viên
exports.getEmployeeStats = async (req, res) => {
  try {
    // Tổng số nhân viên
    const [total] = await db.query('SELECT COUNT(*) as total FROM NHANVIEN WHERE trang_thai = 1');

    // Theo phòng ban
    const [byDept] = await db.query(`
      SELECT 
        pb.ma_phong,
        pb.ten_phong,
        COUNT(nv.ma_nv) as so_luong
      FROM PHONGBAN pb
      LEFT JOIN NHANVIEN nv ON pb.ma_phong = nv.ma_phong AND nv.trang_thai = 1
      GROUP BY pb.ma_phong, pb.ten_phong
    `);

    // Theo chức vụ
    const [byPosition] = await db.query(`
      SELECT 
        cv.ma_chuc_vu,
        cv.ten_chuc_vu,
        COUNT(nv.ma_nv) as so_luong
      FROM CHUCVU cv
      LEFT JOIN NHANVIEN nv ON cv.ma_chuc_vu = nv.ma_chucvu AND nv.trang_thai = 1
      GROUP BY cv.ma_chuc_vu, cv.ten_chuc_vu
    `);

    // Theo giới tính
    const [byGender] = await db.query(`
      SELECT 
        gioi_tinh,
        COUNT(*) as so_luong
      FROM NHANVIEN
      WHERE trang_thai = 1
      GROUP BY gioi_tinh
    `);

    res.json({
      success: true,
      data: {
        total: total[0].total,
        byDepartment: byDept,
        byPosition: byPosition,
        byGender: byGender
      }
    });
  } catch (error) {
    console.error('Get employee stats error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};