import React, { useContext, useState } from 'react';
import { DataContext, CLASSES, SUBJECTS } from '../context/DataContext';
import StatusBadge from '../components/ui/StatusBadge';
import { Link } from 'react-router-dom';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Star, 
  Award, 
  AlertTriangle, 
  FileText, 
  Calendar, 
  Activity, 
  ArrowUpRight,
  GraduationCap,
  Sparkles,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

export const Statistics = () => {
  const { 
    students, 
    calculateStudentAvg, 
    calculateStudentAttendanceRate, 
    getStudentStatus 
  } = useContext(DataContext);

  const [activeTab, setActiveTab] = useState('performance'); // 'performance' | 'class_attendance' | 'weekly_attendance'

  // 1. DYNAMIC CALCULATIONS FOR SUMMARY CARDS
  const totalStudents = students.length;
  
  // Average attendance rate across all students
  const studentAttRates = students.map(s => calculateStudentAttendanceRate(s));
  const avgAttendance = totalStudents > 0 && studentAttRates.length > 0 
    ? Math.round(studentAttRates.reduce((a, b) => a + b, 0) / studentAttRates.length) 
    : 0;

  // Average grade across all students
  const studentGrades = students.map(s => calculateStudentAvg(s)).filter(g => g > 0);
  const avgGrade = totalStudents > 0 && studentGrades.length > 0 
    ? parseFloat((studentGrades.reduce((a, b) => a + b, 0) / studentGrades.length).toFixed(1)) 
    : 0;

  // Class-specific attendance and grade averages
  const classPerformance = CLASSES.map(cls => {
    const classStudents = students.filter(s => s.classGroup === cls);
    const attRates = classStudents.map(s => calculateStudentAttendanceRate(s));
    const grades = classStudents.map(s => calculateStudentAvg(s)).filter(g => g > 0);

    const avgClassAtt = attRates.length > 0 ? Math.round(attRates.reduce((a, b) => a + b, 0) / attRates.length) : 0;
    const avgClassGrade = grades.length > 0 ? parseFloat((grades.reduce((a, b) => a + b, 0) / grades.length).toFixed(1)) : 0;

    return { 
      name: cls, 
      avgAtt: avgClassAtt, 
      avgGrade: avgClassGrade, 
      studentCount: classStudents.length 
    };
  });

  // Eng faol sinf (highest attendance)
  const activeClassesWithStudents = classPerformance.filter(c => c.studentCount > 0);
  const mostActive = activeClassesWithStudents.length > 0
    ? [...activeClassesWithStudents].sort((a, b) => b.avgAtt - a.avgAtt)[0]
    : null;

  // Eng yaxshi o'zlashtirish (highest grade)
  const bestPerforming = activeClassesWithStudents.length > 0
    ? [...activeClassesWithStudents].sort((a, b) => b.avgGrade - a.avgGrade)[0]
    : null;

  // Ko'p dars qoldirayotganlar count (attendance < 80%)
  const absentRiskCount = totalStudents > 0 
    ? students.filter(s => calculateStudentAttendanceRate(s) < 80).length 
    : 0;

  // 2. DYNAMIC CHART DATA
  // Subject performance averages
  const subjectAverages = SUBJECTS.map(subject => {
    let sum = 0;
    let count = 0;
    students.forEach(student => {
      const avg = calculateStudentAvg(student, subject);
      if (avg > 0) {
        sum += avg;
        count++;
      }
    });
    const avg = count > 0 ? parseFloat((sum / count).toFixed(1)) : 0;
    return { name: subject, avg, evaluatedCount: count };
  });

  // History Dates attendance trends
  const historyDates = ['2026-08-10', '2026-08-11', '2026-08-12', '2026-08-13', '2026-08-14', '2026-08-15'];
  const dailyAttendanceRates = historyDates.map(date => {
    const present = students.filter(s => s.attendance && (s.attendance[date] === 'keldi' || s.attendance[date] === 'kechikdi' || s.attendance[date] === 'kasal')).length;
    const rate = students.length > 0 ? Math.round((present / students.length) * 100) : 0;
    const label = date.split('-')[2] + '-Avg';
    return { label, rate };
  });

  // Attention required students (Nazoratda & E’tibor talab statuses)
  const attentionRequiredStudents = totalStudents > 0 
    ? students
        .map(student => ({
          ...student,
          attendanceRate: calculateStudentAttendanceRate(student),
          avgGrade: calculateStudentAvg(student),
          status: getStudentStatus(student)
        }))
        .filter(student => student.status === 'Nazoratda' || student.status === 'E’tibor talab' || student.status === 'Xavfli' || student.status === 'Ogohlantirish')
        .sort((a, b) => {
          if (a.status === 'Nazoratda' && b.status !== 'Nazoratda') return -1;
          if (a.status !== 'Nazoratda' && b.status === 'Nazoratda') return 1;
          return a.avgGrade - b.avgGrade;
        })
    : [];

  return (
    <div className="space-y-6">
      
      {/* Top Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
        
        <div className="bg-white border border-blue-100/80 p-5 rounded-3xl shadow-xs flex flex-col justify-between space-y-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Jami O‘quvchilar</span>
          <div className="flex items-center justify-between">
            <h3 className="text-3xl font-black text-slate-800 tracking-tight">{totalStudents}</h3>
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100"><Users className="w-4 h-4" /></div>
          </div>
        </div>

        <div className="bg-white border border-emerald-100/80 p-5 rounded-3xl shadow-xs flex flex-col justify-between space-y-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">O‘rtacha Davomat</span>
          <div className="flex items-center justify-between">
            <h3 className="text-3xl font-black text-emerald-600 tracking-tight">{avgAttendance}%</h3>
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100"><TrendingUp className="w-4 h-4" /></div>
          </div>
        </div>

        <div className="bg-white border border-amber-100/80 p-5 rounded-3xl shadow-xs flex flex-col justify-between space-y-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">O‘rtacha Baho</span>
          <div className="flex items-center justify-between">
            <h3 className="text-3xl font-black text-amber-600 tracking-tight">{avgGrade}</h3>
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-2xl border border-amber-100"><Star className="w-4 h-4" /></div>
          </div>
        </div>

        <div className="bg-white border border-purple-100/80 p-5 rounded-3xl shadow-xs flex flex-col justify-between space-y-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Eng Faol Sinf</span>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-800">{mostActive?.name || '0'}</h3>
              <p className="text-[10px] text-slate-400 font-bold mt-0.5">{mostActive ? `${mostActive.avgAtt}% qatnashish` : '0% qatnashish'}</p>
            </div>
            <div className="p-2.5 bg-purple-50 text-purple-600 rounded-2xl border border-purple-100"><Activity className="w-4 h-4" /></div>
          </div>
        </div>

        <div className="bg-white border border-indigo-100/80 p-5 rounded-3xl shadow-xs flex flex-col justify-between space-y-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Eng yaxshi sinf</span>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-800">{bestPerforming?.name || '0'}</h3>
              <p className="text-[10px] text-slate-400 font-bold mt-0.5">{bestPerforming ? `O‘rtacha: ${bestPerforming.avgGrade}` : 'O‘rtacha: 0'}</p>
            </div>
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-2xl border border-indigo-100"><Award className="w-4 h-4" /></div>
          </div>
        </div>

        <div className="bg-white border border-rose-100/80 p-5 rounded-3xl shadow-xs flex flex-col justify-between space-y-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">E’tibor talablar</span>
          <div className="flex items-center justify-between">
            <h3 className="text-3xl font-black text-rose-600 tracking-tight">{absentRiskCount} ta</h3>
            <div className="p-2.5 bg-rose-50 text-rose-500 rounded-2xl border border-rose-100"><AlertTriangle className="w-4 h-4" /></div>
          </div>
        </div>

      </div>

      {/* Visual Analytics Dashboard Card */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 sm:p-7 shadow-sm space-y-6">
        
        {/* Header and Interactive Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-5 gap-3">
          <div>
            <h3 className="font-extrabold text-slate-800 text-lg">Vizual Tahlil Diagrammalari</h3>
            <p className="text-xs text-slate-400 font-medium mt-0.5">Sinflar, fanlar va davomat monitoringi</p>
          </div>
          
          {/* Tab buttons */}
          <div className="flex p-1 bg-slate-100/80 rounded-2xl self-start sm:self-auto gap-1">
            <button
              onClick={() => setActiveTab('performance')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === 'performance' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Fanlar & Sinflar (Baholar)
            </button>
            <button
              onClick={() => setActiveTab('class_attendance')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === 'class_attendance' ? 'bg-white text-purple-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Sinflar Davomati (%)
            </button>
            <button
              onClick={() => setActiveTab('weekly_attendance')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === 'weekly_attendance' ? 'bg-white text-emerald-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Haftalik Davomat
            </button>
          </div>
        </div>

        {/* Tab 1: Grades Breakdown by Subject & Class */}
        {activeTab === 'performance' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-2">
            
            {/* Chart 1: Subject Performance Averages */}
            <div className="space-y-4 bg-slate-50/50 p-4 sm:p-5 rounded-2xl border border-slate-100">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Star className="w-4 h-4 text-blue-600 fill-blue-500/20" />
                  <span>Fanlar bo‘yicha o‘rtacha baholar (1-5)</span>
                </h4>
              </div>
              
              <div className="relative h-64 w-full flex items-end justify-between pr-2 pl-6 pb-8 pt-6">
                
                {/* Grid guidelines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[10px] text-slate-400 font-bold border-b border-slate-200/80 pb-8 pl-1">
                  <div className="border-b border-slate-200/40 w-full flex justify-between"><span>5.0</span></div>
                  <div className="border-b border-slate-200/40 w-full flex justify-between"><span>4.0</span></div>
                  <div className="border-b border-slate-200/40 w-full flex justify-between"><span>3.0</span></div>
                  <div className="border-b border-slate-200/40 w-full flex justify-between"><span>2.0</span></div>
                  <div className="w-full flex justify-between"><span>0.0</span></div>
                </div>

                {/* Bars */}
                <div className="w-full flex justify-around items-end z-10 h-[80%] pl-3 gap-2">
                  {subjectAverages.map((item, idx) => {
                    const heightPercent = item.avg > 0 ? (item.avg / 5.0) * 100 : 4;
                    return (
                      <div key={idx} className="flex flex-col items-center space-y-1.5 flex-1 max-w-[64px] group">
                        
                        {/* Always visible score tag */}
                        <span className={`text-[11px] font-black px-1.5 py-0.5 rounded-md transition-all ${
                          item.avg >= 4.0 ? 'bg-blue-100 text-blue-700' :
                          item.avg >= 3.0 ? 'bg-amber-100 text-amber-700' :
                          item.avg > 0 ? 'bg-rose-100 text-rose-700' :
                          'bg-slate-200/60 text-slate-500'
                        }`}>
                          {item.avg}
                        </span>

                        {/* Bar */}
                        <div 
                          className={`w-full rounded-t-xl transition-all duration-500 ${
                            item.avg > 0 
                              ? 'bg-gradient-to-t from-blue-600 via-indigo-500 to-cyan-400 shadow-sm shadow-blue-500/30 group-hover:scale-105' 
                              : 'bg-slate-200/70 border border-dashed border-slate-300'
                          }`}
                          style={{ height: `${heightPercent}%`, minHeight: '6px' }}
                        />

                        {/* X-axis label */}
                        <span className="text-[10px] font-bold text-slate-600 text-center select-none truncate w-full pt-1">
                          {item.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Chart 2: Class Performance Averages */}
            <div className="space-y-4 bg-slate-50/50 p-4 sm:p-5 rounded-2xl border border-slate-100">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-purple-600" />
                  <span>Sinflar bo‘yicha o‘rtacha baho</span>
                </h4>
              </div>

              <div className="relative h-64 w-full flex items-end justify-between pr-2 pl-6 pb-8 pt-6">
                
                {/* Grid guidelines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[10px] text-slate-400 font-bold border-b border-slate-200/80 pb-8 pl-1">
                  <div className="border-b border-slate-200/40 w-full flex justify-between"><span>5.0</span></div>
                  <div className="border-b border-slate-200/40 w-full flex justify-between"><span>4.0</span></div>
                  <div className="border-b border-slate-200/40 w-full flex justify-between"><span>3.0</span></div>
                  <div className="border-b border-slate-200/40 w-full flex justify-between"><span>2.0</span></div>
                  <div className="w-full flex justify-between"><span>0.0</span></div>
                </div>

                {/* Bars */}
                <div className="w-full flex justify-around items-end z-10 h-[80%] pl-3 gap-2">
                  {classPerformance.map((item, idx) => {
                    const heightPercent = item.avgGrade > 0 ? (item.avgGrade / 5.0) * 100 : 4;
                    return (
                      <div key={idx} className="flex flex-col items-center space-y-1.5 flex-1 max-w-[64px] group">
                        
                        {/* Always visible score tag */}
                        <span className={`text-[11px] font-black px-1.5 py-0.5 rounded-md transition-all ${
                          item.avgGrade >= 4.0 ? 'bg-purple-100 text-purple-700' :
                          item.avgGrade >= 3.0 ? 'bg-amber-100 text-amber-700' :
                          item.avgGrade > 0 ? 'bg-rose-100 text-rose-700' :
                          'bg-slate-200/60 text-slate-500'
                        }`}>
                          {item.avgGrade}
                        </span>

                        {/* Bar */}
                        <div 
                          className={`w-full rounded-t-xl transition-all duration-500 ${
                            item.avgGrade > 0 
                              ? 'bg-gradient-to-t from-purple-600 via-indigo-500 to-pink-400 shadow-sm shadow-purple-500/30 group-hover:scale-105' 
                              : 'bg-slate-200/70 border border-dashed border-slate-300'
                          }`}
                          style={{ height: `${heightPercent}%`, minHeight: '6px' }}
                        />

                        {/* X-axis label */}
                        <span className="text-[10px] font-bold text-slate-600 text-center select-none truncate w-full pt-1" title={`${item.name} (${item.studentCount} ta o‘quvchi)`}>
                          {item.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: Class Attendance Rates */}
        {activeTab === 'class_attendance' && (
          <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 space-y-4">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Activity className="w-4 h-4 text-purple-600" />
              <span>Har bir sinfning davomat foizi (0 - 100%)</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 pt-2">
              {classPerformance.map((cls) => (
                <div key={cls.name} className="bg-white p-4 rounded-2xl border border-slate-200/70 shadow-xs flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-xs font-bold text-slate-700 block">{cls.name}</span>
                    <span className="text-[10px] text-slate-400 font-semibold">{cls.studentCount} ta o‘quvchi</span>
                  </div>
                  <div>
                    <div className="flex items-baseline justify-between mb-1">
                      <span className="text-xl font-black text-slate-800">{cls.avgAtt}%</span>
                      <span className={`text-[10px] font-bold ${cls.avgAtt >= 90 ? 'text-emerald-600' : cls.avgAtt >= 70 ? 'text-amber-600' : 'text-slate-400'}`}>
                        {cls.avgAtt >= 90 ? 'A’lo' : cls.avgAtt >= 70 ? 'O‘rta' : 'Past'}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${cls.avgAtt >= 90 ? 'bg-emerald-500' : cls.avgAtt >= 70 ? 'bg-amber-500' : 'bg-blue-500'}`}
                        style={{ width: `${cls.avgAtt}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Weekly Attendance Dynamic Graph */}
        {activeTab === 'weekly_attendance' && (
          <div className="space-y-4 max-w-2xl mx-auto bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
            <h4 className="text-sm font-bold text-slate-800 text-center mb-2">Kunlar bo‘yicha o‘rtacha qatnashish foizi</h4>
            
            <div className="h-60 w-full relative flex items-end pt-6 pb-6 pr-4 pl-10">
              <div className="absolute left-0 inset-y-0 flex flex-col justify-between text-[10px] text-slate-400 font-bold border-r border-slate-200/80 pr-2 pointer-events-none pb-6">
                <span>100%</span>
                <span>75%</span>
                <span>50%</span>
                <span>25%</span>
                <span>0%</span>
              </div>

              <div className="w-full h-[85%] relative z-10 flex justify-between items-end pl-4">
                <svg className="absolute inset-0 w-full h-full" overflow="visible">
                  <path
                    d={dailyAttendanceRates.reduce((pathStr, item, idx) => {
                      const x = (idx / (dailyAttendanceRates.length - 1)) * 100;
                      const yPercent = 100 - (item.rate / 100) * 100;
                      const cmd = idx === 0 ? 'M' : 'L';
                      return `${pathStr} ${cmd} ${x}% ${yPercent}%`;
                    }, '')}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                  
                  {dailyAttendanceRates.map((item, idx) => {
                    const x = (idx / (dailyAttendanceRates.length - 1)) * 100;
                    const yPercent = 100 - (item.rate / 100) * 100;
                    return (
                      <g key={idx}>
                        <circle
                          cx={`${x}%`}
                          cy={`${yPercent}%`}
                          r="5.5"
                          fill="#ffffff"
                          stroke="#10b981"
                          strokeWidth="3.5"
                        />
                        <text
                          x={`${x}%`}
                          y={`${yPercent}%`}
                          dy="-10"
                          textAnchor="middle"
                          fill="#1e293b"
                          fontSize="10"
                          fontWeight="bold"
                        >
                          {item.rate}%
                        </text>
                      </g>
                    );
                  })}
                </svg>

                <div className="absolute left-4 right-0 bottom-[-22px] flex justify-between text-[10px] font-bold text-slate-500 select-none">
                  {dailyAttendanceRates.map((item, idx) => (
                    <span key={idx} className="w-12 text-center">{item.label}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Critical Students Action Card */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-base font-bold text-slate-800">E’tibor talab qiluvchi o‘quvchilar</h4>
            <p className="text-xs text-slate-400 font-medium">Davomati yoki o‘zlashtirishi past bo‘lgan o‘quvchilar</p>
          </div>
          <Link to="/students" className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
            <span>Barcha o‘quvchilar</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {attentionRequiredStudents.length === 0 ? (
          <div className="p-8 text-center bg-slate-50/60 rounded-2xl border border-slate-100 text-slate-400 space-y-1">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
            <p className="text-sm font-bold text-slate-700">Ajoyib natija! Muammoli o‘quvchilar mavjud emas.</p>
            <p className="text-xs">Barcha o‘quvchilar faol va davomat ko‘rsatkichlari yuqori.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {attentionRequiredStudents.slice(0, 4).map((student) => (
              <div key={student.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60 flex flex-col justify-between space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h5 className="text-sm font-bold text-slate-800">{student.surname} {student.name}</h5>
                    <span className="text-[11px] text-slate-400 font-semibold">{student.classGroup}</span>
                  </div>
                  <StatusBadge status={student.status} />
                </div>
                <div className="flex items-center justify-between text-xs font-semibold pt-2 border-t border-slate-200/50">
                  <span className="text-slate-500">Davomat: <b className="text-slate-800">{student.attendanceRate}%</b></span>
                  <span className="text-slate-500">Baho: <b className="text-slate-800">{student.avgGrade || 0}</b></span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default Statistics;
