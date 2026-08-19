import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, MapPin, Eye, ShieldCheck, Tag, Sparkles } from 'lucide-react';

const PoultryCard = ({ poultry }) => {
  if (!poultry) return null;

  const {
    _id,
    name,
    gender,
    breed,
    age,
    ageUnit,
    weight,
    weightUnit,
    price,
    location,
    district,
    healthStatus,
    media,
    sellerId,
    views,
  } = poultry;

  const coverImage =
    media?.images && media.images.length > 0
      ? media.images[0]
      : 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=800';

  const sellerPhone = sellerId?.phone || '';
  const sellerName = sellerId?.name || 'Farmer';
  const farmName = sellerId?.farmName || '';

  const formattedTel = sellerPhone ? `tel:${sellerPhone.replace(/\s+/g, '')}` : '#';

  return (
    <div className="bg-white rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 border border-slate-200/80 overflow-hidden flex flex-col h-full group relative">
      {/* Cover Image Container */}
      <div className="relative aspect-[4/3] bg-slate-900 overflow-hidden">
        <img
          src={coverImage}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Dark Gradient Overlay for readable badges */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30 pointer-events-none"></div>

        {/* Gender Badge */}
        <div className="absolute top-3 left-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-lg backdrop-blur-md flex items-center gap-1 ${
              gender === 'Hen'
                ? 'bg-rose-500/90 text-white border border-rose-400/40'
                : 'bg-indigo-600/90 text-white border border-indigo-400/40'
            }`}
          >
            {gender === 'Hen' ? '🐔 Hen' : '🐓 Cock'}
          </span>
        </div>

        {/* Health Badge */}
        <div className="absolute top-3 right-3">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-emerald-600/90 text-white shadow-lg backdrop-blur-md border border-emerald-400/40 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            {healthStatus || 'Healthy'}
          </span>
        </div>

        {/* Video Overlay Indicator */}
        {media?.videos && media.videos.length > 0 && (
          <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-md text-amber-400 border border-amber-400/30 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            🎥 Video Available
          </div>
        )}

        {/* Price Floating Pill */}
        <div className="absolute bottom-3 left-3 bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 backdrop-blur-md px-3 py-1 rounded-2xl shadow-xl">
          <span className="text-[10px] text-emerald-400 uppercase font-bold block -mb-1">Price</span>
          <span className="text-lg font-black text-white">
            ₹{price ? price.toLocaleString('en-IN') : '0'}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Bird Name */}
          <h3 className="text-base font-extrabold text-slate-900 group-hover:text-emerald-700 transition line-clamp-1">
            {name}
          </h3>

          {/* Quick Specs Pills */}
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Breed</span>
              <span className="font-extrabold text-slate-800 truncate block">{breed}</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Age & Weight</span>
              <span className="font-extrabold text-slate-800 truncate block">
                {age} {ageUnit || 'Mos'} • {weight} {weightUnit || 'KG'}
              </span>
            </div>
          </div>

          {/* Farmer & Location Details */}
          <div className="mt-3 space-y-1 text-xs">
            <div className="flex items-center text-slate-500 font-medium">
              <MapPin className="w-3.5 h-3.5 mr-1 text-emerald-600 flex-shrink-0" />
              <span className="truncate">{district || location || 'Andhra Pradesh'}</span>
            </div>
            <div className="text-slate-600 truncate">
              <span className="text-slate-400">Farmer:</span>{' '}
              <strong className="text-slate-800">{sellerName}</strong>
              {farmName && <span className="text-slate-500"> ({farmName})</span>}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2">
          <Link
            to={`/poultry/${_id}`}
            className="w-full text-center py-2.5 px-3 rounded-2xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
          >
            View Specs
          </Link>
          <a
            href={formattedTel}
            className="w-full text-center py-2.5 px-3 rounded-2xl text-xs font-black text-white bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-1.5 active:scale-95"
          >
            <Phone className="w-3.5 h-3.5 fill-current animate-bounce" />
            Call Seller
          </a>
        </div>
      </div>
    </div>
  );
};

export default PoultryCard;
