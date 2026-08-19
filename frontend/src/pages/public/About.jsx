import React from 'react';
import { ShieldCheck, PhoneCall, CheckCircle, Users } from 'lucide-react';

const About = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-4">
        <span className="bg-farm-100 text-farm-800 text-xs font-bold px-3 py-1.5 rounded-full">
          About PoultryMart
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900">
          Empowering Farmers Through Direct Marketplace Access
        </h1>
        <p className="text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
          PoultryMart is built to eliminate predatory middleman cuts and connect poultry farmers directly with buyers, hobbyists, and backyard poultry enthusiasts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
          <h2 className="text-xl font-bold text-gray-900">Our Core Mission</h2>
          <p>
            For decades, small poultry farmers faced difficulties marketing their pure breed Kadaknath, Aseel, and Natu Kodi birds at fair market prices.
          </p>
          <p>
            PoultryMart changes this by providing a completely free public platform where farmers can list their birds with photos, videos, health details, and phone numbers.
          </p>
          <ul className="space-y-2 font-medium text-gray-800 pt-2">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-farm-600" /> 100% Free for buyers (Zero account setup required)
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-farm-600" /> Direct phone call and WhatsApp connectivity
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-farm-600" /> Admin review process ensuring verified healthy listings
            </li>
          </ul>
        </div>

        <div className="bg-farm-900 text-white p-8 rounded-3xl space-y-6 shadow-xl">
          <h3 className="text-xl font-extrabold text-farm-300">Platform Highlights</h3>
          <div className="space-y-4 text-xs">
            <div className="flex items-start space-x-3">
              <ShieldCheck className="w-6 h-6 text-farm-400 flex-shrink-0" />
              <div>
                <strong className="block text-sm text-white">Verified Listings</strong>
                <span className="text-gray-300">Every listing goes through admin review before publication.</span>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <PhoneCall className="w-6 h-6 text-farm-400 flex-shrink-0" />
              <div>
                <strong className="block text-sm text-white">One-Tap Call Dialer</strong>
                <span className="text-gray-300">Open mobile phone dialer instantly to talk to the farmer.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
