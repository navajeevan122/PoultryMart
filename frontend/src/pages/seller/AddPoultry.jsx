import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { PlusCircle, Upload, X, ShieldCheck, Film, Image as ImageIcon, CheckCircle, ArrowLeft } from 'lucide-react';

const AddPoultry = () => {
  const { user, showToast } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    gender: 'Hen',
    breed: 'Kadaknath',
    age: '',
    ageUnit: 'Months',
    weight: '',
    weightUnit: 'KG',
    price: '',
    quantity: '1',
    village: user?.village || '',
    mandal: user?.mandal || '',
    district: user?.district || '',
    state: user?.state || 'Andhra Pradesh',
    pincode: user?.pincode || '',
    healthStatus: 'Healthy',
    vaccinationStatus: 'Vaccinated',
    vaccinationDetails: '',
    description: '',
  });

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [videos, setVideos] = useState([]);
  const [videoPreviews, setVideoPreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setImages((prev) => [...prev, ...files]);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...previews]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleVideoChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Validate size (max 50MB)
    for (const file of files) {
      if (file.size > 50 * 1024 * 1024) {
        showToast(`Video ${file.name} exceeds recommended maximum size of 50 MB`, 'error');
        return;
      }
    }

    setVideos((prev) => [...prev, ...files]);
    const previews = files.map((file) => URL.createObjectURL(file));
    setVideoPreviews((prev) => [...prev, ...previews]);
  };

  const removeVideo = (index) => {
    setVideos((prev) => prev.filter((_, i) => i !== index));
    setVideoPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.breed || !formData.age || !formData.weight || !formData.price) {
      showToast('Please complete all mandatory fields', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      images.forEach((img) => {
        data.append('images', img);
      });

      videos.forEach((vid) => {
        data.append('videos', vid);
      });

      const res = await API.post('/seller/poultry', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      showToast('Listing submitted successfully and is waiting for admin approval!', 'success');
      navigate('/seller/poultry');
    } catch (error) {
      console.error('[Add Poultry Error]', error);
      showToast(error.response?.data?.message || 'Error creating poultry listing', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Add Poultry Listing</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            List your healthy bird with photos and short video. All new listings undergo quick admin review.
          </p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="text-xs font-semibold text-gray-600 hover:text-gray-900 flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-8">
        {/* Section 1: Basic Details */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-2">
            1. Basic Bird Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Poultry Name *</label>
              <input
                type="text"
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Pure Kadaknath Hen (8 Months)"
                className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-xs text-gray-900 focus:ring-2 focus:ring-farm-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Gender *</label>
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
              <label className="block text-xs font-bold text-gray-700 mb-1">Breed *</label>
              <input
                type="text"
                required
                name="breed"
                value={formData.breed}
                onChange={handleChange}
                placeholder="e.g. Kadaknath, Aseel, Natu Kodi"
                className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-xs text-gray-900 focus:ring-2 focus:ring-farm-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Age *</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  required
                  min="0"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="8"
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-xs text-gray-900 focus:ring-2 focus:ring-farm-500 focus:outline-none"
                />
                <select
                  name="ageUnit"
                  value={formData.ageUnit}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-xs font-semibold focus:outline-none"
                >
                  <option value="Days">Days</option>
                  <option value="Months">Months</option>
                  <option value="Years">Years</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Weight *</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  step="0.1"
                  required
                  min="0"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  placeholder="1.5"
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-xs text-gray-900 focus:ring-2 focus:ring-farm-500 focus:outline-none"
                />
                <select
                  name="weightUnit"
                  value={formData.weightUnit}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-xs font-semibold focus:outline-none"
                >
                  <option value="KG">KG</option>
                  <option value="Grams">Grams</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Price & Quantity */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-2">
            2. Price & Quantity
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Price per Bird (₹) *</label>
              <input
                type="number"
                required
                min="1"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="2500"
                className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-xs text-gray-900 focus:ring-2 focus:ring-farm-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Quantity Available *</label>
              <input
                type="number"
                required
                min="1"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="10"
                className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-xs text-gray-900 focus:ring-2 focus:ring-farm-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Health & Vaccination */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-2">
            3. Health & Vaccination Status
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Health Condition</label>
              <select
                name="healthStatus"
                value={formData.healthStatus}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-xs text-gray-900 focus:ring-2 focus:ring-farm-500 focus:outline-none"
              >
                <option value="Healthy">Healthy (Default)</option>
                <option value="Good">Good</option>
                <option value="Needs Attention">Needs Attention</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Vaccination Record</label>
              <select
                name="vaccinationStatus"
                value={formData.vaccinationStatus}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-xs text-gray-900 focus:ring-2 focus:ring-farm-500 focus:outline-none"
              >
                <option value="Vaccinated">Vaccinated</option>
                <option value="Not Vaccinated">Not Vaccinated</option>
                <option value="Unknown">Unknown</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Vaccination Details / Notes</label>
            <input
              type="text"
              name="vaccinationDetails"
              value={formData.vaccinationDetails}
              onChange={handleChange}
              placeholder="e.g. RDV & Lasota administered at week 4."
              className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-xs text-gray-900 focus:ring-2 focus:ring-farm-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Detailed Description</label>
            <textarea
              rows="3"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe bird plumage, breeding history, diet, temper..."
              className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-xs text-gray-900 focus:ring-2 focus:ring-farm-500 focus:outline-none"
            ></textarea>
          </div>
        </div>

        {/* Section 4: Media Uploads (Images & Video) */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-2">
            4. Upload Photos & Short Video
          </h3>

          {/* Photos Upload */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Upload Poultry Images (JPG, PNG, WEBP)</label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                <div className="flex flex-col items-center justify-center pt-2 pb-3">
                  <ImageIcon className="w-6 h-6 text-gray-400 mb-1" />
                  <p className="text-xs text-gray-500 font-semibold">Click to upload multiple images</p>
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Image Previews */}
            {imagePreviews.length > 0 && (
              <div className="flex gap-3 flex-wrap pt-3">
                {imagePreviews.map((src, idx) => (
                  <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                    <img src={src} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-0.5 hover:bg-red-600 transition"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Video Upload */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Upload Short Poultry Video (MP4, MOV, WEBM • Max 50 MB)
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                <div className="flex flex-col items-center justify-center pt-2 pb-3">
                  <Film className="w-6 h-6 text-gray-400 mb-1" />
                  <p className="text-xs text-gray-500 font-semibold">Click to select video of actual poultry</p>
                </div>
                <input
                  type="file"
                  accept="video/mp4,video/mov,video/webm"
                  onChange={handleVideoChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Video Previews */}
            {videoPreviews.length > 0 && (
              <div className="pt-3 space-y-2">
                {videoPreviews.map((src, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-gray-100 p-2 rounded-lg text-xs">
                    <span className="font-semibold text-gray-800 flex items-center gap-1.5">
                      🎥 Video file {idx + 1} attached
                    </span>
                    <button
                      type="button"
                      onClick={() => removeVideo(idx)}
                      className="text-red-600 hover:text-red-800 text-xs font-bold"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Status Notice */}
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-xs text-amber-900 flex items-start gap-2">
          <ShieldCheck className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <strong>Listing Approval Notice:</strong>
            <p className="mt-0.5 text-amber-800">
              Your poultry listing will be submitted with status <strong>Pending</strong>. It will be reviewed by admin before becoming visible to public customers.
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-4 bg-farm-600 hover:bg-farm-700 disabled:opacity-50 text-white font-extrabold text-sm rounded-xl shadow-xl transition flex items-center justify-center gap-2"
        >
          {submitting ? 'Uploading Media & Submitting...' : 'Submit Listing for Admin Approval'}
          <CheckCircle className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

export default AddPoultry;
