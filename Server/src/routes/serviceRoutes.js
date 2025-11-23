// ================================================================
// USER & SERVICE ROUTES
// ================================================================

const express = require('express');
const router = express.Router();
const {
  getServices,
  createService,
  updateService
} = require('../controllers/serviceController');
const { protect, authorize } = require('../middlewares/auth');

// Public routes
router.get('/', getServices);

// Admin only routes
router.post('/', protect, authorize('admin'), createService);
router.put('/:id', protect, authorize('admin'), updateService);

module.exports = router;
