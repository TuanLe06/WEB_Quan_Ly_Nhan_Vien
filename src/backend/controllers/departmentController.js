const db = require('../config/database');

// Lấy danh sách tất cả phòng ban
exports.getAllDepartments = async (req, res) => {
  try {
    const { trang_thai } = req.query;

    let query = `
      SELECT 
        pb.*,
        COUNT(nv.ma_nv) as so_nhan_vien
      FROM PHONGBAN pb
      LEFT JOIN NHANVIEN nv ON pb.ma_phong = nv.ma_phong AND nv.trang_thai = 1
    `;
    const params = [];

    if (trang_thai !== undefined) {
      query += ' WHERE pb.trang_thai = ?';
      params.push(trang_thai);
    } else {
      query += ' WHERE pb.trang_thai = 1';
    }

    query += ' GROUP BY pb.ma_phong ORDER BY pb.ma_phong';

    const [departments] = await db.query(query, params);

    res.json({
      success: true,
      count: departments.length,
      data: departments
    });
  } catch (error) {
    console.error('Get all departments error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};

// Lấy thông tin 1 phòng ban
exports.getDepartmentById = async (req, res) => {
  try {
    const { id } = req.params;

    const [departments] = await db.query(`
      SELECT 
        pb.*,
        COUNT(nv.ma_nv) as so_nhan_vien
      FROM PHONGBAN pb
      LEFT JOIN NHANVIEN nv ON pb.ma_phong = nv.ma_phong AND nv.trang_thai = 1
      WHERE pb.ma_phong = ?
      GROUP BY pb.ma_phong
    `, [id]);

    if (departments.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Không tìm thấy phòng ban' 
      });
    }

    res.json({
      success: true,
      data: departments[0]
    });
  } catch (error) {
    console.error('Get department by id error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};

// Thêm phòng ban mới
exports.createDepartment = async (req, res) => {
  try {
    const { ma_phong, ten_phong, nam_thanh_lap } = req.body;

    // Validate input
    if (!ma_phong || !ten_phong || !nam_thanh_lap) {
      return res.status(400).json({ 
        success: false,
        message: 'Vui lòng nhập đầy đủ thông tin' 
      });
    }

    // Validate mã phòng (3 ký tự)
    if (ma_phong.length !== 3) {
      return res.status(400).json({ 
        success: false,
        message: 'Mã phòng phải có đúng 3 ký tự' 
      });
    }

    // Kiểm tra mã phòng đã tồn tại
    const [existing] = await db.query(
      'SELECT * FROM PHONGBAN WHERE ma_phong = ?',
      [ma_phong]
    );

    if (existing.length > 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Mã phòng ban đã tồn tại' 
      });
    }

    // Thêm phòng ban
    await db.query(`
      INSERT INTO PHONGBAN (ma_phong, ten_phong, nam_thanh_lap, trang_thai)
      VALUES (?, ?, ?, 1)
    `, [ma_phong, ten_phong, nam_thanh_lap]);

    res.status(201).json({ 
      success: true,
      message: 'Thêm phòng ban thành công',
      data: { ma_phong, ten_phong }
    });
  } catch (error) {
    console.error('Create department error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};

// Cập nhật phòng ban
exports.updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { ten_phong, nam_thanh_lap, trang_thai } = req.body;

    // Kiểm tra phòng ban tồn tại
    const [existing] = await db.query(
      'SELECT * FROM PHONGBAN WHERE ma_phong = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Không tìm thấy phòng ban' 
      });
    }

    // Xây dựng query update
    const updates = {};
    if (ten_phong !== undefined) updates.ten_phong = ten_phong;
    if (nam_thanh_lap !== undefined) updates.nam_thanh_lap = nam_thanh_lap;
    if (trang_thai !== undefined) updates.trang_thai = trang_thai;

    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(updates), id];

    await db.query(`UPDATE PHONGBAN SET ${fields} WHERE ma_phong = ?`, values);

    res.json({ 
      success: true,
      message: 'Cập nhật phòng ban thành công' 
    });
  } catch (error) {
    console.error('Update department error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};

// Xóa phòng ban (soft delete)
exports.deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    // Kiểm tra phòng ban tồn tại
    const [existing] = await db.query(
      'SELECT * FROM PHONGBAN WHERE ma_phong = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Không tìm thấy phòng ban' 
      });
    }

    // Kiểm tra có nhân viên trong phòng không
    const [employees] = await db.query(
      'SELECT COUNT(*) as count FROM NHANVIEN WHERE ma_phong = ? AND trang_thai = 1',
      [id]
    );

    if (employees[0].count > 0) {
      return res.status(400).json({ 
        success: false,
        message: `Không thể xóa phòng ban vì còn ${employees[0].count} nhân viên` 
      });
    }

    // Soft delete
    await db.query('UPDATE PHONGBAN SET trang_thai = 0 WHERE ma_phong = ?', [id]);

    res.json({ 
      success: true,
      message: 'Xóa phòng ban thành công' 
    });
  } catch (error) {
    console.error('Delete department error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};