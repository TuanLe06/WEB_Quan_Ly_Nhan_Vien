const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// @route   POST /api/attendance/checkin
// @desc    Check-in
// @access  Private
router.post('/checkin', auth, attendanceController.checkIn);

// @route   POST /api/attendance/checkout
// @desc    Check-out
// @access  Private
router.post('/checkout', auth, attendanceController.checkOut);

// @route   GET /api/attendance/today
// @desc    Lấy chấm công hôm nay
// @access  Private - Admin
router.get('/today', auth, roleCheck('Admin'), attendanceController.getTodayAttendance);

// @route   GET /api/attendance/stats
// @desc    Thống kê chấm công tháng
// @access  Private - Admin, KeToan
router.get('/stats', auth, roleCheck('Admin', 'KeToan'), attendanceController.getMonthlyStats);

// @route   GET /api/attendance/late
// @desc    Nhân viên đi làm muộn
// @access  Private - Admin
router.get('/late', auth, roleCheck('Admin'), attendanceController.getLateEmployees);

// @route   GET /api/attendance/not-checked-out
// @desc    Nhân viên chưa checkout
// @access  Private - Admin
router.get('/not-checked-out', auth, roleCheck('Admin'), attendanceController.getNotCheckedOut);

// @route   GET /api/attendance/history/:ma_nv
// @desc    Lịch sử chấm công của nhân viên
// @access  Private
router.get('/history/:ma_nv', auth, attendanceController.getAttendanceHistory);

// @route   PUT /api/attendance/:id
// @desc    Cập nhật chấm công (Admin)
// @access  Private - Admin
router.put('/:id', auth, roleCheck('Admin'), attendanceController.updateAttendance);

// @route   DELETE /api/attendance/:id
// @desc    Xóa bản ghi chấm công (Admin)
// @access  Private - Admin
router.delete('/:id', auth, roleCheck('Admin'), attendanceController.deleteAttendance);

module.exports = router;