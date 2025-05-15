import React, { useState, useEffect, useContext } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { carAPI, bookingAPI } from '../api';
import AuthContext from '../context/AuthContext';
import { Calendar, CreditCard, ArrowLeft, Check } from 'lucide-react';

const BookingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingData, setBookingData] = useState({
    startDate: location.state?.startDate || '',
    endDate: location.state?.endDate || '',
    totalDays: location.state?.totalDays || 0,
    totalPrice: location.state?.totalPrice || 0,
  });

  // Payment form state
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [cardInfo, setCardInfo] = useState({
    name: '',
    number: '',
    expiry: '',
    cvc: '',
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchCarDetails = async () => {
      try {
        setLoading(true);
        const { data } = await carAPI.getCarById(id);
        setCar(data);
        
        // If booking data wasn't passed through location state, calculate it
        if (!location.state) {
          const today = new Date();
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          
          const nextWeek = new Date(today);
          nextWeek.setDate(nextWeek.getDate() + 7);
          
          const startDate = today.toISOString().split('T')[0];
          const endDate = nextWeek.toISOString().split('T')[0];
          const totalDays = 7;
          
          setBookingData({
            startDate,
            endDate,
            totalDays,
            totalPrice: totalDays * data.pricePerDay,
          });
        }
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
  }, [id, user, navigate, location.state]);

  const handlePaymentMethodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentMethod(e.target.value);
  };

  const handleCardInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardInfo({
      ...cardInfo,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const bookingPayload = {
        car: id,
        startDate: bookingData.startDate,
        endDate: bookingData.endDate,
        totalDays: bookingData.totalDays,
        totalPrice: bookingData.totalPrice,
      };
      
      await bookingAPI.createBooking(bookingPayload);
      
      // Simulate payment processing (in a real app, you'd handle this via a payment gateway)
      setTimeout(() => {
        setBookingSuccess(true);
        setLoading(false);
      }, 1500);
      
    } catch (err) {
      setError('Failed to create booking. Please try again.');
      console.error(err);
      setLoading(false);
    }
  };

  if (loading && !car) {
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
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-gold-600 hover:text-gold-700"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Go Back
        </button>
      </div>
    );
  }

  if (bookingSuccess) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Booking Confirmed!</h2>
          <p className="text-lg text-gray-600 mb-6">
            Thank you for booking with EliteDrive. Your luxury car rental has been confirmed.
          </p>
          
          <div className="border-t border-b border-gray-200 py-6 my-6">
            <div className="flex justify-between mb-4">
              <span className="font-medium text-gray-600">Car:</span>
              <span className="font-bold text-gray-900">{car.brand} {car.name}</span>
            </div>
            <div className="flex justify-between mb-4">
              <span className="font-medium text-gray-600">Pick-up Date:</span>
              <span className="text-gray-900">{new Date(bookingData.startDate).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between mb-4">
              <span className="font-medium text-gray-600">Return Date:</span>
              <span className="text-gray-900">{new Date(bookingData.endDate).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between mb-4">
              <span className="font-medium text-gray-600">Duration:</span>
              <span className="text-gray-900">{bookingData.totalDays} days</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span className="text-gray-800">Total:</span>
              <span className="text-gray-900">${bookingData.totalPrice}</span>
            </div>
          </div>
          
          <p className="text-gray-600 mb-8">
            A confirmation email has been sent to {user.email} with all the details of your booking.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              onClick={() => navigate('/bookings')}
              className="bg-gold-500 text-gray-900 py-2 px-6 rounded-md font-medium hover:bg-gold-600 transition"
            >
              View My Bookings
            </button>
            <button
              onClick={() => navigate('/')}
              className="bg-gray-200 text-gray-800 py-2 px-6 rounded-md font-medium hover:bg-gray-300 transition"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 max-w-6xl">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-gold-600 hover:text-gold-700"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Car Details
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          {/* Car Summary Section */}
          <div className="md:w-1/3 bg-gray-50 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Your Reservation</h2>
            
            {car && (
              <div>
                <div className="mb-6">
                  <img
                    src={car.image}
                    alt={car.name}
                    className="w-full h-48 object-cover rounded"
                  />
                </div>
                
                <h3 className="text-lg font-bold text-gray-900">{car.brand} {car.name}</h3>
                <p className="text-gray-600 mb-4">{car.year} • {car.category}</p>
                
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex items-center mb-4">
                    <Calendar className="h-5 w-5 text-gold-500 mr-2" />
                    <div>
                      <p className="text-gray-600 text-sm">Pick-up Date</p>
                      <p className="font-medium">
                        {new Date(bookingData.startDate).toLocaleDateString('en-US', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center mb-4">
                    <Calendar className="h-5 w-5 text-gold-500 mr-2" />
                    <div>
                      <p className="text-gray-600 text-sm">Return Date</p>
                      <p className="font-medium">
                        {new Date(bookingData.endDate).toLocaleDateString('en-US', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex justify-between text-gray-600 mb-2">
                    <span>Daily Rate:</span>
                    <span>${car.pricePerDay}/day</span>
                  </div>
                  <div className="flex justify-between text-gray-600 mb-2">
                    <span>Duration:</span>
                    <span>{bookingData.totalDays} days</span>
                  </div>
                  <div className="flex justify-between font-bold text-gray-900 text-lg mt-2">
                    <span>Total:</span>
                    <span>${bookingData.totalPrice}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Payment Form Section */}
          <div className="md:w-2/3 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Information</h2>

            <form onSubmit={handleSubmit}>
              {/* Payment Method Selection */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Payment Method</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      id="credit-card"
                      name="payment-method"
                      type="radio"
                      value="credit-card"
                      checked={paymentMethod === 'credit-card'}
                      onChange={handlePaymentMethodChange}
                      className="h-4 w-4 text-gold-600 focus:ring-gold-500 border-gray-300"
                    />
                    <label htmlFor="credit-card" className="ml-3 flex items-center">
                      <span className="block text-gray-700 mr-2">Credit Card</span>
                      <span className="flex space-x-1">
                        <svg className="h-6 w-auto" viewBox="0 0 36 24" fill="none">
                          <rect width="36" height="24" rx="4" fill="#1A1F71" />
                          <path fillRule="evenodd" clipRule="evenodd" d="M10.5 16.2876H8.36206L7.2 9.71289H9.33794L10.5 16.2876Z" fill="#FF8C00" />
                          <path d="M16.4379 9.87723C16.0283 9.71289 15.3876 9.55078 14.6124 9.55078C12.6737 9.55078 11.3173 10.6151 11.3173 12.1685C11.3173 13.3166 12.2687 13.9665 12.9984 14.3582C13.7379 14.75 13.9634 15.0036 13.9634 15.3501C13.9634 15.8665 13.3227 16.1042 12.7283 16.1042C11.9062 16.1042 11.4696 15.9942 10.8021 15.7405L10.5496 15.631L10.2772 17.3584C10.7771 17.5769 11.7014 17.7673 12.6565 17.7766C14.7324 17.7766 16.0586 16.731 16.0724 15.0585C16.0862 14.1586 15.5186 13.4618 14.3793 12.874C13.6807 12.4823 13.2579 12.2207 13.2579 11.8215C13.2579 11.4676 13.6635 11.1116 14.5628 11.1116C15.2965 11.0937 15.8427 11.2489 16.2627 11.4045L16.4379 11.4864L16.6903 9.87723H16.4379Z" fill="#FF8C00" />
                          <path d="M21.7655 9.71289H20.0807C19.6193 9.71289 19.271 9.84907 19.0662 10.341L16.5738 16.2879H18.6966C18.6966 16.2879 19.021 15.4429 19.1062 15.2526C19.3834 15.2526 21.271 15.2526 21.6214 15.2526C21.6883 15.4967 21.8703 16.2879 21.8703 16.2879H23.7724L21.7655 9.71289ZM19.7938 13.6989C19.959 13.2802 20.5069 11.8571 20.5069 11.8571C20.4938 11.8845 20.6565 11.4748 20.7483 11.217L20.8834 11.7788C20.8834 11.7788 21.1903 13.3234 21.2703 13.6989H19.7938Z" fill="#FF8C00" />
                          <path d="M7.5 9.71289L5.56275 14.1493L5.37239 13.1945C5.02136 11.9306 3.90343 10.552 2.66382 9.87723L4.46172 16.2876H6.59966L9.63446 9.71289H7.5Z" fill="#FF8C00" />
                          <path d="M4.05032 9.71289H0.84L0.75 9.9216C3.28775 10.5986 4.98704 12.1786 5.37239 13.1945L4.69443 10.3499C4.57411 9.8693 4.36125 9.7324 4.05032 9.71289Z" fill="#1A1F71" />
                        </svg>
                        <svg className="h-6 w-auto" viewBox="0 0 36 24" fill="none">
                          <rect width="36" height="24" rx="4" fill="#EB001B" />
                          <circle cx="11.5" cy="12.5" r="7.5" fill="#EB001B" />
                          <circle cx="24.5" cy="12.5" r="7.5" fill="#F79E1B" />
                          <path fillRule="evenodd" clipRule="evenodd" d="M18 17.5C19.614 16.077 20.6569 14.0627 20.6569 11.7889C20.6569 9.51513 19.614 7.50085 18 6.07812C16.386 7.50085 15.3431 9.51513 15.3431 11.7889C15.3431 14.0627 16.386 16.077 18 17.5Z" fill="#FF5F00" />
                        </svg>
                        <svg className="h-6 w-auto" viewBox="0 0 36 24" fill="none">
                          <rect width="36" height="24" rx="4" fill="#003087" />
                          <path fillRule="evenodd" clipRule="evenodd" d="M15.3276 7.80054H10.5952C10.2629 7.80054 9.97853 8.07077 9.94054 8.40297L8.38095 18.6858C8.35169 18.9307 8.5398 19.1496 8.78486 19.1496H11.0802C11.4126 19.1496 11.6969 18.8793 11.7349 18.5471L12.1905 15.9348C12.2285 15.6027 12.5128 15.3324 12.8452 15.3324H14.3244C17.3109 15.3324 19.0557 13.8203 19.5089 10.953C19.712 9.69179 19.5099 8.71496 18.8598 8.04122C18.1483 7.30369 16.9514 7.80054 15.3276 7.80054ZM15.8032 11.1374C15.5522 12.7818 14.3173 12.7818 13.1086 12.7818H12.4835L12.9294 10.1856C12.9503 10.0389 13.0771 9.92949 13.2243 9.92949H13.5094C14.3013 9.92949 15.0547 9.92949 15.4368 10.3561C15.6731 10.6115 15.7494 10.8249 15.8032 11.1374Z" fill="white" />
                          <path fillRule="evenodd" clipRule="evenodd" d="M26.7248 11.0908H24.4291C24.282 11.0908 24.1551 11.2002 24.1343 11.3468L24.04 11.9347L23.8938 11.7321C23.4254 11.0889 22.5322 10.8662 21.6389 10.8662C19.2514 10.8662 17.2265 12.7323 16.8243 15.291C16.6179 16.5689 16.9205 17.7966 17.6399 18.6613C18.3016 19.4543 19.2313 19.7848 20.3234 19.7848C22.2302 19.7848 23.2761 18.5569 23.2761 18.5569L23.1821 19.1448C23.1529 19.3896 23.341 19.6086 23.586 19.6086H25.6674C25.9997 19.6086 26.2841 19.3384 26.3221 19.0062L27.1287 11.5546C27.1579 11.3098 26.9698 11.0908 26.7248 11.0908ZM23.9188 15.3638C23.709 16.6416 22.677 17.4943 21.3862 17.4943C20.7407 17.4943 20.21 17.2934 19.8556 16.9093C19.5029 16.5271 19.3648 15.9873 19.4676 15.3941C19.6638 14.13 20.7086 13.2519 21.9821 13.2519C22.6143 13.2519 23.1415 13.4548 23.5027 13.8428C23.865 14.2328 24.0118 14.7766 23.9188 15.3638Z" fill="white" />
                        </svg>
                        <svg className="h-6 w-auto" viewBox="0 0 36 24" fill="none">
                          <rect width="36" height="24" rx="4" fill="#2F3032" />
                          <path d="M14.5753 15.8954C14.5753 17.7496 13.1679 19.2 11.3672 19.2C9.56648 19.2 8.15906 17.7496 8.15906 15.8954C8.15906 14.0412 9.56648 12.5908 11.3672 12.5908C13.1679 12.5908 14.5753 14.0412 14.5753 15.8954Z" fill="#0099DF" />
                          <path d="M21.4209 15.8954C21.4209 17.7496 20.0135 19.2 18.2128 19.2C16.4121 19.2 15.0046 17.7496 15.0046 15.8954C15.0046 14.0412 16.4121 12.5908 18.2128 12.5908C20.0135 12.5908 21.4209 14.0412 21.4209 15.8954Z" fill="#EB001B" />
                          <path d="M17.8408 13.9078C18.9328 14.7509 19.5625 16.1005 19.5625 17.4501C19.5625 15.8954 20.0135 14.5458 20.8755 13.5014C19.9918 12.5908 18.7434 12 17.391 12C16.0386 12 14.7902 12.5908 13.9065 13.5014C14.7685 14.5458 15.2195 15.8954 15.2195 17.4501C15.2195 16.1005 15.8492 14.7509 16.9412 13.9078C17.1995 14.1092 17.5825 14.1092 17.8408 13.9078Z" fill="#6C6BBD" />
                        </svg>
                      </span>
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="paypal"
                      name="payment-method"
                      type="radio"
                      value="paypal"
                      checked={paymentMethod === 'paypal'}
                      onChange={handlePaymentMethodChange}
                      className="h-4 w-4 text-gold-600 focus:ring-gold-500 border-gray-300"
                    />
                    <label htmlFor="paypal" className="ml-3 flex items-center">
                      <span className="block text-gray-700 mr-2">PayPal</span>
                      <svg className="h-6 w-auto" viewBox="0 0 36 24" fill="none">
                        <rect width="36" height="24" rx="4" fill="#F2F2F2" />
                        <path d="M15.0624 8.40039C14.2922 8.40039 13.6667 9.02593 13.6667 9.79612C13.6667 10.6636 14.4453 11.1925 15.0624 11.1925H17.2051C17.2999 11.1925 17.3771 11.2697 17.3771 11.3644V11.9593C17.3771 12.054 17.2999 12.1313 17.2051 12.1313H15.0624C14.2922 12.1313 13.6667 12.7568 13.6667 13.527C13.6667 14.2972 14.2922 14.9227 15.0624 14.9227H17.2051C17.2999 14.9227 17.3771 15 17.3771 15.0947V15.6896C17.3771 15.7844 17.2999 15.8616 17.2051 15.8616H15.0624C14.2922 15.8616 13.6667 16.4871 13.6667 17.2573C13.6667 18.0275 14.2922 18.6531 15.0624 18.6531H17.2051C18.0698 18.6531 18.7724 17.9504 18.7724 17.0858V14.1102C18.7724 13.2455 18.0698 12.5429 17.2051 12.5429C16.3405 12.5429 15.6378 13.2455 15.6378 14.1102C15.6378 14.9748 16.3405 15.6775 17.2051 15.6775H17.748V15.0947C17.748 15 17.8252 14.9227 17.9199 14.9227H18.0292C18.9766 14.9227 19.7462 14.1531 19.7462 13.2058V13.0965C19.7462 12.1491 18.9766 11.3796 18.0292 11.3796H17.9199C17.8252 11.3796 17.748 11.3023 17.748 11.2076V10.0964C17.748 9.23174 17.0453 8.52911 16.1807 8.52911H15.0624C14.2922 8.52911 13.6667 9.15466 13.6667 9.92484C13.6667 10.695 14.2922 11.3206 15.0624 11.3206H16.3956C16.4903 11.3206 16.5676 11.2433 16.5676 11.1486V10.0964C16.5676 10.0017 16.4903 9.9244 16.3956 9.9244H15.0624C14.9677 9.9244 14.8904 9.84713 14.8904 9.75241V9.6657C14.8904 9.57098 14.9677 9.49371 15.0624 9.49371H16.1807C16.3701 9.49371 16.5229 9.64654 16.5229 9.83598V10.0964C16.5229 10.191 16.4457 10.2683 16.3509 10.2683H15.0624C14.9677 10.2683 14.8904 10.191 14.8904 10.0964V9.92484C14.8904 9.83012 14.9677 9.75285 15.0624 9.75285H16.1807C16.2754 9.75285 16.3527 9.83012 16.3527 9.92484V10.0964C16.3527 10.191 16.2754 10.2683 16.1807 10.2683H15.0624C14.9677 10.2683 14.8904 10.191 14.8904 10.0964V9.79612C14.8904 9.7014 14.9677 9.62413 15.0624 9.62413H16.1807C16.2754 9.62413 16.3527 9.7014 16.3527 9.79612V10.0964C16.3527 10.191 16.2754 10.2683 16.1807 10.2683H15.0624C14.9677 10.2683 14.8904 10.191 14.8904 10.0964C14.8904 10.0017 14.9677 9.92441 15.0624 9.92441H16.1807C16.3701 9.92441 16.5229 10.0772 16.5229 10.2667V10.0964C16.5229 10.191 16.4457 10.2683 16.3509 10.2683H15.0624" fill="#1B3364" />
                        <path d="M25.1151 9.24512H21.4323C21.0824 9.24512 20.8114 9.50252 20.7842 9.84881L20.0134 15.7362C19.991 16.0386 20.2258 16.3046 20.5292 16.3046H22.2859C22.6368 16.3046 22.9368 16.0383 22.964 15.6879L23.1607 14.1393C23.1879 13.789 23.4889 13.5227 23.8397 13.5227H24.7624C26.6724 13.5227 27.6859 12.692 27.9462 10.8512C28.0624 10.0579 27.8962 9.42539 27.5128 9.0014C27.0889 8.52731 26.2357 8.24512 25.1151 8.24512V9.24512ZM25.4387 11.0013C25.2951 12.0245 24.5216 12.0245 23.8106 12.0245H23.3985L23.5952 10.467C23.6088 10.3652 23.6971 10.2899 23.7999 10.2899H23.9893C24.4503 10.2899 24.8847 10.2899 25.1061 10.5335C25.2381 10.6775 25.2801 10.8105 25.4387 11.0013ZM31.7155 13.4692H30.195C30.0931 13.4692 30.0039 13.5444 29.9903 13.6471L29.9368 13.9821L29.8554 13.861C29.5712 13.3992 29.038 13.2451 28.5049 13.2451C27.2347 13.2451 26.1141 14.2374 25.8892 15.6227C25.7728 16.3337 25.9399 17.0129 26.3225 17.5006C26.6731 17.9493 27.195 18.1576 27.8011 18.1576C28.805 18.1576 29.3805 17.4663 29.3805 17.4663L29.327 17.8013C29.3083 17.9029 29.3831 18.0032 29.4861 18.0032H30.8498C31.1997 18.0032 31.4997 17.7369 31.5268 17.3865L32.006 13.7202C32.0201 13.6195 31.9443 13.4692 31.7155 13.4692H31.7155ZM30.1864 15.668C30.0647 16.3337 29.5272 16.7867 28.8539 16.7867C28.5189 16.7867 28.2479 16.6733 28.0798 16.4674C27.9127 16.2616 27.8418 15.9627 27.893 15.6227C28.0066 14.9662 28.5559 14.4949 29.2172 14.4949C29.5453 14.4949 29.8136 14.6083 29.9853 14.8171C30.1587 15.0288 30.2343 15.3297 30.1864 15.668Z" fill="#28356A" />
                        <path d="M30.2344 10.2529H26.5516C26.2018 10.2529 25.9307 10.5103 25.9036 10.8566L25.1328 16.744C25.1103 17.0464 25.3451 17.3124 25.6486 17.3124H27.3184C27.5473 17.3124 27.744 17.1322 27.7768 16.9049L27.9901 15.1471C28.0172 14.7967 28.3183 14.5304 28.6691 14.5304H29.5918C31.5018 14.5304 32.5152 13.6997 32.7756 11.8589C32.8918 11.0657 32.7256 10.4332 32.3422 10.0091C31.9183 9.53508 31.065 9.25287 29.9444 9.25287L30.2344 10.2529ZM30.5581 12.0091C30.4145 13.0323 29.641 13.0323 28.93 13.0323H28.5178L28.7145 11.4747C28.7282 11.3729 28.8165 11.2977 28.9193 11.2977H29.1086C29.5697 11.2977 30.0041 11.2977 30.2255 11.5413C30.3575 11.6853 30.3995 11.8183 30.5581 12.0091ZM12.6667 10.2529H9.32258C8.97279 10.2529 8.70176 10.5103 8.67465 10.8566L7.90383 16.744C7.88139 17.0464 8.11616 17.3124 8.4196 17.3124H9.85599C10.2058 17.3124 10.4768 17.055 10.5039 16.7087L10.7006 15.1471C10.7277 14.7967 11.0288 14.5304 11.3796 14.5304H12.3023C14.2122 14.5304 15.2257 13.6997 15.4861 11.8589C15.6023 11.0657 15.4361 10.4332 15.0526 10.0092C14.6287 9.53508 13.7754 9.25287 12.6549 9.25287L12.6667 10.2529ZM12.9685 12.0091C12.825 13.0323 12.0515 13.0323 11.3405 13.0323H10.9283L11.125 11.4747C11.1387 11.3729 11.2269 11.2977 11.3297 11.2977H11.5191C11.9802 11.2977 12.4146 11.2977 12.636 11.5413C12.768 11.6853 12.8099 11.8183 12.9685 12.0091ZM19.2496 14.4769H17.7282C17.6254 14.4769 17.5371 14.5521 17.5235 14.6548L17.4701 14.9898L17.3887 14.8687C17.1045 14.4069 16.5714 14.2529 16.0383 14.2529C14.7681 14.2529 13.6474 15.2452 13.4225 16.6304C13.3061 17.3414 13.4733 18.0206 13.8558 18.5082C14.2064 18.9569 14.7284 19.1653 15.3344 19.1653C16.3384 19.1653 16.9139 18.4739 16.9139 18.4739L16.8604 18.8089C16.8417 18.9107 16.9165 19.0109 17.0195 19.0109H18.3832C18.7331 19.0109 19.0331 18.7446 19.0602 18.3941L19.5394 14.7279C19.5536 14.6272 19.4778 14.4769 19.2488 14.4769H19.2496ZM17.7199 16.6757C17.5982 17.3414 17.0607 17.7944 16.3874 17.7944C16.0524 17.7944 15.7814 17.681 15.6133 17.4752C15.4462 17.2693 15.3753 16.9705 15.4265 16.6304C15.5401 15.9739 16.0894 15.5027 16.7507 15.5027C17.0787 15.5027 17.3471 15.616 17.5188 15.8248C17.6922 16.0364 17.7677 16.3374 17.7199 16.6757Z" fill="#298FC2" />
                      </svg>
                    </label>
                  </div>
                </div>
              </div>

              {/* Credit Card Form */}
              {paymentMethod === 'credit-card' && (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="card-name" className="block text-sm font-medium text-gray-700 mb-1">
                      Name on card
                    </label>
                    <input
                      type="text"
                      id="card-name"
                      name="name"
                      value={cardInfo.name}
                      onChange={handleCardInfoChange}
                      placeholder="John Doe"
                      className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gold-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="card-number" className="block text-sm font-medium text-gray-700 mb-1">
                      Card number
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="card-number"
                        name="number"
                        value={cardInfo.number}
                        onChange={handleCardInfoChange}
                        placeholder="1234 5678 9012 3456"
                        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gold-500"
                        maxLength={19}
                        required
                      />
                      <CreditCard className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="expiry" className="block text-sm font-medium text-gray-700 mb-1">
                        Expiry date
                      </label>
                      <input
                        type="text"
                        id="expiry"
                        name="expiry"
                        value={cardInfo.expiry}
                        onChange={handleCardInfoChange}
                        placeholder="MM/YY"
                        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gold-500"
                        maxLength={5}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="cvc" className="block text-sm font-medium text-gray-700 mb-1">
                        CVC
                      </label>
                      <input
                        type="text"
                        id="cvc"
                        name="cvc"
                        value={cardInfo.cvc}
                        onChange={handleCardInfoChange}
                        placeholder="123"
                        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gold-500"
                        maxLength={3}
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* PayPal Form */}
              {paymentMethod === 'paypal' && (
                <div className="bg-blue-50 p-4 rounded-md">
                  <p className="text-gray-700 mb-3">
                    You'll be redirected to PayPal to complete your payment securely.
                  </p>
                  <p className="text-sm text-gray-500">
                    Note: You don't need a PayPal account to pay with your credit or debit card through PayPal.
                  </p>
                </div>
              )}

              <div className="mt-8">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gold-500 text-gray-900 py-3 px-4 rounded-md font-semibold hover:bg-gold-600 transition"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-900"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    `Pay $${bookingData.totalPrice}`
                  )}
                </button>
              </div>

              <p className="text-sm text-gray-500 mt-4 text-center">
                By proceeding with the payment, you agree to our{' '}
                <a href="#" className="text-gold-600 hover:text-gold-700">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-gold-600 hover:text-gold-700">
                  Rental Policy
                </a>
                .
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;