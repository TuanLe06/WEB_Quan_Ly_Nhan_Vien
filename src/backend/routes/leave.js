const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leaveController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// @route   POST /api/leave
// @desc    Gửi yêu cầu nghỉ phép
// @access  Private
router.post('/', auth, leaveController.createLeaveRequest);

// @route   GET /api/leave
// @desc    Lấy danh sách yêu cầu nghỉ phép
// @access  Private
router.get('/', auth, leaveController.getLeaveRequests);

// @route   GET /api/leave/today
// @desc    Ai đang nghỉ phép hôm nay
// @access  Private
router.get('/today', auth, leaveController.getTodayLeave);

// @route   GET /api/leave/stats
// @desc    Thống kê nghỉ phép theo nhân viên
// @access  Private - Admin, KeToan
router.get('/stats', auth, roleCheck('Admin', 'KeToan'), leaveController.getLeaveStats);

// @route   GET /api/leave/:id
// @desc    Lấy chi tiết yêu cầu nghỉ phép
// @access  Private
router.get('/:id', auth, leaveController.getLeaveRequestById);

// @route   PUT /api/leave/:id/status
// @desc    Duyệt/Từ chối yêu cầu nghỉ phép
// @access  Private - Admin
router.put('/:id/status', auth, roleCheck('Admin'), leaveController.updateLeaveStatus);

// @route   PUT /api/leave/:id
// @desc    Cập nhật yêu cầu nghỉ phép (trước khi duyệt)
// @access  Private
router.put('/:id', auth, leaveController.updateLeaveRequest);

// @route   DELETE /api/leave/:id
// @desc    Xóa yêu cầu nghỉ phép (chỉ khi chờ duyệt)
// @access  Private
router.delete('/:id', auth, leaveController.deleteLeaveRequest);

module.exports = router;