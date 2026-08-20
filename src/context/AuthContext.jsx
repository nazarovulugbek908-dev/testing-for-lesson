import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('up_user');
    return saved ? JSON.parse(saved) : {
      id: 'usr-1',
      name: 'Abdulloh',
      surname: 'Yo‘ldoshev',
      email: 'abdulloh.yuldashev@school.uz',
      role: 'Ustoz',
      subject: 'Matematika va Fizika',
      school: '110-sonli IDUM'
    };
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const saved = localStorage.getItem('up_auth');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [session, setSession] = useState(null);

  useEffect(() => {
    localStorage.setItem('up_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('up_auth', JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  // Sync Supabase Auth Session
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        const meta = session.user.user_metadata || {};
        setCurrentUser({
          id: session.user.id,
          name: meta.name || session.user.email?.split('@')[0] || 'Ustoz',
          surname: meta.surname || '',
          email: session.user.email || '',
          role: 'Ustoz',
          subject: meta.subject || 'Matematika',
          school: meta.school || 'Maktab'
        });
        setIsAuthenticated(true);
      }
    });

    // Listen to Auth State Changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        const meta = session.user.user_metadata || {};
        setCurrentUser({
          id: session.user.id,
          name: meta.name || session.user.email?.split('@')[0] || 'Ustoz',
          surname: meta.surname || '',
          email: session.user.email || '',
          role: 'Ustoz',
          subject: meta.subject || 'Matematika',
          school: meta.school || 'Maktab'
        });
        setIsAuthenticated(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Supabase + Instant Login (No Email Confirm Block)
  const login = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        // If error is invalid credentials
        if (error.message.toLowerCase().includes('invalid login credentials')) {
          throw new Error('Email yoki parol noto‘g‘ri kiritildi.');
        }

        // If error is email not confirmed, still authenticate locally to fulfill "email confirmsiz"
        if (error.message.toLowerCase().includes('email not confirmed')) {
          console.warn("Supabase notice: email not confirmed, logging in directly.");
          const userObj = {
            id: `usr-${Date.now()}`,
            name: email.split('@')[0],
            surname: '',
            email: email,
            role: 'Ustoz',
            subject: 'Matematika',
            school: 'Maktab'
          };
          setCurrentUser(userObj);
          setIsAuthenticated(true);
          return { success: true, user: userObj };
        }

        throw new Error(error.message || 'Tizimga kirishda xatolik yuz berdi.');
      }

      if (data?.user) {
        const meta = data.user.user_metadata || {};
        const userObj = {
          id: data.user.id,
          name: meta.name || data.user.email?.split('@')[0] || 'Ustoz',
          surname: meta.surname || '',
          email: data.user.email || email,
          role: 'Ustoz',
          subject: meta.subject || 'Matematika',
          school: meta.school || 'Maktab'
        };
        setCurrentUser(userObj);
        setIsAuthenticated(true);
        return { success: true, user: userObj };
      }

      return { success: true };
    } catch (err) {
      throw err;
    }
  };

  // Supabase + Instant Register (No Email Confirm Block)
  const register = async (userData) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            name: userData.name,
            surname: userData.surname || '',
            subject: userData.subject || 'Matematika',
            school: userData.school || 'Maktab'
          }
        }
      });

      if (error) {
        if (error.message.toLowerCase().includes('already registered') || error.message.toLowerCase().includes('already exists')) {
          throw new Error('Ushbu email bilan foydalanuvchi allaqachon ro‘yxatdan o‘tgan.');
        }
        throw new Error(error.message || 'Ro‘yxatdan o‘tishda xatolik yuz berdi.');
      }

      const user = data?.user;
      const meta = user?.user_metadata || {};
      const createdUserObj = {
        id: user?.id || `usr-${Date.now()}`,
        name: meta.name || userData.name,
        surname: meta.surname || userData.surname || '',
        email: user?.email || userData.email,
        role: 'Ustoz',
        subject: meta.subject || userData.subject || 'Matematika',
        school: meta.school || userData.school || 'Maktab'
      };

      // Instantly authenticate user without waiting for email confirmation
      setCurrentUser(createdUserObj);
      setIsAuthenticated(true);
      return { success: true, user: createdUserObj };
    } catch (err) {
      throw err;
    }
  };

  const updateUserProfile = async (updatedData) => {
    const newUserData = {
      ...currentUser,
      ...updatedData,
      school: updatedData.school || updatedData.schoolName || currentUser?.school
    };
    setCurrentUser(newUserData);
    localStorage.setItem('up_user', JSON.stringify(newUserData));

    try {
      await supabase.auth.updateUser({
        data: {
          name: updatedData.name,
          surname: updatedData.surname,
          subject: updatedData.subject,
          school: updatedData.school || updatedData.schoolName,
          phone: updatedData.phone
        }
      });
    } catch (e) {
      console.warn("Update Supabase user error:", e);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn("Supabase logout error:", e);
    }
    setIsAuthenticated(false);
    localStorage.removeItem('up_auth');
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      isAuthenticated,
      session,
      login,
      register,
      logout,
      setCurrentUser,
      updateUserProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

