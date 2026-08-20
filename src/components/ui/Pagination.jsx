import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Pagination = ({ currentPage, totalPages, onPageChange, totalItems, itemsPerPage }) => {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getPages = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 bg-white border-t border-slate-100 rounded-b-2xl">
      <div className="text-sm text-slate-500 mb-3 sm:mb-0">
        Jami <span className="font-semibold text-slate-700">{totalItems}</span> tadan 
        <span className="font-semibold text-slate-700"> {startItem}-{endItem}</span> ko‘rsatilmoqda
      </div>
      
      <div className="flex items-center space-x-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-500 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {getPages().map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3.5 py-2 text-sm font-semibold rounded-lg transition-colors ${
              currentPage === page
                ? 'bg-blue-600 text-white'
                : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-500 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
export default Pagination;
