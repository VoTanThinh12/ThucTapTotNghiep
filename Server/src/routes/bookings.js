import express from 'express';
import {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBooking,
  cancelBooking,
  getMyBookings,
  getBookingStats
} from '../controllers/bookingController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate, bookingValidation } from '../middleware/validator.js';

const router = express.Router();

// Customer routes
router.get('/my-bookings', authenticate, getMyBookings);
router.post('/', 
  authenticate, 
  validate(bookingValidation.create), 
  createBooking
);
router.post('/:id/cancel', authenticate, cancelBooking);

// Admin routes
router.get('/', authenticate, authorize('admin'), getAllBookings);
router.get('/stats', authenticate, authorize('admin'), getBookingStats);
router.get('/:id', authenticate, getBookingById);
router.put('/:id', 
  authenticate, 
  authorize('admin'), 
  validate(bookingValidation.update), 
  updateBooking
);

export default router;
