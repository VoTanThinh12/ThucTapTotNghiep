import express from 'express';
import {
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  getCustomerStats
} from '../controllers/customerController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Admin only routes
router.use(authenticate, authorize('admin'));

router.get('/', getAllCustomers);
router.get('/stats', getCustomerStats);
router.get('/:id', getCustomerById);
router.put('/:id', updateCustomer);

export default router;
