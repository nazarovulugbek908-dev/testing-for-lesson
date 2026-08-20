import React, { useContext, useState, useEffect } from 'react';
import { DataContext } from '../context/DataContext';
import { AuthContext } from '../context/AuthContext';
import { Save, User, Settings as SettingsIcon, Calendar, Check, Shield } from 'lucide-react';

export const Settings = () => {
  const { showToast } = useContext(DataContext);
  const { currentUser, updateUserProfile } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);

  // Profile data state dynamically synced from currentUser
  const [profile, setProfile] = useState({
    name: currentUser?.name || '',
    surname: currentUser?.surname || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '+998 90 999-88-77',
    schoolName: currentUser?.school || currentUser?.schoolName || '110-sonli IDUM',
    subject: currentUser?.subject || 'Matematika va Fizika',
    avatar: currentUser?.avatar || ''
  });

  // Sync profile when currentUser updates or loads
  useEffect(() => {
    if (currentUser) {
      setProfile(prev => ({
        ...prev,
        name: currentUser.name || prev.name,
        surname: currentUser.surname !== undefined ? currentUser.surname : prev.surname,
        email: currentUser.email || prev.email,
        schoolName: currentUser.school || currentUser.schoolName || prev.schoolName,
        subject: currentUser.subject || prev.subject,
        phone: currentUser.phone || prev.phone
      }));
    }
  }, [currentUser]);

  // System settings state
  const [system, setSystem] = useState({
    language: 'uz',
    theme: 'light',
    smsNotifications: true,
    weeklyReports: true,
    emailAlerts: false
  });

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (updateUserProfile) {
        await updateUserProfile({
          name: profile.name,
          surname: profile.surname,
          email: profile.email,
          phone: profile.phone,
          school: profile.schoolName,
          schoolName: profile.schoolName,
          subject: profile.subject
        });
      }
      showToast("Profil ma’lumotlari muvaffaqiyatli yangilandi.", "success");
    } catch (err) {
      showToast("Profilni saqlashda xatolik yuz berdi", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSystemSave = (e) => {
    e.preventDefault();
    showToast("Tizim sozlamalari saqlandi.", "success");
  };


  return (
    <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden min-h-[500px] flex flex-col md:flex-row">
      {/* Settings Navigation Menu */}
      <div className="w-full md:w-64 border-r border-slate-100 bg-slate-50/50 p-4 shrink-0 flex flex-row md:flex-col space-x-2 md:space-x-0 md:space-y-1 overflow-x-auto md:overflow-x-visible">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap w-full text-left ${activeTab === 'profile'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10'
              : 'text-slate-600 hover:bg-slate-100'
            }`}
        >
          <User className="w-4 h-4 shrink-0" />
          <span>Profil Ma’lumotlari</span>
        </button>

        <button
          onClick={() => setActiveTab('system')}
          className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap w-full text-left ${activeTab === 'system'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10'
              : 'text-slate-600 hover:bg-slate-100'
            }`}
        >
          <SettingsIcon className="w-4 h-4 shrink-0" />
          <span>Tizim Sozlamalari</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap w-full text-left ${activeTab === 'security'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10'
              : 'text-slate-600 hover:bg-slate-100'
            }`}
        >
          <Shield className="w-4 h-4 shrink-0" />
          <span>Xavfsizlik</span>
        </button>
      </div>

      {/* Settings Content Area */}
      <div className="flex-1 p-6 sm:p-8">

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <form onSubmit={handleProfileSave} className="space-y-6 max-w-xl">
            <div>
              <h3 className="text-base font-bold text-slate-800">Shaxsiy Profil</h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Platformadagi shaxsiy ma’lumotlaringizni yangilang</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1.5">Ism</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 font-semibold"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1.5">Familiya</label>
                <input
                  type="text"
                  value={profile.surname}
                  onChange={(e) => setProfile({ ...profile, surname: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 font-semibold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1.5">Elektron pochta</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 font-medium"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1.5">Telefon raqam</label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 font-semibold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1.5">Maktab / Muassasa nomi</label>
                <input
                  type="text"
                  value={profile.schoolName}
                  onChange={(e) => setProfile({ ...profile, schoolName: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 font-semibold"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1.5">Dars beradigan fanlar</label>
                <input
                  type="text"
                  value={profile.subject}
                  onChange={(e) => setProfile({ ...profile, subject: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 font-semibold"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="flex items-center space-x-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 shadow-md shadow-blue-500/10 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Profilni saqlash</span>
              </button>
            </div>
          </form>
        )}

        {/* System Tab */}
        {activeTab === 'system' && (
          <form onSubmit={handleSystemSave} className="space-y-6 max-w-xl">
            <div>
              <h3 className="text-base font-bold text-slate-800">Tizim parametrlari</h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Platforma va bildirishnoma sozlamalari</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1.5">Tizim tili</label>
                <select
                  value={system.language}
                  onChange={(e) => setSystem({ ...system, language: e.target.value })}
                  className="w-full sm:w-64 p-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 bg-white"
                >
                  <option value="uz">O‘zbekcha (Uzbek)</option>
                  <option value="en" disabled>English (Inglizcha - Tez kunda)</option>
                  <option value="ru" disabled>Русский (Ruscha - Tez kunda)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1.5">Vizual mavzu (Theme)</label>
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setSystem({ ...system, theme: 'light' })}
                    className={`px-4 py-2 border rounded-xl text-xs font-bold transition-all ${system.theme === 'light'
                        ? 'border-blue-500 text-blue-600 bg-blue-50/50'
                        : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                      }`}
                  >
                    Yorug‘ (Light)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSystem({ ...system, theme: 'dark' });
                      showToast("Qorong‘i mavzu tez kunda ishga tushadi.", "info");
                    }}
                    className={`px-4 py-2 border rounded-xl text-xs font-bold transition-all ${system.theme === 'dark'
                        ? 'border-blue-500 text-blue-600 bg-blue-50/50'
                        : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                      }`}
                  >
                    Qorong‘i (Dark)
                  </button>
                </div>
              </div>

              <div className="pt-4 space-y-4 border-t border-slate-50">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Bildirishnomalar</h4>

                <div className="flex items-center justify-between p-3 rounded-2xl border border-slate-100">
                  <div>
                    <h5 className="text-xs font-bold text-slate-700">Telegram/SMS xabarlar</h5>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Ota-onalarga farzandi kelmaganida avtomatik xabar yuborish</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={system.smsNotifications}
                    onChange={(e) => setSystem({ ...system, smsNotifications: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500/20"
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-2xl border border-slate-100">
                  <div>
                    <h5 className="text-xs font-bold text-slate-700">Haftalik hisobotlar</h5>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Tahliliy hisobotlarni elektron pochtaga yuborish</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={system.weeklyReports}
                    onChange={(e) => setSystem({ ...system, weeklyReports: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500/20"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="flex items-center space-x-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 shadow-md shadow-blue-500/10 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Sozlamalarni saqlash</span>
              </button>
            </div>
          </form>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="space-y-6 max-w-xl">
            <div>
              <h3 className="text-base font-bold text-slate-800">Xavfsizlik sozlamalari</h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Tizimga kirish parolini o‘zgartiring</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1.5">Joriy parol</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1.5">Yangi parol</label>
                <input
                  type="password"
                  placeholder="Kamida 8 ta belgidan iborat"
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1.5">Yangi parolni takrorlang</label>
                <input
                  type="password"
                  placeholder="Yangi parolni takroran kiriting"
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 font-medium"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => showToast("Parol muvaffaqiyatli o‘zgartirildi.", "success")}
                className="flex items-center space-x-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 shadow-md shadow-blue-500/10 transition-all cursor-pointer"
              >
                <span>Parolni yangilash</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
export default Settings;
