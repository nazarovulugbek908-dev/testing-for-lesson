import React, { useContext } from 'react';
import { DataContext } from '../../context/DataContext';
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';

export const Toast = ({ toast }) => {
  const { removeToast } = useContext(DataContext);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />
  };

  const bgColors = {
    success: 'bg-emerald-50 border-emerald-100',
    warning: 'bg-amber-50 border-amber-100',
    error: 'bg-rose-50 border-rose-100',
    info: 'bg-blue-50 border-blue-100'
  };

  return (
    <div
      className={`flex items-center justify-between p-4 mb-3 border rounded-xl shadow-sm min-w-[320px] max-w-md animate-slide-in-right ${bgColors[toast.type] || bgColors.info}`}
      role="alert"
    >
      <div className="flex items-center space-x-3">
        {icons[toast.type] || icons.info}
        <p className="text-sm font-medium text-slate-800">{toast.message}</p>
      </div>
      <button
        onClick={() => removeToast(toast.id)}
        className="p-1 ml-3 rounded-lg hover:bg-black/5 text-slate-400 hover:text-slate-600 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export const ToastContainer = () => {
  const { toasts } = useContext(DataContext);

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col items-end pointer-events-none">
      <div className="pointer-events-auto">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} />
        ))}
      </div>
    </div>
  );
};
