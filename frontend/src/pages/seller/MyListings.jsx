import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import { PlusCircle, Edit3, Trash2, Eye, AlertCircle, CheckCircle2, Clock, XCircle } from 'lucide-react';

const MyListings = () => {
  const { showToast } = useContext(AuthContext);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRejection, setSelectedRejection] = useState(null);

  const fetchListings = async () => {
    try {
      const res = await API.get('/seller/poultry');
      setListings(res.data.listings || []);
    } catch (error) {
      console.error('[Fetch My Listings Error]', error);
      showToast('Failed to load listings', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      await API.delete(`/seller/poultry/${id}`);
      showToast('Poultry listing deleted successfully', 'success');
      setListings((prev) => prev.filter((l) => l._id !== id));
    } catch (error) {
      console.error('[Delete Error]', error);
      showToast(error.response?.data?.message || 'Error deleting listing', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">My Poultry Listings</h1>
          <p className="text-xs text-gray-500 mt-0.5">Manage your active, pending, and past poultry postings.</p>
        </div>
        <Link
          to="/seller/poultry/add"
          className="px-4 py-2.5 bg-farm-600 hover:bg-farm-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
        >
          <PlusCircle className="w-4 h-4" /> Add New Poultry
        </Link>
      </div>

      {loading ? (
        <LoadingSpinner message="Fetching your poultry listings..." />
      ) : listings.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-gray-200 text-center space-y-4 shadow-sm">
          <div className="text-5xl">🐓</div>
          <h3 className="text-lg font-bold text-gray-800">You haven't added any poultry yet.</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Click below to create your first poultry listing and reach local buyers directly.
          </p>
          <Link
            to="/seller/poultry/add"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-farm-600 text-white text-xs font-bold rounded-xl shadow-md"
          >
            <PlusCircle className="w-4 h-4" /> Add Poultry Now
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((item) => {
            const coverImg =
              item.media?.images && item.media.images.length > 0
                ? item.media.images[0]
                : 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=800';

            return (
              <div
                key={item._id}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[16/9] bg-gray-100 overflow-hidden">
                    <img src={coverImg} alt={item.name} className="w-full h-full object-cover" />

                    {/* Status Badge */}
                    <div className="absolute top-3 left-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide flex items-center gap-1 shadow-md ${
                          item.approvalStatus === 'approved'
                            ? 'bg-emerald-600 text-white'
                            : item.approvalStatus === 'pending'
                            ? 'bg-amber-500 text-white'
                            : 'bg-red-600 text-white'
                        }`}
                      >
                        {item.approvalStatus === 'approved' && <CheckCircle2 className="w-3 h-3" />}
                        {item.approvalStatus === 'pending' && <Clock className="w-3 h-3" />}
                        {item.approvalStatus === 'rejected' && <XCircle className="w-3 h-3" />}
                        {item.approvalStatus}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1">
                      <Eye className="w-3 h-3" /> {item.views || 0} views
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <h3 className="font-bold text-gray-900 text-base line-clamp-1">{item.name}</h3>

                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                      <div>
                        <span className="text-gray-400">Breed:</span> <strong>{item.breed}</strong>
                      </div>
                      <div>
                        <span className="text-gray-400">Gender:</span> <strong>{item.gender}</strong>
                      </div>
                      <div>
                        <span className="text-gray-400">Price:</span>{' '}
                        <strong className="text-farm-700">₹{item.price}</strong>
                      </div>
                      <div>
                        <span className="text-gray-400">Quantity:</span> <strong>{item.quantity}</strong>
                      </div>
                    </div>

                    {/* Rejection notice if status is rejected */}
                    {item.approvalStatus === 'rejected' && (
                      <div className="bg-red-50 border border-red-200 p-3 rounded-xl text-xs text-red-800 space-y-1">
                        <span className="font-bold flex items-center gap-1 text-red-900">
                          <AlertCircle className="w-4 h-4 text-red-600" /> Listing Rejected
                        </span>
                        <p className="text-[11px] italic">"{item.rejectionReason || 'No reason provided.'}"</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between gap-2">
                  <Link
                    to={`/seller/poultry/edit/${item._id}`}
                    className="flex-1 py-2 bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit
                  </Link>

                  <button
                    onClick={() => handleDelete(item._id, item.name)}
                    className="py-2 px-3 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyListings;
