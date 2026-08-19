import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Clock, CheckCircle, XCircle, Eye, Phone, MapPin } from 'lucide-react';

const PendingListings = () => {
  const { showToast } = useContext(AuthContext);
  const [pendingListings, setPendingListings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Reject Modal State
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const fetchPending = async () => {
    try {
      const res = await API.get('/admin/listings/pending');
      setPendingListings(res.data || []);
    } catch (error) {
      console.error('[Fetch Pending Error]', error);
      showToast('Error loading pending approvals queue', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleApprove = async (id, name) => {
    try {
      await API.put(`/admin/listings/${id}/approve`);
      showToast(`"${name}" approved and published to public marketplace!`, 'success');
      setPendingListings((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      showToast(error.response?.data?.message || 'Error approving listing', 'error');
    }
  };

  const handleRejectSubmit = async (e) => {
    e.preventDefault();
    if (!rejectionReason.trim()) {
      showToast('Please enter a rejection reason', 'error');
      return;
    }

    try {
      await API.put(`/admin/listings/${rejectingId}/reject`, { rejectionReason });
      showToast('Listing rejected and feedback saved for seller.', 'info');
      setPendingListings((prev) => prev.filter((item) => item._id !== rejectingId));
      setRejectingId(null);
      setRejectionReason('');
    } catch (error) {
      showToast(error.response?.data?.message || 'Error rejecting listing', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
          <Clock className="w-6 h-6 text-amber-600" /> Pending Approval Queue
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Review new poultry submissions from farmers before publishing them to the public website.
        </p>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading pending approval queue..." />
      ) : pendingListings.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-gray-200 text-center space-y-3">
          <div className="text-4xl">🎉</div>
          <h3 className="text-lg font-bold text-gray-800">Pending queue is clear!</h3>
          <p className="text-xs text-gray-500">All submitted poultry listings have been reviewed.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingListings.map((item) => {
            const coverImg =
              item.media?.images && item.media.images.length > 0
                ? item.media.images[0]
                : 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=800';

            const sellerName = item.sellerId?.name || 'Farmer';
            const farmName = item.sellerId?.farmName || '';
            const sellerPhone = item.sellerId?.phone || '';

            return (
              <div
                key={item._id}
                className="bg-white rounded-2xl border-2 border-amber-200 shadow-sm overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[16/9] bg-gray-100 overflow-hidden">
                    <img src={coverImg} alt={item.name} className="w-full h-full object-cover" />
                    <div className="absolute top-3 left-3 bg-amber-500 text-white px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide shadow-md">
                      Pending Review
                    </div>
                    {item.media?.videos && item.media.videos.length > 0 && (
                      <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-0.5 rounded text-[11px] font-semibold">
                        🎥 Has Video
                      </div>
                    )}
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
                        <span className="text-gray-400">Age:</span> <strong>{item.age} {item.ageUnit}</strong>
                      </div>
                    </div>

                    <div className="bg-purple-50 p-3 rounded-xl text-xs space-y-1 border border-purple-100">
                      <span className="text-purple-800 font-bold block">Farmer Contact Info:</span>
                      <div className="text-gray-800 font-semibold">{sellerName} {farmName && `(${farmName})`}</div>
                      <div className="text-purple-900 font-mono font-bold">📞 {sellerPhone}</div>
                    </div>
                  </div>
                </div>

                {/* Approve & Reject Action Buttons */}
                <div className="p-4 border-t border-gray-100 bg-gray-50 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleApprove(item._id, item.name)}
                    className="py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-1"
                  >
                    <CheckCircle className="w-4 h-4" /> Approve
                  </button>

                  <button
                    onClick={() => {
                      setRejectingId(item._id);
                      setRejectionReason('');
                    }}
                    className="py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-1"
                  >
                    <XCircle className="w-4 h-4" /> Reject
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Reject Reason Modal */}
      {rejectingId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Rejection Reason</h3>
            <p className="text-xs text-gray-500">
              Provide constructive feedback for the farmer regarding why this listing was rejected.
            </p>
            <form onSubmit={handleRejectSubmit} className="space-y-4">
              <textarea
                required
                rows="3"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g. Please upload a clearer photo showing full bird body or verify price."
                className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-xs focus:ring-2 focus:ring-red-500 focus:outline-none"
              ></textarea>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setRejectingId(null)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg shadow-sm"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingListings;
