import React, { useState } from 'react';
import { Play, Maximize2, X, Image as ImageIcon } from 'lucide-react';

const MediaGallery = ({ images = [], videos = [] }) => {
  const [selectedMedia, setSelectedMedia] = useState({
    type: 'image',
    url: images[0] || 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=800',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const allImages = images.length > 0 ? images : ['https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=800'];

  return (
    <div className="space-y-4">
      {/* Main Active Viewer */}
      <div className="relative aspect-[4/3] bg-black rounded-2xl overflow-hidden shadow-md group">
        {selectedMedia.type === 'video' ? (
          <video
            src={selectedMedia.url}
            controls
            preload="metadata"
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="w-full h-full relative cursor-pointer" onClick={() => setIsModalOpen(true)}>
            <img
              src={selectedMedia.url}
              alt="Poultry Detail View"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white">
              <span className="bg-black/60 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 backdrop-blur-sm">
                <Maximize2 className="w-4 h-4" /> Click to Zoom
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Thumbnails Row */}
      <div className="flex items-center space-x-3 overflow-x-auto pb-2 custom-scrollbar">
        {/* Images Thumbnails */}
        {allImages.map((img, idx) => (
          <button
            key={`img-${idx}`}
            onClick={() => setSelectedMedia({ type: 'image', url: img })}
            className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition ${
              selectedMedia.type === 'image' && selectedMedia.url === img
                ? 'border-farm-600 ring-2 ring-farm-500/30'
                : 'border-gray-200 opacity-70 hover:opacity-100'
            }`}
          >
            <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
          </button>
        ))}

        {/* Video Thumbnails */}
        {videos.map((vid, idx) => (
          <button
            key={`vid-${idx}`}
            onClick={() => setSelectedMedia({ type: 'video', url: vid })}
            className={`relative flex-shrink-0 w-20 h-20 bg-gray-900 rounded-xl overflow-hidden border-2 transition flex items-center justify-center ${
              selectedMedia.type === 'video' && selectedMedia.url === vid
                ? 'border-farm-600 ring-2 ring-farm-500/30'
                : 'border-gray-200 opacity-80 hover:opacity-100'
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-farm-600/90 text-white flex items-center justify-center shadow-md">
              <Play className="w-4 h-4 fill-current ml-0.5" />
            </div>
            <span className="absolute bottom-1 right-1 text-[9px] bg-black/80 text-white px-1 rounded font-bold uppercase">
              Video
            </span>
          </button>
        ))}
      </div>

      {/* Image Zoom Modal */}
      {isModalOpen && selectedMedia.type === 'image' && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <button
            onClick={() => setIsModalOpen(false)}
            className="absolute top-5 right-5 text-white bg-gray-800/80 p-2 rounded-full hover:bg-gray-700 transition"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={selectedMedia.url}
            alt="Expanded Poultry Zoom"
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
          />
        </div>
      )}
    </div>
  );
};

export default MediaGallery;
