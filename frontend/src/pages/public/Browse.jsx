import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../../services/api';
import PoultryCard from '../../components/PoultryCard';
import SearchBar from '../../components/SearchBar';
import Filters from '../../components/Filters';
import LoadingSpinner from '../../components/LoadingSpinner';
import { SlidersHorizontal, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';

const Browse = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // State for search and filters
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [filters, setFilters] = useState({
    gender: searchParams.get('gender') || 'All',
    breed: searchParams.get('breed') || 'All',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    minAge: searchParams.get('minAge') || '',
    maxAge: searchParams.get('maxAge') || '',
    minWeight: searchParams.get('minWeight') || '',
    maxWeight: searchParams.get('maxWeight') || '',
    location: searchParams.get('location') || '',
    healthStatus: searchParams.get('healthStatus') || 'All',
  });

  const [sortBy, setSortBy] = useState('newest');
  const [poultryList, setPoultryList] = useState([]);
  const [availableBreeds, setAvailableBreeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalListings, setTotalListings] = useState(0);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Fetch unique breeds for filter dropdown
  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        const res = await API.get('/breeds');
        setAvailableBreeds(res.data || []);
      } catch (err) {
        console.error('[Breeds Fetch Error]', err);
      }
    };
    fetchBreeds();
  }, []);

  // Fetch poultry listings based on current search, filters, sorting & pagination
  const fetchPoultry = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (filters.gender !== 'All') params.append('gender', filters.gender);
      if (filters.breed !== 'All') params.append('breed', filters.breed);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.minAge) params.append('minAge', filters.minAge);
      if (filters.maxAge) params.append('maxAge', filters.maxAge);
      if (filters.minWeight) params.append('minWeight', filters.minWeight);
      if (filters.maxWeight) params.append('maxWeight', filters.maxWeight);
      if (filters.location) params.append('location', filters.location);
      if (filters.healthStatus !== 'All') params.append('healthStatus', filters.healthStatus);
      if (sortBy) params.append('sortBy', sortBy);
      params.append('page', page);
      params.append('limit', 12);

      const res = await API.get(`/poultry?${params.toString()}`);
      setPoultryList(res.data.poultry || []);
      setTotalPages(res.data.pages || 1);
      setTotalListings(res.data.total || 0);
    } catch (error) {
      console.error('[Fetch Poultry Error]', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPoultry();
  }, [searchTerm, filters, sortBy, page]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setFilters({
      gender: 'All',
      breed: 'All',
      minPrice: '',
      maxPrice: '',
      minAge: '',
      maxAge: '',
      minWeight: '',
      maxWeight: '',
      location: '',
      healthStatus: 'All',
    });
    setSortBy('newest');
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900">
          Browse <span className="text-farm-600">Poultry</span>
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Explore healthy hens, cocks, and breeding stock listed directly by local farmers.
        </p>
      </div>

      {/* Top Search Bar */}
      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onSearch={() => setPage(1)}
      />

      {/* Filter and Sort Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 w-full sm:w-auto">
          <button
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="lg:hidden px-3 py-2 bg-gray-100 rounded-lg text-xs font-bold text-gray-800 flex items-center gap-1.5"
          >
            <SlidersHorizontal className="w-4 h-4 text-farm-600" /> Filters
          </button>
          <span>
            Showing <strong className="text-farm-700">{totalListings}</strong> available poultry listings
          </span>
        </div>

        {/* Sort By Dropdown */}
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 w-full sm:w-auto justify-end">
          <ArrowUpDown className="w-4 h-4 text-gray-500" />
          <span>Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setPage(1);
            }}
            className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-farm-500"
          >
            <option value="newest">Newest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="age_asc">Age: Low to High</option>
            <option value="age_desc">Age: High to Low</option>
            <option value="views">Most Viewed</option>
          </select>
        </div>
      </div>

      {/* Main Grid & Filters Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Sidebar Filters */}
        <div className="hidden lg:block lg:col-span-1">
          <Filters
            filters={filters}
            setFilters={setFilters}
            availableBreeds={availableBreeds}
            onReset={handleResetFilters}
          />
        </div>

        {/* Mobile Filter Drawer */}
        {isMobileFilterOpen && (
          <div className="lg:hidden col-span-1">
            <Filters
              filters={filters}
              setFilters={setFilters}
              availableBreeds={availableBreeds}
              onReset={handleResetFilters}
            />
          </div>
        )}

        {/* Poultry Listings Cards Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <LoadingSpinner message="Searching poultry listings..." />
          ) : poultryList.length === 0 ? (
            /* Empty State */
            <div className="bg-white p-12 rounded-2xl border border-gray-200 text-center space-y-4 shadow-sm">
              <div className="text-5xl">🐓</div>
              <h3 className="text-xl font-bold text-gray-800">No poultry listings found.</h3>
              <p className="text-sm text-gray-500 max-w-md mx-auto">
                Try changing your search terms or relaxing your filters to view more birds.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 bg-farm-600 hover:bg-farm-700 text-white text-xs font-bold rounded-xl transition"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {poultryList.map((item) => (
                  <PoultryCard key={item._id} poultry={item} />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center space-x-2 pt-6">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="p-2 rounded-lg border border-gray-300 text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="text-sm font-semibold text-gray-700 px-4">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className="p-2 rounded-lg border border-gray-300 text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Browse;
