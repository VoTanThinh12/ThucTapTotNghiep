// ================================================================
// BOOKING ROUTES - Quản lý đặt sân
// ================================================================

const express = require('express');
const router = express.Router();
const {
  createBooking,
  getBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middlewares/auth');

// All routes require authentication
router.use(protect);

router.post('/', createBooking);
router.get('/', getBookings);
router.get('/:id', getBookingById);
router.put('/:id/cancel', cancelBooking);

// Admin only
router.put('/:id/status', authorize('admin'), updateBookingStatus);

module.exports = router;
