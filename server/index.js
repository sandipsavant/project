// import express from 'express';
// import dotenv from 'dotenv';
// import cors from 'cors';
// import cookieParser from 'cookie-parser';
// import { connectDB } from './config/db.js';
// import userRoutes from './routes/userRoutes.js';
// import carRoutes from './routes/carRoutes.js';
// import bookingRoutes from './routes/bookingRoutes.js';
// import { errorHandler } from './middleware/errorMiddleware.js';

// // Load environment variables
// dotenv.config();

// // Connect to database
// connectDB();

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(cors({
//   origin: 'http://localhost:5173',
//   credentials: true
// }));
// app.use(express.json());
// app.use(cookieParser());

// // Routes
// app.use('/api/users', userRoutes);
// app.use('/api/cars', carRoutes);
// app.use('/api/bookings', bookingRoutes);

// // Error handler middleware
// app.use(errorHandler);

// // Start server
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
// });

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

import { connectDB } from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import carRoutes from './routes/carRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import { errorHandler } from './middleware/errorMiddleware.js';

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/bookings', bookingRoutes);

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  // Serve static files from the Vite build output directory
  app.use(express.static(path.join(__dirname, '../dist')));

  // Serve index.html for all other requests (SPA support)
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

// Error handler middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});
