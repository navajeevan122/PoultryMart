import React, { useState, useEffect, useContext } from 'react';
import API from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Save, User, Building2, MapPin, Phone, MessageCircle, ShieldCheck } from 'lucide-react';

const SellerProfile = () => {
  const { showToast } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    farmName: '',
    farmDescription: '',
    farmAddress: '',
    village: '',
    mandal: '',
    district: '',
    state: '',
    pincode: '',
    whatsappEnabled: true,
  });

  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get('/seller/profile');
        const u = res.data;
        setFormData({
          name: u.name || '',
          phone: u.phone || '',
          farmName: u.farmName || '',
          farmDescription: u.farmDescription || '',
          farmAddress: u.farmAddress || '',
          village: u.village || '',
          mandal: u.mandal || '',
          district: u.district || '',
          state: u.state || '',
          pincode: u.pincode || '',
          whatsappEnabled: u.whatsappEnabled !== undefined ? u.whatsappEnabled : true,
        });
        if (u.profileImage) {
          setProfileImagePreview(u.profileImage);
        }
      } catch (error) {
        console.error('[Fetch Profile Error]', error);
        showToast('Error fetching profile', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      setProfileImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      if (profileImage) {
        data.append('profileImage', profileImage);
      }

      await API.put('/seller/profile', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      showToast('Profile and farm details updated successfully!', 'success');
    } catch (error) {
      console.error('[Update Profile Error]', error);
      showToast(error.response?.data?.message || 'Error updating profile', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner message="Fetching profile details..." />;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Farmer & Farm Profile Settings</h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Manage your contact information, location, and buyer WhatsApp communication settings.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-8">
        {/* Profile Image & Personal Info */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-2">
            1. Farmer Information
          </h3>

          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 rounded-full bg-farm-100 border-2 border-farm-300 overflow-hidden flex items-center justify-center text-3xl font-bold text-farm-700 flex-shrink-0">
              {profileImagePreview ? (
                <img src={profileImagePreview} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                '👨‍🌾'
              )}
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Change Profile Photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="text-xs text-gray-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-xs text-gray-900 focus:ring-2 focus:ring-farm-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number (Public Dialer)</label>
              <input
                type="text"
                required
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-xs text-gray-900 focus:ring-2 focus:ring-farm-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* WhatsApp Setting Toggle */}
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <MessageCircle className="w-6 h-6 text-emerald-600 flex-shrink-0" />
            <div>
              <span className="text-xs font-bold text-emerald-900 block">Allow WhatsApp Direct Contact</span>
              <span className="text-[11px] text-emerald-700">
                When enabled, buyers can tap the WhatsApp button to start a pre-filled chat with you.
              </span>
            </div>
          </div>

          <select
            name="whatsappEnabled"
            value={formData.whatsappEnabled ? 'true' : 'false'}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, whatsappEnabled: e.target.value === 'true' }))
            }
            className="bg-white border border-emerald-300 rounded-lg text-xs font-bold p-2 text-emerald-900 focus:outline-none"
          >
            <option value="true">Yes (Enabled)</option>
            <option value="false">No (Disabled)</option>
          </select>
        </div>

        {/* Farm Details */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-2">
            2. Farm Details
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
              rows="3"
              name="farmDescription"
              value={formData.farmDescription}
              onChange={handleChange}
              placeholder="Provide information regarding your breeding experience, organic feeds, farm environment..."
              className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-xs text-gray-900 focus:ring-2 focus:ring-farm-500 focus:outline-none"
            ></textarea>
          </div>
        </div>

        {/* Location Breakdown */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-2">
            3. Farm Address & Location
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Village</label>
              <input
                type="text"
                name="village"
                value={formData.village}
                onChange={handleChange}
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
                className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-farm-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3.5 bg-farm-600 hover:bg-farm-700 disabled:opacity-50 text-white font-extrabold text-sm rounded-xl shadow-lg transition flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" />
          {submitting ? 'Saving Profile...' : 'Save Profile Changes'}
        </button>
      </form>
    </div>
  );
};

export default SellerProfile;
