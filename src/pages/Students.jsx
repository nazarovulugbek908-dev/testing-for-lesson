import React, { useContext, useState, useRef, useEffect } from 'react';
import { DataContext, CLASSES } from '../context/DataContext';
import { 
  Search, 
  Plus, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  MoreVertical, 
  X, 
  Mail, 
  Phone, 
  MapPin, 
  User, 
  Calendar,
  AlertTriangle,
  UserPlus,
  Grid
} from 'lucide-react';
import ProgressBar from '../components/ui/ProgressBar';
import StatusBadge from '../components/ui/StatusBadge';
import Pagination from '../components/ui/Pagination';

export const Students = () => {
  const { 
    students, 
    addStudent, 
    updateStudent, 
    deleteStudent,
    calculateStudentAvg, 
    calculateStudentAttendanceRate, 
    getStudentStatus,
    showToast
  } = useContext(DataContext);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterClass, setFilterClass] = useState('Barchasi');
  const [filterStatus, setFilterStatus] = useState('Barchasi');
  const [filterAttendance, setFilterAttendance] = useState('Barchasi');
  const [filterGrades, setFilterGrades] = useState('Barchasi');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal / Detail Panel State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  
  // Table action dropdown
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownRef = useRef(null);

  // Form inputs state
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    birthDate: '',
    phone: '',
    classGroup: '9-A sinf',
    parentName: '',
    parentPhone: '',
    address: '',
    avatar: ''
  });

  // Handle outside dropdown click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sync edit form when selected student changes
  useEffect(() => {
    if (selectedStudent && isEditOpen) {
      setFormData({
        name: selectedStudent.name || '',
        surname: selectedStudent.surname || '',
        birthDate: selectedStudent.birthDate || '',
        phone: selectedStudent.phone || '',
        classGroup: selectedStudent.classGroup || '9-A sinf',
        parentName: selectedStudent.parentName || '',
        parentPhone: selectedStudent.parentPhone || '',
        address: selectedStudent.address || '',
        avatar: selectedStudent.avatar || ''
      });
    }
  }, [selectedStudent, isEditOpen]);

  // Reset form helper
  const resetForm = () => {
    setFormData({
      name: '',
      surname: '',
      birthDate: '',
      phone: '',
      classGroup: '9-A sinf',
      parentName: '',
      parentPhone: '',
      address: '',
      avatar: ''
    });
  };

  // 1. Get filtered list of students
  const filteredStudents = students.filter((student) => {
    // Search filter
    const fullName = `${student.name} ${student.surname}`.toLowerCase();
    const searchMatch = fullName.includes(searchQuery.toLowerCase());

    // Class filter
    const classMatch = filterClass === 'Barchasi' || student.classGroup === filterClass;

    // Status filter
    const statusMatch = filterStatus === 'Barchasi' || getStudentStatus(student) === filterStatus;

    // Attendance filter
    const attRate = calculateStudentAttendanceRate(student);
    let attMatch = true;
    if (filterAttendance === 'past') attMatch = attRate < 60; // <60%
    else if (filterAttendance === 'orta') attMatch = attRate >= 60 && attRate < 80; // 60-80%
    else if (filterAttendance === 'yuqori') attMatch = attRate >= 80; // >=80%

    // Grades filter
    const avgGrade = calculateStudentAvg(student);
    let gradeMatch = true;
    if (filterGrades === 'past') gradeMatch = avgGrade > 0 && avgGrade < 3.0;
    else if (filterGrades === 'orta') gradeMatch = avgGrade >= 3.0 && avgGrade < 4.0;
    else if (filterGrades === 'yuqori') gradeMatch = avgGrade >= 4.0;

    return searchMatch && classMatch && statusMatch && attMatch && gradeMatch;
  });

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterClass, filterStatus, filterAttendance, filterGrades]);

  // 2. Pagination Calculations
  const totalItems = filteredStudents.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredStudents.slice(indexOfFirstItem, indexOfLastItem);

  // 3. Status summary statistics for top cards
  const totalCount = students.length;
  const activeCount = students.filter(s => getStudentStatus(s) === 'Faol').length;
  const warningCount = students.filter(s => getStudentStatus(s) === 'Ogohlantirish').length;
  const dangerCount = students.filter(s => getStudentStatus(s) === 'Xavfli').length;
  const classesCount = new Set(students.map(s => s.classGroup)).size;

  // Form Submission handlers
  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.surname) {
      showToast("Ism va Familiya majburiy!", "error");
      return;
    }
    addStudent(formData);
    setIsAddOpen(false);
    resetForm();
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.surname) {
      showToast("Ism va Familiya majburiy!", "error");
      return;
    }
    updateStudent(selectedStudent.id, formData);
    setIsEditOpen(false);
    setSelectedStudent(prev => ({ ...prev, ...formData })); // Update visual detail panel if open
  };

  const handleDeleteSubmit = () => {
    deleteStudent(selectedStudent.id);
    setIsDeleteOpen(false);
    setIsDetailOpen(false);
    setSelectedStudent(null);
  };

  // Color helper for Average Grade value
  const getGradeColorClass = (val) => {
    if (!val || val === 0) return 'text-slate-400';
    if (val >= 4.0) return 'text-emerald-600 bg-emerald-50';
    if (val >= 3.0) return 'text-amber-600 bg-amber-50';
    return 'text-rose-600 bg-rose-50';
  };

  return (
    <div className="space-y-6 relative min-h-[calc(100vh-120px)]">
      
      {/* Top statistics summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Jami O‘quvchilar</p>
            <h4 className="text-2xl font-bold text-slate-800 mt-1">{totalCount} ta</h4>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <User className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Faol O‘quvchilar</p>
            <h4 className="text-2xl font-bold text-emerald-600 mt-1">{activeCount} ta</h4>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <User className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Muammoli / Nofaol</p>
            <h4 className="text-2xl font-bold text-rose-500 mt-1">{warningCount + dangerCount} ta</h4>
          </div>
          <div className="p-3 bg-rose-50 text-rose-500 rounded-xl">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Sinflar soni</p>
            <h4 className="text-2xl font-bold text-purple-600 mt-1">{classesCount} ta guruh</h4>
          </div>
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <Grid className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search & Filters row */}
      <div className="bg-white border border-slate-100 p-4 sm:p-5 rounded-3xl shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search box */}
          <div className="relative w-full md:max-w-xs">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="w-4 h-4 text-slate-400" />
            </span>
            <input
              type="text"
              placeholder="O‘quvchi ismini qidiring..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400 text-slate-700 font-medium"
            />
          </div>

          {/* Add student button */}
          <button
            onClick={() => { resetForm(); setIsAddOpen(true); }}
            className="w-full md:w-auto flex items-center justify-center space-x-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 shadow-md shadow-blue-500/10 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ O‘quvchi qo‘shish</span>
          </button>
        </div>

        {/* Multi-Filters Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-slate-50">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Sinf/Guruh</label>
            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200/60 rounded-xl text-xs font-semibold text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500"
            >
              <option value="Barchasi">Barcha sinflar</option>
              {CLASSES.map((cls) => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Holati (Status)</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200/60 rounded-xl text-xs font-semibold text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500"
            >
              <option value="Barchasi">Barcha holatlar</option>
              <option value="Faol">Faol</option>
              <option value="Ogohlantirish">Ogohlantirish</option>
              <option value="Xavfli">Xavfli</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Davomat (Faollik)</label>
            <select
              value={filterAttendance}
              onChange={(e) => setFilterAttendance(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200/60 rounded-xl text-xs font-semibold text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500"
            >
              <option value="Barchasi">Barcha davomat</option>
              <option value="yuqori">Yaxshi (&gt;= 80%)</option>
              <option value="orta">O‘rta (60% - 80%)</option>
              <option value="past">Past (&lt; 60%)</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Baholar</label>
            <select
              value={filterGrades}
              onChange={(e) => setFilterGrades(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200/60 rounded-xl text-xs font-semibold text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500"
            >
              <option value="Barchasi">Barcha baholar</option>
              <option value="yuqori">A’lo (&gt;= 4.0)</option>
              <option value="orta">Qoniqarli (3.0 - 4.0)</option>
              <option value="past">Past (&lt; 3.0)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Students Data Table Card */}
      <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-400 text-xs font-bold uppercase select-none">
                <th className="px-6 py-4 text-center w-12">№</th>
                <th className="px-6 py-4">O‘quvchi</th>
                <th className="px-6 py-4">Sinf/Guruh</th>
                <th className="px-6 py-4">Telefon raqami</th>
                <th className="px-6 py-4 w-44">Davomat (%)</th>
                <th className="px-6 py-4 text-center">O‘rtacha baho</th>
                <th className="px-6 py-4 text-center">Holat</th>
                <th className="px-6 py-4 text-center w-24">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-slate-400">
                    <User className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p className="font-semibold text-sm">O‘quvchi topilmadi.</p>
                  </td>
                </tr>
              ) : (
                currentItems.map((student, idx) => {
                  const itemIndex = indexOfFirstItem + idx + 1;
                  const attRate = calculateStudentAttendanceRate(student);
                  const avgGrade = calculateStudentAvg(student);
                  const status = getStudentStatus(student);

                  return (
                    <tr 
                      key={student.id} 
                      className="hover:bg-slate-50/40 transition-colors group"
                    >
                      <td className="px-6 py-3.5 text-center text-xs font-bold text-slate-400">{itemIndex}</td>
                      <td className="px-6 py-3.5">
                        <div className="flex items-center space-x-3">
                          <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0 select-none">
                            {student.name[0]}{student.surname[0]}
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                              {student.surname} {student.name}
                            </h4>
                            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{student.birthDate}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3.5">
                        <span className="text-xs font-semibold text-slate-600">{student.classGroup}</span>
                      </td>
                      <td className="px-6 py-3.5">
                        <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">{student.phone || '—'}</span>
                      </td>
                      <td className="px-6 py-3.5">
                        <ProgressBar value={attRate} showText={true} size="sm" />
                      </td>
                      <td className="px-6 py-3.5 text-center">
                        <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold ${getGradeColorClass(avgGrade)}`}>
                          {avgGrade > 0 ? avgGrade : 0}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-center">
                        <StatusBadge status={status} />
                      </td>
                      <td className="px-6 py-3.5 text-center relative" ref={dropdownRef}>
                        <div className="flex items-center justify-center space-x-1.5">
                          <button
                            onClick={() => { setSelectedStudent(student); setIsDetailOpen(true); }}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            title="Ko‘rish"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => { setSelectedStudent(student); setIsEditOpen(true); }}
                            className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                            title="Tahrirlash"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          {/* Dropdown toggle button */}
                          <div className="relative">
                            <button
                              onClick={() => setActiveDropdown(activeDropdown === student.id ? null : student.id)}
                              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>

                            {activeDropdown === student.id && (
                              <div className="absolute right-0 mt-1 w-28 bg-white border border-slate-100 rounded-xl shadow-lg p-1 z-30 animate-slide-in-up">
                                <button
                                  onClick={() => {
                                    setSelectedStudent(student);
                                    setIsDeleteOpen(true);
                                    setActiveDropdown(null);
                                  }}
                                  className="w-full flex items-center space-x-2 px-2.5 py-1.5 text-left text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>O‘chirish</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination element */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
        />
      </div>

      {/* RIGHT SIDE DETAILS SLIDER PANEL */}
      {isDetailOpen && selectedStudent && (
        <>
          {/* Slider backdrop */}
          <div 
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 transition-opacity"
            onClick={() => setIsDetailOpen(false)}
          />
          {/* Slider content container */}
          <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-white shadow-2xl flex flex-col justify-between animate-slide-in-right border-l border-slate-100">
            {/* Slider Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0">
              <h3 className="font-bold text-slate-800 text-base">O‘quvchi Ma’lumoti</h3>
              <button
                onClick={() => setIsDetailOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:bg-slate-50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Slider Main Details Area */}
            <div className="p-6 flex-1 overflow-y-auto space-y-6">
              {/* Profile Card Summary */}
              <div className="flex flex-col items-center text-center p-6 bg-slate-50/50 rounded-3xl border border-slate-100/50">
                <div className="w-20 h-20 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-2xl border-4 border-white shadow-sm select-none">
                  {selectedStudent.name[0]}{selectedStudent.surname[0]}
                </div>
                <h2 className="text-lg font-bold text-slate-800 mt-4 leading-tight">
                  {selectedStudent.surname} {selectedStudent.name}
                </h2>
                <div className="mt-2.5">
                  <StatusBadge status={getStudentStatus(selectedStudent)} />
                </div>
              </div>

              {/* Statistics Rates */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white border border-slate-100 rounded-2xl text-center space-y-1 shadow-sm">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Davomat Ko‘rsatkichi</p>
                  <p className="text-xl font-bold text-blue-600">{calculateStudentAttendanceRate(selectedStudent)}%</p>
                </div>
                <div className="p-4 bg-white border border-slate-100 rounded-2xl text-center space-y-1 shadow-sm">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">O‘rtacha Bahosi</p>
                  <p className="text-xl font-bold text-amber-500">{calculateStudentAvg(selectedStudent) || '—'}</p>
                </div>
              </div>

              {/* Details List */}
              <div className="space-y-4 pt-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Batafsil Ma’lumotlar</h4>
                
                <div className="space-y-3.5">
                  <div className="flex items-start space-x-3 text-sm">
                    <Grid className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-slate-400 text-xs font-semibold">Sinf / Guruh</p>
                      <p className="font-semibold text-slate-700 mt-0.5">{selectedStudent.classGroup}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 text-sm">
                    <Calendar className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-slate-400 text-xs font-semibold">Tug‘ilgan sana</p>
                      <p className="font-semibold text-slate-700 mt-0.5">{selectedStudent.birthDate || '—'}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 text-sm">
                    <Phone className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-slate-400 text-xs font-semibold">Telefon raqami</p>
                      <p className="font-semibold text-slate-700 mt-0.5">{selectedStudent.phone || '—'}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 text-sm">
                    <UserPlus className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-slate-400 text-xs font-semibold">Ota-ona ismi</p>
                      <p className="font-semibold text-slate-700 mt-0.5">{selectedStudent.parentName || '—'}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 text-sm">
                    <Phone className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-slate-400 text-xs font-semibold">Ota-ona telefoni</p>
                      <p className="font-semibold text-slate-700 mt-0.5">{selectedStudent.parentPhone || '—'}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 text-sm">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-slate-400 text-xs font-semibold">Yashash manzili</p>
                      <p className="font-semibold text-slate-700 mt-0.5 leading-normal">{selectedStudent.address || '—'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Slider Quick Actions Footer */}
            <div className="p-6 border-t border-slate-100 bg-slate-50 shrink-0 space-y-2.5">
              <button
                onClick={() => {
                  setIsDetailOpen(false);
                  showToast(`${selectedStudent.parentName}ga xabar yuborish rejimiga o'tildi.`, 'info');
                }}
                className="w-full flex items-center justify-center space-x-2 py-3 bg-white border border-slate-200 hover:border-blue-500 hover:text-blue-600 rounded-xl text-xs font-bold text-slate-600 shadow-sm transition-all"
              >
                <Mail className="w-4 h-4" />
                <span>Ota-onaga xabar yuborish</span>
              </button>
              
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => { setIsEditOpen(true); }}
                  className="w-full py-3 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all text-center"
                >
                  Tahrirlash
                </button>
                <button
                  onClick={() => { setIsDeleteOpen(true); }}
                  className="w-full py-3 bg-rose-50 text-rose-600 rounded-xl text-xs font-bold hover:bg-rose-100 transition-all text-center"
                >
                  O‘chirish
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ADD STUDENT MODAL */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsAddOpen(false)} />
          
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-2xl bg-white border border-slate-100 rounded-3xl shadow-2xl p-6 sm:p-8 animate-slide-in-up">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h3 className="font-bold text-slate-800 text-lg">Yangi o‘quvchi qo‘shish</h3>
                <button onClick={() => setIsAddOpen(false)} className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddSubmit} className="space-y-5 pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1.5">Ism *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Ismni kiriting"
                      className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1.5">Familiya *</label>
                    <input
                      type="text"
                      required
                      value={formData.surname}
                      onChange={(e) => setFormData({...formData, surname: e.target.value})}
                      placeholder="Familiyani kiriting"
                      className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1.5">Sinf / Guruh</label>
                    <select
                      value={formData.classGroup}
                      onChange={(e) => setFormData({...formData, classGroup: e.target.value})}
                      className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 font-semibold bg-white"
                    >
                      {CLASSES.map((cls) => (
                        <option key={cls} value={cls}>{cls}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1.5">Tug‘ilgan sana</label>
                    <input
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                      className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1.5">Telefon raqam</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="+998 90 123-45-67"
                      className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1.5">Manzil</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      placeholder="Toshkent sh., Chilonzor"
                      className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-50 pt-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1.5">Ota-ona ismi</label>
                    <input
                      type="text"
                      value={formData.parentName}
                      onChange={(e) => setFormData({...formData, parentName: e.target.value})}
                      placeholder="Ota yoki onasining ismi"
                      className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1.5">Ota-ona telefoni</label>
                    <input
                      type="tel"
                      value={formData.parentPhone}
                      onChange={(e) => setFormData({...formData, parentPhone: e.target.value})}
                      placeholder="+998 90 987-65-43"
                      className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 font-medium"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-3 pt-6 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsAddOpen(false)}
                    className="px-5 py-2.5 border border-slate-200 hover:bg-slate-50 rounded-xl font-bold text-sm text-slate-600 transition-colors"
                  >
                    Bekor qilish
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md shadow-blue-500/10 transition-colors"
                  >
                    Saqlash
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* EDIT STUDENT MODAL */}
      {isEditOpen && selectedStudent && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsEditOpen(false)} />
          
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-2xl bg-white border border-slate-100 rounded-3xl shadow-2xl p-6 sm:p-8 animate-slide-in-up">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h3 className="font-bold text-slate-800 text-lg">O‘quvchi ma’lumotlarini tahrirlash</h3>
                <button onClick={() => setIsEditOpen(false)} className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="space-y-5 pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1.5">Ism *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Ismni kiriting"
                      className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1.5">Familiya *</label>
                    <input
                      type="text"
                      required
                      value={formData.surname}
                      onChange={(e) => setFormData({...formData, surname: e.target.value})}
                      placeholder="Familiyani kiriting"
                      className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1.5">Sinf / Guruh</label>
                    <select
                      value={formData.classGroup}
                      onChange={(e) => setFormData({...formData, classGroup: e.target.value})}
                      className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 font-semibold bg-white"
                    >
                      {CLASSES.map((cls) => (
                        <option key={cls} value={cls}>{cls}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1.5">Tug‘ilgan sana</label>
                    <input
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                      className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1.5">Telefon raqam</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="+998 90 123-45-67"
                      className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1.5">Manzil</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      placeholder="Toshkent sh., Chilonzor"
                      className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-50 pt-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1.5">Ota-ona ismi</label>
                    <input
                      type="text"
                      value={formData.parentName}
                      onChange={(e) => setFormData({...formData, parentName: e.target.value})}
                      placeholder="Ota yoki onasining ismi"
                      className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1.5">Ota-ona telefoni</label>
                    <input
                      type="tel"
                      value={formData.parentPhone}
                      onChange={(e) => setFormData({...formData, parentPhone: e.target.value})}
                      placeholder="+998 90 987-65-43"
                      className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 font-medium"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-3 pt-6 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsEditOpen(false)}
                    className="px-5 py-2.5 border border-slate-200 hover:bg-slate-50 rounded-xl font-bold text-sm text-slate-600 transition-colors"
                  >
                    Bekor qilish
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md shadow-blue-500/10 transition-colors"
                  >
                    O‘zgartirishni saqlash
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {isDeleteOpen && selectedStudent && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsDeleteOpen(false)} />
          
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-md bg-white border border-slate-100 rounded-3xl shadow-2xl p-6 text-center animate-slide-in-up">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600 mb-4 border border-rose-100">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-2">O‘quvchini o‘chirishni xohlaysizmi?</h3>
              <p className="text-xs font-semibold text-slate-400 leading-relaxed px-4">
                Siz haqiqatan ham <span className="text-slate-700 font-bold">{selectedStudent.name} {selectedStudent.surname}</span>ni ro‘yxatdan o‘chirib tashlamoqchimisiz? Bu amalni bekor qilib bo‘lmaydi.
              </p>

              <div className="flex items-center justify-center space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsDeleteOpen(false)}
                  className="px-5 py-2.5 border border-slate-200 hover:bg-slate-50 rounded-xl font-bold text-xs text-slate-500 transition-colors"
                >
                  Bekor qilish
                </button>
                <button
                  type="button"
                  onClick={handleDeleteSubmit}
                  className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs shadow-md shadow-rose-500/10 transition-colors"
                >
                  O‘chirish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
export default Students;
