import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { ShieldCheck, Users, Layers, Clock, CheckCircle2, XCircle, Eye, AlertCircle } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalSellers: 0,
    totalListings: 0,
    approvedListings: 0,
    pendingListings: 0,
    rejectedListings: 0,
    availablePoultry: 0,
    totalViews: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const res = await API.get('/admin/dashboard');
        setStats(res.data || {});
      } catch (error) {
        console.error('[Fetch Admin Stats Error]', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminStats();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-purple-900 via-purple-800 to-gray-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs font-bold text-purple-300 uppercase tracking-wider block">
            System Administration
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">
            PoultryMart Admin Dashboard 🛡️
          </h1>
          <p className="text-xs text-gray-300 mt-1">
            Live MongoDB Atlas metrics, seller account management, and pending approval queues.
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            to="/admin/listings/pending"
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center gap-1.5"
          >
            <Clock className="w-4 h-4" /> Pending Approvals ({stats.pendingListings})
          </Link>
          <Link
            to="/admin/sellers"
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl transition flex items-center gap-1.5"
          >
            <Users className="w-4 h-4" /> Manage Sellers
          </Link>
        </div>
      </div>

      {/* Metrics Cards */}
      {loading ? (
        <LoadingSpinner message="Querying MongoDB Atlas metrics..." />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-1">
            <span className="text-xs text-gray-400 font-semibold block">Total Sellers</span>
            <span className="text-2xl font-black text-gray-900">{stats.totalSellers}</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-1">
            <span className="text-xs text-gray-400 font-semibold block">Total Listings</span>
            <span className="text-2xl font-black text-gray-900">{stats.totalListings}</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-amber-200 bg-amber-50/50 shadow-sm space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-amber-800 font-bold">Pending Review</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <span className="text-2xl font-black text-amber-900">{stats.pendingListings}</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 shadow-sm space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-emerald-800 font-bold">Approved</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-2xl font-black text-emerald-900">{stats.approvedListings}</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-red-200 bg-red-50/50 shadow-sm space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-red-800 font-bold">Rejected</span>
              <XCircle className="w-4 h-4 text-red-600" />
            </div>
            <span className="text-2xl font-black text-red-900">{stats.rejectedListings}</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-blue-200 bg-blue-50/50 shadow-sm space-y-1">
            <span className="text-xs text-blue-800 font-bold block">Available Birds</span>
            <span className="text-2xl font-black text-blue-900">{stats.availablePoultry}</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-purple-200 bg-purple-50/50 shadow-sm space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-purple-800 font-bold">Total Views</span>
              <Eye className="w-4 h-4 text-purple-600" />
            </div>
            <span className="text-2xl font-black text-purple-900">{stats.totalViews}</span>
          </div>
        </div>
      )}

      {/* Admin Action Panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/admin/listings/pending"
          className="bg-white p-6 rounded-2xl border-2 border-amber-200 shadow-sm hover:shadow-md transition space-y-3 group"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <span className="bg-amber-100 text-amber-900 text-xs font-bold px-2.5 py-1 rounded-full">
              {stats.pendingListings} Waiting
            </span>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-base group-hover:text-purple-700 transition">
              Pending Approvals Queue
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Review photos, videos, pricing and health status of new poultry submissions.
            </p>
          </div>
        </Link>

        <Link
          to="/admin/sellers"
          className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition space-y-3 group"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-xs text-gray-500 font-semibold">{stats.totalSellers} Farmers</span>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-base group-hover:text-purple-700 transition">
              Seller Management
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Activate, deactivate, or inspect registered farmer profiles and listings.
            </p>
          </div>
        </Link>

        <Link
          to="/admin/listings"
          className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition space-y-3 group"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <span className="text-xs text-gray-500 font-semibold">{stats.totalListings} Listings</span>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-base group-hover:text-purple-700 transition">
              All Poultry Listings
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Browse, edit, or delete any listing across the entire marketplace platform.
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
