import express from 'express';
import {
  getAllPitches,
  getPitchById,
  getPitchTimeSlots,
  createPitch,
  updatePitch,
  deletePitch,
  getAvailableSlots
} from '../controllers/pitchController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate, pitchValidation } from '../middleware/validator.js';

const router = express.Router();

// Public routes
router.get('/', getAllPitches);
router.get('/available-slots', getAvailableSlots);
router.get('/:id', getPitchById);
router.get('/:id/time-slots', getPitchTimeSlots);

// Admin routes
router.post('/', 
  authenticate, 
  authorize('admin'), 
  validate(pitchValidation.create), 
  createPitch
);

router.put('/:id', 
  authenticate, 
  authorize('admin'), 
  validate(pitchValidation.update), 
  updatePitch
);

router.delete('/:id', 
  authenticate, 
  authorize('admin'), 
  deletePitch
);

// GET /:id/time-slots - Lấy danh sách khúng giờ của một sân
const getPitchTimeSlots = async (req, res) => {
  try {
    const { id } = req.params;
    const query = `
      SELECT id, pitch_id, start_time, end_time, price, is_available 
      FROM time_slots 
      WHERE pitch_id = ?
      ORDER BY start_time ASC
    `;
    const [slots] = await pool.query(query, [id]);
    res.json({
      success: true,
      data: slots || []
    });
  } catch (error) {
    console.error('Get time slots error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export default router;
