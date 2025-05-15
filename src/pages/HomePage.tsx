import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { carAPI } from '../api';
import CarCard from '../components/cars/CarCard';
import { ArrowRight } from 'lucide-react';

const HomePage: React.FC = () => {
  const [featuredCars, setFeaturedCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useState({
    pickupDate: '',
    returnDate: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeaturedCars = async () => {
      try {
        const { data } = await carAPI.getAllCars();
        // Get 6 cars with highest ratings
        const featured = data
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 6);
        setFeaturedCars(featured);
      } catch (error) {
        console.error('Error fetching featured cars:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedCars();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate('/cars', { state: searchParams });
  };

  return (
    <div>
      {/* Hero Section */}
      <section 
        className="relative h-screen bg-cover bg-center flex items-center"
        style={{ backgroundImage: 'url(https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg)' }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-white leading-tight mb-6">
              Experience Luxury on Wheels
            </h1>
            <p className="text-xl text-white mb-8">
              Elevate your journey with our premium collection of luxury vehicles,
              offering unparalleled comfort, style, and performance.
            </p>
            
            {/* Search Form */}
            <div className="bg-white bg-opacity-95 rounded-lg p-6 shadow-xl">
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="pickup-date" className="block text-gray-700 mb-1">
                      Pickup Date
                    </label>
                    <input
                      type="date"
                      id="pickup-date"
                      min={new Date().toISOString().split('T')[0]}
                      value={searchParams.pickupDate}
                      onChange={(e) => 
                        setSearchParams({ ...searchParams, pickupDate: e.target.value })
                      }
                      className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gold-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="return-date" className="block text-gray-700 mb-1">
                      Return Date
                    </label>
                    <input
                      type="date"
                      id="return-date"
                      min={searchParams.pickupDate || new Date().toISOString().split('T')[0]}
                      value={searchParams.returnDate}
                      onChange={(e) => 
                        setSearchParams({ ...searchParams, returnDate: e.target.value })
                      }
                      className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gold-500"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-gold-500 text-gray-900 py-3 px-4 rounded-md font-semibold hover:bg-gold-600 transition"
                >
                  Search Available Cars
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Cars Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
              Featured Luxury Vehicles
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover our handpicked selection of premium cars that redefine luxury and performance.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredCars.map((car) => (
                <CarCard key={car._id} car={car} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <a
              href="/cars"
              className="inline-flex items-center text-gold-600 font-semibold hover:text-gold-700"
            >
              View All Cars
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
              Why Choose EliteDrive
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We offer a premium experience that sets us apart from traditional car rental services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-lg text-center hover:shadow-lg transition duration-300">
              <div className="bg-gold-500 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Premium Selection</h3>
              <p className="text-gray-600">
                Our fleet features the finest luxury vehicles from prestigious brands worldwide, meticulously maintained for optimal performance.
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg text-center hover:shadow-lg transition duration-300">
              <div className="bg-gold-500 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Seamless Experience</h3>
              <p className="text-gray-600">
                Enjoy a hassle-free rental process from booking to return, with personalized service tailored to your preferences.
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg text-center hover:shadow-lg transition duration-300">
              <div className="bg-gold-500 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Exceptional Service</h3>
              <p className="text-gray-600">
                Our dedicated team ensures every aspect of your rental experience exceeds expectations, from vehicle delivery to concierge services.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
              What Our Clients Say
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Discover why our clients choose us for their luxury car rental needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="text-gold-500">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-300 mb-4">
                "The Ferrari 488 GTB I rented was immaculate, and the service was exceptional. EliteDrive made my anniversary weekend truly special."
              </p>
              <div className="font-semibold">— Michael Thompson</div>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="text-gold-500">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-300 mb-4">
                "Renting the Rolls-Royce Phantom through EliteDrive was seamless. The attention to detail and customer service are unmatched."
              </p>
              <div className="font-semibold">— Sophia Martinez</div>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="text-gold-500">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-300 mb-4">
                "I've rented from luxury car services worldwide, and EliteDrive stands out. Their Lamborghini Huracán was perfectly maintained and delivered to my hotel."
              </p>
              <div className="font-semibold">— James Wilson</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gold-500">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-6">
              Ready to Experience Luxury?
            </h2>
            <p className="text-xl text-gray-800 mb-8">
              Browse our exclusive collection of luxury vehicles and book your dream car today.
            </p>
            <a
              href="/cars"
              className="inline-block bg-gray-900 text-white py-3 px-8 rounded-md font-semibold hover:bg-black transition"
            >
              Explore Our Fleet
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;