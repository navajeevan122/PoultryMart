import React from 'react';
import { Phone, MessageCircle, MapPin, UserCheck, Building2, ShieldCheck, Sparkles } from 'lucide-react';

const SellerContactBox = ({ seller, poultryName }) => {
  if (!seller) return null;

  const {
    name,
    phone,
    farmName,
    farmDescription,
    village,
    mandal,
    district,
    state,
    whatsappEnabled,
    profileImage,
  } = seller;

  const rawPhone = phone ? phone.replace(/[^0-9]/g, '') : '';
  const formattedTel = rawPhone ? `tel:${phone}` : '#';

  const waText = encodeURIComponent(
    `Hello, I am interested in your "${poultryName || 'Poultry'}" listed on PoultryMart. Is it still available?`
  );
  const waPhone = rawPhone.length === 10 ? `91${rawPhone}` : rawPhone;
  const waUrl = `https://wa.me/${waPhone}?text=${waText}`;

  const locationText = [village, mandal, district, state].filter(Boolean).join(', ') || 'Andhra Pradesh, India';

  return (
    <div className="bg-white rounded-3xl p-7 border-2 border-emerald-500/20 shadow-xl space-y-6 relative overflow-hidden">
      {/* Decorative Top Accent Bar */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-500"></div>

      <div className="flex items-center justify-between border-b border-slate-100 pb-4 pt-1">
        <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-emerald-600" />
          Seller / Farmer Information
        </h3>
        <span className="bg-emerald-100 text-emerald-900 text-[11px] font-extrabold px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Verified
        </span>
      </div>

      {/* Farmer Profile Avatar & Info */}
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 p-0.5 shadow-md flex-shrink-0">
          <div className="w-full h-full rounded-[14px] bg-white overflow-hidden flex items-center justify-center text-emerald-800 font-black text-2xl">
            {profileImage ? (
              <img src={profileImage} alt={name} className="w-full h-full object-cover" />
            ) : (
              name ? name.charAt(0).toUpperCase() : '👨‍🌾'
            )}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-lg font-black text-slate-900 truncate">{name}</h4>
          {farmName && (
            <div className="text-xs font-bold text-emerald-700 flex items-center gap-1 mt-0.5">
              <Building2 className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{farmName}</span>
            </div>
          )}
          <div className="text-xs text-slate-500 flex items-center gap-1 mt-1 font-medium">
            <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="line-clamp-1">{locationText}</span>
          </div>
        </div>
      </div>

      {farmDescription && (
        <div className="bg-slate-50 p-3.5 rounded-2xl text-xs text-slate-600 italic border border-slate-200/80">
          "{farmDescription}"
        </div>
      )}

      {/* Phone Number Display Box */}
      <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/60 border border-emerald-200 p-4 rounded-2xl text-center space-y-1 shadow-inner">
        <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest block">
          Farmer Direct Mobile Number
        </span>
        <span className="text-2xl font-black text-emerald-950 block tracking-wider font-mono">
          {phone || '+91 XXXXX XXXXX'}
        </span>
      </div>

      {/* High Visibility Action Buttons */}
      <div className="space-y-3 pt-1">
        {/* Core Call Seller Button */}
        <a
          href={formattedTel}
          className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-black text-center flex items-center justify-center gap-2.5 shadow-xl shadow-emerald-600/30 transition transform hover:-translate-y-0.5 active:scale-95 text-sm"
        >
          <Phone className="w-5 h-5 fill-current animate-bounce" />
          📞 Call Seller Now
        </a>

        {/* WhatsApp Seller Button */}
        {whatsappEnabled !== false && (
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-4 px-5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-center flex items-center justify-center gap-2.5 shadow-xl shadow-emerald-500/25 transition transform hover:-translate-y-0.5 active:scale-95 text-sm"
          >
            <MessageCircle className="w-5 h-5 fill-current" />
            💬 WhatsApp Seller
          </a>
        )}
      </div>

      <div className="text-[11px] text-center text-slate-400 font-medium pt-1">
        Direct buyer-to-farmer connectivity • Zero signup required
      </div>
    </div>
  );
};

export default SellerContactBox;
