import express from 'express';
import {
  getCars,
  getCarById,
  createCar,
  updateCar,
} from '../controllers/carController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getCars).post(protect, admin, createCar);
router.route('/:id').get(getCarById).put(protect, admin, updateCar);

export default router;