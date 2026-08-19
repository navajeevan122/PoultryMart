import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../../services/api';
import MediaGallery from '../../components/MediaGallery';
import SellerContactBox from '../../components/SellerContactBox';
import LoadingSpinner from '../../components/LoadingSpinner';
import { MapPin, ShieldCheck, Tag, Eye, Calendar, Weight, ArrowLeft, CheckCircle2 } from 'lucide-react';

const PoultryDetails = () => {
  const { id } = useParams();
  const [poultry, setPoultry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await API.get(`/poultry/${id}`);
        setPoultry(res.data);

        // Update Document Title for SEO
        if (res.data && res.data.name) {
          document.title = `${res.data.name} for Sale in ${res.data.district || res.data.location || 'India'} – PoultryMart`;
        }
      } catch (err) {
        console.error('[Fetch Poultry Details Error]', err);
        setError(err.response?.data?.message || 'Failed to load poultry details');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  if (loading) return <LoadingSpinner message="Loading poultry media & seller information..." />;

  if (error || !poultry) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="text-5xl">⚠️</div>
        <h2 className="text-2xl font-bold text-gray-800">Poultry Listing Not Found</h2>
        <p className="text-sm text-gray-500">{error || 'This listing may have been removed or deleted.'}</p>
        <Link
          to="/browse"
          className="inline-flex items-center gap-2 px-4 py-2 bg-farm-600 text-white rounded-lg font-bold text-xs"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Browse
        </Link>
      </div>
    );
  }

  const {
    name,
    gender,
    breed,
    age,
    ageUnit,
    weight,
    weightUnit,
    price,
    quantity,
    village,
    mandal,
    district,
    state,
    location,
    healthStatus,
    vaccinationStatus,
    vaccinationDetails,
    description,
    media,
    sellerId,
    views,
    createdAt,
  } = poultry;

  const fullLoc = location || [village, mandal, district, state].filter(Boolean).join(', ') || 'India';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center text-xs font-semibold text-gray-500 space-x-2">
        <Link to="/" className="hover:text-farm-600">Home</Link>
        <span>/</span>
        <Link to="/browse" className="hover:text-farm-600">Browse</Link>
        <span>/</span>
        <span className="text-gray-900 truncate">{name}</span>
      </nav>

      {/* Main Grid: Media & Specs vs Seller Contact Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left 2 Columns: Media & Info */}
        <div className="lg:col-span-2 space-y-8">
          {/* Media Gallery */}
          <MediaGallery images={media?.images} videos={media?.videos} />

          {/* Core Info Header */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-4">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide ${
                      gender === 'Hen' ? 'bg-pink-100 text-pink-800' : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {gender === 'Hen' ? '🐔 Hen' : '🐓 Cock'}
                  </span>
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {healthStatus || 'Healthy'}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">{name}</h1>
                <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                  <MapPin className="w-4 h-4 text-farm-600" />
                  {fullLoc}
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs text-gray-400 font-semibold uppercase block">Price</span>
                <span className="text-3xl font-black text-farm-700">
                  ₹{price ? price.toLocaleString('en-IN') : '0'}
                </span>
                <span className="block text-[11px] text-gray-500 mt-0.5">
                  Available Quantity: <strong className="text-gray-800">{quantity} bird(s)</strong>
                </span>
              </div>
            </div>

            {/* Quick Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                <span className="text-[11px] text-gray-400 font-medium block">Breed</span>
                <span className="text-sm font-bold text-gray-800">{breed}</span>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                <span className="text-[11px] text-gray-400 font-medium block">Age</span>
                <span className="text-sm font-bold text-gray-800">
                  {age} {ageUnit || 'Months'}
                </span>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                <span className="text-[11px] text-gray-400 font-medium block">Weight</span>
                <span className="text-sm font-bold text-gray-800">
                  {weight} {weightUnit || 'KG'}
                </span>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                <span className="text-[11px] text-gray-400 font-medium block">Listing Views</span>
                <span className="text-sm font-bold text-gray-800 flex items-center gap-1">
                  <Eye className="w-4 h-4 text-gray-400" />
                  {views || 1}
                </span>
              </div>
            </div>
          </div>

          {/* Health & Vaccination Details */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
              <ShieldCheck className="w-5 h-5 text-farm-600" />
              Health & Vaccination Status
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <span className="text-xs text-gray-400 font-semibold block uppercase">Vaccination Record</span>
                <div className="flex items-center gap-2 font-bold text-gray-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{vaccinationStatus || 'Vaccinated'}</span>
                </div>
              </div>
              {vaccinationDetails && (
                <div className="space-y-1">
                  <span className="text-xs text-gray-400 font-semibold block uppercase">Vaccination Notes</span>
                  <p className="text-xs text-gray-700 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                    {vaccinationDetails}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Description Section */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-3">
            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">
              Farmer Description
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {description || 'No additional description provided by the farmer.'}
            </p>
          </div>
        </div>

        {/* Right Column: Seller Information Card */}
        <div className="lg:col-span-1 sticky top-24">
          <SellerContactBox seller={sellerId} poultryName={name} />
        </div>
      </div>
    </div>
  );
};

export default PoultryDetails;
