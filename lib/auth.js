'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const ROLES = {
  student: {
    label: 'Sinh viên',
    icon: '🎓',
    name: 'Nguyễn Minh Anh',
    sub: 'MSSV: 20210001 · Khoa CNTT · ĐH Bách Khoa TP.HCM',
    color: '#3b82f6',
    homePath: '/dashboard',
  },
  reviewer: {
    label: 'Cán bộ Hội',
    icon: '🏛️',
    name: 'Trần Văn Bình',
    sub: 'Phó ban Phong trào · Hội SV Trường ĐH Bách Khoa TP.HCM',
    color: '#8b5cf6',
    homePath: '/reviewer',
  },
};

export function AuthProvider({ children }) {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('fg_role') : null;
    if (saved && ROLES[saved]) {
      setRole(saved);
    }
    setLoading(false);
  }, []);

  const login = (r) => {
    setRole(r);
    localStorage.setItem('fg_role', r);
  };

  const logout = () => {
    setRole(null);
    localStorage.removeItem('fg_role');
  };

  const user = role ? ROLES[role] : null;

  return (
    <AuthContext.Provider value={{ role, user, login, logout, loading, ROLES }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
