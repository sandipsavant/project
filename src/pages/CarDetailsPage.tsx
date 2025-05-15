import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { carAPI } from '../api';
import CarDetails from '../components/cars/CarDetails';
import AuthContext from '../context/AuthContext';
import { ArrowLeft } from 'lucide-react';

const CarDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useContext(AuthContext);
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        setLoading(true);
        const { data } = await carAPI.getCarById(id);
        setCar(data);
      } catch (err) {
        setError('Failed to load car details. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCarDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-500"></div>
        </div>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8">
          <p className="text-red-700">{error || 'Car not found'}</p>
        </div>
        <Link to="/cars" className="inline-flex items-center text-gold-600 hover:text-gold-700">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to All Cars
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link to="/cars" className="inline-flex items-center text-gold-600 hover:text-gold-700">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to All Cars
        </Link>
      </div>

      <CarDetails car={car} isAuthenticated={!!user} />
    </div>
  );
};

export default CarDetailsPage;