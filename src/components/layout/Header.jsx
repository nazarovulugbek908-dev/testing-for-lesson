import React, { useContext, useState, useRef, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { DataContext } from '../../context/DataContext';
import { 
  Bell, 
  Menu, 
  Search, 
  X, 
  Check, 
  Trash2, 
  Users, 
  ListTodo, 
  Calendar, 
  Star, 
  BarChart3, 
  Settings,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const Header = ({ onMenuClick, isNotificationsOpen, setIsNotificationsOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { students, tasks, notifications, markAllNotificationsRead, clearNotification } = useContext(DataContext);
  
  const notificationRef = useRef(null);
  const searchRef = useRef(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setIsNotificationsOpen]);

  // Breadcrumbs generator
  const getHeaderInfo = () => {
    const path = location.pathname;
    switch (path) {
      case '/dashboard':
        return { title: 'Bosh sahifa', breadcrumb: 'Bosh sahifa' };
      case '/students':
        return { title: 'O‘quvchilar', breadcrumb: 'Bosh sahifa > O‘quvchilar' };
      case '/tasks':
        return { title: 'Vazifalar (To-Do)', breadcrumb: 'Bosh sahifa > Vazifalar' };
      case '/attendance':
        return { title: 'Davomat', breadcrumb: 'Bosh sahifa > Davomat' };
      case '/grades':
        return { title: 'Baholash', breadcrumb: 'Bosh sahifa > Baholash' };
      case '/statistics':
        return { title: 'Statistika', breadcrumb: 'Bosh sahifa > Statistika' };
      case '/settings':
        return { title: 'Sozlamalar', breadcrumb: 'Bosh sahifa > Sozlamalar' };
      default:
        return { title: 'Ustozlar Platformasi', breadcrumb: 'Bosh sahifa' };
    }
  };

  const info = getHeaderInfo();

  // Search filtration
  const query = searchQuery.toLowerCase().trim();
  
  const matchedStudents = query ? students.filter(s => 
    `${s.name} ${s.surname}`.toLowerCase().includes(query) ||
    (s.classGroup && s.classGroup.toLowerCase().includes(query)) ||
    (s.phone && s.phone.includes(query))
  ).slice(0, 4) : [];

  const matchedTasks = query ? tasks.filter(t => 
    t.title.toLowerCase().includes(query) ||
    (t.category && t.category.toLowerCase().includes(query))
  ).slice(0, 3) : [];

  const systemPages = [
    { title: 'Bosh sahifa', path: '/dashboard', icon: BarChart3 },
    { title: 'O‘quvchilar ro‘yxati', path: '/students', icon: Users },
    { title: 'Vazifalar (To-Do)', path: '/tasks', icon: ListTodo },
    { title: 'Face ID Davomat', path: '/attendance', icon: Calendar },
    { title: 'Baholash jurnali', path: '/grades', icon: Star },
    { title: 'Statistika va hisobotlar', path: '/statistics', icon: BarChart3 },
    { title: 'Sozlamalar', path: '/settings', icon: Settings },
  ];

  const matchedPages = query ? systemPages.filter(p => 
    p.title.toLowerCase().includes(query)
  ).slice(0, 3) : [];

  const totalMatches = matchedStudents.length + matchedTasks.length + matchedPages.length;

  const handleSelectResult = (path) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    navigate(path);
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 bg-white/85 backdrop-blur-md border-b border-slate-100 shrink-0 gap-3">
      
      {/* Breadcrumbs & Mobile Hamburger Toggle */}
      <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
        <button
          onClick={onMenuClick}
          className="p-2 -ml-2 text-slate-500 rounded-lg hover:bg-slate-50 lg:hidden transition-colors cursor-pointer"
        >
          <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        <div className="min-w-0">
          <div className="text-xs font-semibold text-slate-400 select-none hidden sm:block">
            {info.breadcrumb.split(' > ').map((crumb, idx, arr) => (
              <span key={idx}>
                {idx > 0 && <span className="mx-1.5 text-slate-300">&gt;</span>}
                <span className={idx === arr.length - 1 ? 'text-blue-600 font-bold' : ''}>{crumb}</span>
              </span>
            ))}
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-800 leading-tight lg:mt-0.5 truncate">{info.title}</h2>
        </div>
      </div>

      {/* Action Utilities: Active Live Search & Notifications */}
      <div className="flex items-center space-x-2 sm:space-x-4 relative" ref={notificationRef}>
        
        {/* Interactive Live Search Box */}
        <div className="relative w-40 sm:w-64 md:w-80" ref={searchRef}>
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => setIsSearchOpen(true)}
            placeholder="Qidiruv (o‘quvchi, vazifa, fan)..."
            className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200/80 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400 text-slate-700 font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setIsSearchOpen(false);
              }}
              className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Search Dropdown Modal/Results */}
          {isSearchOpen && searchQuery.trim() && (
            <div className="absolute right-0 top-11 w-72 sm:w-96 bg-white border border-slate-100 rounded-2xl shadow-2xl z-50 animate-slide-in-up overflow-hidden max-h-[380px] overflow-y-auto">
              <div className="p-3 bg-slate-50/80 border-b border-slate-100 text-[11px] font-bold text-slate-500 flex items-center justify-between">
                <span>Qidiruv natijalari: "{searchQuery}"</span>
                <span className="text-blue-600">{totalMatches} ta topildi</span>
              </div>

              {totalMatches === 0 ? (
                <div className="p-6 text-center text-slate-400 space-y-1">
                  <Search className="w-7 h-7 mx-auto opacity-30 mb-2" />
                  <p className="text-xs font-bold text-slate-600">Hech narsa topilmadi</p>
                  <p className="text-[11px]">Boshqa kalit so‘z bilan izlab ko‘ring</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-50">
                  
                  {/* Matched Students */}
                  {matchedStudents.length > 0 && (
                    <div className="p-2">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">O‘quvchilar</p>
                      {matchedStudents.map((s) => (
                        <div
                          key={s.id}
                          onClick={() => handleSelectResult('/students')}
                          className="p-2 rounded-xl hover:bg-blue-50/60 flex items-center justify-between cursor-pointer transition-colors"
                        >
                          <div className="flex items-center space-x-2.5">
                            <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold shrink-0">
                              {s.name?.[0] || 'O'}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-800">{s.surname} {s.name}</p>
                              <p className="text-[10px] text-slate-400">{s.classGroup} &bull; {s.phone || 'Telefon yo‘q'}</p>
                            </div>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Matched Tasks */}
                  {matchedTasks.length > 0 && (
                    <div className="p-2">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">Vazifalar</p>
                      {matchedTasks.map((t) => (
                        <div
                          key={t.id}
                          onClick={() => handleSelectResult('/tasks')}
                          className="p-2 rounded-xl hover:bg-purple-50/60 flex items-center justify-between cursor-pointer transition-colors"
                        >
                          <div className="flex items-center space-x-2.5">
                            <div className="p-1.5 rounded-lg bg-purple-100 text-purple-600 shrink-0">
                              <ListTodo className="w-3.5 h-3.5" />
                            </div>
                            <div className="truncate max-w-[200px]">
                              <p className="text-xs font-bold text-slate-800 truncate">{t.title}</p>
                              <p className="text-[10px] text-slate-400">{t.category} &bull; {t.priority}</p>
                            </div>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Matched Pages */}
                  {matchedPages.length > 0 && (
                    <div className="p-2">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">Bo‘limlar</p>
                      {matchedPages.map((p) => {
                        const PageIcon = p.icon;
                        return (
                          <div
                            key={p.path}
                            onClick={() => handleSelectResult(p.path)}
                            className="p-2 rounded-xl hover:bg-slate-50 flex items-center justify-between cursor-pointer transition-colors"
                          >
                            <div className="flex items-center space-x-2.5">
                              <div className="p-1.5 rounded-lg bg-slate-100 text-slate-600 shrink-0">
                                <PageIcon className="w-3.5 h-3.5" />
                              </div>
                              <p className="text-xs font-bold text-slate-800">{p.title}</p>
                            </div>
                            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                          </div>
                        );
                      })}
                    </div>
                  )}

                </div>
              )}
            </div>
          )}
        </div>

        {/* Notification Bell Button */}
        <button
          onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
          className="p-2 sm:p-2.5 text-slate-500 rounded-xl hover:bg-slate-50 relative border border-slate-200/50 transition-colors cursor-pointer shrink-0"
        >
          <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full" />
          )}
        </button>

        {/* Notifications Dropdown Panel */}
        {isNotificationsOpen && (
          <div className="absolute right-0 top-14 w-80 sm:w-96 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 animate-slide-in-up overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-slate-800 text-sm">Xabarnomalar</h3>
                {unreadCount > 0 && (
                  <span className="bg-rose-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                    {unreadCount} yangi
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllNotificationsRead}
                  className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center space-x-1 transition-colors cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Hammasini o‘qilgan qilish</span>
                </button>
              )}
            </div>

            <div className="max-h-[360px] overflow-y-auto divide-y divide-slate-50">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-slate-400">
                  <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-xs font-semibold">Hech qanday xabarnoma yo‘q</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-4 flex items-start space-x-3 transition-colors ${
                      n.read ? 'bg-white' : 'bg-blue-50/20'
                    }`}
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-700 leading-normal">{n.text}</p>
                      <span className="text-xs text-slate-400 font-semibold mt-1 inline-block">{n.time}</span>
                    </div>
                    <button
                      onClick={() => clearNotification(n.id)}
                      className="p-1 rounded text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors shrink-0 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </div>

    </header>
  );
};

export default Header;
