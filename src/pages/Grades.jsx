import React, { useContext, useState } from 'react';
import { DataContext, CLASSES, SUBJECTS } from '../context/DataContext';
import { Save, Award, AlertTriangle, Star, CheckCircle, Sparkles, Check } from 'lucide-react';

/**
 * Modern 1-Tap Grade Picker Component
 * Allows teachers to select 2, 3, 4, 5 in a single click with instant visual feedback
 */
const GradePicker = ({ value, onChange, disabled }) => {
  return (
    <div className={`inline-flex items-center p-1 bg-slate-100/90 rounded-2xl border border-slate-200/70 gap-1 select-none shadow-xs ${disabled ? 'opacity-40 pointer-events-none' : ''}`}>
      {[2, 3, 4, 5].map((gradeNum) => {
        const isSelected = Number(value) === gradeNum;
        let activeClass = '';
        if (gradeNum === 5) activeClass = 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/30 scale-105';
        else if (gradeNum === 4) activeClass = 'bg-blue-500 text-white shadow-sm shadow-blue-500/30 scale-105';
        else if (gradeNum === 3) activeClass = 'bg-amber-500 text-white shadow-sm shadow-amber-500/30 scale-105';
        else if (gradeNum === 2) activeClass = 'bg-rose-500 text-white shadow-sm shadow-rose-500/30 scale-105';

        return (
          <button
            key={gradeNum}
            type="button"
            onClick={() => onChange(isSelected ? null : gradeNum)}
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center ${
              isSelected 
                ? activeClass 
                : 'text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-xs'
            }`}
            title={`${gradeNum} baho`}
          >
            {gradeNum}
          </button>
        );
      })}
    </div>
  );
};

export const Grades = () => {
  const { 
    students, 
    updateStudentGrade, 
    saveAllGrades,
    calculateStudentAvg,
    showToast
  } = useContext(DataContext);

  // Filters
  const [selectedClass, setSelectedClass] = useState('9-A sinf');
  const [selectedSubject, setSelectedSubject] = useState('Matematika');
  const [selectedDate, setSelectedDate] = useState('2026-08-15');
  const [assessmentType, setAssessmentType] = useState('Barchasi');

  // Filter students by selected class
  const classStudents = students.filter(s => s.classGroup === selectedClass);

  // Calculate subject-specific statistics for the top cards
  const getSubjectStats = () => {
    let sum = 0;
    let count = 0;
    let aclassCount = 0; // >= 4.5
    let dangerCount = 0; // < 3.0

    classStudents.forEach(student => {
      const avg = calculateStudentAvg(student, selectedSubject);
      if (avg > 0) {
        sum += avg;
        count++;
        if (avg >= 4.5) aclassCount++;
        else if (avg < 3.0) dangerCount++;
      }
    });

    const avgSubjectGrade = count > 0 ? parseFloat((sum / count).toFixed(1)) : 0;
    
    return {
      average: avgSubjectGrade,
      evaluated: count,
      excellent: aclassCount,
      danger: dangerCount
    };
  };

  const stats = getSubjectStats();

  // Handle grade input change with instant toast notification
  const handleGradeChange = (studentId, gradeType, val) => {
    updateStudentGrade(studentId, selectedSubject, gradeType, val);
  };

  const handleSave = () => {
    saveAllGrades(`Baholar (${selectedClass}, ${selectedSubject}) muvaffaqiyatli saqlandi.`);
  };

  return (
    <div className="space-y-6">
      
      {/* Subject-specific overview cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Fan bo'yicha o'rtacha baho */}
        <div className="bg-white border border-slate-100 p-5 rounded-2xl sm:rounded-3xl shadow-xs flex items-center justify-between">
          <div className="space-y-1.5">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Fan bo‘yicha o‘rtacha baho</p>
            <div className="flex items-baseline space-x-2">
              <h4 className="text-2xl sm:text-3xl font-black text-blue-600">
                {stats.average > 0 ? stats.average : 0}
              </h4>
              {stats.average > 0 && (
                <div className="flex items-center text-amber-400 gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      className={`w-3.5 h-3.5 ${
                        star <= Math.round(stats.average) ? 'fill-amber-400 text-amber-400' : 'text-slate-200 fill-slate-100'
                      }`} 
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="p-3 bg-amber-50 text-amber-500 rounded-2xl border border-amber-100/80">
            <Star className="w-5 h-5 fill-amber-400" />
          </div>
        </div>

        <div className="bg-white border border-slate-100 p-5 rounded-2xl sm:rounded-3xl shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Baholangan o‘quvchilar</p>
            <h4 className="text-2xl sm:text-3xl font-black text-slate-800">{stats.evaluated} ta o‘quvchi</h4>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100/80">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-100 p-5 rounded-2xl sm:rounded-3xl shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">A’lochi o‘quvchilar</p>
            <h4 className="text-2xl sm:text-3xl font-black text-emerald-600">{stats.excellent} ta o‘quvchi</h4>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100/80">
            <Award className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-100 p-5 rounded-2xl sm:rounded-3xl shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Kam o‘zlashtirayotganlar</p>
            <h4 className="text-2xl sm:text-3xl font-black text-rose-500">{stats.danger} ta o‘quvchi</h4>
          </div>
          <div className="p-3 bg-rose-50 text-rose-500 rounded-2xl border border-rose-100/80">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* Main Table Container */}
      <div className="bg-white border border-slate-100 rounded-3xl p-4 sm:p-6 shadow-sm space-y-6">
        
        {/* Filters Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Sinf/Guruh</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500 shadow-xs cursor-pointer"
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
              className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500 shadow-xs cursor-pointer"
            >
              {SUBJECTS.map((sub) => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Sana</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500 shadow-xs cursor-pointer"
            >
            </input>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Baholash turi</label>
            <select
              value={assessmentType}
              onChange={(e) => setAssessmentType(e.target.value)}
              className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500 shadow-xs cursor-pointer"
            >
              <option value="Barchasi">Barcha turlari</option>
              <option value="homework">Uy vazifasi (Homework)</option>
              <option value="exam">Nazorat ishi (Exam)</option>
              <option value="activity">Darsdagi faollik (Activity)</option>
              <option value="final">Yakuniy imtihon (Final)</option>
            </select>
          </div>
        </div>

        {/* Grades Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[750px]">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-xs font-bold uppercase select-none">
                <th className="py-3 px-3 text-center w-12">№</th>
                <th className="py-3 px-4">O‘quvchi</th>
                <th className="py-3 px-4">Fan</th>
                <th className="py-3 px-4 text-center">Uy vazifasi</th>
                <th className="py-3 px-4 text-center">Nazorat ishi</th>
                <th className="py-3 px-4 text-center">Darsdagi faollik</th>
                <th className="py-3 px-4 text-center">Yakuniy imtihon</th>
                <th className="py-3 px-4 text-center w-28">O‘rtacha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-xs">
              {classStudents.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-4 py-12 text-center text-slate-400 font-semibold text-sm">
                    Bu sinfda hech qanday o‘quvchi yo‘q.
                  </td>
                </tr>
              ) : (
                classStudents.map((student, idx) => {
                  const sGrades = (student.grades && student.grades[selectedSubject]) || { homework: null, exam: null, activity: null, final: null };
                  const avg = calculateStudentAvg(student, selectedSubject);

                  return (
                    <tr key={student.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-3 text-center text-xs font-bold text-slate-400">{idx + 1}</td>
                      <td className="py-4 px-4 font-bold text-slate-800 text-sm">
                        {student.surname} {student.name}
                      </td>
                      <td className="py-4 px-4 text-xs font-semibold text-slate-500">{selectedSubject}</td>
                      
                      {/* Uy vazifasi 1-Tap Grade Picker */}
                      <td className="py-4 px-3 text-center">
                        <GradePicker
                          value={sGrades.homework}
                          onChange={(val) => handleGradeChange(student.id, 'homework', val)}
                          disabled={assessmentType !== 'Barchasi' && assessmentType !== 'homework'}
                        />
                      </td>

                      {/* Nazorat ishi 1-Tap Grade Picker */}
                      <td className="py-4 px-3 text-center">
                        <GradePicker
                          value={sGrades.exam}
                          onChange={(val) => handleGradeChange(student.id, 'exam', val)}
                          disabled={assessmentType !== 'Barchasi' && assessmentType !== 'exam'}
                        />
                      </td>

                      {/* Darsdagi faollik 1-Tap Grade Picker */}
                      <td className="py-4 px-3 text-center">
                        <GradePicker
                          value={sGrades.activity}
                          onChange={(val) => handleGradeChange(student.id, 'activity', val)}
                          disabled={assessmentType !== 'Barchasi' && assessmentType !== 'activity'}
                        />
                      </td>

                      {/* Yakuniy imtihon 1-Tap Grade Picker */}
                      <td className="py-4 px-3 text-center">
                        <GradePicker
                          value={sGrades.final}
                          onChange={(val) => handleGradeChange(student.id, 'final', val)}
                          disabled={assessmentType !== 'Barchasi' && assessmentType !== 'final'}
                        />
                      </td>

                      {/* O'rtacha baho with Star Pill */}
                      <td className="py-4 px-4 text-center">
                        {avg > 0 ? (
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black border shadow-xs ${
                            avg >= 4.5 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            avg >= 3.5 ? 'bg-blue-50 text-blue-700 border-blue-200' :
                            avg >= 3.0 ? 'bg-amber-50 text-amber-700 border-amber-200' :
                            'bg-rose-50 text-rose-700 border-rose-200'
                          }`}>
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span>{avg}</span>
                          </span>
                        ) : (
                          <span className="text-slate-300 font-bold">0</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Save Button Bar */}
        {classStudents.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
            <div className="text-xs text-slate-400 font-medium">
              Baholar real vaqtda avtomatik saqlanadi va Supabase bulut bazasi bilan sinxronlashadi.
            </div>
            <button
              onClick={handleSave}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-blue-600/20 transition-all cursor-pointer transform active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>Barcha baholarni saqlash (Supabase)</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default Grades;
