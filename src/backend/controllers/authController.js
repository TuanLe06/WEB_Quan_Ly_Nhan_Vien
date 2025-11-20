const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

// Đăng nhập
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Vui lòng nhập đầy đủ thông tin' 
      });
    }

    // Kiểm tra user tồn tại
    const [users] = await db.query(
      'SELECT * FROM NGUOIDUNG WHERE username = ?',
      [username]
    );

    if (users.length === 0) {
      return res.status(401).json({ 
        success: false,
        message: 'Tên đăng nhập không tồn tại' 
      });
    }

    const user = users[0];

    // Kiểm tra password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false,
        message: 'Mật khẩu không đúng' 
      });
    }

    // Tạo token
    const token = jwt.sign(
      { 
        username: user.username, 
        vai_tro: user.vai_tro,
        ma_nv: user.ma_nv 
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    // Cập nhật lần đăng nhập cuối
    await db.query(
      'UPDATE NGUOIDUNG SET lan_dang_nhap_cuoi = NOW() WHERE username = ?',
      [username]
    );

    // Lấy thông tin nhân viên nếu có
    let employeeInfo = null;
    if (user.ma_nv) {
      const [empData] = await db.query(
        'SELECT ten_nv, ma_phong FROM NHANVIEN WHERE ma_nv = ?',
        [user.ma_nv]
      );
      if (empData.length > 0) {
        employeeInfo = empData[0];
      }
    }

    res.json({
      success: true,
      message: 'Đăng nhập thành công',
      token,
      user: {
        username: user.username,
        vai_tro: user.vai_tro,
        ma_nv: user.ma_nv,
        ten_nv: employeeInfo?.ten_nv,
        ma_phong: employeeInfo?.ma_phong
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};

// Đăng ký (chỉ Admin)
exports.register = async (req, res) => {
  try {
    const { username, password, vai_tro, ma_nv } = req.body;

    // Validate input
    if (!username || !password || !vai_tro) {
      return res.status(400).json({ 
        success: false,
        message: 'Vui lòng nhập đầy đủ thông tin' 
      });
    }

    // Validate vai_tro
    if (!['Admin', 'NhanVien', 'KeToan'].includes(vai_tro)) {
      return res.status(400).json({ 
        success: false,
        message: 'Vai trò không hợp lệ' 
      });
    }

    // Kiểm tra username đã tồn tại
    const [existing] = await db.query(
      'SELECT * FROM NGUOIDUNG WHERE username = ?',
      [username]
    );

    if (existing.length > 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Tên đăng nhập đã tồn tại' 
      });
    }

    // Kiểm tra mã nhân viên nếu có
    if (ma_nv) {
      const [empCheck] = await db.query(
        'SELECT * FROM NHANVIEN WHERE ma_nv = ?',
        [ma_nv]
      );
      if (empCheck.length === 0) {
        return res.status(400).json({ 
          success: false,
          message: 'Mã nhân viên không tồn tại' 
        });
      }

      // Kiểm tra nhân viên đã có tài khoản chưa
      const [accountCheck] = await db.query(
        'SELECT * FROM NGUOIDUNG WHERE ma_nv = ?',
        [ma_nv]
      );
      if (accountCheck.length > 0) {
        return res.status(400).json({ 
          success: false,
          message: 'Nhân viên này đã có tài khoản' 
        });
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Thêm user mới
    await db.query(
      'INSERT INTO NGUOIDUNG (username, password, vai_tro, ma_nv) VALUES (?, ?, ?, ?)',
      [username, hashedPassword, vai_tro, ma_nv]
    );

    res.status(201).json({ 
      success: true,
      message: 'Đăng ký tài khoản thành công' 
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};

// Đổi mật khẩu
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const username = req.user.username;

    // Validate input
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ 
        success: false,
        message: 'Vui lòng nhập đầy đủ thông tin' 
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ 
        success: false,
        message: 'Mật khẩu mới phải có ít nhất 6 ký tự' 
      });
    }

    // Lấy thông tin user
    const [users] = await db.query(
      'SELECT * FROM NGUOIDUNG WHERE username = ?',
      [username]
    );

    if (users.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Không tìm thấy người dùng' 
      });
    }

    const user = users[0];

    // Kiểm tra mật khẩu cũ
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false,
        message: 'Mật khẩu cũ không đúng' 
      });
    }

    // Hash mật khẩu mới
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Cập nhật mật khẩu
    await db.query(
      'UPDATE NGUOIDUNG SET password = ? WHERE username = ?',
      [hashedPassword, username]
    );

    res.json({ 
      success: true,
      message: 'Đổi mật khẩu thành công' 
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};

// Lấy thông tin user hiện tại
exports.getMe = async (req, res) => {
  try {
    const username = req.user.username;

    const [users] = await db.query(`
      SELECT 
        nd.username,
        nd.vai_tro,
        nd.ma_nv,
        nv.ten_nv,
        nv.ma_phong,
        pb.ten_phong
      FROM NGUOIDUNG nd
      LEFT JOIN NHANVIEN nv ON nd.ma_nv = nv.ma_nv
      LEFT JOIN PHONGBAN pb ON nv.ma_phong = pb.ma_phong
      WHERE nd.username = ?
    `, [username]);

    if (users.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Không tìm thấy người dùng' 
      });
    }

    res.json({ 
      success: true,
      user: users[0] 
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};