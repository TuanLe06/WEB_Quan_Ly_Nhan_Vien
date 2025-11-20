const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/departmentController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// @route   GET /api/departments
// @desc    Lấy danh sách phòng ban
// @access  Private
router.get('/', auth, departmentController.getAllDepartments);

// @route   GET /api/departments/:id
// @desc    Lấy thông tin chi tiết phòng ban
// @access  Private
router.get('/:id', auth, departmentController.getDepartmentById);

// @route   POST /api/departments
// @desc    Thêm phòng ban mới
// @access  Private - Admin
router.post('/', auth, roleCheck('Admin'), departmentController.createDepartment);

// @route   PUT /api/departments/:id
// @desc    Cập nhật phòng ban
// @access  Private - Admin
router.put('/:id', auth, roleCheck('Admin'), departmentController.updateDepartment);

// @route   DELETE /api/departments/:id
// @desc    Xóa phòng ban (soft delete)
// @access  Private - Admin
router.delete('/:id', auth, roleCheck('Admin'), departmentController.deleteDepartment);

module.exports = router;