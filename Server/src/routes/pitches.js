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

export default router;
