import React from 'react';

export const ProgressBar = ({ value, showText = true, size = 'md' }) => {
  const percentage = Math.max(0, Math.min(100, value));

  // Determine colors based on thresholds
  let barColor = 'bg-emerald-500';
  let textColor = 'text-emerald-700';
  let bgColor = 'bg-emerald-50';

  if (percentage < 60) {
    barColor = 'bg-rose-500';
    textColor = 'text-rose-700';
    bgColor = 'bg-rose-50';
  } else if (percentage < 80) {
    barColor = 'bg-amber-500';
    textColor = 'text-amber-700';
    bgColor = 'bg-amber-50';
  }

  const heights = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3'
  };

  const height = heights[size] || heights.md;

  return (
    <div className="w-full flex items-center space-x-3">
      <div className="flex-1 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`rounded-full transition-all duration-500 ${height} ${barColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showText && (
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${bgColor} ${textColor} shrink-0 min-w-[45px] text-center`}>
          {percentage}%
        </span>
      )}
    </div>
  );
};
export default ProgressBar;
