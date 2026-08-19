import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { User, Mail, Phone, Lock, Building2, MapPin, CheckCircle } from 'lucide-react';

const SellerRegister = () => {
  const { registerSeller, showToast } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    farmName: '',
    farmDescription: '',
    village: '',
    mandal: '',
    district: '',
    state: 'Andhra Pradesh',
    pincode: '',
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    setSubmitting(true);
    const res = await registerSeller(formData);
    setSubmitting(false);

    if (res.success) {
      navigate('/seller/dashboard');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-farm-100 rounded-full flex items-center justify-center text-2xl mx-auto">
            🐔
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900">Farmer Registration</h2>
          <p className="text-xs text-gray-500">
            Create your seller profile to publish poultry listings and connect directly with buyers.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-2">
              1. Personal Account Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ravi Kumar"
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-xs text-gray-900 focus:ring-2 focus:ring-farm-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="ravi.poultry@example.com"
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-xs text-gray-900 focus:ring-2 focus:ring-farm-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number (Public for Calls) *</label>
                <input
                  type="text"
                  required
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+918309030289"
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-xs text-gray-900 focus:ring-2 focus:ring-farm-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Password *</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimum 6 characters"
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-xs text-gray-900 focus:ring-2 focus:ring-farm-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Confirm Password *</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-xs text-gray-900 focus:ring-2 focus:ring-farm-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Farm Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-2">
              2. Farm Information
            </h3>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Farm Name</label>
              <input
                type="text"
                name="farmName"
                value={formData.farmName}
                onChange={handleChange}
                placeholder="Sri Lakshmi Poultry Farm"
                className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-xs text-gray-900 focus:ring-2 focus:ring-farm-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Farm Description</label>
              <textarea
                rows="2"
                name="farmDescription"
                value={formData.farmDescription}
                onChange={handleChange}
                placeholder="Describe your farm, breeding methods, feed type..."
                className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-xs text-gray-900 focus:ring-2 focus:ring-farm-500 focus:outline-none"
              ></textarea>
            </div>
          </div>

          {/* Location Breakdown */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-2">
              3. Farm Location Breakdown
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Village / Town</label>
                <input
                  type="text"
                  name="village"
                  value={formData.village}
                  onChange={handleChange}
                  placeholder="Tadepalligudem"
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-farm-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Mandal</label>
                <input
                  type="text"
                  name="mandal"
                  value={formData.mandal}
                  onChange={handleChange}
                  placeholder="Tadepalligudem"
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-farm-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">District</label>
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  placeholder="West Godavari"
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-farm-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="Andhra Pradesh"
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-farm-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="534101"
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-farm-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 bg-farm-600 hover:bg-farm-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2"
          >
            {submitting ? 'Registering...' : 'Complete Farmer Registration'}
            <CheckCircle className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            Already registered?{' '}
            <Link to="/seller/login" className="font-bold text-farm-700 hover:underline">
              Log in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SellerRegister;
