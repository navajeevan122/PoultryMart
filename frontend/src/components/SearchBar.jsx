import React from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = ({ searchTerm, setSearchTerm, onSearch }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(searchTerm);
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <div className="relative flex items-center">
        <Search className="absolute left-4 w-5 h-5 text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search hens, cocks, breeds or locations (e.g. Kadaknath, Aseel, West Godavari)..."
          className="w-full pl-12 pr-24 py-3 bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-farm-500 focus:border-farm-500 text-sm text-gray-900 placeholder-gray-400"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => {
              setSearchTerm('');
              if (onSearch) onSearch('');
            }}
            className="absolute right-20 text-gray-400 hover:text-gray-600 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        <button
          type="submit"
          className="absolute right-2 top-2 bottom-2 px-4 bg-farm-600 hover:bg-farm-700 text-white font-semibold text-xs rounded-lg transition shadow-sm"
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
