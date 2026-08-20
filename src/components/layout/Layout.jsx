import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { ToastContainer } from '../ui/Toast';

export const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
        openNotifications={() => {
          setNotificationsOpen(true);
          setSidebarOpen(false);
        }}
      />

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Content wrapper */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <Header 
          onMenuClick={() => setSidebarOpen(true)}
          isNotificationsOpen={notificationsOpen}
          setIsNotificationsOpen={setNotificationsOpen}
        />
        
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto max-w-[1600px] mx-auto w-full">
          {children}
        </main>
      </div>

      {/* Global Toast Alerts */}
      <ToastContainer />
    </div>
  );
};
export default Layout;
