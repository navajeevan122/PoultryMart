import React from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-gray-900">
          Contact <span className="text-farm-600">PoultryMart</span>
        </h1>
        <p className="text-sm text-gray-600">
          Have questions or need assistance with farmer onboarding? Get in touch with our team.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <h3 className="font-bold text-gray-900 text-lg">Support Details</h3>
          <div className="space-y-4 text-sm text-gray-700">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-farm-100 text-farm-700 rounded-lg">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-gray-400 font-semibold block">Email Us</span>
                <span className="font-bold">support@poultrymart.com</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-farm-100 text-farm-700 rounded-lg">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-gray-400 font-semibold block">Helpline</span>
                <span className="font-bold">+91 1800-POULTRY (Toll-Free)</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-farm-100 text-farm-700 rounded-lg">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-gray-400 font-semibold block">Headquarters</span>
                <span className="font-bold">West Godavari & Visakhapatnam, Andhra Pradesh</span>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={(e) => e.preventDefault()} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <h3 className="font-bold text-gray-900 text-lg">Send Message</h3>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Your Name</label>
            <input type="text" placeholder="Full Name" className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-farm-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number</label>
            <input type="text" placeholder="+91..." className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-farm-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Message</label>
            <textarea rows="3" placeholder="How can we help you?" className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-farm-500 focus:outline-none"></textarea>
          </div>
          <button type="submit" className="w-full py-2.5 bg-farm-600 hover:bg-farm-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-2">
            <Send className="w-4 h-4" /> Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
