const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// @route   GET /api/employees
// @desc    Lấy danh sách nhân viên
// @access  Private
router.get('/', auth, employeeController.getAllEmployees);

// @route   GET /api/employees/stats
// @desc    Thống kê nhân viên
// @access  Private - Admin, KeToan
router.get('/stats', auth, roleCheck('Admin', 'KeToan'), employeeController.getEmployeeStats);

// @route   GET /api/employees/:id
// @desc    Lấy thông tin chi tiết nhân viên
// @access  Private
router.get('/:id', auth, employeeController.getEmployeeById);

// @route   POST /api/employees
// @desc    Thêm nhân viên mới
// @access  Private - Admin
router.post('/', auth, roleCheck('Admin'), employeeController.createEmployee);

// @route   PUT /api/employees/:id
// @desc    Cập nhật thông tin nhân viên
// @access  Private - Admin
router.put('/:id', auth, roleCheck('Admin'), employeeController.updateEmployee);

// @route   DELETE /api/employees/:id
// @desc    Xóa nhân viên (soft delete)
// @access  Private - Admin
router.delete('/:id', auth, roleCheck('Admin'), employeeController.deleteEmployee);

// @route   PUT /api/employees/:id/restore
// @desc    Khôi phục nhân viên đã xóa
// @access  Private - Admin
router.put('/:id/restore', auth, roleCheck('Admin'), employeeController.restoreEmployee);

module.exports = router;