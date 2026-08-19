import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const ToastNotification = () => {
  const { toast } = useContext(AuthContext);

  if (!toast) return null;

  const bgColors = {
    success: 'bg-green-800 text-white border-green-700',
    error: 'bg-red-800 text-white border-red-700',
    info: 'bg-blue-800 text-white border-blue-700',
  };

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-300 mr-2 flex-shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-red-300 mr-2 flex-shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-300 mr-2 flex-shrink-0" />,
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-bounce">
      <div
        className={`flex items-center px-4 py-3 rounded-lg shadow-xl border ${
          bgColors[toast.type] || bgColors.info
        }`}
      >
        {icons[toast.type]}
        <span className="text-sm font-medium pr-2">{toast.message}</span>
      </div>
    </div>
  );
};

export default ToastNotification;
