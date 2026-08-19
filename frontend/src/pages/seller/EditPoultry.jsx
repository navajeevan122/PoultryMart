import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Save, ArrowLeft, X, ShieldCheck } from 'lucide-react';

const EditPoultry = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: '',
    gender: 'Hen',
    breed: '',
    age: '',
    ageUnit: 'Months',
    weight: '',
    weightUnit: 'KG',
    price: '',
    quantity: '1',
    village: '',
    mandal: '',
    district: '',
    state: '',
    pincode: '',
    healthStatus: 'Healthy',
    vaccinationStatus: 'Vaccinated',
    vaccinationDetails: '',
    description: '',
    isAvailable: true,
  });

  const [existingImages, setExistingImages] = useState([]);
  const [existingVideos, setExistingVideos] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);
  const [newVideos, setNewVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchPoultry = async () => {
      try {
        const res = await API.get(`/seller/poultry/${id}`);
        const p = res.data;
        setFormData({
          name: p.name || '',
          gender: p.gender || 'Hen',
          breed: p.breed || '',
          age: p.age || '',
          ageUnit: p.ageUnit || 'Months',
          weight: p.weight || '',
          weightUnit: p.weightUnit || 'KG',
          price: p.price || '',
          quantity: p.quantity || '1',
          village: p.village || '',
          mandal: p.mandal || '',
          district: p.district || '',
          state: p.state || '',
          pincode: p.pincode || '',
          healthStatus: p.healthStatus || 'Healthy',
          vaccinationStatus: p.vaccinationStatus || 'Vaccinated',
          vaccinationDetails: p.vaccinationDetails || '',
          description: p.description || '',
          isAvailable: p.isAvailable !== undefined ? p.isAvailable : true,
        });
        setExistingImages(p.media?.images || []);
        setExistingVideos(p.media?.videos || []);
      } catch (error) {
        console.error('[Fetch Seller Poultry Error]', error);
        showToast(error.response?.data?.message || 'Error fetching listing', 'error');
        navigate('/seller/poultry');
      } finally {
        setLoading(false);
      }
    };
    fetchPoultry();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const removeExistingImage = (idx) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const removeExistingVideo = (idx) => {
    setExistingVideos((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleNewImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setNewImages((prev) => [...prev, ...files]);
    const previews = files.map((file) => URL.createObjectURL(file));
    setNewImagePreviews((prev) => [...prev, ...previews]);
  };

  const removeNewImage = (idx) => {
    setNewImages((prev) => prev.filter((_, i) => i !== idx));
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      existingImages.forEach((img) => {
        data.append('existingImages', img);
      });

      existingVideos.forEach((vid) => {
        data.append('existingVideos', vid);
      });

      newImages.forEach((img) => {
        data.append('images', img);
      });

      newVideos.forEach((vid) => {
        data.append('videos', vid);
      });

      await API.put(`/seller/poultry/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      showToast('Poultry listing updated and resubmitted for admin review.', 'success');
      navigate('/seller/poultry');
    } catch (error) {
      console.error('[Update Poultry Error]', error);
      showToast(error.response?.data?.message || 'Error updating listing', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading listing details..." />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Edit Poultry Listing</h1>
          <p className="text-xs text-gray-500 mt-0.5">Update bird details, availability, photos or video.</p>
        </div>
        <button
          onClick={() => navigate('/seller/poultry')}
          className="text-xs font-semibold text-gray-600 hover:text-gray-900 flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" /> Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-8">
        {/* Availability Toggle */}
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-900 block">Public Availability</span>
            <span className="text-[11px] text-gray-500">Toggle whether this bird is currently available for buyers.</span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="isAvailable"
              checked={formData.isAvailable}
              onChange={handleChange}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-farm-600"></div>
          </label>
        </div>

        {/* Basic Details */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-2">
            Bird Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Poultry Name</label>
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
              <label className="block text-xs font-bold text-gray-700 mb-1">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-xs text-gray-900 focus:ring-2 focus:ring-farm-500 focus:outline-none"
              >
                <option value="Hen">Hen 🐔</option>
                <option value="Cock">Cock 🐓</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Breed</label>
              <input
                type="text"
                required
                name="breed"
                value={formData.breed}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-xs text-gray-900 focus:ring-2 focus:ring-farm-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Price (₹)</label>
              <input
                type="number"
                required
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-xs text-gray-900 focus:ring-2 focus:ring-farm-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Quantity Available</label>
              <input
                type="number"
                required
                min="1"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-xs text-gray-900 focus:ring-2 focus:ring-farm-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Existing & New Images */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-2">
            Media Images
          </h3>

          {/* Existing Photos */}
          {existingImages.length > 0 && (
            <div>
              <span className="text-xs font-semibold text-gray-600 block mb-2">Current Images:</span>
              <div className="flex gap-3 flex-wrap">
                {existingImages.map((img, idx) => (
                  <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                    <img src={img} alt="Current" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(idx)}
                      className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-0.5 hover:bg-red-600 transition"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add Additional Photos */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Add More Photos</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleNewImageChange}
              className="text-xs text-gray-500"
            />
            {newImagePreviews.length > 0 && (
              <div className="flex gap-3 flex-wrap pt-2">
                {newImagePreviews.map((src, idx) => (
                  <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200">
                    <img src={src} alt="New Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeNewImage(idx)}
                      className="absolute top-0.5 right-0.5 bg-black/70 text-white rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3.5 bg-farm-600 hover:bg-farm-700 disabled:opacity-50 text-white font-extrabold text-sm rounded-xl shadow-lg transition flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" />
          {submitting ? 'Saving Changes...' : 'Save & Update Listing'}
        </button>
      </form>
    </div>
  );
};

export default EditPoultry;
