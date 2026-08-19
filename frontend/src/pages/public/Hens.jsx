import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import PoultryCard from '../../components/PoultryCard';
import LoadingSpinner from '../../components/LoadingSpinner';

const Hens = () => {
  const [hensList, setHensList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHens = async () => {
      try {
        const res = await API.get('/poultry?gender=Hen&limit=24');
        setHensList(res.data.poultry || []);
      } catch (err) {
        console.error('[Fetch Hens Error]', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHens();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900">
          Healthy <span className="text-pink-600">Hens</span> for Sale
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Explore egg layers, Kadaknath hens, Country hens (Natu Kodi), and breeding hens directly from local farmers.
        </p>
      </div>

      {loading ? (
        <LoadingSpinner message="Fetching healthy hens..." />
      ) : hensList.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-gray-200 text-center">
          <p className="text-gray-500 font-medium">No hens available right now.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {hensList.map((item) => (
            <PoultryCard key={item._id} poultry={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Hens;
