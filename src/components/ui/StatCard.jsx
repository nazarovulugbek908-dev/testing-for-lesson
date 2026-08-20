import React from 'react';

export const StatCard = ({ title, value, icon: Icon, color = 'blue', subtitle, description, trend }) => {
  const colorSchemes = {
    blue: {
      bg: 'bg-blue-50/60',
      text: 'text-blue-600',
      border: 'border-blue-100/80',
      iconBg: 'bg-blue-500/10 text-blue-600 border border-blue-500/20',
      hoverGlow: 'hover:border-blue-300 hover:shadow-blue-500/10'
    },
    emerald: {
      bg: 'bg-emerald-50/60',
      text: 'text-emerald-600',
      border: 'border-emerald-100/80',
      iconBg: 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20',
      hoverGlow: 'hover:border-emerald-300 hover:shadow-emerald-500/10'
    },
    amber: {
      bg: 'bg-amber-50/60',
      text: 'text-amber-600',
      border: 'border-amber-100/80',
      iconBg: 'bg-amber-500/10 text-amber-600 border border-amber-500/20',
      hoverGlow: 'hover:border-amber-300 hover:shadow-amber-500/10'
    },
    rose: {
      bg: 'bg-rose-50/60',
      text: 'text-rose-600',
      border: 'border-rose-100/80',
      iconBg: 'bg-rose-500/10 text-rose-600 border border-rose-500/20',
      hoverGlow: 'hover:border-rose-300 hover:shadow-rose-500/10'
    },
    purple: {
      bg: 'bg-purple-50/60',
      text: 'text-purple-600',
      border: 'border-purple-100/80',
      iconBg: 'bg-purple-500/10 text-purple-600 border border-purple-500/20',
      hoverGlow: 'hover:border-purple-300 hover:shadow-purple-500/10'
    },
    slate: {
      bg: 'bg-slate-50/60',
      text: 'text-slate-600',
      border: 'border-slate-100/80',
      iconBg: 'bg-slate-500/10 text-slate-600 border border-slate-500/20',
      hoverGlow: 'hover:border-slate-300 hover:shadow-slate-500/10'
    }
  };

  const scheme = colorSchemes[color] || colorSchemes.blue;

  const renderIcon = () => {
    if (!Icon) return null;
    if (React.isValidElement(Icon)) return Icon;
    if (typeof Icon === 'function' || typeof Icon === 'object') {
      return <Icon className="w-5 h-5" />;
    }
    return null;
  };

  return (
    <div className={`p-4 sm:p-5 bg-white border ${scheme.border} rounded-2xl sm:rounded-3xl shadow-xs transition-all duration-300 hover:shadow-lg ${scheme.hoverGlow} hover:-translate-y-0.5 flex flex-col justify-between min-w-0 relative overflow-hidden group`}>
      
      {/* Top row: Title and Icon Badge */}
      <div className="flex items-start justify-between gap-2 mb-2 sm:mb-3">
        <p className="text-[11px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider line-clamp-2 leading-tight">
          {title}
        </p>
        <div className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl ${scheme.iconBg} flex items-center justify-center shrink-0 shadow-xs group-hover:scale-110 transition-transform duration-300`}>
          {renderIcon()}
        </div>
      </div>

      {/* Bottom row: Value and optional subtitle/description */}
      <div className="mt-auto">
        <h3 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight leading-none">
          {value}
        </h3>
        {(subtitle || description) && (
          <p className="text-[11px] text-slate-400 font-semibold mt-1.5 truncate">
            {subtitle || description}
          </p>
        )}
      </div>

    </div>
  );
};

export default StatCard;
