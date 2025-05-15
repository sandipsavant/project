import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { users } from './data/users.js';
import { cars } from './data/cars.js';
import User from './models/userModel.js';
import Car from './models/carModel.js';
import Booking from './models/bookingModel.js';
import { connectDB } from './config/db.js';

dotenv.config();

connectDB();

const importData = async () => {
  try {
    // Clear all data
    await User.deleteMany();
    await Car.deleteMany();
    await Booking.deleteMany();

    // Import users
    const createdUsers = await User.insertMany(users);
    const adminUser = createdUsers[0]._id;

    // Import cars
    const sampleCars = cars.map(car => {
      return { ...car };
    });
    await Car.insertMany(sampleCars);

    console.log('Data imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    // Clear all data
    await User.deleteMany();
    await Car.deleteMany();
    await Booking.deleteMany();

    console.log('Data destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}