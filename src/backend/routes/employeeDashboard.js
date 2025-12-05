const express = require('express');
const router = express.Router();
const employeeDashboardController = require('../controllers/employeeDashboardController');
const auth = require('../middleware/auth');

// @route   GET /api/dashboard/employee/:ma_nv
// @desc    Dashboard nhân viên
// @access  Private
router.get('/employee/:ma_nv', auth, employeeDashboardController.getEmployeeDashboard);

module.exports = router;