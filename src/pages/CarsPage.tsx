import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { carAPI } from '../api';
import CarCard from '../components/cars/CarCard';
import { Search, Filter, ChevronDown } from 'lucide-react';

const CarsPage: React.FC = () => {
  const location = useLocation();
  const initialSearchDates = location.state || {};
  
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    brand: '',
    category: '',
    priceMin: '',
    priceMax: '',
    sortBy: 'name-asc'
  });
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searchDates, setSearchDates] = useState({
    pickupDate: initialSearchDates.pickupDate || '',
    returnDate: initialSearchDates.returnDate || ''
  });

  // Get unique brands and categories for filter dropdowns
  const brands = [...new Set(cars.map(car => car.brand))].sort();
  const categories = [...new Set(cars.map(car => car.category))].sort();

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        const { data } = await carAPI.getAllCars();
        setCars(data);
      } catch (err) {
        setError('Failed to fetch cars. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (searchQuery.trim()) {
        const { data } = await carAPI.searchCars(searchQuery);
        setCars(data);
      } else {
        const { data } = await carAPI.getAllCars();
        setCars(data);
      }
    } catch (err) {
      setError('Search failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const resetFilters = () => {
    setFilters({
      brand: '',
      category: '',
      priceMin: '',
      priceMax: '',
      sortBy: 'name-asc'
    });
    setSearchQuery('');
    setSearchDates({
      pickupDate: '',
      returnDate: ''
    });
  };

  // Apply all filters and sorting
  const filteredCars = cars
    .filter(car => {
      // Brand filter
      if (filters.brand && car.brand !== filters.brand) return false;
      
      // Category filter
      if (filters.category && car.category !== filters.category) return false;
      
      // Price range filter
      if (filters.priceMin && car.pricePerDay < parseInt(filters.priceMin)) return false;
      if (filters.priceMax && car.pricePerDay > parseInt(filters.priceMax)) return false;
      
      return true;
    })
    .sort((a, b) => {
      // Sorting
      switch (filters.sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'price-asc':
          return a.pricePerDay - b.pricePerDay;
        case 'price-desc':
          return b.pricePerDay - a.pricePerDay;
        case 'rating-desc':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Our Luxury Fleet</h1>
          <p className="text-gray-600">
            Discover our exceptional collection of luxury vehicles for your next adventure.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="md:flex md:justify-between md:items-center">
            {/* Search Form */}
            <form onSubmit={handleSearch} className="mb-4 md:mb-0 md:w-1/3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by car name or brand..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full p-3 pl-10 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gold-500"
                />
                <Search className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                <button
                  type="submit"
                  className="absolute right-3 top-3 text-gold-500 hover:text-gold-600"
                >
                  <span className="sr-only">Search</span>
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </form>

            {/* Filter Toggle Button (Mobile) */}
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="flex items-center text-gray-700 hover:text-gold-500 md:hidden w-full justify-between p-2 border border-gray-300 rounded"
            >
              <div className="flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                <span>Filters</span>
              </div>
              <ChevronDown className={`h-4 w-4 transform ${filtersOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Filters (Desktop always visible, mobile toggleable) */}
          <div className={`mt-4 md:mt-6 ${filtersOpen ? 'block' : 'hidden md:block'}`}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">
                  Brand
                </label>
                <select
                  id="brand"
                  name="brand"
                  value={filters.brand}
                  onChange={handleFilterChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gold-500"
                >
                  <option value="">All Brands</option>
                  {brands.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gold-500"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="priceRange" className="block text-sm font-medium text-gray-700 mb-1">
                  Price Range (per day)
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    name="priceMin"
                    placeholder="Min"
                    value={filters.priceMin}
                    onChange={handleFilterChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                  <span className="text-gray-500">-</span>
                  <input
                    type="number"
                    name="priceMax"
                    placeholder="Max"
                    value={filters.priceMax}
                    onChange={handleFilterChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">
                  Sort By
                </label>
                <select
                  id="sortBy"
                  name="sortBy"
                  value={filters.sortBy}
                  onChange={handleFilterChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gold-500"
                >
                  <option value="name-asc">Name (A-Z)</option>
                  <option value="name-desc">Name (Z-A)</option>
                  <option value="price-asc">Price (Low to High)</option>
                  <option value="price-desc">Price (High to Low)</option>
                  <option value="rating-desc">Rating (Highest)</option>
                </select>
              </div>
            </div>

            {/* Date Filters */}
            {(searchDates.pickupDate || searchDates.returnDate) && (
              <div className="bg-gold-50 border border-gold-200 rounded-md p-3 mt-4 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div>
                    <span className="block text-sm font-medium text-gray-700">Pickup:</span>
                    <span className="font-medium text-gray-900">{searchDates.pickupDate}</span>
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-gray-700">Return:</span>
                    <span className="font-medium text-gray-900">{searchDates.returnDate}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSearchDates({ pickupDate: '', returnDate: '' })}
                  className="text-sm text-gold-600 hover:text-gold-800"
                >
                  Clear Dates
                </button>
              </div>
            )}

            <div className="flex justify-end mt-4">
              <button
                onClick={resetFilters}
                className="px-4 py-2 text-gray-700 hover:text-gold-600"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8">
            <p className="text-red-700">{error}</p>
          </div>
        ) : (
          <div>
            <p className="mb-6 text-gray-600">
              Showing {filteredCars.length} vehicles
            </p>

            {filteredCars.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No cars found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search criteria or filters.
                </p>
                <button
                  onClick={resetFilters}
                  className="bg-gold-500 text-gray-900 py-2 px-4 rounded font-medium hover:bg-gold-600 transition"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCars.map((car) => (
                  <CarCard key={car._id} car={car} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CarsPage;