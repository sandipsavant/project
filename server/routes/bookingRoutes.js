import express from 'express';
import {
  createBooking,
  getMyBookings,
  getBookingById,
  updateBookingToPaid,
} from '../controllers/bookingController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, createBooking);
router.route('/mybookings').get(protect, getMyBookings);
router.route('/:id').get(protect, getBookingById);
router.route('/:id/pay').put(protect, updateBookingToPaid);

export default router;