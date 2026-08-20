import React, { useContext, useState } from 'react';
import { DataContext, CLASSES, SUBJECTS } from '../context/DataContext';
import ProgressBar from '../components/ui/ProgressBar';
import { 
  CheckSquare, 
  Square, 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Edit3, 
  Trash2, 
  Tag, 
  X, 
  Sparkles,
  ListTodo,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

export const Tasks = () => {
  const { tasks, addTask, updateTask, deleteTask, toggleTaskCompletion } = useContext(DataContext);

  // Filters & State
  const [activeTab, setActiveTab] = useState('Barchasi'); // Barchasi, Kutilmoqda, Bajarildi
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState('Barchasi');
  const [filterCategory, setFilterCategory] = useState('Barchasi');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deletingTaskItem, setDeletingTaskItem] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '9-A sinf',
    priority: 'O‘rta',
    dueDate: new Date().toISOString().split('T')[0]
  });

  // Dynamic Statistics
  const totalTasksCount = tasks.length;
  const completedTasksCount = tasks.filter(t => t.completed).length;
  const pendingTasksCount = totalTasksCount - completedTasksCount;
  const highPriorityCount = tasks.filter(t => t.priority === 'Yuqori' && !t.completed).length;
  const completionRate = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

  // Filtered Tasks
  const filteredTasks = tasks.filter(task => {
    // Tab filter
    if (activeTab === 'Kutilmoqda' && task.completed) return false;
    if (activeTab === 'Bajarildi' && !task.completed) return false;

    // Search query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchTitle = task.title.toLowerCase().includes(q);
      const matchDesc = task.description.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc) return false;
    }

    // Priority filter
    if (filterPriority !== 'Barchasi' && task.priority !== filterPriority) return false;

    // Category filter
    if (filterCategory !== 'Barchasi' && task.category !== filterCategory) return false;

    return true;
  });

  const handleOpenAddModal = () => {
    setEditingTask(null);
    setFormData({
      title: '',
      description: '',
      category: '9-A sinf',
      priority: 'O‘rta',
      dueDate: new Date().toISOString().split('T')[0]
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      category: task.category || 'Umumiy',
      priority: task.priority || 'O‘rta',
      dueDate: task.dueDate || new Date().toISOString().split('T')[0]
    });
    setIsModalOpen(true);
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    if (editingTask) {
      updateTask(editingTask.id, formData);
    } else {
      addTask(formData);
    }
    setIsModalOpen(false);
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'Yuqori':
        return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'O‘rta':
        return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'Past':
        return 'bg-blue-50 text-blue-600 border-blue-100';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header & Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center space-x-3">
            <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-md shadow-blue-500/20">
              <ListTodo className="w-6 h-6" />
            </div>
            <span>Vazifalar Rejasi (To-Do List)</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Kunlik darslar, sinf tadbirlari hamda maktab topshiriqlarini qulay boshqaring
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center space-x-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md shadow-blue-500/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Yangi Vazifa Qo‘shish</span>
        </button>
      </div>

      {/* Dynamic Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Jami Vazifalar</p>
            <h4 className="text-2xl font-bold text-slate-800">{totalTasksCount} ta</h4>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <ListTodo className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div className="space-y-1 w-full mr-3">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Bajarilganlik ko‘rsatkichi</p>
              <span className="text-xs font-bold text-emerald-600">{completionRate}%</span>
            </div>
            <div className="pt-2">
              <ProgressBar progress={completionRate} color="emerald" height="h-2" />
            </div>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Kutilayotgan Rejalar</p>
            <h4 className="text-2xl font-bold text-amber-600">{pendingTasksCount} ta</h4>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Yuqori Muhimlikdagi</p>
            <h4 className="text-2xl font-bold text-rose-600">{highPriorityCount} ta</h4>
          </div>
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* Main Container: Controls & List */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 sm:p-6 shadow-sm space-y-6">
        
        {/* Controls Header: Tabs, Search & Select Filters */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 border-b border-slate-100 pb-5">
          
          {/* Status Tabs */}
          <div className="inline-flex p-1 bg-slate-100/80 rounded-2xl space-x-1 border border-slate-200/20 w-full sm:w-auto">
            {['Barchasi', 'Kutilmoqda', 'Bajarildi'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === tab
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab}
                {tab === 'Barchasi' && ` (${totalTasksCount})`}
                {tab === 'Kutilmoqda' && ` (${pendingTasksCount})`}
                {tab === 'Bajarildi' && ` (${completedTasksCount})`}
              </button>
            ))}
          </div>

          {/* Search & Dropdown Filters */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            
            {/* Search bar */}
            <div className="relative w-full sm:w-60">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Vazifalarni qidirish..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 font-semibold"
              />
            </div>

            {/* Category filter */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full sm:w-auto p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500"
            >
              <option value="Barchasi">Barcha kategoriyalar</option>
              <option value="9-A sinf">9-A sinf</option>
              <option value="9-B sinf">9-B sinf</option>
              <option value="10-A sinf">10-A sinf</option>
              <option value="10-B sinf">10-B sinf</option>
              <option value="Maktab ma’muriyati">Maktab ma’muriyati</option>
              <option value="Davomat">Davomat</option>
              <option value="Shaxsiy">Shaxsiy</option>
            </select>

            {/* Priority filter */}
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="w-full sm:w-auto p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500"
            >
              <option value="Barchasi">Barcha muhimlik</option>
              <option value="Yuqori">Yuqori</option>
              <option value="O‘rta">O‘rta</option>
              <option value="Past">Past</option>
            </select>

          </div>

        </div>

        {/* Tasks List */}
        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-400">
                <Sparkles className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-slate-700">Hozircha vazifalar mavjud emas</h4>
              <p className="text-xs text-slate-400 font-medium max-w-sm mx-auto">
                Kunlik shaxsiy rejalaringizni rejalashtirish uchun yangi vazifa qo‘shing.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleOpenAddModal}
                  className="inline-flex items-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Yangi Vazifa Qo‘shish</span>
                </button>
              </div>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  task.completed
                    ? 'bg-slate-50/60 border-slate-100 opacity-75'
                    : 'bg-white border-slate-100 hover:border-slate-200 hover:shadow-md'
                }`}
              >
                {/* Left Section: Checkbox & Task info */}
                <div className="flex items-start space-x-3.5 flex-1 min-w-0">
                  <button
                    onClick={() => toggleTaskCompletion(task.id)}
                    className="mt-0.5 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer shrink-0"
                  >
                    {task.completed ? (
                      <CheckSquare className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-300 hover:text-blue-500" />
                    )}
                  </button>

                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center space-x-2.5 flex-wrap gap-y-1">
                      <h4 className={`text-sm font-bold text-slate-800 leading-tight ${task.completed ? 'line-through text-slate-400' : ''}`}>
                        {task.title}
                      </h4>

                      {/* Priority Tag */}
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${getPriorityBadge(task.priority)}`}>
                        {task.priority}
                      </span>

                      {/* Category Tag */}
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200/50">
                        {task.category}
                      </span>
                    </div>

                    {task.description && (
                      <p className={`text-xs font-medium text-slate-500 line-clamp-2 ${task.completed ? 'line-through text-slate-300' : ''}`}>
                        {task.description}
                      </p>
                    )}

                    <div className="flex items-center space-x-4 text-[11px] text-slate-400 font-semibold pt-1">
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Muddati: {task.dueDate}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Action buttons */}
                <div className="flex items-center space-x-2 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => handleOpenEditModal(task)}
                    className="p-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                    title="Tahrirlash"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeletingTaskItem(task);
                    }}
                    className="p-2.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="O‘chirish"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>
            ))
          )}
        </div>

      </div>

      {/* Add / Edit Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-100 rounded-3xl w-full max-w-lg shadow-2xl p-6 sm:p-8 space-y-6 animate-slide-in-up">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-800">
                {editingTask ? 'Vazifani Tahrirlash' : 'Yangi Vazifa Yaratish'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">Vazifa Sarlavhasi *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Masalan: 9-A sinf nazorat ishini tekshirish"
                  required
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">Batafsil Izoh</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Vazifa haqida qo‘shimcha ma’lumotlar..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Kategoriya</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                  >
                    <option value="9-A sinf">9-A sinf</option>
                    <option value="9-B sinf">9-B sinf</option>
                    <option value="10-A sinf">10-A sinf</option>
                    <option value="10-B sinf">10-B sinf</option>
                    <option value="Maktab ma’muriyati">Maktab ma’muriyati</option>
                    <option value="Davomat">Davomat</option>
                    <option value="Shaxsiy">Shaxsiy</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Muhimlik</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                  >
                    <option value="Yuqori">Yuqori</option>
                    <option value="O‘rta">O‘rta</option>
                    <option value="Past">Past</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Bajarish Muddati</label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold text-xs transition-colors cursor-pointer"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                >
                  {editingTask ? 'Saqlash' : 'Vazifani Yaratish'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      {deletingTaskItem && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-100 rounded-3xl w-full max-w-md shadow-2xl p-6 sm:p-8 space-y-6 animate-slide-in-up">
            <div className="flex items-center space-x-3 text-rose-600">
              <div className="p-3 bg-rose-50 rounded-2xl">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800">Vazifani o‘chirish</h3>
                <p className="text-xs text-slate-400 font-medium">Ushbu harakatni ortga qaytarib bo‘lmaydi</p>
              </div>
            </div>

            <p className="text-xs font-semibold text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
              "<span className="text-slate-800 font-bold">{deletingTaskItem.title}</span>" vazifasini rostdan ham o‘chirmoqchimisiz?
            </p>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingTaskItem(null)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold text-xs transition-colors cursor-pointer"
              >
                Bekor qilish
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteTask(deletingTaskItem.id);
                  setDeletingTaskItem(null);
                }}
                className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs shadow-md shadow-rose-500/20 transition-all cursor-pointer"
              >
                O‘chirish
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
export default Tasks;
