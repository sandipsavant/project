import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';

interface CarCardProps {
  car: {
    _id: string;
    name: string;
    brand: string;
    image: string;
    pricePerDay: number;
    category: string;
    rating: number;
    numReviews: number;
  };
}

const CarCard: React.FC<CarCardProps> = ({ car }) => {
  return (
    <Link 
      to={`/car/${car._id}`}
      className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
    >
      <div className="relative overflow-hidden h-56">
        <img
          src={car.image}
          alt={car.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-0 right-0 bg-gold-500 text-gray-900 text-sm font-bold px-3 py-1 m-2 rounded">
          {car.category}
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 group-hover:text-gold-600 transition-colors">
              {car.name}
            </h3>
            <p className="text-gray-500">{car.brand}</p>
          </div>
          <div className="bg-gray-100 px-3 py-1 rounded-full">
            <span className="font-bold text-gray-900">${car.pricePerDay}</span>
            <span className="text-gray-500 text-sm">/day</span>
          </div>
        </div>
        
        <div className="flex items-center mt-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(car.rating)
                    ? 'text-gold-500 fill-gold-500'
                    : 'text-gray-300'
                }`}
              />
            ))}
            <span className="text-gray-600 ml-1 text-sm">
              ({car.numReviews})
            </span>
          </div>
          <span className="ml-auto text-gold-600 font-medium group-hover:underline">
            View Details
          </span>
        </div>
      </div>
    </Link>
  );
};

export default CarCard;