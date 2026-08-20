import React, { useState, useContext, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { DataContext } from '../../context/DataContext';
import { AuthContext } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Star, 
  BarChart3, 
  Bell, 
  Settings, 
  ChevronDown, 
  LogOut, 
  User,
  GraduationCap,
  ListTodo,
  X
} from 'lucide-react';

export const Sidebar = ({ isOpen, toggleSidebar, openNotifications }) => {
  const { notifications } = useContext(DataContext);
  const { currentUser, logout } = useContext(AuthContext);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { label: 'Bosh sahifa', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Vazifalar (To-Do)', path: '/tasks', icon: ListTodo },
    { label: 'O‘quvchilar', path: '/students', icon: Users },
    { label: 'Davomat', path: '/attendance', icon: Calendar },
    { label: 'Baholash', path: '/grades', icon: Star },
    { label: 'Statistika', path: '/statistics', icon: BarChart3 },
  ];

  const getCleanFullName = (user) => {
    if (!user) return 'Ustoz';
    const name = (user.name || '').trim();
    const surname = (user.surname || '').trim();
    if (!surname) return name || 'Ustoz';
    if (!name) return surname || 'Ustoz';
    if (name.toLowerCase().includes(surname.toLowerCase())) {
      return name;
    }
    return `${name} ${surname}`;
  };

  return (
    <aside
      className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-100 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex flex-col flex-1 overflow-y-auto">
        {/* Logo and App Title */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#5B4BEE] to-[#7C3AED] flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900 leading-tight">Ustozlar</h1>
              <p className="text-[11px] text-slate-400 font-semibold tracking-wide">O‘quvchilarni boshqarish</p>
            </div>
          </div>
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1.5">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => {
                if (window.innerWidth < 1024) toggleSidebar();
              }}
              className={({ isActive }) =>
                `flex items-center space-x-3.5 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-[#5B4BEE] text-white shadow-md shadow-indigo-500/25'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <item.icon className="w-5 h-5 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          ))}

          {/* Notifications in menu */}
          <button
            onClick={() => {
              openNotifications();
              if (window.innerWidth < 1024) toggleSidebar();
            }}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all"
          >
            <div className="flex items-center space-x-3.5">
              <Bell className="w-5 h-5" />
              <span>Xabarnomalar</span>
            </div>
            {unreadCount > 0 && (
              <span className="bg-rose-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Settings in menu */}
          <NavLink
            to="/settings"
            onClick={() => {
              if (window.innerWidth < 1024) toggleSidebar();
            }}
            className={({ isActive }) =>
              `flex items-center space-x-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            <Settings className="w-5 h-5" />
            <span>Sozlamalar</span>
          </NavLink>
        </nav>
      </div>

      {/* Teacher Profile Section at Bottom */}
      <div className="p-4 border-t border-slate-100 relative shrink-0" ref={dropdownRef}>
        <button
          onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
          className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">
              {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="text-left min-w-0 flex-1">
              <h4 className="text-sm font-semibold text-slate-800 leading-tight truncate">
                {getCleanFullName(currentUser)}
              </h4>
              <p className="text-xs text-slate-400 font-medium truncate">{currentUser?.role || 'Ustoz'}</p>
            </div>
          </div>
          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform shrink-0 ${profileDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Profile Dropdown */}
        {profileDropdownOpen && (
          <div className="absolute bottom-16 left-4 right-4 bg-white border border-slate-100 rounded-xl shadow-lg p-1.5 z-50 animate-slide-in-up">
            <button
              onClick={() => {
                setProfileDropdownOpen(false);
                navigate('/settings');
              }}
              className="w-full flex items-center space-x-2 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 rounded-lg transition-colors text-left"
            >
              <User className="w-4 h-4" />
              <span>Profilni tahrirlash</span>
            </button>
            <div className="h-px bg-slate-100 my-1" />
            <button
              onClick={() => {
                setProfileDropdownOpen(false);
                logout();
                navigate('/login');
              }}
              className="w-full flex items-center space-x-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors text-left"
            >
              <LogOut className="w-4 h-4" />
              <span>Chiqish</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
export default Sidebar;
