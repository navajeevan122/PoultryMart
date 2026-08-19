import React, { useEffect, useState, useContext } from 'react';
import API from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Search, User, Power, Trash2, MapPin, Building2, Phone } from 'lucide-react';

const Sellers = () => {
  const { showToast } = useContext(AuthContext);
  const [sellers, setSellers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchSellers = async (query = '') => {
    try {
      const res = await API.get(`/admin/sellers?search=${query}`);
      setSellers(res.data || []);
    } catch (error) {
      console.error('[Fetch Sellers Error]', error);
      showToast('Error loading sellers list', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchSellers(search);
  };

  const toggleSellerStatus = async (id, currentStatus) => {
    try {
      const res = await API.put(`/admin/sellers/${id}/status`, { isActive: !currentStatus });
      showToast(res.data.message, 'success');
      setSellers((prev) =>
        prev.map((s) => (s._id === id ? { ...s, isActive: !currentStatus } : s))
      );
    } catch (error) {
      showToast(error.response?.data?.message || 'Error updating seller status', 'error');
    }
  };

  const handleDeleteSeller = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete seller "${name}" and all associated poultry listings?`)) {
      return;
    }

    try {
      await API.delete(`/admin/sellers/${id}`);
      showToast('Seller and listings deleted successfully', 'success');
      setSellers((prev) => prev.filter((s) => s._id !== id));
    } catch (error) {
      showToast(error.response?.data?.message || 'Error deleting seller', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Manage Registered Sellers</h1>
          <p className="text-xs text-gray-500 mt-0.5">Activate, deactivate, or delete farmer seller accounts.</p>
        </div>

        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-72">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, farm or phone..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-gray-300 rounded-xl text-xs text-gray-900 focus:ring-2 focus:ring-purple-500 focus:outline-none"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
        </form>
      </div>

      {loading ? (
        <LoadingSpinner message="Fetching seller database..." />
      ) : sellers.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-gray-200 text-center">
          <p className="text-gray-500 text-sm font-medium">No registered sellers found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-700">
              <thead className="bg-gray-50 uppercase text-[10px] text-gray-400 font-bold border-b border-gray-200">
                <tr>
                  <th className="p-4">Farmer Details</th>
                  <th className="p-4">Farm & Location</th>
                  <th className="p-4">Phone Number</th>
                  <th className="p-4">Listings Count</th>
                  <th className="p-4">Account Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {sellers.map((s) => (
                  <tr key={s._id} className="hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center flex-shrink-0">
                          {s.name ? s.name.charAt(0).toUpperCase() : '👨‍🌾'}
                        </div>
                        <div>
                          <strong className="block text-gray-900">{s.name}</strong>
                          <span className="text-[11px] text-gray-400">{s.email}</span>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="space-y-0.5">
                        <strong className="block text-gray-800">{s.farmName || 'Independent Farmer'}</strong>
                        <span className="text-[11px] text-gray-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          {[s.village, s.district, s.state].filter(Boolean).join(', ') || 'India'}
                        </span>
                      </div>
                    </td>

                    <td className="p-4 font-mono font-bold text-gray-800">{s.phone}</td>

                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-md bg-purple-50 text-purple-800 font-bold">
                        {s.listingsCount || 0} listings
                      </span>
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          s.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {s.isActive ? 'Active' : 'Deactivated'}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => toggleSellerStatus(s._id, s.isActive)}
                          className={`px-3 py-1.5 rounded-lg font-bold text-[11px] transition flex items-center gap-1 ${
                            s.isActive
                              ? 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                              : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                          }`}
                        >
                          <Power className="w-3.5 h-3.5" />
                          {s.isActive ? 'Deactivate' : 'Activate'}
                        </button>

                        <button
                          onClick={() => handleDeleteSeller(s._id, s.name)}
                          className="px-2.5 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 font-bold text-[11px] transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
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

export default Sellers;
