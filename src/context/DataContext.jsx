import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../lib/supabaseClient';
import { AuthContext } from './AuthContext';

export const DataContext = createContext();

// Subjects list
export const SUBJECTS = [
  'Matematika',
  'Fizika',
  'Informatika',
  'Ingliz tili',
  'Ona tili',
  'Tarix'
];

// Classes list
export const CLASSES = [
  '9-A sinf',
  '9-B sinf',
  '10-A sinf',
  '10-B sinf',
  '11-A sinf',
  '11-B sinf'
];

// Helper to generate Uzbek names
const UZBEK_BOY_NAMES = ['Asadbek', 'Behruz', 'Bobur', 'Sarvar', 'Jahongir', 'Jasur', 'Davron', 'Sherzod', 'Anvar', 'Sardor', 'Dilshod', 'Otabek', 'Farrux', 'Diyor', 'Rustam', 'Siroj', 'Umid'];
const UZBEK_GIRL_NAMES = ['Madina', 'Sevinch', 'Nozima', 'Dilnoza', 'Malika', 'Laylo', 'Nigora', 'Shahzoda', 'Gulnora', 'Rayhon', 'Zulfiya', 'Firuza', 'Guli', 'Lola', 'Shirin', 'Kamola'];
const UZBEK_SURNAMES = ['Aliyev', 'Abdullayev', 'Ergashev', 'Karimov', 'Toshpo‘latov', 'Ismoilov', 'Yusupov', 'Norqulov', 'Rustamov', 'Mamatov', 'Olimov', 'Tursunov', 'Xalilov', 'Hasanov', 'Solihov', 'Rahmatov', 'Qodirov'];

const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomPhone = (prefix) => {
  const codes = ['90', '91', '93', '94', '95', '97', '99', '88'];
  const code = getRandomElement(codes);
  const num1 = Math.floor(100 + Math.random() * 900);
  const num2 = Math.floor(10 + Math.random() * 90);
  const num3 = Math.floor(10 + Math.random() * 90);
  return `+998 ${code} ${num1}-${num2}-${num3}`;
};

const generateInitialData = () => {
  const list = [];
  
  // 1. The 10 core students required by the prompt
  const coreStudents = [
    {
      id: 'core-1',
      name: 'Asadbek',
      surname: 'Aliyev',
      birthDate: '2011-03-15',
      phone: '+998 90 123-45-67',
      classGroup: '9-A sinf',
      parentName: 'Aliyev Olim',
      parentPhone: '+998 93 321-65-43',
      address: 'Toshkent shahar, Chilonzor tumani, 9-kvartal, 15-uy',
      avatar: '',
      attendance: {},
      grades: {}
    },
    {
      id: 'core-2',
      name: 'Madina',
      surname: 'Abdullayeva',
      birthDate: '2011-07-22',
      phone: '+998 91 234-56-78',
      classGroup: '9-A sinf',
      parentName: 'Abdullayev Mansur',
      parentPhone: '+998 94 432-76-54',
      address: 'Toshkent shahar, Yunusobod tumani, 4-daha, 12-uy',
      avatar: '',
      attendance: {},
      grades: {}
    },
    {
      id: 'core-3',
      name: 'Behruz',
      surname: 'Ergashev',
      birthDate: '2011-11-05',
      phone: '+998 93 345-67-89',
      classGroup: '9-A sinf',
      parentName: 'Ergashev Ilhom',
      parentPhone: '+998 95 543-87-65',
      address: 'Toshkent shahar, Uchtepa tumani, 22-daha, 8-uy',
      avatar: '',
      attendance: {},
      grades: {}
    },
    {
      id: 'core-4',
      name: 'Sevinch',
      surname: 'Karimova',
      birthDate: '2011-05-18',
      phone: '+998 94 456-78-90',
      classGroup: '9-B sinf',
      parentName: 'Karimov Rustam',
      parentPhone: '+998 97 654-98-76',
      address: 'Toshkent shahar, Olmazor tumani, Qoraqamish 1/2, 45-uy',
      avatar: '',
      attendance: {},
      grades: {}
    },
    {
      id: 'core-5',
      name: 'Bobur',
      surname: 'Toshpo‘latov',
      birthDate: '2011-09-12',
      phone: '+998 95 567-89-01',
      classGroup: '9-B sinf',
      parentName: 'Toshpo‘latov Shuhrat',
      parentPhone: '+998 99 765-09-87',
      address: 'Toshkent shahar, Yakkasaroy tumani, Shota Rustaveli ko‘chasi, 2-uy',
      avatar: '',
      attendance: {},
      grades: {}
    },
    {
      id: 'core-6',
      name: 'Nozima',
      surname: 'Ismoilova',
      birthDate: '2010-01-25',
      phone: '+998 97 678-90-12',
      classGroup: '10-A sinf',
      parentName: 'Ismoilova Feruza',
      parentPhone: '+998 90 876-12-34',
      address: 'Toshkent shahar, Yashnobod tumani, Aviasozlar 2-daha, 9-uy',
      avatar: '',
      attendance: {},
      grades: {}
    },
    {
      id: 'core-7',
      name: 'Sarvar',
      surname: 'Yusupov',
      birthDate: '2010-04-10',
      phone: '+998 99 789-01-23',
      classGroup: '10-A sinf',
      parentName: 'Yusupov Akmal',
      parentPhone: '+998 91 987-23-45',
      address: 'Toshkent shahar, Sergeli tumani, 6-daha, 34-uy',
      avatar: '',
      attendance: {},
      grades: {}
    },
    {
      id: 'core-8',
      name: 'Dilnoza',
      surname: 'Norqulova',
      birthDate: '2010-08-30',
      phone: '+998 90 890-12-34',
      classGroup: '10-B sinf',
      parentName: 'Norqulov Dilshod',
      parentPhone: '+998 93 109-34-56',
      address: 'Toshkent shahar, Shayxontohur tumani, Labzak ko‘chasi, 18-uy',
      avatar: '',
      attendance: {},
      grades: {}
    },
    {
      id: 'core-9',
      name: 'Jahongir',
      surname: 'Rustamov',
      birthDate: '2010-12-14',
      phone: '+998 93 901-23-45',
      classGroup: '10-B sinf',
      parentName: 'Rustamov Jamshid',
      parentPhone: '+998 94 210-45-67',
      address: 'Toshkent shahar, Mirzo Ulug‘bek tumani, Qorasu 4, 7-uy',
      avatar: '',
      attendance: {},
      grades: {}
    },
    {
      id: 'core-10',
      name: 'Malika',
      surname: 'Mamatova',
      birthDate: '2010-02-05',
      phone: '+998 94 102-34-56',
      classGroup: '10-A sinf',
      parentName: 'Mamatov G‘ofur',
      parentPhone: '+998 95 321-56-78',
      address: 'Toshkent shahar, Bektemir tumani, Suvsoz mavzesi, 11-uy',
      avatar: '',
      attendance: {},
      grades: {}
    }
  ];

  list.push(...coreStudents);

  // 2. Generate 118 more students to reach exactly 128
  const remainingCount = 128 - coreStudents.length;
  for (let i = 1; i <= remainingCount; i++) {
    const isBoy = Math.random() > 0.5;
    const name = getRandomElement(isBoy ? UZBEK_BOY_NAMES : UZBEK_GIRL_NAMES);
    const surname = getRandomElement(UZBEK_SURNAMES) + (isBoy ? '' : 'a');
    const classGroup = getRandomElement(CLASSES);
    const birthYear = classGroup.startsWith('9') ? 2011 : classGroup.startsWith('10') ? 2010 : 2009;
    const birthMonth = String(Math.floor(1 + Math.random() * 12)).padStart(2, '0');
    const birthDay = String(Math.floor(1 + Math.random() * 28)).padStart(2, '0');
    
    list.push({
      id: `gen-${i}`,
      name,
      surname,
      birthDate: `${birthYear}-${birthMonth}-${birthDay}`,
      phone: getRandomPhone(),
      classGroup,
      parentName: `${surname} ${getRandomElement(UZBEK_BOY_NAMES)}`,
      parentPhone: getRandomPhone(),
      address: `Toshkent shahar, ${getRandomElement(['Chilonzor', 'Yunusobod', 'Mirzo Ulug‘bek', 'Olmazor', 'Uchtepa', 'Yashnobod', 'Sergeli'])} tumani`,
      avatar: '',
      attendance: {},
      grades: {}
    });
  }

  // 3. Seed mock grades and attendance for all students to match stats
  // We need:
  // - 120 active ("Faol"), 5 warned ("Ogohlantirish"), 3 danger ("Xavfli")
  // Let's seed core-6 (Nozima Ismoilova) as "Xavfli", core-4 (Sevinch Karimova) as "Ogohlantirish", core-3 (Behruz Ergashev) as "Ogohlantirish" or "Ogohlantirish" / "Xavfli".
  // Let's seed specifically:
  // Nozima Ismoilova (core-6) -> 40% attendance, average grade 2.8, status Xavfli.
  // Sevinch Karimova (core-4) -> 60% attendance, average grade 3.2, status Ogohlantirish.
  // Behruz Ergashev (core-3) -> 72% attendance, average grade 3.7, status Ogohlantirish.
  // Let's assign specific grades/attendance to match this.
  
  const todayStr = '2026-08-15';
  
  // Historical dates (5 school days before today)
  const historyDates = ['2026-08-10', '2026-08-11', '2026-08-12', '2026-08-13', '2026-08-14', todayStr];
  
  list.forEach((student) => {
    // Seed Grades
    SUBJECTS.forEach((subject) => {
      student.grades[subject] = {
        homework: null,
        exam: null,
        activity: null,
        final: null
      };
    });

    // Determine target profile
    let targetAvg = 4.3; // Default
    let targetAtt = 0.90; // Default (90% attendance)

    if (student.id === 'core-6') { // Nozima Ismoilova: Xavfli
      targetAvg = 2.8;
      targetAtt = 0.40;
    } else if (student.id === 'core-4') { // Sevinch Karimova: Ogohlantirish
      targetAvg = 3.2;
      targetAtt = 0.60;
    } else if (student.id === 'core-3') { // Behruz Ergashev: Ogohlantirish
      targetAvg = 3.7;
      targetAtt = 0.72;
    } else if (student.id === 'core-9') { // Jahongir Rustamov: Ogohlantirish
      targetAvg = 3.5;
      targetAtt = 0.78;
    } else if (student.id === 'core-1') { // Asadbek Aliyev: Faol (High)
      targetAvg = 4.7;
      targetAtt = 0.95;
    } else if (student.id === 'core-2') { // Madina: Faol
      targetAvg = 4.2;
      targetAtt = 0.88;
    } else if (student.id === 'core-5') { // Bobur
      targetAvg = 4.0;
      targetAtt = 0.85;
    } else if (student.id === 'core-7') { // Sarvar
      targetAvg = 4.5;
      targetAtt = 0.92;
    } else if (student.id === 'core-8') { // Dilnoza
      targetAvg = 4.1;
      targetAtt = 0.89;
    } else if (student.id === 'core-10') { // Malika
      targetAvg = 4.8;
      targetAtt = 0.96;
    } else {
      // For general generated students:
      // Assign mostly "Faol" profile, with very few "Ogohlantirish" or "Xavfli" to match the user's dashboard requirement:
      // Total 128. Faol = 120, Ogohlantirish = 5, Xavfli = 3.
      // Already 3 core students are non-active (core-6 is Xavfli, core-4 is Ogohlantirish, core-3 is Ogohlantirish, core-9 is Ogohlantirish).
      // Let's make 1 more generated student "Xavfli", 2 more "Ogohlantirish", and the rest "Faol".
      const idx = parseInt(student.id.split('-')[1]);
      if (idx === 10) { // Make another one Xavfli
        targetAvg = 2.7;
        targetAtt = 0.35;
      } else if (idx === 20 || idx === 30) { // Make two more Ogohlantirish
        targetAvg = 3.3;
        targetAtt = 0.65;
      } else {
        // High performing (Faol)
        targetAvg = 4.0 + Math.random() * 1.0;
        targetAtt = 0.85 + Math.random() * 0.15;
      }
    }

    // Seed grades according to target average
    SUBJECTS.forEach((subject) => {
      // To get targetAvg, we generate grades close to targetAvg
      const hw = Math.round(targetAvg + (Math.random() - 0.5) * 1.2);
      const ex = Math.round(targetAvg + (Math.random() - 0.5) * 1.2);
      const ac = Math.round(targetAvg + (Math.random() - 0.5) * 1.2);
      
      const clamp = (val) => Math.max(2, Math.min(5, val));
      
      student.grades[subject].homework = clamp(hw);
      student.grades[subject].exam = clamp(ex);
      student.grades[subject].activity = clamp(ac);
      
      if (Math.random() > 0.5) {
        student.grades[subject].final = clamp(Math.round((hw + ex + ac) / 3));
      }
    });

    // Seed attendance records
    historyDates.forEach((date) => {
      // Decide status based on target attendance rate
      const rand = Math.random();
      let status = 'keldi';
      if (rand > targetAtt) {
        // Let's split absent vs late
        status = Math.random() > 0.6 ? 'kechikdi' : 'kelmagan';
      }
      student.attendance[date] = status;
    });
  });

  // Make sure today's attendance has exactly 114 present (keldi/kechikdi) and 14 absent (kelmagan)
  // Let's force it for todayStr (2026-08-15)
  // We can sort students and mark 14 as 'kelmagan', and 114 as 'keldi'/'kechikdi'
  // Let's mark Nozima (core-6), Karimova Sevinch (core-4) and 12 other low attendance/random students as 'kelmagan'.
  let kelmaganCount = 0;
  // Mark specific low attendance ones first
  const forceAbsentList = ['core-6', 'core-4', 'core-3', 'gen-10', 'gen-20', 'gen-30'];
  list.forEach(student => {
    if (forceAbsentList.includes(student.id)) {
      student.attendance[todayStr] = 'kelmagan';
      kelmaganCount++;
    }
  });

  // Complete up to 14 kelmagan
  for (let i = 0; i < list.length; i++) {
    if (kelmaganCount >= 14) break;
    const student = list[i];
    if (student.attendance[todayStr] !== 'kelmagan') {
      student.attendance[todayStr] = 'kelmagan';
      kelmaganCount++;
    }
  }

  // Set the remaining 114 to 'keldi' (mostly), 'kechikdi', or 'kasal'
  let kechikdiCount = 0;
  let kasalCount = 0;
  list.forEach(student => {
    if (student.attendance[todayStr] !== 'kelmagan') {
      // Assign 'kechikdi' to about 4 students and 'kasal' to about 4 students
      if (kechikdiCount < 4 && Math.random() > 0.8) {
        student.attendance[todayStr] = 'kechikdi';
        kechikdiCount++;
      } else if (kasalCount < 4 && Math.random() > 0.8) {
        student.attendance[todayStr] = 'kasal';
        kasalCount++;
      } else {
        student.attendance[todayStr] = 'keldi';
      }
    }
  });

  return list;
};

const initialNotifications = [
  { id: 1, text: "9-A sinf o‘quvchisi Nozima Ismoilova bugun darsga kelmadi.", time: "10 daqiqa oldin", read: false },
  { id: 2, text: "Ota-onalar majlisi ertaga soat 15:00 ga belgilandi.", time: "1 soat oldin", read: false },
  { id: 3, text: "Yangi o‘quvchi - Aliyev Asadbek tizimga muvaffaqiyatli qo‘shildi.", time: "Kecha", read: true },
  { id: 4, text: "Haftalik hisobot tayyor. Uni Statistika bo‘limidan yuklab olishingiz mumkin.", time: "2 kun oldin", read: true }
];

export const DataProvider = ({ children }) => {
  const authContext = useContext(AuthContext);
  const activeUserId = authContext?.currentUser?.id || 'usr-1';

  const [students, setStudents] = useState(() => {
    // Clear legacy mock students from localStorage
    localStorage.removeItem('up_students');
    const stored = localStorage.getItem(`up_students_${activeUserId}`);
    return stored ? JSON.parse(stored) : [];
  });

  const [notifications, setNotifications] = useState(() => {
    const stored = localStorage.getItem('up_notifications');
    return stored ? JSON.parse(stored) : initialNotifications;
  });

  const [tasks, setTasks] = useState(() => {
    const stored = localStorage.getItem(`up_tasks_${activeUserId}`);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Filter out any previous dummy/default tasks
      return parsed.filter(t => 
        t.user_id === activeUserId && 
        !t.id.startsWith('task-1') && 
        !t.id.startsWith('task-2') && 
        !t.id.startsWith('task-3') && 
        !t.id.startsWith('task-4') &&
        t.title !== 'Yangi o‘quv yiliga dars rejalarini tasdiqlash' &&
        t.title !== 'O‘quvchilar ro‘yxati va baholash jurnalini shakllantirish'
      );
    }
    return [];
  });

  const [toasts, setToasts] = useState([]);

  // Fetch data from Supabase for active user
  useEffect(() => {
    if (!activeUserId) return;

    // Load from local storage initially for instant display (without mock tasks)
    const localTasks = localStorage.getItem(`up_tasks_${activeUserId}`);
    if (localTasks) {
      const parsed = JSON.parse(localTasks).filter(t => 
        t.user_id === activeUserId &&
        !t.id.startsWith('task-1') && 
        !t.id.startsWith('task-2') && 
        !t.id.startsWith('task-3') && 
        !t.id.startsWith('task-4') &&
        t.title !== 'Yangi o‘quv yiliga dars rejalarini tasdiqlash' &&
        t.title !== 'O‘quvchilar ro‘yxati va baholash jurnalini shakllantirish'
      );
      setTasks(parsed);
      localStorage.setItem(`up_tasks_${activeUserId}`, JSON.stringify(parsed));
    } else {
      setTasks([]);
    }

    const localStudents = localStorage.getItem(`up_students_${activeUserId}`);
    if (localStudents) {
      setStudents(JSON.parse(localStudents));
    } else {
      setStudents([]);
    }

    async function fetchSupabaseData() {
      try {
        // 1. Fetch Students for active user
        const { data: dbStudents, error: err1 } = await supabase
          .from('students')
          .select('*')
          .eq('user_id', activeUserId);

        if (!err1 && dbStudents) {
          setStudents(dbStudents);
        }

        // 2. Fetch Tasks for active user (purely user-created tasks)
        const { data: dbTasks, error: err2 } = await supabase
          .from('tasks')
          .select('*')
          .eq('user_id', activeUserId)
          .order('createdAt', { ascending: false });

        if (!err2 && dbTasks) {
          // Filter out dummy/mock tasks
          const realTasks = dbTasks.filter(t => 
            !t.id.startsWith('task-1') && 
            !t.id.startsWith('task-2') && 
            !t.id.startsWith('task-3') && 
            !t.id.startsWith('task-4') &&
            t.title !== 'Yangi o‘quv yiliga dars rejalarini tasdiqlash' &&
            t.title !== 'O‘quvchilar ro‘yxati va baholash jurnalini shakllantirish'
          );

          // Clean up any mock tasks from Supabase
          const mockTasks = dbTasks.filter(t => 
            t.id.startsWith('task-1') || 
            t.id.startsWith('task-2') || 
            t.id.startsWith('task-3') || 
            t.id.startsWith('task-4') ||
            t.title === 'Yangi o‘quv yiliga dars rejalarini tasdiqlash' ||
            t.title === 'O‘quvchilar ro‘yxati va baholash jurnalini shakllantirish'
          );
          if (mockTasks.length > 0) {
            for (const m of mockTasks) {
              await supabase.from('tasks').delete().eq('id', m.id);
            }
          }

          setTasks(realTasks);
        }
      } catch (err) {
        console.warn("Supabase fetch error:", err);
      }
    }

    fetchSupabaseData();
  }, [activeUserId]);

  const clearAllStudents = async () => {
    setStudents([]);
    try {
      await supabase.from('students').delete().neq('id', '0');
    } catch (e) {
      console.warn("Clear students notice:", e);
    }
  };

  // Save to localStorage when state changes
  useEffect(() => {
    if (activeUserId) {
      localStorage.setItem(`up_students_${activeUserId}`, JSON.stringify(students));
    }
  }, [students, activeUserId]);

  useEffect(() => {
    localStorage.setItem('up_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    if (activeUserId) {
      localStorage.setItem(`up_tasks_${activeUserId}`, JSON.stringify(tasks));
      localStorage.setItem('up_tasks', JSON.stringify(tasks));
    }
  }, [tasks, activeUserId]);

  // Toast helpers
  const showToast = (message, type = 'success') => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    // Remove toast after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter(t => t.id !== id));
  };

  // Actions with Supabase Sync
  const addStudent = async (studentData) => {
    const newStudent = {
      id: `student-${Date.now()}`,
      user_id: activeUserId,
      name: studentData.name,
      surname: studentData.surname,
      birthDate: studentData.birthDate || '',
      phone: studentData.phone || '',
      classGroup: studentData.classGroup || CLASSES[0],
      parentName: studentData.parentName || '',
      parentPhone: studentData.parentPhone || '',
      address: studentData.address || '',
      avatar: studentData.avatar || '',
      attendance: {},
      grades: {}
    };

    // Initialize grades with nulls
    SUBJECTS.forEach((subject) => {
      newStudent.grades[subject] = {
        homework: null,
        exam: null,
        activity: null,
        final: null
      };
    });

    setStudents((prev) => [newStudent, ...prev]);
    showToast(`O‘quvchi ${studentData.name} ${studentData.surname} muvaffaqiyatli qo‘shildi.`, 'success');

    try {
      await supabase.from('students').insert([newStudent]);
    } catch (e) {
      console.warn("Supabase student insert notice:", e);
    }
  };

  const updateStudent = async (id, studentData) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === id ? { ...student, ...studentData } : student
      )
    );
    showToast("O‘quvchi ma’lumotlari muvaffaqiyatli tahrirlandi.", 'success');

    try {
      await supabase.from('students').update(studentData).eq('id', String(id));
    } catch (e) {
      console.warn("Supabase student update notice:", e);
    }
  };

  const deleteStudent = async (id) => {
    const student = students.find((s) => s.id === id);
    setStudents((prev) => prev.filter((s) => String(s.id) !== String(id)));
    showToast(`O‘quvchi ${student ? `${student.name} ${student.surname}` : ''} muvaffaqiyatli o‘chirildi.`, 'success');

    try {
      await supabase.from('students').delete().eq('id', String(id));
    } catch (e) {
      console.warn("Supabase student delete notice:", e);
    }
  };

  const saveFaceAttendanceLog = async (faceLog) => {
    // faceLog: { student_id, student_name, class_group, date, time, status, face_snapshot, face_match_rate, teacher_name }
    const logEntry = {
      id: `face-att-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      user_id: activeUserId,
      student_id: String(faceLog.student_id),
      student_name: faceLog.student_name || '',
      class_group: faceLog.class_group || '',
      date: faceLog.date || new Date().toISOString().split('T')[0],
      time: faceLog.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: faceLog.status || 'keldi',
      face_snapshot: faceLog.face_snapshot || '',
      face_match_rate: faceLog.face_match_rate || 99.8,
      teacher_name: faceLog.teacher_name || 'Ustoz'
    };

    // Update local student face snapshot & attendance
    setStudents((prev) =>
      prev.map((student) => {
        if (String(student.id) === String(faceLog.student_id)) {
          return {
            ...student,
            face_snapshot: faceLog.face_snapshot || student.face_snapshot,
            face_registered: true,
            attendance: {
              ...student.attendance,
              [logEntry.date]: logEntry.status
            }
          };
        }
        return student;
      })
    );

    // Save to Supabase 'face_attendance' table & update 'students' table
    try {
      await supabase.from('face_attendance').insert([logEntry]);
      await supabase.from('students').update({
        face_snapshot: logEntry.face_snapshot,
        face_registered: true
      }).eq('id', String(faceLog.student_id));
    } catch (e) {
      console.warn("Supabase face attendance log insert notice:", e);
    }

    return logEntry;
  };

  const saveAttendance = async (classGroup, subject, date, attendanceRecords) => {
    // attendanceRecords is an object: { [studentId]: status }
    let updatedList = [];
    setStudents((prev) => {
      updatedList = prev.map((student) => {
        if (student.classGroup === classGroup) {
          const status = attendanceRecords[student.id] || 'keldi';
          return {
            ...student,
            attendance: {
              ...(student.attendance || {}),
              [date]: status
            }
          };
        }
        return student;
      });
      return updatedList;
    });
    showToast(`Davomat (${classGroup}, ${date}) muvaffaqiyatli saqlandi.`, 'success');

    // Sync with Supabase students table & standalone attendance table
    try {
      const targetStudents = updatedList.filter(s => s.classGroup === classGroup);
      for (const student of targetStudents) {
        await supabase.from('students').update({
          attendance: student.attendance
        }).eq('id', String(student.id));

        // Insert / Upsert into dedicated attendance table
        const status = attendanceRecords[student.id] || 'keldi';
        await supabase.from('attendance').insert([{
          id: `att-${Date.now()}-${student.id}`,
          user_id: activeUserId,
          student_id: String(student.id),
          student_name: `${student.surname || ''} ${student.name || ''}`.trim(),
          class_group: classGroup,
          subject: subject || 'Umumiy',
          date: date,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: status
        }]);
      }
    } catch (e) {
      console.warn("Supabase attendance sync error:", e);
    }
  };

  const updateStudentGrade = async (studentId, subject, gradeType, value) => {
    // value can be number (2,3,4,5) or null
    let updatedStudent = null;
    setStudents((prev) =>
      prev.map((student) => {
        if (student.id === studentId) {
          const currentGrades = (student.grades && student.grades[subject]) || { homework: null, exam: null, activity: null, final: null };
          const newGrades = {
            ...(student.grades || {}),
            [subject]: {
              ...currentGrades,
              [gradeType]: value !== null && value !== '' ? parseInt(value) : null
            }
          };
          updatedStudent = { ...student, grades: newGrades };
          return updatedStudent;
        }
        return student;
      })
    );

    // Sync individual grade to Supabase immediately
    try {
      if (updatedStudent) {
        await supabase.from('students').update({
          grades: updatedStudent.grades
        }).eq('id', String(studentId));

        if (value) {
          await supabase.from('grades').insert([{
            id: `grd-${Date.now()}-${studentId}-${subject}-${gradeType}`,
            user_id: activeUserId,
            student_id: String(studentId),
            student_name: `${updatedStudent.surname || ''} ${updatedStudent.name || ''}`.trim(),
            class_group: updatedStudent.classGroup,
            subject: subject,
            grade_type: gradeType,
            grade: Number(value),
            date: new Date().toISOString().split('T')[0]
          }]);
        }
      }
    } catch (e) {
      console.warn("Supabase single grade sync notice:", e);
    }
  };

  const saveAllGrades = async (successMessage = "Baholar muvaffaqiyatli saqlandi.") => {
    showToast(successMessage, 'success');
    try {
      for (const student of students) {
        await supabase.from('students').update({
          grades: student.grades
        }).eq('id', String(student.id));

        // Also log to dedicated grades table
        if (student.grades) {
          for (const [subj, gObj] of Object.entries(student.grades)) {
            for (const [gType, val] of Object.entries(gObj || {})) {
              if (val) {
                await supabase.from('grades').insert([{
                  id: `grd-${Date.now()}-${student.id}-${subj}-${gType}`,
                  user_id: activeUserId,
                  student_id: String(student.id),
                  student_name: `${student.surname || ''} ${student.name || ''}`.trim(),
                  class_group: student.classGroup,
                  subject: subj,
                  grade_type: gType,
                  grade: Number(val),
                  date: new Date().toISOString().split('T')[0]
                }]);
              }
            }
          }
        }
      }
    } catch (e) {
      console.warn("Supabase grades sync notice:", e);
    }
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Helper utility functions for calculations
  const calculateStudentAvg = (student, subject = null) => {
    if (subject) {
      const g = student.grades[subject];
      if (!g) return 0;
      const vals = [g.homework, g.exam, g.activity, g.final].filter((v) => v !== null && v !== undefined);
      if (vals.length === 0) return 0;
      return parseFloat((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1));
    } else {
      // Calculate overall average across all subjects
      let totalSum = 0;
      let count = 0;
      SUBJECTS.forEach((sub) => {
        const avg = calculateStudentAvg(student, sub);
        if (avg > 0) {
          totalSum += avg;
          count++;
        }
      });
      if (count === 0) return 0;
      return parseFloat((totalSum / count).toFixed(1));
    }
  };

  const calculateStudentAttendanceRate = (student) => {
    if (!student || !student.attendance) return 100;
    const keys = Object.keys(student.attendance);
    if (keys.length === 0) return 100; // If no attendance records yet, default to 100%
    let presentCount = 0;
    keys.forEach((k) => {
      const status = student.attendance[k];
      if (status === 'keldi' || status === 'kechikdi' || status === 'kasal') {
        presentCount++;
      }
    });
    return Math.round((presentCount / keys.length) * 100);
  };

  const getStudentStatus = (student) => {
    if (!student) return 'Faol';
    const attKeys = Object.keys(student.attendance || {});
    const attRate = calculateStudentAttendanceRate(student);
    const avgGrade = calculateStudentAvg(student);
    
    // If student is new and hasn't attended yet, consider active
    if (attKeys.length === 0 && (!avgGrade || avgGrade >= 3.5)) {
      return 'Faol';
    }

    // Professional Educational Categories:
    // Nazoratda (Dars qoldiruvchi yoki past baho): Attendance < 60% OR Avg Grade < 3.0
    // E’tibor talab (O'rtacha): Attendance between 60% and 80% OR Avg Grade between 3.0 and 3.8
    // Faol: Attendance >= 80% AND Avg Grade >= 3.8
    if ((attKeys.length > 0 && attRate < 60) || (avgGrade > 0 && avgGrade < 3.0)) {
      return 'Nazoratda';
    } else if ((attKeys.length > 0 && attRate < 80) || (avgGrade > 0 && avgGrade < 3.8)) {
      return 'E’tibor talab';
    } else {
      return 'Faol';
    }
  };

  // Task Handlers with Supabase sync
  const addTask = async (newTaskData) => {
    if (!activeUserId) return;
    const task = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      user_id: activeUserId,
      title: newTaskData.title,
      description: newTaskData.description || '',
      category: newTaskData.category || 'Umumiy',
      priority: newTaskData.priority || 'O‘rta',
      dueDate: newTaskData.dueDate || new Date().toISOString().split('T')[0],
      completed: false,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setTasks(prev => [task, ...prev]);
    showToast('Yangi vazifa muvaffaqiyatli qo‘shildi!', 'success');

    try {
      await supabase.from('tasks').insert([task]);
    } catch (e) {
      console.warn("Supabase task insert notice:", e);
    }
  };

  const updateTask = async (taskId, updatedData) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...updatedData } : t));
    showToast('Vazifa ma’lumotlari yangilandi!', 'success');

    try {
      await supabase.from('tasks').update(updatedData).eq('id', taskId).eq('user_id', activeUserId);
    } catch (e) {
      console.warn("Supabase task update notice:", e);
    }
  };

  const deleteTask = async (taskId) => {
    setTasks(prev => prev.filter(t => String(t.id) !== String(taskId)));
    showToast('Vazifa o‘chirildi!', 'error');

    try {
      await supabase.from('tasks').delete().eq('id', String(taskId)).eq('user_id', activeUserId);
    } catch (e) {
      console.warn("Supabase task delete notice:", e);
    }
  };

  const toggleTaskCompletion = async (taskId) => {
    let nextState = false;
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        nextState = !t.completed;
        showToast(nextState ? 'Vazifa bajarildi deb belgilandi! 🎉' : 'Vazifa qayta tiklandi.', 'info');
        return { ...t, completed: nextState };
      }
      return t;
    }));

    try {
      await supabase.from('tasks').update({ completed: nextState }).eq('id', taskId).eq('user_id', activeUserId);
    } catch (e) {
      console.warn("Supabase task toggle notice:", e);
    }
  };

  return (
    <DataContext.Provider
      value={{
        students,
        notifications,
        tasks,
        toasts,
        addStudent,
        updateStudent,
        deleteStudent,
        clearAllStudents,
        saveAttendance,
        saveFaceAttendanceLog,
        updateStudentGrade,
        saveAllGrades,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskCompletion,
        showToast,
        removeToast,
        markAllNotificationsRead,
        clearNotification,
        calculateStudentAvg,
        calculateStudentAttendanceRate,
        getStudentStatus
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
