import Booking from '../models/bookingModel.js';
import Car from '../models/carModel.js';

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
export const createBooking = async (req, res) => {
  try {
    const {
      car,
      startDate,
      endDate,
      totalDays,
      totalPrice,
    } = req.body;

    // Calculate rental days and check dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start > end) {
      res.status(400);
      throw new Error('End date must be after start date');
    }

    // Check if car is available for booking period
    const carDoc = await Car.findById(car);
    
    if (!carDoc) {
      res.status(404);
      throw new Error('Car not found');
    }
    
    if (!carDoc.available) {
      res.status(400);
      throw new Error('Car is not available for booking');
    }

    // Check if car is already booked for the selected dates
    const existingBooking = await Booking.findOne({
      car,
      $or: [
        { 
          startDate: { $lte: end },
          endDate: { $gte: start }
        }
      ],
      status: { $in: ['pending', 'confirmed'] }
    });

    if (existingBooking) {
      res.status(400);
      throw new Error('Car is already booked for selected dates');
    }

    const booking = new Booking({
      user: req.user._id,
      car,
      startDate,
      endDate,
      totalDays,
      totalPrice,
    });

    const createdBooking = await booking.save();
    res.status(201).json(createdBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get logged in user bookings
// @route   GET /api/bookings/mybookings
// @access  Private
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('car', 'name image brand')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('car');

    if (booking) {
      // Check if booking belongs to logged in user or user is admin
      if (booking.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
        res.status(401);
        throw new Error('Not authorized');
      }
      
      res.json(booking);
    } else {
      res.status(404);
      throw new Error('Booking not found');
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// @desc    Update booking to paid
// @route   PUT /api/bookings/:id/pay
// @access  Private
export const updateBookingToPaid = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (booking) {
      booking.isPaid = true;
      booking.paidAt = Date.now();
      booking.status = 'confirmed';

      const updatedBooking = await booking.save();
      res.json(updatedBooking);
    } else {
      res.status(404);
      throw new Error('Booking not found');
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};