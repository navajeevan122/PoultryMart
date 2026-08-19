import React, { useEffect, useState, useContext } from 'react';
import API from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Search, CheckCircle, XCircle, Trash2, Edit3, Eye, Clock } from 'lucide-react';

const Listings = () => {
  const { showToast } = useContext(AuthContext);
  const [listings, setListings] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchListings = async () => {
    try {
      const res = await API.get(`/admin/listings?status=${statusFilter}&search=${search}`);
      setListings(res.data || []);
    } catch (error) {
      console.error('[Fetch Admin Listings Error]', error);
      showToast('Error loading listings', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [statusFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchListings();
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete listing "${name}"?`)) return;

    try {
      await API.delete(`/admin/listings/${id}`);
      showToast('Listing deleted successfully by admin', 'success');
      setListings((prev) => prev.filter((l) => l._id !== id));
    } catch (error) {
      showToast(error.response?.data?.message || 'Error deleting listing', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">All Poultry Listings (Admin)</h1>
          <p className="text-xs text-gray-500 mt-0.5">Filter, search, inspect, or remove any poultry listing.</p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Status Filter Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 focus:outline-none"
          >
            <option value="all">All Approval Statuses</option>
            <option value="pending">Pending Only</option>
            <option value="approved">Approved Only</option>
            <option value="rejected">Rejected Only</option>
          </select>

          <form onSubmit={handleSearch} className="relative flex-1 sm:w-64">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by breed or location..."
              className="w-full pl-8 pr-3 py-2 bg-white border border-gray-300 rounded-xl text-xs text-gray-900 focus:outline-none"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-2.5 top-2.5" />
          </form>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner message="Fetching listings database..." />
      ) : listings.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-gray-200 text-center">
          <p className="text-gray-500 text-sm font-medium">No poultry listings match the selected criteria.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-700">
              <thead className="bg-gray-50 uppercase text-[10px] text-gray-400 font-bold border-b border-gray-200">
                <tr>
                  <th className="p-4">Bird / Breed</th>
                  <th className="p-4">Farmer / Seller</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Views</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {listings.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="p-4">
                      <div className="space-y-0.5">
                        <strong className="block text-gray-900">{item.name}</strong>
                        <span className="text-[11px] text-gray-500">
                          {item.gender} • {item.breed}
                        </span>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="space-y-0.5">
                        <strong className="block text-gray-800">{item.sellerId?.name || 'Farmer'}</strong>
                        <span className="text-[11px] text-purple-800 font-mono font-bold">
                          {item.sellerId?.phone}
                        </span>
                      </div>
                    </td>

                    <td className="p-4 font-bold text-farm-700">₹{item.price}</td>

                    <td className="p-4 text-gray-600">{item.location || item.district || 'India'}</td>

                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          item.approvalStatus === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.approvalStatus === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {item.approvalStatus}
                      </span>
                    </td>

                    <td className="p-4 text-gray-500">{item.views || 0}</td>

                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDelete(item._id, item.name)}
                        className="px-2.5 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 font-bold text-[11px] transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Listings;
