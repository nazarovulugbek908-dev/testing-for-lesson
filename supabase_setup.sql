-- ========================================================
-- USTOZLAR PLATFORMASI - TO'LIQ SUPABASE SQL STRUKTURASI
-- ========================================================
-- Ushbu kodni Supabase -> SQL Editor bo'limiga nusxalab qo'ying va "Run" tugmasini bosing!
-- Natijada Supabase'da platformaning barcha 7 ta jadvali paydo bo'ladi:
-- 1. tasks (Vazifalar)
-- 2. students (O'quvchilar)
-- 3. attendance (Davomat Jurnali)
-- 4. face_attendance (Face ID Biometrik Suratlari va Loglari)
-- 5. grades (Baholash Jurnali)
-- 6. notifications (Xabarnomalar)
-- 7. teachers (Ustozlar Profili)
-- ========================================================

-- 1. 'tasks' (Vazifalar / To-Do)
CREATE TABLE IF NOT EXISTS public.tasks (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'Umumiy',
  priority TEXT DEFAULT 'O‘rta',
  "dueDate" TEXT,
  completed BOOLEAN DEFAULT false,
  "createdAt" TEXT
);
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all tasks" ON public.tasks;
CREATE POLICY "Allow all tasks" ON public.tasks FOR ALL USING (true) WITH CHECK (true);

-- 2. 'students' (O'quvchilar)
CREATE TABLE IF NOT EXISTS public.students (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  name TEXT NOT NULL,
  surname TEXT,
  "birthDate" TEXT,
  phone TEXT,
  "classGroup" TEXT,
  "parentName" TEXT,
  "parentPhone" TEXT,
  address TEXT,
  avatar TEXT,
  face_snapshot TEXT,
  face_registered BOOLEAN DEFAULT false,
  attendance JSONB DEFAULT '{}'::jsonb,
  grades JSONB DEFAULT '{}'::jsonb
);
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all students" ON public.students;
CREATE POLICY "Allow all students" ON public.students FOR ALL USING (true) WITH CHECK (true);

-- 3. 'attendance' (Davomat Jurnali)
CREATE TABLE IF NOT EXISTS public.attendance (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  student_id TEXT NOT NULL,
  student_name TEXT,
  class_group TEXT,
  subject TEXT,
  date TEXT NOT NULL,
  time TEXT,
  status TEXT DEFAULT 'keldi',
  comment TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all attendance" ON public.attendance;
CREATE POLICY "Allow all attendance" ON public.attendance FOR ALL USING (true) WITH CHECK (true);

-- 4. 'face_attendance' (Face ID Biometrik Loglari va Jonli Suratlari)
CREATE TABLE IF NOT EXISTS public.face_attendance (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  student_id TEXT NOT NULL,
  student_name TEXT,
  class_group TEXT,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  status TEXT DEFAULT 'keldi',
  face_snapshot TEXT,
  face_match_rate NUMERIC DEFAULT 99.8,
  teacher_name TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.face_attendance ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all face_attendance" ON public.face_attendance;
CREATE POLICY "Allow all face_attendance" ON public.face_attendance FOR ALL USING (true) WITH CHECK (true);

-- 5. 'grades' (Baholar Jurnali)
CREATE TABLE IF NOT EXISTS public.grades (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  student_id TEXT NOT NULL,
  student_name TEXT,
  class_group TEXT,
  subject TEXT NOT NULL,
  grade_type TEXT,
  grade NUMERIC,
  date TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.grades ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all grades" ON public.grades;
CREATE POLICY "Allow all grades" ON public.grades FOR ALL USING (true) WITH CHECK (true);

-- 6. 'notifications' (Xabarnomalar)
CREATE TABLE IF NOT EXISTS public.notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  text TEXT NOT NULL,
  time TEXT,
  read BOOLEAN DEFAULT false,
  "createdAt" TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all notifications" ON public.notifications;
CREATE POLICY "Allow all notifications" ON public.notifications FOR ALL USING (true) WITH CHECK (true);

-- 7. 'teachers' (Ustozlar Profili)
CREATE TABLE IF NOT EXISTS public.teachers (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  name TEXT NOT NULL,
  surname TEXT,
  email TEXT,
  phone TEXT,
  school TEXT,
  subject TEXT,
  role TEXT DEFAULT 'Ustoz',
  "createdAt" TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all teachers" ON public.teachers;
CREATE POLICY "Allow all teachers" ON public.teachers FOR ALL USING (true) WITH CHECK (true);

-- ========================================================
-- Done! Barcha 7 ta jadval muvaffaqiyatli yaratiladi!
-- ========================================================
