const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { authenticate, isAdmin } = require('../middleware/auth');

router.get('/dashboard', authenticate, isAdmin, reportController.getDashboardStats);
router.get('/revenue', authenticate, isAdmin, reportController.getRevenueReport);
router.get('/pitch-usage', authenticate, isAdmin, reportController.getPitchUsageStats);
router.get('/top-customers', authenticate, isAdmin, reportController.getTopCustomers);
router.get('/export', authenticate, isAdmin, reportController.exportReport);

module.exports = router;
