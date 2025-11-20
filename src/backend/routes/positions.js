const express = require('express');
const router = express.Router();
const positionController = require('../controllers/positionController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// @route   GET /api/positions
// @desc    Lấy danh sách chức vụ
// @access  Private
router.get('/', auth, positionController.getAllPositions);

// @route   GET /api/positions/:id
// @desc    Lấy thông tin chi tiết chức vụ
// @access  Private
router.get('/:id', auth, positionController.getPositionById);

// @route   POST /api/positions
// @desc    Thêm chức vụ mới
// @access  Private - Admin
router.post('/', auth, roleCheck('Admin'), positionController.createPosition);

// @route   PUT /api/positions/:id
// @desc    Cập nhật chức vụ
// @access  Private - Admin
router.put('/:id', auth, roleCheck('Admin'), positionController.updatePosition);

// @route   DELETE /api/positions/:id
// @desc    Xóa chức vụ
// @access  Private - Admin
router.delete('/:id', auth, roleCheck('Admin'), positionController.deletePosition);

module.exports = router;