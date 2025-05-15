import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingAPI } from '../api';
import { Calendar, Clock, DollarSign, Check, X, ChevronRight } from 'lucide-react';

const BookingsListPage: React.FC = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const { data } = await bookingAPI.getMyBookings();
        setBookings(data);
      } catch (err) {
        setError('Failed to load your bookings. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const StatusIcon = ({ status }) => {
    switch (status) {
      case 'confirmed':
        return <Check className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'cancelled':
        return <X className="h-4 w-4" />;
      case 'completed':
        return <Check className="h-4 w-4" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8">
          <p className="text-red-700">{error}</p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center text-gold-600 hover:text-gold-700"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-serif font-bold text-gray-900 mb-6">My Bookings</h1>

      {bookings.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="mb-4">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No bookings found</h3>
          <p className="text-gray-600 mb-6">
            You haven't made any bookings yet. Explore our luxury fleet and book your dream car today.
          </p>
          <Link
            to="/cars"
            className="inline-block bg-gold-500 text-gray-900 py-2 px-4 rounded font-medium hover:bg-gold-600 transition"
          >
            Browse Cars
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="hidden md:grid md:grid-cols-5 bg-gray-50 p-4 font-medium text-gray-700">
            <div>Car</div>
            <div>Dates</div>
            <div>Duration</div>
            <div>Status</div>
            <div>Price</div>
          </div>

          <div className="divide-y divide-gray-200">
            {bookings.map((booking) => (
              <div key={booking._id} className="p-4 hover:bg-gray-50">
                <div className="md:grid md:grid-cols-5 md:gap-4 items-center">
                  {/* Car */}
                  <div className="flex items-center mb-4 md:mb-0">
                    <div className="h-16 w-16 flex-shrink-0">
                      <img
                        src={booking.car.image}
                        alt={booking.car.name}
                        className="h-full w-full object-cover rounded"
                      />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        {booking.car.brand} {booking.car.name}
                      </h3>
                      <Link
                        to={`/car/${booking.car._id}`}
                        className="text-sm text-gold-600 hover:text-gold-700"
                      >
                        View Car
                      </Link>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="mb-4 md:mb-0">
                    <div className="md:hidden text-sm font-medium text-gray-500 mb-1">Dates</div>
                    <div className="flex items-center text-gray-900">
                      <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                      <div>
                        <div>{new Date(booking.startDate).toLocaleDateString()}</div>
                        <div>{new Date(booking.endDate).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </div>

                  {/* Duration */}
                  <div className="mb-4 md:mb-0">
                    <div className="md:hidden text-sm font-medium text-gray-500 mb-1">Duration</div>
                    <div className="text-gray-900">{booking.totalDays} days</div>
                  </div>

                  {/* Status */}
                  <div className="mb-4 md:mb-0">
                    <div className="md:hidden text-sm font-medium text-gray-500 mb-1">Status</div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(
                        booking.status
                      )}`}
                    >
                      <StatusIcon status={booking.status} />
                      <span className="ml-1 capitalize">{booking.status}</span>
                    </span>
                  </div>

                  {/* Price and Action */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="md:hidden text-sm font-medium text-gray-500 mb-1">Price</div>
                      <div className="text-gray-900 font-medium">${booking.totalPrice}</div>
                    </div>
                    <Link
                      to={`/booking/${booking._id}`}
                      className="inline-flex items-center text-sm font-medium text-gold-600 hover:text-gold-700"
                    >
                      Details
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingsListPage;