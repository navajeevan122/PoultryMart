import React from 'react';
import { Link } from 'react-router-dom';
import { Feather, ShieldCheck } from 'lucide-react';

const breedsData = [
  {
    name: 'Kadaknath',
    origin: 'Madhya Pradesh, India',
    desc: 'Famous for its black plumage, black meat, black bones, and high medicinal value. Low fat and high protein content.',
    image: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=800',
  },
  {
    name: 'Aseel',
    origin: 'Andhra Pradesh & Odisha',
    desc: 'Renowned traditional fighter chicken breed with great stamina, heavy muscular build, upright posture, and strong aggression.',
    image: 'https://images.unsplash.com/photo-1612170153139-6f881ff067e0?w=800',
  },
  {
    name: 'Country Chicken (Natu Kodi)',
    origin: 'India',
    desc: 'Authentic free-range organic chicken raised on natural farm grains and insects. High demand for rich natural taste.',
    image: 'https://images.unsplash.com/photo-1563281577-a7be47e20db9?w=800',
  },
  {
    name: 'Giriraja',
    origin: 'Karnataka, India',
    desc: 'Developed for rural backyard farming. Gives 180-200 tinted brown eggs annually with fast growth rate.',
    image: 'https://images.unsplash.com/photo-1598965402089-897ce52e8355?w=800',
  },
  {
    name: 'Vanaraja',
    origin: 'Hyderabad, India',
    desc: 'Dual-purpose variety for free-range farming in rural & tribal areas. Multi-colored feathers and disease resistant.',
    image: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=800',
  },
  {
    name: 'Rhode Island Red (RIR)',
    origin: 'United States',
    desc: 'Famous American breed adapted worldwide. Outstanding layer of large brown eggs with hardy constitution.',
    image: 'https://images.unsplash.com/photo-1563281577-a7be47e20db9?w=800',
  },
];

const Breeds = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">
          Popular <span className="text-emerald-600">Poultry Breeds</span>
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Learn about indigenous and commercial poultry breeds available directly from farmers on PoultryMart.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {breedsData.map((b) => (
          <div
            key={b.name}
            className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            <div className="h-52 bg-slate-900 overflow-hidden relative">
              <img src={b.image} alt={b.name} className="w-full h-full object-cover" />
              <div className="absolute top-3 left-3 bg-slate-950/80 text-white text-[11px] font-bold px-3 py-1 rounded-full backdrop-blur-md border border-white/20">
                {b.origin}
              </div>
            </div>

            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-black text-slate-900">{b.name}</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">{b.desc}</p>
              </div>

              <Link
                to={`/browse?breed=${encodeURIComponent(b.name)}`}
                className="block w-full text-center py-3 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-extrabold text-xs rounded-2xl border border-emerald-200 transition"
              >
                View Available {b.name} Listings →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Breeds;
