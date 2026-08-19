import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, ShieldCheck, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-6 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Column 1: Brand Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-9 h-9 rounded-full bg-farm-600 flex items-center justify-center text-white text-lg font-bold">
                🐔
              </div>
              <span className="text-xl font-bold text-white tracking-wide">
                Poultry<span className="text-farm-400">Mart</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Connecting poultry farmers directly with buyers across India. Pure breeds, healthy birds, and direct farmer contact with zero hidden commissions.
            </p>
            <div className="inline-flex items-center text-xs bg-farm-950 text-farm-300 px-3 py-1.5 rounded-md border border-farm-800">
              <ShieldCheck className="w-4 h-4 mr-1.5 text-farm-400" />
              Verified Farmer Network
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Quick Navigation
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/browse" className="hover:text-farm-400 transition">
                  Browse All Poultry
                </Link>
              </li>
              <li>
                <Link to="/hens" className="hover:text-farm-400 transition">
                  Healthy Hens
                </Link>
              </li>
              <li>
                <Link to="/cocks" className="hover:text-farm-400 transition">
                  Breeding & Fighter Cocks
                </Link>
              </li>
              <li>
                <Link to="/breeds" className="hover:text-farm-400 transition">
                  Popular Poultry Breeds
                </Link>
              </li>
              <li>
                <Link to="/seller/register" className="hover:text-farm-400 transition">
                  Farmer Registration
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Breeds */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Featured Breeds
            </h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Kadaknath (Black Meat Chicken)</li>
              <li>Aseel (Fighter & Breeder)</li>
              <li>Country Chicken (Natu Kodi)</li>
              <li>Giriraja & Vanaraja</li>
              <li>Rhode Island Red (RIR)</li>
            </ul>
          </div>

          {/* Column 4: Customer Note */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              No Registration Needed
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed mb-3">
              Buyers can browse listings, view detailed photos & videos, and call/WhatsApp farmers directly on their phone number.
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex items-center text-gray-400">
                <Phone className="w-4 h-4 mr-2 text-farm-400" />
                Direct Phone Dialer
              </div>
              <div className="flex items-center text-gray-400">
                <Mail className="w-4 h-4 mr-2 text-farm-400" />
                support@poultrymart.com
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>© {new Date().getFullYear()} PoultryMart. All rights reserved.</p>
          <p className="mt-2 md:mt-0 flex items-center">
            Empowering Indian Poultry Farmers • Direct Farmer Marketplace
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
