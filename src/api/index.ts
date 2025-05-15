import axios from 'axios';

const API_URL = import.meta.env.FRONTEND_URL || '/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem('user');
    if (user) {
      const { token } = JSON.parse(user);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// API functions
export const carAPI = {
  getAllCars: () => api.get('/cars'),
  getCarById: (id: string) => api.get(`/cars/${id}`),
  searchCars: (keyword: string) => api.get(`/cars?keyword=${keyword}`),
};

export const bookingAPI = {
  createBooking: (bookingData: any) => api.post('/bookings', bookingData),
  getMyBookings: () => api.get('/bookings/mybookings'),
  getBookingById: (id: string) => api.get(`/bookings/${id}`),
  updateBookingToPaid: (id: string) => api.put(`/bookings/${id}/pay`),
};

export const userAPI = {
  login: (email: string, password: string) => 
    api.post('/users/login', { email, password }),
  register: (name: string, email: string, password: string) => 
    api.post('/users', { name, email, password }),
  getProfile: () => api.get('/users/profile'),
  updateProfile: (userData: any) => api.put('/users/profile', userData),
};

export default api;