'use client';
import { createContext, useContext, useState, useEffect } from 'react';

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

  // Lấy danh sách users đã đăng ký
  const getUsers = () => {
    try {
      return JSON.parse(localStorage.getItem('fg_users') || '[]');
    } catch { return []; }
  };

  // Đăng ký user mới
  const register = (name, mssv, school, faculty, role) => {
    const defaults = ROLE_DEFAULTS[role];
    const newUser = {
      id: Date.now(),
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

    const users = getUsers();
    users.push(newUser);
    localStorage.setItem('fg_users', JSON.stringify(users));
    return newUser;
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
