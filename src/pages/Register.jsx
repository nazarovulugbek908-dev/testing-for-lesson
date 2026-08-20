import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Mail, Lock, User, BookOpen, UserPlus, Eye, EyeOff, Building, CheckCircle2 } from 'lucide-react';

export const Register = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    subject: 'Matematika',
    school: '110-sonli IDUM',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      setError('Iltimos, barcha zaruriy maydonlarni to‘ldiring.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Parol kamida 6 ta belgidan iborat bo‘lishi kerak.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Parollar bir-biriga mos kelmadi.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await register(formData);
      setLoading(false);
      navigate('/dashboard');
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Ro‘yxatdan o‘tishda xatolik yuz berdi');
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F3F3] flex items-center justify-center p-3 sm:p-6 md:p-10 font-sans select-none antialiased">
      
      {/* Centered Main 2-Column Card */}
      <div className="w-full max-w-5xl bg-white rounded-[28px] sm:rounded-[36px] md:rounded-[44px] shadow-[0_20px_60px_-15px_rgba(79,70,229,0.12)] border border-slate-100 overflow-hidden flex flex-col md:flex-row my-auto transition-all duration-300">
        
        {/* Left Column: Colorful Educational 3D Illustration */}
        <div className="w-full md:w-5/12 bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/40 p-6 sm:p-8 lg:p-10 flex flex-col items-center justify-center relative border-b md:border-b-0 md:border-r border-slate-100/80 overflow-hidden">
          
          {/* Ambient Glows */}
          <div className="absolute -top-10 -left-10 w-48 h-48 bg-purple-200/40 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-yellow-200/40 rounded-full blur-3xl pointer-events-none" />
          
          {/* 3D Rendered Educational Illustration */}
          <div className="relative w-full max-w-[280px] sm:max-w-[340px] aspect-square flex items-center justify-center group">
            <img
              src="/login_illustration.jpg"
              alt="Ustozlar Platformasi"
              className="w-full h-full object-contain rounded-2xl sm:rounded-3xl drop-shadow-md transform transition-transform duration-500 group-hover:scale-102"
              loading="eager"
            />
          </div>

          {/* Educational Note */}
          <div className="mt-4 text-center z-10">
            <h3 className="text-sm sm:text-base font-black text-slate-800 tracking-tight">
              Yangi Ustoz Hisobini Yaratish
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Barcha dars jurnali va Face ID imkoniyatlari
            </p>
          </div>
        </div>

        {/* Right Column: Clean Simple Register Form */}
        <div className="w-full md:w-7/12 p-6 sm:p-8 lg:p-12 flex flex-col justify-between bg-white">
          
          {/* Simple Header */}
          <div className="mb-5 text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight uppercase">
              REGISTER
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">
              Yangi hisob ochish uchun ma’lumotlaringizni kiriting
            </p>
          </div>

          {/* Form Content */}
          <div className="space-y-4 my-auto">
            
            {/* Error message alert */}
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200/80 rounded-xl text-rose-600 text-xs font-bold text-center animate-fade-in">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              
              {/* Name & Surname Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Ism *</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                      <User className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Ismingiz"
                      required
                      className="w-full pl-9 pr-3 py-2.5 sm:py-3 bg-slate-50/70 border border-slate-200/90 rounded-2xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-[#5B4BEE] transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Familiya</label>
                  <input
                    type="text"
                    name="surname"
                    value={formData.surname}
                    onChange={handleChange}
                    placeholder="Familiyangiz"
                    className="w-full px-3 py-2.5 sm:py-3 bg-slate-50/70 border border-slate-200/90 rounded-2xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-[#5B4BEE] transition-all"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Email Manzil *</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="ustoz@school.uz"
                    required
                    className="w-full pl-9 pr-3 py-2.5 sm:py-3 bg-slate-50/70 border border-slate-200/90 rounded-2xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-[#5B4BEE] transition-all"
                  />
                </div>
              </div>

              {/* Fan & Maktab */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Mutaxassislik (Fan)</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                      <BookOpen className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Matematika"
                      className="w-full pl-9 pr-3 py-2.5 sm:py-3 bg-slate-50/70 border border-slate-200/90 rounded-2xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-[#5B4BEE] transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Maktab</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                      <Building className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      name="school"
                      value={formData.school}
                      onChange={handleChange}
                      placeholder="110-sonli IDUM"
                      className="w-full pl-9 pr-3 py-2.5 sm:py-3 bg-slate-50/70 border border-slate-200/90 rounded-2xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-[#5B4BEE] transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Password & Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Parol *</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                      <Lock className="w-4 h-4" />
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Kamida 6 ta belgi"
                      required
                      className="w-full pl-9 pr-9 py-2.5 sm:py-3 bg-slate-50/70 border border-slate-200/90 rounded-2xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-[#5B4BEE] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Parolni Tasdiqlang *</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Parolni qayta tering"
                    required
                    className="w-full px-3 py-2.5 sm:py-3 bg-slate-50/70 border border-slate-200/90 rounded-2xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-[#5B4BEE] transition-all"
                  />
                </div>
              </div>

              {/* Wide Purple Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 sm:py-4 bg-[#5B4BEE] hover:bg-[#4F46E5] text-white rounded-2xl font-bold text-sm sm:text-base shadow-lg shadow-indigo-500/25 flex items-center justify-center space-x-2 transition-all cursor-pointer transform active:scale-[0.98] mt-4"
              >
                {loading ? (
                  <span>Ro‘yxatdan o‘tilmoqda...</span>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Ro‘yxatdan O‘tish</span>
                  </>
                )}
              </button>

            </form>

          </div>

          {/* Bottom Footer & Login Link */}
          <div className="mt-5 pt-4 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500 font-medium">
              Hisobingiz bormi?{' '}
              <Link to="/login" className="font-bold text-[#5B4BEE] hover:underline">
                Tizimga kirish (Login)
              </Link>
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Register;
