import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, LogIn, ArrowRight } from 'lucide-react';

export const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // Input states
  const [email, setEmail] = useState(() => localStorage.getItem('up_saved_email') || '');
  const [password, setPassword] = useState(() => localStorage.getItem('up_saved_password') || '');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Iltimos, email va parolingizni kiriting.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      if (rememberMe) {
        localStorage.setItem('up_saved_email', email.trim());
        localStorage.setItem('up_saved_password', password);
      } else {
        localStorage.removeItem('up_saved_email');
        localStorage.removeItem('up_saved_password');
      }

      await login(email.trim(), password);
      setLoading(false);
      navigate('/dashboard');
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Email yoki parol noto‘g‘ri kiritildi.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F3F3] flex items-center justify-center p-3 sm:p-6 md:p-10 font-sans select-none antialiased">
      
      {/* Centered Main 2-Column Card */}
      <div className="w-full max-w-5xl bg-white rounded-[28px] sm:rounded-[36px] md:rounded-[44px] shadow-[0_20px_60px_-15px_rgba(79,70,229,0.12)] border border-slate-100 overflow-hidden flex flex-col md:flex-row my-auto transition-all duration-300">
        
        {/* Left Column: Colorful Educational 3D Illustration */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/40 p-6 sm:p-8 lg:p-12 flex flex-col items-center justify-center relative border-b md:border-b-0 md:border-r border-slate-100/80 overflow-hidden">
          
          {/* Ambient Glows */}
          <div className="absolute -top-10 -left-10 w-48 h-48 bg-purple-200/40 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-yellow-200/40 rounded-full blur-3xl pointer-events-none" />
          
          {/* 2D Vector Educational Illustration */}
          <div className="relative w-full max-w-[340px] sm:max-w-[400px] lg:max-w-[440px] aspect-square flex items-center justify-center group">
            <img
              src="/login_backpack.jpg"
              alt="Ustozlar Platformasi"
              className="w-full h-full object-contain rounded-2xl sm:rounded-3xl drop-shadow-md transform transition-transform duration-500 group-hover:scale-102"
              loading="eager"
            />
          </div>

          {/* Educational Note */}
          <div className="mt-4 sm:mt-6 text-center z-10">
            <h3 className="text-sm sm:text-base font-black text-slate-800 tracking-tight">
              Ustozlar & O‘quvchilar Platformasi
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Aqlli ta’lim va Face ID davomat boshqaruvi
            </p>
          </div>
        </div>

        {/* Right Column: Clean Simple Login Form */}
        <div className="w-full md:w-1/2 p-6 sm:p-10 lg:p-14 flex flex-col justify-between bg-white">
          
          {/* Simple Header */}
          <div className="mb-6 sm:mb-8 text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight uppercase">
              LOGIN
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">
              Platformaga kirish uchun ma’lumotlaringizni kiriting
            </p>
          </div>

          {/* Form Content */}
          <div className="space-y-6 my-auto">
            
            {/* Error message alert */}
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200/80 rounded-xl text-rose-600 text-xs font-bold text-center animate-fade-in">
                {error}
              </div>
            )}

            {/* Login Inputs Form */}
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              
              {/* 1. Email Address Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@school.uz"
                    required
                    className="w-full pl-10 pr-4 py-3 sm:py-3.5 bg-slate-50/70 border border-slate-200/90 rounded-2xl text-sm font-semibold text-slate-800 focus:outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-[#5B4BEE] transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* 2. Password Field with Eye Toggle */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-11 py-3 sm:py-3.5 bg-slate-50/70 border border-slate-200/90 rounded-2xl text-sm font-semibold text-slate-800 focus:outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-[#5B4BEE] transition-all placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password Row */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center space-x-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 text-[#5B4BEE] rounded border-slate-300 focus:ring-[#5B4BEE] cursor-pointer"
                  />
                  <span className="text-slate-600 font-medium">Remember me</span>
                </label>

                <a
                  href="#"
                  onClick={(e) => { 
                    e.preventDefault(); 
                    alert("Parolni tiklash uchun maktab ma'muriyatiga murojaat qiling."); 
                  }}
                  className="font-bold text-[#5B4BEE] hover:text-indigo-700 hover:underline transition-colors"
                >
                  Forgot Password?
                </a>
              </div>

              {/* Wide Purple Rounded Log In Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 sm:py-4 bg-[#5B4BEE] hover:bg-[#4F46E5] text-white rounded-2xl font-bold text-sm sm:text-base shadow-lg shadow-indigo-500/25 flex items-center justify-center space-x-2 transition-all cursor-pointer transform active:scale-[0.98] mt-2"
              >
                {loading ? (
                  <span>Logging in...</span>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Log In</span>
                  </>
                )}
              </button>

            </form>

          </div>

          {/* Bottom Footer & Register Link */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500 font-medium">
              Don't have an account?{' '}
              <Link to="/register" className="font-bold text-[#5B4BEE] hover:underline">
                Register here
              </Link>
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Login;
