const express = require('express');
const { listPitches, createPitch, updatePitch, deletePitch, getBookingsByDate } = require('../controllers/pitch.controller');
const { auth } = require('../middleware/auth');
const router = express.Router();

router.get('/', listPitches);
router.post('/', auth('admin'), createPitch);
router.put('/:id', auth('admin'), updatePitch);
router.delete('/:id', auth('admin'), deletePitch);
router.get('/:id/bookings', auth(), getBookingsByDate);

module.exports = router;
