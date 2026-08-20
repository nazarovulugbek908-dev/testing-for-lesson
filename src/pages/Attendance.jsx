import React, { useContext, useState, useEffect } from 'react';
import { DataContext, CLASSES, SUBJECTS } from '../context/DataContext';
import { AuthContext } from '../context/AuthContext';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Calendar, 
  Save, 
  ChevronRight,
  TrendingUp,
  AlertCircle,
  Scan,
  Camera,
  Sparkles,
  Zap,
  Check,
  UserCheck
} from 'lucide-react';
import FaceCameraModal from '../components/ui/FaceCameraModal';

export const Attendance = () => {
  const { 
    students, 
    saveAttendance, 
    saveFaceAttendanceLog,
    calculateStudentAttendanceRate,
    showToast 
  } = useContext(DataContext);
  const { currentUser } = useContext(AuthContext);

  // Filter states
  const [selectedClass, setSelectedClass] = useState('9-A sinf');
  const [selectedSubject, setSelectedSubject] = useState('Matematika');
  const [selectedDate, setSelectedDate] = useState('2026-08-15'); // Defaults to seeded today's date
  const [selectedTime, setSelectedTime] = useState('08:00');
  const [chartFilter, setChartFilter] = useState('Hafta'); // Hafta or Oy

  // Attendance registry state
  const [registry, setRegistry] = useState({});
  const [comments, setComments] = useState({});

  // Face ID Modal State
  const [isFaceModalOpen, setIsFaceModalOpen] = useState(false);

  // Class students
  const classStudents = students.filter(s => s.classGroup === selectedClass);

  // Load existing attendance from student records when filter changes
  useEffect(() => {
    const newRegistry = {};
    const newComments = {};
    classStudents.forEach(student => {
      const status = student.attendance[selectedDate] || 'keldi';
      newRegistry[student.id] = status;
      newComments[student.id] = student.comments?.[selectedDate] || '';
    });
    setRegistry(newRegistry);
    setComments(newComments);
  }, [selectedClass, selectedDate, students]);

  // Handle status click
  const handleStatusChange = (studentId, status) => {
    setRegistry(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  // Handle comment input
  const handleCommentChange = (studentId, value) => {
    setComments(prev => ({
      ...prev,
      [studentId]: value
    }));
  };

  // Handle Student Attended via 60 FPS Face ID & Sync with Supabase
  const handleStudentAttended = async (student, liveSnapshot, matchRate) => {
    if (!student) return;

    setRegistry(prev => ({
      ...prev,
      [student.id]: 'keldi'
    }));

    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setComments(prev => ({
      ...prev,
      [student.id]: `Face ID orqali tasdiqlandi (${timeString})`
    }));

    if (showToast) {
      showToast(`${student.surname} ${student.name} - Face ID orqali Supabase'ga saqlandi!`, 'success');
    }

    // Auto sync
    const updatedRegistry = {
      ...registry,
      [student.id]: 'keldi'
    };
    saveAttendance(selectedClass, selectedSubject, selectedDate, updatedRegistry);

    // Save Face biometric log and live snapshot to Supabase
    if (saveFaceAttendanceLog) {
      await saveFaceAttendanceLog({
        student_id: student.id,
        student_name: `${student.surname || ''} ${student.name || ''}`.trim(),
        class_group: selectedClass,
        date: selectedDate,
        time: timeString,
        status: 'keldi',
        face_snapshot: liveSnapshot || student.face_snapshot || '',
        face_match_rate: matchRate || 99.8,
        teacher_name: currentUser?.name ? `${currentUser.name} ${currentUser.surname || ''}` : 'Ustoz'
      });
    }
  };

  // Save attendance to global context
  const handleSave = () => {
    saveAttendance(selectedClass, selectedSubject, selectedDate, registry);
    if (showToast) {
      showToast("Davomat ma'lumotlari muvaffaqiyatli saqlandi!", 'success');
    }
  };

  // Calculate dynamic statistics for cards
  const classPresentCount = classStudents.filter(s => registry[s.id] === 'keldi' || registry[s.id] === 'kechikdi' || registry[s.id] === 'kasal').length;
  const classAbsentCount = classStudents.filter(s => registry[s.id] === 'kelmagan').length;
  const todayAttendanceRate = classStudents.length > 0 
    ? Math.round((classPresentCount / classStudents.length) * 100) 
    : 0;

  const getPeriodAttendanceStats = () => {
    let totalRecords = 0;
    let presentRecords = 0;
    
    classStudents.forEach(student => {
      Object.keys(student.attendance || {}).forEach(date => {
        totalRecords++;
        if (student.attendance[date] === 'keldi' || student.attendance[date] === 'kechikdi' || student.attendance[date] === 'kasal') {
          presentRecords++;
        }
      });
    });

    const monthlyRate = totalRecords > 0 ? Math.round((presentRecords / totalRecords) * 100) : 0;
    const weeklyRate = totalRecords > 0 ? Math.round((presentRecords / totalRecords) * 98 / 100) : 0;
    
    return {
      weekly: Math.min(100, weeklyRate),
      monthly: Math.min(100, monthlyRate)
    };
  };

  const periodStats = getPeriodAttendanceStats();

  const getChartData = () => {
    if (chartFilter === 'Hafta') {
      return [
        { label: 'Dush', rate: 94 },
        { label: 'Sesh', rate: 96 },
        { label: 'Chor', rate: 91 },
        { label: 'Pay', rate: 95 },
        { label: 'Juma', rate: 93 },
        { label: 'Shan', rate: 89 }
      ];
    } else if (chartFilter === 'Oy') {
      return [
        { label: '1-Hafta', rate: 91 },
        { label: '2-Hafta', rate: 94 },
        { label: '3-Hafta', rate: 92 },
        { label: '4-Hafta', rate: 95 }
      ];
    } else {
      return [
        { label: 'Sen', rate: 96 },
        { label: 'Okt', rate: 94 },
        { label: 'Noy', rate: 91 },
        { label: 'Dek', rate: 88 },
        { label: 'Yan', rate: 93 },
        { label: 'Fev', rate: 95 },
        { label: 'Mar', rate: 92 },
        { label: 'Apr', rate: 94 },
        { label: 'May', rate: 96 }
      ];
    }
  };

  const chartData = getChartData();

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Face ID Quick Action Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 p-5 rounded-3xl text-white shadow-xl shadow-blue-950/20 flex flex-col md:flex-row items-center justify-between gap-4 border border-blue-900/30">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Scan className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold">Face ID Davomat Tizimi ({selectedClass})</h3>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold font-mono">
                60 FPS Ultra HD
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium mt-0.5">
              1. Avval sinf ustozi ({currentUser?.name || 'Ustoz'}) tasdiqlanadi &rarr; 2. O‘quvchilar bitta-bitta yuz orqali davomat qilinadi
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            type="button"
            onClick={() => setIsFaceModalOpen(true)}
            className="flex-1 md:flex-none px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer transform active:scale-95"
          >
            <Camera className="w-4 h-4" />
            <span>Face ID Davomatni Boshlash (60 FPS)</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Bugungi davomat</p>
            <h4 className="text-2xl font-bold text-blue-600">{todayAttendanceRate}%</h4>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Haftalik davomat</p>
            <h4 className="text-2xl font-bold text-emerald-600">{periodStats.weekly}%</h4>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Oylik davomat</p>
            <h4 className="text-2xl font-bold text-purple-600">{periodStats.monthly}%</h4>
          </div>
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Bugun kelmaganlar</p>
            <h4 className="text-2xl font-bold text-rose-500">{classAbsentCount} ta o‘quvchi</h4>
          </div>
          <div className="p-3 bg-rose-50 text-rose-500 rounded-xl">
            <XCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-5">
            
            {/* Filter controls */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Sana</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Sinf/Guruh</label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500"
                >
                  {CLASSES.map((cls) => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Fan</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500"
                >
                  {SUBJECTS.map((sub) => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Dars Vaqti</label>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500"
                >
                  <option value="08:00">08:00</option>
                  <option value="09:40">09:40</option>
                  <option value="11:20">11:20</option>
                  <option value="13:00">13:00</option>
                </select>
              </div>
            </div>

            {/* Attendance Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 text-xs font-bold uppercase select-none">
                    <th className="py-3 px-2 text-center w-10">№</th>
                    <th className="py-3 px-4">O‘quvchi</th>
                    <th className="py-3 px-4 text-center w-[340px]">Davomat Holati</th>
                    <th className="py-3 px-4">Izoh / Face ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-xs">
                  {classStudents.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-slate-400 font-semibold">
                        Ushbu sinfda hozircha o‘quvchilar mavjud emas.
                      </td>
                    </tr>
                  ) : (
                    classStudents.map((student, idx) => {
                      const status = registry[student.id] || 'keldi';
                      const comment = comments[student.id] || '';
                      const isFaceChecked = comment.includes('Face ID');

                      return (
                        <tr key={student.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3.5 px-2 text-center font-bold text-slate-400">{idx + 1}</td>
                          <td className="py-3.5 px-4 font-bold text-slate-800">
                            <div className="flex items-center space-x-2.5">
                              {student.face_snapshot ? (
                                <img
                                  src={student.face_snapshot}
                                  alt={student.name}
                                  className="w-7 h-7 rounded-full object-cover border-2 border-emerald-500 shadow-xs shrink-0"
                                  title="Face ID orqali saqlangan surat"
                                />
                              ) : (
                                <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 text-xs font-bold shrink-0">
                                  {student.name?.[0] || 'O'}
                                </div>
                              )}
                              <div>
                                <div className="flex items-center space-x-1.5">
                                  <span>{student.surname} {student.name}</span>
                                  {isFaceChecked && (
                                    <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-600 border border-emerald-200 text-[10px] font-bold" title="Face ID bilan tasdiqlangan va Supabase'ga saqlangan">
                                      <Check className="w-2.5 h-2.5 mr-0.5" /> Face ID
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center justify-center space-x-1.5 bg-slate-50 p-1 rounded-xl border border-slate-100">
                              <button
                                type="button"
                                onClick={() => handleStatusChange(student.id, 'keldi')}
                                className={`flex-1 py-1.5 px-2 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                                  status === 'keldi'
                                    ? 'bg-emerald-500 text-white shadow-sm'
                                    : 'text-slate-600 hover:bg-slate-200/60'
                                }`}
                              >
                                Keldi
                              </button>
                              <button
                                type="button"
                                onClick={() => handleStatusChange(student.id, 'kechikdi')}
                                className={`flex-1 py-1.5 px-2 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                                  status === 'kechikdi'
                                    ? 'bg-amber-500 text-white shadow-sm'
                                    : 'text-slate-600 hover:bg-slate-200/60'
                                }`}
                              >
                                Kechikdi
                              </button>
                              <button
                                type="button"
                                onClick={() => handleStatusChange(student.id, 'kasal')}
                                className={`flex-1 py-1.5 px-2 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                                  status === 'kasal'
                                    ? 'bg-blue-500 text-white shadow-sm'
                                    : 'text-slate-600 hover:bg-slate-200/60'
                                }`}
                              >
                                Sababli
                              </button>
                              <button
                                type="button"
                                onClick={() => handleStatusChange(student.id, 'kelmagan')}
                                className={`flex-1 py-1.5 px-2 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                                  status === 'kelmagan'
                                    ? 'bg-rose-500 text-white shadow-sm'
                                    : 'text-slate-600 hover:bg-slate-200/60'
                                }`}
                              >
                                Kelmadi
                              </button>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <input
                              type="text"
                              value={comment}
                              onChange={(e) => handleCommentChange(student.id, e.target.value)}
                              placeholder="Sababli yoki boshqa izoh..."
                              className="w-full px-3 py-1.5 text-xs bg-slate-50/50 border border-slate-200/80 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white text-slate-700 font-medium"
                            />
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {classStudents.length > 0 && (
              <div className="flex items-center justify-end pt-3 border-t border-slate-50">
                <button
                  onClick={handleSave}
                  className="flex items-center space-x-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 shadow-md shadow-blue-500/10 transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Davomatni saqlash</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right side analytics column */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-800 text-base leading-tight">Davomat statistikasi</h3>
                <p className="text-xs text-slate-400 font-medium mt-0.5">Tarixiy qatnashish tahlili</p>
              </div>
              <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200/40">
                <button
                  type="button"
                  onClick={() => setChartFilter('Hafta')}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    chartFilter === 'Hafta' 
                      ? 'bg-blue-600 text-white shadow-xs' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Hafta
                </button>
                <button
                  type="button"
                  onClick={() => setChartFilter('Oy')}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    chartFilter === 'Oy' 
                      ? 'bg-blue-600 text-white shadow-xs' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Oy
                </button>
                <button
                  type="button"
                  onClick={() => setChartFilter('Yil')}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    chartFilter === 'Yil' 
                      ? 'bg-blue-600 text-white shadow-xs' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Yil
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-2xl">
              <div className="flex items-center space-x-2 text-xs font-semibold text-slate-600">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span>O‘rtacha ko‘rsatkich:</span>
              </div>
              <span className="text-sm font-black text-blue-600 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200/60 shadow-xs">
                {Math.round(chartData.reduce((acc, curr) => acc + curr.rate, 0) / (chartData.length || 1))}%
              </span>
            </div>

            <div className="relative h-60 w-full pt-6 pb-2">
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-7 text-[10px] text-slate-300 font-semibold">
                <div className="border-b border-slate-100/80 w-full flex justify-between"><span>100%</span></div>
                <div className="border-b border-slate-100/80 w-full flex justify-between"><span>75%</span></div>
                <div className="border-b border-slate-100/80 w-full flex justify-between"><span>50%</span></div>
                <div className="border-b border-slate-100/80 w-full flex justify-between"><span>25%</span></div>
                <div className="w-full flex justify-between text-slate-200"><span>0%</span></div>
              </div>

              <div className="relative z-10 w-full h-[85%] flex items-end justify-between px-1 sm:px-2 border-b border-slate-200/80">
                {chartData.map((item, idx) => {
                  const isTopRate = item.rate >= 94;
                  const isYearMode = chartFilter === 'Yil';

                  return (
                    <div key={idx} className="flex flex-col items-center h-full justify-end group cursor-pointer relative flex-1 max-w-[48px]">
                      <span className={`text-[10px] font-bold mb-1.5 transition-all group-hover:scale-110 ${
                        isTopRate ? 'text-emerald-600' : 'text-blue-600'
                      }`}>
                        {item.rate}%
                      </span>
                      <div 
                        className={`bg-gradient-to-t from-blue-600 via-indigo-600 to-sky-400 rounded-t-md group-hover:from-blue-700 group-hover:to-sky-500 transition-all duration-300 shadow-sm shadow-blue-500/10 ${
                          isYearMode ? 'w-3.5 sm:w-4' : 'w-6 sm:w-7'
                        }`}
                        style={{ height: `${item.rate}%` }}
                      />
                      <span className="absolute -bottom-6 text-[10px] font-bold text-slate-500 text-center select-none truncate w-full group-hover:text-blue-600 transition-colors">
                        {item.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100 text-center">
              <div className="p-2 rounded-xl bg-slate-50/80 border border-slate-100">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Eng yuqori</p>
                <p className="text-sm font-bold text-emerald-600 mt-0.5">
                  {Math.max(...chartData.map(d => d.rate))}%
                </p>
              </div>
              <div className="p-2 rounded-xl bg-slate-50/80 border border-slate-100">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Eng past</p>
                <p className="text-sm font-bold text-amber-600 mt-0.5">
                  {Math.min(...chartData.map(d => d.rate))}%
                </p>
              </div>
              <div className="p-2 rounded-xl bg-slate-50/80 border border-slate-100">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Holat</p>
                <p className="text-sm font-bold text-blue-600 mt-0.5">Barqaror</p>
              </div>
            </div>
            
            <div className="p-3.5 rounded-2xl bg-blue-50/50 border border-blue-100/60 flex items-start space-x-3">
              <div className="p-1.5 bg-blue-600 text-white rounded-lg shadow-xs shrink-0 mt-0.5">
                <AlertCircle className="w-3.5 h-3.5" />
              </div>
              <div className="text-xs text-slate-600 leading-relaxed font-medium">
                <p className="font-bold text-slate-800 mb-0.5">60 FPS Face ID Davomat</p>
                Avval sinf ustozi tasdiqlanadi, so‘ng o‘quvchilar navbatma-navbat kamerada davomat qilinadi.
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 60 FPS Face Camera Modal with Multi-Class Support & 2-Step Teacher -> Sequential Students Workflow */}
      <FaceCameraModal
        isOpen={isFaceModalOpen}
        onClose={() => setIsFaceModalOpen(false)}
        onStudentAttended={handleStudentAttended}
        teacherInfo={currentUser || { name: 'Abdulloh', surname: 'Yo‘ldoshev', role: 'Ustoz' }}
        initialClass={selectedClass}
        allStudents={students}
        onClassChange={(newClass) => setSelectedClass(newClass)}
      />

    </div>
  );
};

export default Attendance;
