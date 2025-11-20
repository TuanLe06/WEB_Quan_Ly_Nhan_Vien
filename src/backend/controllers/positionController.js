const db = require('../config/database');

// Lấy danh sách tất cả chức vụ
exports.getAllPositions = async (req, res) => {
  try {
    const [positions] = await db.query(`
      SELECT 
        cv.*,
        COUNT(nv.ma_nv) as so_nhan_vien
      FROM CHUCVU cv
      LEFT JOIN NHANVIEN nv ON cv.ma_chuc_vu = nv.ma_chucvu AND nv.trang_thai = 1
      GROUP BY cv.ma_chuc_vu
      ORDER BY cv.ma_chuc_vu
    `);

    res.json({
      success: true,
      count: positions.length,
      data: positions
    });
  } catch (error) {
    console.error('Get all positions error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};

// Lấy thông tin 1 chức vụ
exports.getPositionById = async (req, res) => {
  try {
    const { id } = req.params;

    const [positions] = await db.query(`
      SELECT 
        cv.*,
        COUNT(nv.ma_nv) as so_nhan_vien
      FROM CHUCVU cv
      LEFT JOIN NHANVIEN nv ON cv.ma_chuc_vu = nv.ma_chucvu AND nv.trang_thai = 1
      WHERE cv.ma_chuc_vu = ?
      GROUP BY cv.ma_chuc_vu
    `, [id]);

    if (positions.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Không tìm thấy chức vụ' 
      });
    }

    res.json({
      success: true,
      data: positions[0]
    });
  } catch (error) {
    console.error('Get position by id error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};

// Thêm chức vụ mới
exports.createPosition = async (req, res) => {
  try {
    const { ma_chuc_vu, ten_chuc_vu } = req.body;

    // Validate input
    if (!ma_chuc_vu || !ten_chuc_vu) {
      return res.status(400).json({ 
        success: false,
        message: 'Vui lòng nhập đầy đủ thông tin' 
      });
    }

    // Validate mã chức vụ (1 ký tự)
    if (ma_chuc_vu.length !== 1) {
      return res.status(400).json({ 
        success: false,
        message: 'Mã chức vụ phải có đúng 1 ký tự' 
      });
    }

    // Kiểm tra mã chức vụ đã tồn tại
    const [existing] = await db.query(
      'SELECT * FROM CHUCVU WHERE ma_chuc_vu = ?',
      [ma_chuc_vu]
    );

    if (existing.length > 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Mã chức vụ đã tồn tại' 
      });
    }

    // Thêm chức vụ
    await db.query(
      'INSERT INTO CHUCVU (ma_chuc_vu, ten_chuc_vu) VALUES (?, ?)',
      [ma_chuc_vu, ten_chuc_vu]
    );

    res.status(201).json({ 
      success: true,
      message: 'Thêm chức vụ thành công',
      data: { ma_chuc_vu, ten_chuc_vu }
    });
  } catch (error) {
    console.error('Create position error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};

// Cập nhật chức vụ
exports.updatePosition = async (req, res) => {
  try {
    const { id } = req.params;
    const { ten_chuc_vu } = req.body;

    // Validate input
    if (!ten_chuc_vu) {
      return res.status(400).json({ 
        success: false,
        message: 'Vui lòng nhập tên chức vụ' 
      });
    }

    // Kiểm tra chức vụ tồn tại
    const [existing] = await db.query(
      'SELECT * FROM CHUCVU WHERE ma_chuc_vu = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Không tìm thấy chức vụ' 
      });
    }

    await db.query(
      'UPDATE CHUCVU SET ten_chuc_vu = ? WHERE ma_chuc_vu = ?',
      [ten_chuc_vu, id]
    );

    res.json({ 
      success: true,
      message: 'Cập nhật chức vụ thành công' 
    });
  } catch (error) {
    console.error('Update position error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};

// Xóa chức vụ
exports.deletePosition = async (req, res) => {
  try {
    const { id } = req.params;

    // Kiểm tra chức vụ tồn tại
    const [existing] = await db.query(
      'SELECT * FROM CHUCVU WHERE ma_chuc_vu = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Không tìm thấy chức vụ' 
      });
    }

    // Kiểm tra có nhân viên giữ chức vụ này không
    const [employees] = await db.query(
      'SELECT COUNT(*) as count FROM NHANVIEN WHERE ma_chucvu = ? AND trang_thai = 1',
      [id]
    );

    if (employees[0].count > 0) {
      return res.status(400).json({ 
        success: false,
        message: `Không thể xóa chức vụ vì còn ${employees[0].count} nhân viên` 
      });
    }

    // Xóa chức vụ
    await db.query('DELETE FROM CHUCVU WHERE ma_chuc_vu = ?', [id]);

    res.json({ 
      success: true,
      message: 'Xóa chức vụ thành công' 
    });
  } catch (error) {
    console.error('Delete position error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};