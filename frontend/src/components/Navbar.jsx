import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Menu, X, PlusCircle, User, ShieldCheck, LogOut, PhoneCall, Sparkles } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isSeller, isAdmin, logout } = useContext(AuthContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm transition-all">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-950 text-emerald-100 text-xs py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2 border-b border-emerald-800/40">
        <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
        <span>Direct Farmer-to-Customer Marketplace • Zero Buyer Registration Required!</span>
        <span className="hidden sm:inline bg-emerald-800/60 text-emerald-200 px-2 py-0.5 rounded-full text-[10px] font-bold border border-emerald-700/50">
          100% Free Contact
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-emerald-600/30 group-hover:scale-105 transition-transform duration-300">
              🐔
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-slate-900 group-hover:text-emerald-700 transition">
                Poultry<span className="text-emerald-600">Mart</span>
              </span>
              <span className="block text-[10px] text-slate-400 -mt-1 font-bold tracking-widest uppercase">
                Direct Farmer Market
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <nav className="hidden lg:flex items-center space-x-1 text-sm font-semibold text-slate-700 bg-slate-100/70 p-1.5 rounded-2xl border border-slate-200/60">
            {[
              { path: '/', label: 'Home' },
              { path: '/browse', label: 'Browse Poultry' },
              { path: '/hens', label: 'Hens 🐔' },
              { path: '/cocks', label: 'Cocks 🐓' },
              { path: '/breeds', label: 'Breeds' },
              { path: '/about', label: 'About' },
              { path: '/contact', label: 'Contact' },
            ].map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3.5 py-1.5 rounded-xl transition-all ${
                  isActive(link.path)
                    ? 'bg-white text-emerald-800 font-extrabold shadow-sm'
                    : 'hover:text-emerald-700 hover:bg-white/50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Action & Auth CTA */}
          <div className="hidden lg:flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                {isSeller && (
                  <>
                    <Link
                      to="/seller/dashboard"
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition flex items-center gap-1.5"
                    >
                      <User className="w-4 h-4 text-emerald-600" />
                      Dashboard
                    </Link>
                    <Link
                      to="/seller/poultry/add"
                      className="px-4 py-2 rounded-xl text-xs font-extrabold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 transition flex items-center gap-1.5"
                    >
                      <PlusCircle className="w-4 h-4" />
                      + Post Bird
                    </Link>
                  </>
                )}
                {isAdmin && (
                  <Link
                    to="/admin/dashboard"
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-purple-100 hover:bg-purple-200 text-purple-900 transition flex items-center gap-1.5"
                  >
                    <ShieldCheck className="w-4 h-4 text-purple-700" />
                    Admin
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition flex items-center gap-1"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/seller/login"
                  className="text-xs font-bold text-slate-700 hover:text-emerald-700 px-3 py-2 rounded-xl hover:bg-slate-100 transition"
                >
                  Seller Login
                </Link>
                <Link
                  to="/admin/login"
                  className="text-[11px] font-bold text-slate-400 hover:text-purple-700 px-2 py-1"
                >
                  Admin
                </Link>
                <Link
                  to="/seller/register"
                  className="px-5 py-2.5 rounded-2xl text-xs font-black bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white transition shadow-lg shadow-emerald-600/25 flex items-center gap-1.5 transform hover:-translate-y-0.5"
                >
                  <PlusCircle className="w-4 h-4" />
                  Sell Your Poultry
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex lg:hidden items-center space-x-2">
            <Link
              to="/seller/register"
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 text-white shadow-sm flex items-center gap-1"
            >
              Sell Poultry
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white/98 backdrop-blur-lg px-4 pt-3 pb-6 space-y-2 shadow-xl">
          {[
            { path: '/', label: 'Home' },
            { path: '/browse', label: 'Browse Poultry' },
            { path: '/hens', label: 'Hens 🐔' },
            { path: '/cocks', label: 'Cocks 🐓' },
            { path: '/breeds', label: 'Breeds' },
            { path: '/about', label: 'About' },
            { path: '/contact', label: 'Contact' },
          ].map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block py-2.5 px-3 rounded-xl text-sm font-bold transition ${
                isActive(link.path)
                  ? 'bg-emerald-50 text-emerald-800'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {link.label}
            </Link>
          ))}

          <div className="pt-4 border-t border-slate-100 space-y-2">
            {isAuthenticated ? (
              <>
                {isSeller && (
                  <Link
                    to="/seller/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2.5 px-3 rounded-xl font-bold bg-emerald-100/60 text-emerald-900"
                  >
                    Farmer Dashboard
                  </Link>
                )}
                {isAdmin && (
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2.5 px-3 rounded-xl font-bold bg-purple-100/60 text-purple-900"
                  >
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left py-2.5 px-3 rounded-xl font-bold text-rose-600 hover:bg-rose-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  to="/seller/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-center py-2.5 bg-slate-100 text-slate-800 rounded-xl text-xs font-bold"
                >
                  Seller Login
                </Link>
                <Link
                  to="/admin/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-center py-2.5 bg-purple-50 text-purple-900 rounded-xl text-xs font-bold"
                >
                  Admin Login
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
