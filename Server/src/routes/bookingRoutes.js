const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { authenticate, isAdmin } = require('../middleware/auth');

router.post('/', bookingController.createBooking);
router.get('/', authenticate, bookingController.getAllBookings);
router.get('/check-availability', bookingController.checkAvailability);
router.get('/calculate-price', bookingController.calculatePrice);
router.get('/:id', authenticate, bookingController.getBookingById);
router.put('/:id/status', authenticate, isAdmin, bookingController.updateBookingStatus);

module.exports = router;
