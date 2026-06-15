'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { supabase, createUser, findUserByMssv, getUser } from '@/lib/supabase';

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

  const logout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setRole(null);
    setUser(null);
    localStorage.removeItem('fg_user');
  };

  // Đăng ký user mới → lưu vào Supabase Auth và public.users
  const register = async (name, mssv, school, faculty, role, email, password) => {
    const defaults = ROLE_DEFAULTS[role];

    if (!supabase) {
      throw new Error('Supabase client chưa được khởi tạo');
    }

    // 1. Đăng ký trên Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          mssv,
          school,
          faculty,
          role,
        }
      }
    });

    if (authError) {
      throw new Error(authError.message);
    }

    // 2. Lưu thông tin vào bảng public.users
    const { data: dbUser, error: dbError } = await createUser({ name, mssv, school, faculty, role });
    if (dbError) {
      console.warn('Lỗi lưu public users profile:', dbError);
    }

    // 3. Cập nhật metadata với dbId thật
    if (dbUser?.id) {
      await supabase.auth.updateUser({
        data: { dbId: dbUser.id }
      });
    }

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
      email,
    };

    // Đăng nhập session hiện tại
    login(newUser);

    return newUser;
  };

  // Đăng nhập thực tế bằng email/password qua Supabase Auth
  const signIn = async (email, password) => {
    if (!supabase) {
      throw new Error('Supabase client chưa được khởi tạo');
    }

    // 1. Đăng nhập Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      throw new Error(authError.message);
    }

    const authUser = authData.user;
    const meta = authUser.user_metadata || {};
    const role = meta.role || 'student';
    const dbId = meta.dbId;

    // 2. Lấy profile từ public.users qua dbId
    let dbUser = null;
    if (dbId) {
      dbUser = await getUser(dbId);
    } else if (meta.mssv) {
      dbUser = await findUserByMssv(meta.mssv);
    }

    // Nếu chưa có profile trong public.users, tự động tạo mới
    if (!dbUser) {
      const { data: created, error: dbError } = await createUser({
        name: meta.name || authUser.email.split('@')[0],
        mssv: meta.mssv || '',
        school: meta.school || '',
        faculty: meta.faculty || '',
        role: role
      });
      dbUser = created;

      if (dbUser?.id) {
        await supabase.auth.updateUser({
          data: { dbId: dbUser.id }
        });
      }
    }

    const defaults = ROLE_DEFAULTS[role];
    const loggedInUser = {
      id: dbUser?.id || Date.now(),
      dbId: dbUser?.id || null,
      name: dbUser?.name || meta.name || authUser.email.split('@')[0],
      mssv: dbUser?.mssv || meta.mssv || '',
      school: dbUser?.school || meta.school || '',
      faculty: dbUser?.faculty || meta.faculty || '',
      role: role,
      label: defaults.label,
      icon: defaults.icon,
      color: defaults.color,
      homePath: defaults.homePath,
      sub: role === 'student'
        ? (dbUser?.mssv && dbUser?.school
            ? `MSSV: ${dbUser.mssv} · ${dbUser.faculty} · ${dbUser.school}`
            : 'Chưa cập nhật thông tin')
        : (dbUser?.school
            ? `${dbUser.faculty} · ${dbUser.school}`
            : 'Chưa cập nhật thông tin'),
      email: authUser.email,
    };

    login(loggedInUser);
    return loggedInUser;
  };

  const getUsers = () => {
    try {
      return JSON.parse(localStorage.getItem('fg_users') || '[]');
    } catch { return []; }
  };

  return (
    <AuthContext.Provider value={{ role, user, login, logout, loading, register, signIn, getUsers, ROLE_DEFAULTS }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
