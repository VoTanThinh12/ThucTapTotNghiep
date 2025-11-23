// ================================================================
// PITCH ROUTES - Quản lý sân bóng
// ================================================================

const express = require('express');
const router = express.Router();
const {
  getPitches,
  getPitchById,
  createPitch,
  updatePitch,
  deletePitch,
  getTimeslots
} = require('../controllers/pitchController');
const { protect, authorize } = require('../middlewares/auth');

// Public routes
router.get('/', getPitches);
router.get('/:id', getPitchById);
router.get('/:id/timeslots', getTimeslots);

// Admin only routes
router.post('/', protect, authorize('admin'), createPitch);
router.put('/:id', protect, authorize('admin'), updatePitch);
router.delete('/:id', protect, authorize('admin'), deletePitch);

module.exports = router;
