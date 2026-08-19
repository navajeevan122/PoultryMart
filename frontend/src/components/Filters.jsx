import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';

const Filters = ({ filters, setFilters, availableBreeds = [], onReset }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <h3 className="font-bold text-gray-900 flex items-center gap-2 text-base">
          <Filter className="w-4 h-4 text-farm-600" />
          Filter Poultry
        </h3>
        <button
          onClick={onReset}
          className="text-xs text-farm-700 hover:text-farm-800 font-semibold flex items-center gap-1"
        >
          <RotateCcw className="w-3 h-3" />
          Reset All
        </button>
      </div>

      {/* Gender Filter */}
      <div>
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
          Gender
        </label>
        <div className="grid grid-cols-3 gap-2">
          {['All', 'Hen', 'Cock'].map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setFilters((prev) => ({ ...prev, gender: g }))}
              className={`py-2 px-3 rounded-lg text-xs font-bold transition border ${
                filters.gender === g
                  ? 'bg-farm-600 text-white border-farm-600 shadow-sm'
                  : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Breed Filter */}
      <div>
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
          Poultry Breed
        </label>
        <select
          name="breed"
          value={filters.breed}
          onChange={handleChange}
          className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-xs font-medium text-gray-800 focus:ring-2 focus:ring-farm-500 focus:outline-none"
        >
          <option value="All">All Breeds</option>
          {availableBreeds.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range Filter */}
      <div>
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
          Price Range (₹)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            name="minPrice"
            placeholder="Min ₹"
            value={filters.minPrice}
            onChange={handleChange}
            className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-farm-500 focus:outline-none"
          />
          <input
            type="number"
            name="maxPrice"
            placeholder="Max ₹"
            value={filters.maxPrice}
            onChange={handleChange}
            className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-farm-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Age Filter */}
      <div>
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
          Age (Months)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            name="minAge"
            placeholder="Min Age"
            value={filters.minAge}
            onChange={handleChange}
            className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-farm-500 focus:outline-none"
          />
          <input
            type="number"
            name="maxAge"
            placeholder="Max Age"
            value={filters.maxAge}
            onChange={handleChange}
            className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-farm-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Weight Filter */}
      <div>
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
          Weight (KG)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            step="0.1"
            name="minWeight"
            placeholder="Min KG"
            value={filters.minWeight}
            onChange={handleChange}
            className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-farm-500 focus:outline-none"
          />
          <input
            type="number"
            step="0.1"
            name="maxWeight"
            placeholder="Max KG"
            value={filters.maxWeight}
            onChange={handleChange}
            className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-farm-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Location Filter */}
      <div>
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
          Location / District
        </label>
        <input
          type="text"
          name="location"
          placeholder="e.g. West Godavari"
          value={filters.location}
          onChange={handleChange}
          className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-farm-500 focus:outline-none"
        />
      </div>

      {/* Health Status Filter */}
      <div>
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
          Health Condition
        </label>
        <select
          name="healthStatus"
          value={filters.healthStatus}
          onChange={handleChange}
          className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-xs font-medium text-gray-800 focus:ring-2 focus:ring-farm-500 focus:outline-none"
        >
          <option value="All">All Conditions</option>
          <option value="Healthy">Healthy</option>
          <option value="Good">Good</option>
          <option value="Needs Attention">Needs Attention</option>
          <option value="Other">Other</option>
        </select>
      </div>
    </div>
  );
};

export default Filters;
