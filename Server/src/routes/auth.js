import express from 'express';
import { 
  register, 
  login, 
  getProfile, 
  updateProfile,
  changePassword 
} from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { validate, authValidation } from '../middleware/validator.js';

const router = express.Router();

// Public routes
router.post('/register', validate(authValidation.register), register);
router.post('/login', validate(authValidation.login), login);

// Protected routes
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);
router.post('/change-password', authenticate, changePassword);

export default router;
