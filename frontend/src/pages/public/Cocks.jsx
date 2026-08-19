import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import PoultryCard from '../../components/PoultryCard';
import LoadingSpinner from '../../components/LoadingSpinner';

const Cocks = () => {
  const [cocksList, setCocksList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCocks = async () => {
      try {
        const res = await API.get('/poultry?gender=Cock&limit=24');
        setCocksList(res.data.poultry || []);
      } catch (err) {
        console.error('[Fetch Cocks Error]', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCocks();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900">
          Breeding & Fighter <span className="text-blue-600">Cocks</span>
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Find Aseel fighter cocks, Kadaknath breeding males, Vanaraja cocks, and Country roosters from verified farmers.
        </p>
      </div>

      {loading ? (
        <LoadingSpinner message="Fetching cocks..." />
      ) : cocksList.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-gray-200 text-center">
          <p className="text-gray-500 font-medium">No cocks available right now.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cocksList.map((item) => (
            <PoultryCard key={item._id} poultry={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Cocks;
