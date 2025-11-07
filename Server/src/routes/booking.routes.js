const express = require('express');
const { listBookings, createBooking, updateStatus } = require('../controllers/booking.controller');
const { auth } = require('../middleware/auth');
const router = express.Router();

router.get('/', auth('admin'), listBookings);
router.post('/', createBooking);
router.put('/:id/status', auth('admin'), updateStatus);

module.exports = router;
