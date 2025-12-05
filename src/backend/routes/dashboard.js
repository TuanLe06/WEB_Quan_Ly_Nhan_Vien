const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// @route   GET /api/dashboard/stats
// @desc    Lấy thống kê tổng quan
// @access  Private
router.get('/stats', auth, dashboardController.getDashboardStats);

// @route   GET /api/dashboard/employees-by-department
// @desc    Thống kê nhân viên theo phòng ban
// @access  Private
router.get('/employees-by-department', auth, dashboardController.getEmployeesByDepartment);

// @route   GET /api/dashboard/employees-by-position
// @desc    Thống kê nhân viên theo chức vụ
// @access  Private
router.get('/employees-by-position', auth, dashboardController.getEmployeesByPosition);

// @route   GET /api/dashboard/salary-trend
// @desc    Quỹ lương 6 tháng gần nhất
// @access  Private - Admin, KeToan
router.get('/salary-trend', auth, roleCheck('Admin', 'KeToan'), dashboardController.getSalaryTrend);

// @route   GET /api/dashboard/attendance-stats
// @desc    Thống kê chấm công tháng này
// @access  Private - Admin, KeToan
router.get('/attendance-stats', auth, roleCheck('Admin', 'KeToan'), dashboardController.getAttendanceStats);

// @route   GET /api/dashboard/top-employees
// @desc    Top 10 nhân viên chăm chỉ nhất
// @access  Private - Admin
router.get('/top-employees', auth, roleCheck('Admin', 'KeToan'), dashboardController.getTopEmployees);

// @route   GET /api/dashboard/leave-stats
// @desc    Thống kê nghỉ phép tháng này
// @access  Private - Admin
router.get('/leave-stats', auth, roleCheck('Admin', 'KeToan'), dashboardController.getLeaveStats);

// @route   GET /api/dashboard/recent-activities
// @desc    Hoạt động gần đây
// @access  Private - Admin
router.get('/recent-activities', auth, roleCheck('Admin', 'KeToan'), dashboardController.getRecentActivities);

module.exports = router;