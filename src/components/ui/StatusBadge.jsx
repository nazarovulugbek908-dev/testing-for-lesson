import React from 'react';

export const StatusBadge = ({ status }) => {
  const normalized = status ? status.trim() : 'Faol';

  const styles = {
    'Faol': 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    'E’tibor talab': 'bg-amber-50 text-amber-700 border-amber-200/80',
    'Ogohlantirish': 'bg-amber-50 text-amber-700 border-amber-200/80',
    'Nazoratda': 'bg-orange-50 text-orange-700 border-orange-200/80',
    'Xavfli': 'bg-orange-50 text-orange-700 border-orange-200/80'
  };

  const dotColors = {
    'Faol': 'bg-emerald-500',
    'E’tibor talab': 'bg-amber-500',
    'Ogohlantirish': 'bg-amber-500',
    'Nazoratda': 'bg-orange-500',
    'Xavfli': 'bg-orange-500'
  };

  const style = styles[normalized] || styles['Faol'];
  const dotColor = dotColors[normalized] || 'bg-emerald-500';

  // Display clean educational label
  let displayLabel = normalized;
  if (normalized === 'Xavfli') displayLabel = 'Nazoratda';
  if (normalized === 'Ogohlantirish') displayLabel = 'E’tibor talab';

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border shadow-2xs ${style}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${dotColor}`} />
      {displayLabel}
    </span>
  );
};
export default StatusBadge;
