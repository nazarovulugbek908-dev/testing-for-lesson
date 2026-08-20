import React, { useContext, useState } from 'react';
import { DataContext, CLASSES } from '../context/DataContext';
import { AuthContext } from '../context/AuthContext';
import StatCard from '../components/ui/StatCard';
import ProgressBar from '../components/ui/ProgressBar';
import StatusBadge from '../components/ui/StatusBadge';
import { Link } from 'react-router-dom';
import { 
  Users, 
  UserCheck, 
  CheckCircle2, 
  XCircle, 
  Grid, 
  Award,
  Clock,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  BookOpen,
  ListTodo,
  CheckSquare,
  Square,
  Plus,
  Trash2,
  Sparkles,
  Calendar,
  Camera,
  GraduationCap,
  ChevronRight
} from 'lucide-react';

export const Dashboard = () => {
  const { 
    students, 
    tasks,
    addTask,
    deleteTask,
    toggleTaskCompletion,
    calculateStudentAvg, 
    calculateStudentAttendanceRate, 
    getStudentStatus 
  } = useContext(DataContext);

  const { currentUser } = useContext(AuthContext);

  // Quick To-Do State for Home Page
  const [quickTitle, setQuickTitle] = useState('');
  const [quickCategory, setQuickCategory] = useState('Umumiy');
  const [quickPriority, setQuickPriority] = useState('O‘rta');
  const [isSubmittingTask, setIsSubmittingTask] = useState(false);

  const todayStr = '2026-08-15'; // Anchor date to match seed data

  const handleQuickAddTask = async (e) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;

    setIsSubmittingTask(true);
    try {
      await addTask({
        title: quickTitle.trim(),
        description: '',
        category: quickCategory,
        priority: quickPriority,
        dueDate: new Date().toISOString().split('T')[0]
      });
      setQuickTitle('');
    } finally {
      setIsSubmittingTask(false);
    }
  };

  // Helper to remove duplicate teacher surnames
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

  // 1. Calculations for Statistics
  const jamiStudents = students.length;
  const activeStudents = students.filter(s => getStudentStatus(s) === 'Faol').length;
  
  // Attendance calculations for today
  const todayKelganlar = students.filter(s => s.attendance && s.attendance[todayStr] === 'keldi').length;
  const todayKechikkanlar = students.filter(s => s.attendance && s.attendance[todayStr] === 'kechikdi').length;
  const todayKasal = students.filter(s => s.attendance && s.attendance[todayStr] === 'kasal').length;
  const todayKelmaganlar = students.filter(s => s.attendance && s.attendance[todayStr] === 'kelmagan').length;
  const todayPresent = todayKelganlar + todayKechikkanlar + todayKasal;

  const totalClasses = new Set(students.map(s => s.classGroup)).size;

  // Average grades across all students
  const studentAverages = students.map(s => calculateStudentAvg(s)).filter(avg => avg > 0);
  const averageGradeOverall = studentAverages.length > 0 
    ? parseFloat((studentAverages.reduce((a, b) => a + b, 0) / studentAverages.length).toFixed(1)) 
    : 0;

  // 2. Class Average Grades calculation (for chart)
  const classAverages = CLASSES.map(cls => {
    const classStudents = students.filter(s => s.classGroup === cls);
    const avgs = classStudents.map(s => calculateStudentAvg(s)).filter(a => a > 0);
    const avg = avgs.length > 0 ? parseFloat((avgs.reduce((a, b) => a + b, 0) / avgs.length).toFixed(1)) : 0;
    return { name: cls, avg, count: classStudents.length };
  });

  // 3. High Risk Students (lowest attendance)
  const highRiskStudents = [...students]
    .map(s => ({
      ...s,
      attendanceRate: calculateStudentAttendanceRate(s),
      avgGrade: calculateStudentAvg(s),
      status: getStudentStatus(s)
    }))
    .filter(s => s.attendanceRate < 80)
    .sort((a, b) => a.attendanceRate - b.attendanceRate)
    .slice(0, 4);

  // Today's lessons schedule
  const todayLessons = [
    { id: 1, sinf: '9-A sinf', vaqt: '08:00 - 08:45', fan: currentUser?.subject || 'Matematika', xona: '302-xona', status: 'Bajarildi' },
    { id: 2, sinf: '9-B sinf', vaqt: '09:40 - 10:25', fan: currentUser?.subject || 'Fizika', xona: '304-xona', status: 'Jarayonda' },
    { id: 3, sinf: '10-A sinf', vaqt: '11:20 - 12:05', fan: currentUser?.subject || 'Informatika', xona: 'Kompyuter xonasi', status: 'Kutilmoqda' },
    { id: 4, sinf: '10-B sinf', vaqt: '13:00 - 13:45', fan: currentUser?.subject || 'Matematika', xona: '302-xona', status: 'Kutilmoqda' },
  ];

  // Format today date in Uzbek
  const todayDateFormatted = new Date().toLocaleDateString('uz-UZ', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      
      {/* 1. HERO WELCOME BANNER (Theme-Matched Purple Gradient + 3D Illustration) */}
      <div className="relative overflow-hidden rounded-[28px] sm:rounded-[36px] bg-gradient-to-r from-[#5B4BEE] via-[#6366F1] to-[#7C3AED] text-white p-6 sm:p-8 lg:p-10 shadow-xl shadow-indigo-500/20 border border-white/10">
        
        {/* Subtle Ambient Decorative Circles */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-60 h-60 rounded-full bg-purple-400/20 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Welcome Text & Quick Shortcuts */}
          <div className="space-y-4 max-w-xl text-center md:text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-bold border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-spin-slow" />
              <span>{todayDateFormatted} &bull; Yangi O‘quv Kuni</span>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
                Xush kelibsiz, {getCleanFullName(currentUser)}!
              </h2>
              <p className="text-sm sm:text-base text-purple-100 font-medium mt-1.5 opacity-90">
                Bugun barcha darslar, Face ID davomat va baholash jurnali to‘liq faol.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 pt-1">
              <Link
                to="/attendance"
                className="px-4 py-2.5 bg-white text-[#5B4BEE] hover:bg-slate-50 font-bold text-xs rounded-xl shadow-md shadow-black/10 flex items-center space-x-2 transition-all transform active:scale-95 cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>Face ID Davomat</span>
              </Link>

              <Link
                to="/grades"
                className="px-4 py-2.5 bg-white/20 hover:bg-white/30 text-white font-bold text-xs rounded-xl backdrop-blur-md border border-white/25 flex items-center space-x-2 transition-all cursor-pointer"
              >
                <Award className="w-4 h-4" />
                <span>Baholash</span>
              </Link>

              <Link
                to="/students"
                className="px-4 py-2.5 bg-white/20 hover:bg-white/30 text-white font-bold text-xs rounded-xl backdrop-blur-md border border-white/25 flex items-center space-x-2 transition-all cursor-pointer"
              >
                <Users className="w-4 h-4" />
                <span>O‘quvchi qo‘shish</span>
              </Link>
            </div>
          </div>

          {/* 3D Visual Avatar Badge from Reference */}
          <div className="relative shrink-0 hidden sm:flex items-center justify-center">
            <div className="w-36 h-36 lg:w-44 lg:h-44 rounded-3xl bg-white/10 backdrop-blur-md p-2 border border-white/20 shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-300">
              <img
                src="/login_illustration.jpg"
                alt="Ustozlar Platformasi"
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
          </div>

        </div>
      </div>

      {/* 2. STATISTIC SUMMARY CARDS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
        
        <StatCard
          title="Jami O‘quvchilar"
          value={jamiStudents}
          subtitle={`Faol sinflar: ${totalClasses} ta`}
          icon={Users}
          color="blue"
        />

        <StatCard
          title="Bugungi Davomat"
          value={todayPresent}
          subtitle={
            jamiStudents === 0 ? "0% qatnashish" :
            `${Math.round((todayPresent / jamiStudents) * 100)}% qatnashish`
          }
          icon={UserCheck}
          color="emerald"
        />

        <StatCard
          title="O‘rtacha Baho"
          value={averageGradeOverall}
          subtitle="Barcha fanlar bo‘yicha"
          icon={Award}
          color="amber"
        />

        <StatCard
          title="Bugungi Darslar"
          value={todayLessons.length}
          subtitle="Dars jadvali bo‘yicha"
          icon={BookOpen}
          color="purple"
        />

      </div>

      {/* 3. MAIN WORKSPACE GRID: SCHEDULE & TO-DO TASKS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2-Columns: Today's Lessons & Performance Charts */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Today's Lessons Card */}
          <div className="bg-white border border-slate-100 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-extrabold text-slate-800 text-base sm:text-lg flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#5B4BEE]" />
                  <span>Bugungi Dars Jadvali</span>
                </h3>
                <p className="text-xs text-slate-400 font-medium mt-0.5">Sizning bugungi rejalashtirilgan mashg‘ulotlaringiz</p>
              </div>
              <Link to="/attendance" className="text-xs font-bold text-[#5B4BEE] hover:underline flex items-center gap-1">
                <span>Davomatga o‘tish</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {todayLessons.map((lesson) => (
                <div 
                  key={lesson.id}
                  className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/70 hover:border-[#5B4BEE]/40 hover:bg-white hover:shadow-xs transition-all flex flex-col justify-between space-y-3 group"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="px-2.5 py-1 bg-[#5B4BEE]/10 text-[#5B4BEE] rounded-lg font-black text-xs">
                        {lesson.sinf}
                      </span>
                      <h4 className="font-bold text-slate-800 text-sm mt-2">{lesson.fan}</h4>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      lesson.status === 'Bajarildi' ? 'bg-emerald-50 text-emerald-600' :
                      lesson.status === 'Jarayonda' ? 'bg-blue-50 text-blue-600' :
                      'bg-slate-100 text-slate-500'
                    }`}>
                      {lesson.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 font-semibold pt-2 border-t border-slate-200/40">
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-slate-400" /> {lesson.vaqt}</span>
                    <span>{lesson.xona}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Class Performance Breakdown Chart */}
          <div className="bg-white border border-slate-100 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-extrabold text-slate-800 text-base sm:text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#5B4BEE]" />
                  <span>Sinflar Bo‘yicha O‘zlashtirish Tahlili</span>
                </h3>
                <p className="text-xs text-slate-400 font-medium mt-0.5">Har bir sinfning o‘rtacha baho ko‘rsatkichlari (1-5)</p>
              </div>
              <Link to="/statistics" className="text-xs font-bold text-[#5B4BEE] hover:underline flex items-center gap-1">
                <span>To‘liq statistika</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
              {classAverages.map((cls) => (
                <div key={cls.name} className="p-3.5 bg-slate-50/70 rounded-2xl border border-slate-200/60 flex flex-col items-center justify-between space-y-2 group hover:bg-white hover:border-[#5B4BEE]/40 transition-all">
                  <span className="text-xs font-black text-slate-700">{cls.name}</span>
                  
                  {/* Score pill */}
                  <span className={`text-xs font-black px-2 py-0.5 rounded-lg ${
                    cls.avg >= 4.0 ? 'bg-emerald-100 text-emerald-700' :
                    cls.avg >= 3.0 ? 'bg-amber-100 text-amber-700' :
                    cls.avg > 0 ? 'bg-rose-100 text-rose-700' :
                    'bg-slate-200/60 text-slate-500'
                  }`}>
                    {cls.avg}
                  </span>

                  {/* Vertical dynamic bar */}
                  <div className="w-full h-20 bg-slate-200/60 rounded-xl overflow-hidden flex items-end p-1">
                    <div 
                      className="w-full bg-gradient-to-t from-[#5B4BEE] to-[#818cf8] rounded-lg transition-all duration-500 group-hover:scale-105"
                      style={{ height: `${cls.avg > 0 ? (cls.avg / 5.0) * 100 : 8}%` }}
                    />
                  </div>

                  <span className="text-[10px] text-slate-400 font-semibold">{cls.count} ta o‘quvchi</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right 1-Column: Quick To-Do Tasks & Monitoring */}
        <div className="space-y-6">
          
          {/* Quick To-Do List Card */}
          <div className="bg-white border border-slate-100 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-[#5B4BEE]/10 text-[#5B4BEE]">
                  <ListTodo className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-800 text-sm sm:text-base">Vazifalar (To-Do)</h3>
                  <p className="text-[11px] text-slate-400 font-semibold">{tasks.filter(t => !t.completed).length} ta bajarilmagan</p>
                </div>
              </div>
              <Link to="/tasks" className="text-xs font-bold text-[#5B4BEE] hover:underline">
                Hammasi
              </Link>
            </div>

            {/* Quick Add Input */}
            <form onSubmit={handleQuickAddTask} className="flex gap-2">
              <input
                type="text"
                value={quickTitle}
                onChange={(e) => setQuickTitle(e.target.value)}
                placeholder="Yangi vazifa yozing..."
                className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:border-[#5B4BEE] font-medium"
              />
              <button
                type="submit"
                disabled={isSubmittingTask || !quickTitle.trim()}
                className="p-2 bg-[#5B4BEE] hover:bg-[#4F46E5] text-white rounded-xl cursor-pointer disabled:opacity-50 transition-all shadow-xs"
              >
                <Plus className="w-4 h-4" />
              </button>
            </form>

            {/* Tasks List */}
            <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
              {tasks.length === 0 ? (
                <div className="py-6 text-center text-slate-400 text-xs font-medium">
                  Hozircha hech qanday vazifa yo‘q.
                </div>
              ) : (
                tasks.slice(0, 5).map((task) => (
                  <div
                    key={task.id}
                    className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-2 group ${
                      task.completed ? 'bg-slate-50/60 border-slate-100 opacity-60' : 'bg-white border-slate-100 hover:border-[#5B4BEE]/30'
                    }`}
                  >
                    <div 
                      onClick={() => toggleTaskCompletion(task.id)}
                      className="flex items-center space-x-2.5 cursor-pointer flex-1 min-w-0"
                    >
                      {task.completed ? (
                        <CheckSquare className="w-4 h-4 text-[#5B4BEE] shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-300 shrink-0 group-hover:text-[#5B4BEE]" />
                      )}
                      <span className={`text-xs font-bold truncate ${task.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                        {task.title}
                      </span>
                    </div>

                    <button
                      onClick={() => deleteTask(task.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-300 hover:text-rose-500 rounded-lg transition-all cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Attention Required Students Card */}
          <div className="bg-white border border-slate-100 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
              <div>
                <h3 className="font-extrabold text-slate-800 text-sm sm:text-base">Monitoring</h3>
                <p className="text-[11px] text-slate-400 font-semibold">Qo‘shimcha e’tibor talab o‘quvchilar</p>
              </div>
              <Link to="/students" className="text-xs font-bold text-[#5B4BEE] hover:underline">
                Barchasi
              </Link>
            </div>

            {highRiskStudents.length === 0 ? (
              <div className="p-4 text-center text-slate-400 text-xs font-medium bg-slate-50 rounded-2xl">
                Barcha o‘quvchilarning davomati va faolligi yuqori darajada.
              </div>
            ) : (
              <div className="space-y-2.5">
                {highRiskStudents.map((s) => (
                  <div key={s.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                    <div>
                      <h5 className="text-xs font-bold text-slate-800">{s.surname} {s.name}</h5>
                      <span className="text-[10px] text-slate-400 font-semibold">{s.classGroup} &bull; Davomat: {s.attendanceRate}%</span>
                    </div>
                    <StatusBadge status={s.status} />
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};

export default Dashboard;
