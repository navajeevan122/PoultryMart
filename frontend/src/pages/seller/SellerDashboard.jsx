import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import { PlusCircle, ListFilter, Eye, CheckCircle2, Clock, XCircle, User, Feather, Layers } from 'lucide-react';

const SellerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalListings: 0,
    approvedCount: 0,
    pendingCount: 0,
    rejectedCount: 0,
    availableCount: 0,
    totalViews: 0,
  });
  const [recentListings, setRecentListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await API.get('/seller/poultry');
        setStats(res.data.stats || {});
        setRecentListings((res.data.listings || []).slice(0, 5));
      } catch (error) {
        console.error('[Seller Dashboard Fetch Error]', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-farm-800 to-farm-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs font-bold text-farm-300 uppercase tracking-wider block">
            Farmer Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">
            Welcome back, {user?.name || 'Farmer'}! 🌾
          </h1>
          <p className="text-xs text-gray-300 mt-1">
            {user?.farmName ? `Farm: ${user.farmName}` : 'Manage your poultry listings and public views.'}
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            to="/seller/poultry/add"
            className="px-4 py-2.5 bg-farm-500 hover:bg-farm-600 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" /> Add New Poultry
          </Link>
          <Link
            to="/seller/profile"
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl transition flex items-center gap-1.5"
          >
            <User className="w-4 h-4" /> Profile
          </Link>
        </div>
      </div>

      {/* Main Stats Cards Grid */}
      {loading ? (
        <LoadingSpinner message="Fetching dashboard metrics..." />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-1">
            <span className="text-xs text-gray-400 font-semibold block">Total Listings</span>
            <span className="text-2xl font-black text-gray-900">{stats.totalListings}</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-emerald-100 bg-emerald-50/50 shadow-sm space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-emerald-800 font-bold">Approved</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-2xl font-black text-emerald-900">{stats.approvedCount}</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-amber-100 bg-amber-50/50 shadow-sm space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-amber-800 font-bold">Pending Review</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <span className="text-2xl font-black text-amber-900">{stats.pendingCount}</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-red-100 bg-red-50/50 shadow-sm space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-red-800 font-bold">Rejected</span>
              <XCircle className="w-4 h-4 text-red-600" />
            </div>
            <span className="text-2xl font-black text-red-900">{stats.rejectedCount}</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-blue-100 bg-blue-50/50 shadow-sm space-y-1">
            <span className="text-xs text-blue-800 font-bold block">Available Birds</span>
            <span className="text-2xl font-black text-blue-900">{stats.availableCount}</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-purple-100 bg-purple-50/50 shadow-sm space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-purple-800 font-bold">Total Views</span>
              <Eye className="w-4 h-4 text-purple-600" />
            </div>
            <span className="text-2xl font-black text-purple-900">{stats.totalViews}</span>
          </div>
        </div>
      )}

      {/* Quick Navigation Links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          to="/seller/poultry"
          className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:border-farm-300 transition flex items-center justify-between group"
        >
          <div>
            <h3 className="font-bold text-gray-900 group-hover:text-farm-600 transition text-sm">
              My Poultry Listings
            </h3>
            <p className="text-xs text-gray-500">View, edit, or remove your posted birds.</p>
          </div>
          <ListFilter className="w-5 h-5 text-farm-600" />
        </Link>

        <Link
          to="/seller/poultry/add"
          className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:border-farm-300 transition flex items-center justify-between group"
        >
          <div>
            <h3 className="font-bold text-gray-900 group-hover:text-farm-600 transition text-sm">
              Create New Listing
            </h3>
            <p className="text-xs text-gray-500">Upload photos, video, health and location.</p>
          </div>
          <PlusCircle className="w-5 h-5 text-farm-600" />
        </Link>

        <Link
          to="/seller/profile"
          className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:border-farm-300 transition flex items-center justify-between group"
        >
          <div>
            <h3 className="font-bold text-gray-900 group-hover:text-farm-600 transition text-sm">
              Farm & Profile Settings
            </h3>
            <p className="text-xs text-gray-500">Manage phone number and WhatsApp toggle.</p>
          </div>
          <User className="w-5 h-5 text-farm-600" />
        </Link>
      </div>

      {/* Recent Listings Table Preview */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h3 className="font-bold text-gray-900 text-base">Recent Posted Poultry</h3>
          <Link to="/seller/poultry" className="text-xs font-bold text-farm-700 hover:underline">
            View All ({stats.totalListings}) →
          </Link>
        </div>

        {recentListings.length === 0 ? (
          <div className="text-center py-8 text-xs text-gray-500">
            You haven't created any poultry listings yet.{' '}
            <Link to="/seller/poultry/add" className="font-bold text-farm-600 hover:underline">
              Create your first listing now.
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-700">
              <thead className="bg-gray-50 uppercase text-[10px] text-gray-400 font-bold">
                <tr>
                  <th className="p-3">Poultry Name</th>
                  <th className="p-3">Breed</th>
                  <th className="p-3">Gender</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Views</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {recentListings.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="p-3 font-bold text-gray-900">{item.name}</td>
                    <td className="p-3">{item.breed}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.gender === 'Hen' ? 'bg-pink-100 text-pink-800' : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {item.gender}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-farm-700">₹{item.price}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
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
                    <td className="p-3 text-gray-500">{item.views || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerDashboard;
