const express = require('express');
const router = express.Router();
const contractController = require('../controllers/contractController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// @route   POST /api/contracts
// @desc    Thêm hợp đồng mới
// @access  Private - Admin
router.post('/', auth, roleCheck('Admin'), contractController.createContract);

// @route   GET /api/contracts
// @desc    Lấy danh sách hợp đồng
// @access  Private - Admin
router.get('/', auth, roleCheck('Admin'), contractController.getContracts);

// @route   GET /api/contracts/expiring
// @desc    Hợp đồng sắp hết hạn
// @access  Private - Admin
router.get('/expiring', auth, roleCheck('Admin'), contractController.getExpiringContracts);

// @route   GET /api/contracts/expired
// @desc    Hợp đồng đã hết hạn
// @access  Private - Admin
router.get('/expired', auth, roleCheck('Admin'), contractController.getExpiredContracts);

// @route   GET /api/contracts/stats
// @desc    Thống kê hợp đồng theo loại
// @access  Private - Admin
router.get('/stats', auth, roleCheck('Admin'), contractController.getContractStats);

// @route   GET /api/contracts/:id
// @desc    Lấy chi tiết hợp đồng
// @access  Private - Admin
router.get('/:id', auth, roleCheck('Admin'), contractController.getContractById);

// @route   PUT /api/contracts/:id
// @desc    Cập nhật hợp đồng
// @access  Private - Admin
router.put('/:id', auth, roleCheck('Admin'), contractController.updateContract);

// @route   DELETE /api/contracts/:id
// @desc    Xóa hợp đồng
// @access  Private - Admin
router.delete('/:id', auth, roleCheck('Admin'), contractController.deleteContract);

module.exports = router;