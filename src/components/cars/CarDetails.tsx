import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Users, Fuel, Zap, Check, ChevronLeft, ChevronRight } from 'lucide-react';

interface CarDetailsProps {
  car: {
    _id: string;
    name: string;
    brand: string;
    image: string;
    additionalImages: string[];
    description: string;
    category: string;
    pricePerDay: number;
    year: number;
    seats: number;
    transmission: string;
    fuelType: string;
    features: string[];
    reviews: Array<{
      name: string;
      rating: number;
      comment: string;
    }>;
    rating: number;
    numReviews: number;
  };
  isAuthenticated: boolean;
}

const CarDetails: React.FC<CarDetailsProps> = ({ car, isAuthenticated }) => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // Combine main image with additional images
  const allImages = [car.image, ...car.additionalImages];

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? allImages.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      (prevIndex + 1) % allImages.length
    );
  };

  const handleRentNow = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!startDate || !endDate) {
      alert('Please select both start and end dates');
      return;
    }

    // Calculate days difference
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start >= end) {
      alert('End date must be after start date');
      return;
    }

    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    navigate(`/booking/${car._id}`, { 
      state: { 
        startDate,
        endDate,
        totalDays: diffDays,
        totalPrice: diffDays * car.pricePerDay 
      } 
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Image Gallery */}
      <div className="relative h-96 md:h-[32rem]">
        <img
          src={allImages[currentImageIndex]}
          alt={car.name}
          className="w-full h-full object-cover"
        />
        
        {/* Image Navigation Buttons */}
        <button
          onClick={handlePrevImage}
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={handleNextImage}
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
        
        {/* Image Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {allImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-2 h-2 rounded-full ${
                currentImageIndex === index ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="p-6 md:p-8">
        <div className="md:flex justify-between">
          <div className="md:w-7/12">
            {/* Car Info Header */}
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{car.name}</h1>
                <p className="text-xl text-gray-600">{car.brand} • {car.year}</p>
              </div>
              <div className="bg-gray-100 px-4 py-2 rounded-lg text-right">
                <span className="block text-2xl font-bold text-gray-900">${car.pricePerDay}</span>
                <span className="text-gray-500">per day</span>
              </div>
            </div>

            {/* Car Specifications */}
            <div className="grid grid-cols-2 gap-6 my-6">
              <div className="flex items-center">
                <Users className="h-5 w-5 text-gold-500 mr-2" />
                <span className="text-gray-700">{car.seats} Seats</span>
              </div>
              <div className="flex items-center">
                <Zap className="h-5 w-5 text-gold-500 mr-2" />
                <span className="text-gray-700">{car.transmission}</span>
              </div>
              <div className="flex items-center">
                <Fuel className="h-5 w-5 text-gold-500 mr-2" />
                <span className="text-gray-700">{car.fuelType}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gold-500 mr-2" />
                <span className="text-gray-700">{car.year}</span>
              </div>
            </div>

            {/* Description */}
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Description</h2>
              <p className="text-gray-700 leading-relaxed">{car.description}</p>
            </div>

            {/* Features */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Features</h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {car.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="h-5 w-5 text-gold-500 mr-2" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Booking Form */}
          <div className="md:w-4/12 mt-8 md:mt-0">
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Book this car</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="start-date" className="block text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="start-date"
                    min={new Date().toISOString().split('T')[0]}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="end-date" className="block text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    id="end-date"
                    min={startDate || new Date().toISOString().split('T')[0]}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                </div>
                
                {startDate && endDate && (
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <div className="flex justify-between text-gray-600 mb-2">
                      <span>Daily Rate:</span>
                      <span>${car.pricePerDay} × {startDate && endDate ? calculateDays(startDate, endDate) : 0} days</span>
                    </div>
                    <div className="flex justify-between font-semibold text-gray-900 text-lg">
                      <span>Total:</span>
                      <span>${startDate && endDate ? calculateDays(startDate, endDate) * car.pricePerDay : 0}</span>
                    </div>
                  </div>
                )}
                
                <button
                  onClick={handleRentNow}
                  className="w-full bg-gold-500 text-gray-900 py-3 px-4 rounded font-semibold hover:bg-gold-600 transition mt-4"
                >
                  {isAuthenticated ? 'Book Now' : 'Sign In to Book'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to calculate days between dates
const calculateDays = (startDate: string, endDate: string): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export default CarDetails;