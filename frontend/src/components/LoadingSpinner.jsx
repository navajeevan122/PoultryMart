import React from 'react';

const LoadingSpinner = ({ message = 'Loading poultry details...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-12 h-12 border-4 border-farm-200 border-t-farm-600 rounded-full animate-spin"></div>
      <p className="mt-4 text-sm font-medium text-gray-600">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
