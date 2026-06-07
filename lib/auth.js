'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { createUser, findUserByMssv } from '@/lib/supabase';

const AuthContext = createContext(null);

const ROLE_DEFAULTS = {
  student: { label: 'Sinh viên', icon: '🎓', color: '#3b82f6', homePath: '/dashboard' },
  reviewer: { label: 'Cán bộ Hội', icon: '🏛️', color: '#8b5cf6', homePath: '/reviewer' },
};

export function AuthProvider({ children }) {
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = typeof window !== 'undefined' ? localStorage.getItem('fg_user') : null;
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setRole(parsed.role);
        setUser(parsed);
      } catch {}
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setRole(userData.role);
    setUser(userData);
    localStorage.setItem('fg_user', JSON.stringify(userData));
  };

  const logout = () => {
    setRole(null);
    setUser(null);
    localStorage.removeItem('fg_user');
  };

  // Đăng ký user mới → lưu vào Supabase
  const register = async (name, mssv, school, faculty, role) => {
    const defaults = ROLE_DEFAULTS[role];

    // Lưu vào Supabase DB
    const { data: dbUser, error } = await createUser({ name, mssv, school, faculty, role });

    const newUser = {
      id: dbUser?.id || Date.now(),
      dbId: dbUser?.id || null, // ID trong Supabase
      name,
      mssv,
      school,
      faculty,
      role,
      label: defaults.label,
      icon: defaults.icon,
      color: defaults.color,
      homePath: defaults.homePath,
      sub: role === 'student'
        ? `MSSV: ${mssv} · ${faculty} · ${school}`
        : `${faculty} · ${school}`,
      createdAt: new Date().toISOString(),
    };

    if (error) {
      console.warn('Supabase register error:', error);
    }

    // Lưu vào localStorage list
    const users = getUsers();
    users.push(newUser);
    localStorage.setItem('fg_users', JSON.stringify(users));

    return newUser;
  };

  const getUsers = () => {
    try {
      return JSON.parse(localStorage.getItem('fg_users') || '[]');
    } catch { return []; }
  };

  return (
    <AuthContext.Provider value={{ role, user, login, logout, loading, register, getUsers, ROLE_DEFAULTS }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
