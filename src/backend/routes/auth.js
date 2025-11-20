const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// @route   POST /api/auth/login
// @desc    Đăng nhập
// @access  Public
router.post('/login', authController.login);

// @route   POST /api/auth/register
// @desc    Đăng ký tài khoản mới (chỉ Admin)
// @access  Private - Admin
router.post('/register', auth, roleCheck('Admin'), authController.register);

// @route   PUT /api/auth/change-password
// @desc    Đổi mật khẩu
// @access  Private
router.put('/change-password', auth, authController.changePassword);

// @route   GET /api/auth/me
// @desc    Lấy thông tin user hiện tại
// @access  Private
router.get('/me', auth, authController.getMe);

module.exports = router;