const express = require('express');
const router = express.Router();
const salaryController = require('../controllers/salaryController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// @route   POST /api/salary/calculate
// @desc    Tính lương cho một nhân viên (có bảo vệ trạng thái)
// @access  Private - Admin, KeToan
router.post('/calculate', auth, roleCheck('Admin', 'KeToan'), salaryController.calculateSalary);

// @route   POST /api/salary/calculate-all
// @desc    Tính lương cho tất cả nhân viên (có bảo vệ trạng thái)
// @access  Private - Admin, KeToan
router.post('/calculate-all', auth, roleCheck('Admin', 'KeToan'), salaryController.calculateAllSalary);

// @route   POST /api/salary/lock
// @desc    Khóa lương tháng
// @access  Private - Admin, KeToan
router.post('/lock', auth, roleCheck('Admin', 'KeToan'), salaryController.lockSalary);

// @route   POST /api/salary/unlock
// @desc    Mở khóa lương tháng (chỉ Admin)
// @access  Private - Admin
router.post('/unlock', auth, roleCheck('Admin'), salaryController.unlockSalary);

// @route   POST /api/salary/confirm
// @desc    Xác nhận lương tháng
// @access  Private - Admin, KeToan
router.post('/confirm', auth, roleCheck('Admin', 'KeToan'), salaryController.confirmSalary);

// @route   GET /api/salary/monthly
// @desc    Xem bảng lương tháng
// @access  Private - Admin, KeToan
router.get('/monthly', auth, roleCheck('Admin', 'KeToan'), salaryController.getMonthlySalary);

// @route   GET /api/salary/deducted
// @desc    Danh sách nhân viên bị trừ lương
// @access  Private - Admin, KeToan
router.get('/deducted', auth, roleCheck('Admin', 'KeToan'), salaryController.getDeductedSalary);

// @route   GET /api/salary/top
// @desc    Top nhân viên lương cao nhất
// @access  Private - Admin, KeToan
router.get('/top', auth, roleCheck('Admin', 'KeToan'), salaryController.getTopSalary);

// @route   GET /api/salary/by-department
// @desc    Tổng quỹ lương theo phòng ban
// @access  Private - Admin, KeToan
router.get('/by-department', auth, roleCheck('Admin', 'KeToan'), salaryController.getSalaryByDepartment);

// @route   GET /api/salary/compare
// @desc    So sánh lương theo tháng
// @access  Private - Admin, KeToan
router.get('/compare', auth, roleCheck('Admin', 'KeToan'), salaryController.compareSalary);

// @route   GET /api/salary/employee/:ma_nv
// @desc    Xem chi tiết lương của nhân viên
// @access  Private
router.get('/employee/:ma_nv', auth, salaryController.getEmployeeSalary);

// @route   DELETE /api/salary/:id
// @desc    Xóa bảng lương (Admin - không thể xóa đã khóa)
// @access  Private - Admin
router.delete('/:id', auth, roleCheck('Admin'), salaryController.deleteSalary);

module.exports = router;