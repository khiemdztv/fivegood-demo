'use client';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import { AuthProvider, useAuth } from '@/lib/auth';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

function CompleteProfileForm() {
  const { user, login } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    mssv: user?.mssv || '',
    school: user?.school || '',
    faculty: user?.faculty || ''
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.school.trim() || !form.mssv.trim()) {
      setError('Vui lòng điền đầy đủ các thông tin bắt buộc (*)');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const dbId = user.dbId || user.id;
      if (supabase) {
        // 1. Cập nhật database public.users
        const { error: dbError } = await supabase
          .from('users')
          .update({
            name: form.name,
            mssv: form.mssv,
            school: form.school,
            faculty: form.faculty
          })
          .eq('id', dbId);
        
        if (dbError) throw new Error(dbError.message);
        
        // 2. Cập nhật metadata trong Supabase Auth
        await supabase.auth.updateUser({
          data: {
            name: form.name,
            mssv: form.mssv,
            school: form.school,
            faculty: form.faculty
          }
        });
      }

      // 3. Cập nhật local session
      login({
        ...user,
        name: form.name,
        mssv: form.mssv,
        school: form.school,
        faculty: form.faculty,
        sub: user.role === 'student'
          ? `MSSV: ${form.mssv} · ${form.faculty} · ${form.school}`
          : `${form.faculty} · ${form.school}`
      });
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra, vui lòng thử lại.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '100vh', background: '#030712', color: 'white', padding: '20px',
      boxSizing: 'border-box', fontFamily: "'Be Vietnam Pro', sans-serif"
    }}>
      {/* Background Orbs */}
      <div style={{ position: 'fixed', top: '-10%', left: '-10%', width: '50vw', height: '50vw', borderRadius: '50%', background: 'rgba(124, 92, 255, 0.04)', filter: 'blur(100px)', zIndex: 0 }} />
      <div style={{ position: 'fixed', bottom: '-10%', right: '-10%', width: '50vw', height: '50vw', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.04)', filter: 'blur(100px)', zIndex: 0 }} />

      <div style={{
        background: '#0F172A', border: '1px solid #1e293b', borderRadius: '16px',
        padding: '40px', width: '100%', maxWidth: '480px', zIndex: 1,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <span style={{ fontSize: '48px', display: 'block', marginBottom: '16px' }}>⚙️</span>
          <h2 style={{ fontSize: '22px', fontWeight: 700, margin: '0 0 8px 0' }}>Hoàn thiện thông tin tài khoản</h2>
          <p style={{ color: '#64748b', fontSize: '13px', margin: 0, lineHeight: 1.5 }}>
            Vui lòng điền thông tin cá nhân để kích hoạt tài khoản sử dụng FiveGood Journey.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.05em' }}>Họ và tên *</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              style={{
                width: '100%', padding: '10px 14px', background: 'rgba(0,0,0,0.3)',
                border: '1px solid #1e293b', borderRadius: '8px', color: 'white',
                fontFamily: 'inherit', fontSize: '13px', outline: 'none', boxSizing: 'border-box'
              }}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.05em' }}>Vai trò tài khoản</label>
            <div style={{
              width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.02)',
              border: '1px solid #1e293b', borderRadius: '8px', color: '#94a3b8',
              fontFamily: 'inherit', fontSize: '13px', boxSizing: 'border-box', fontWeight: 600
            }}>
              {user?.role === 'reviewer' ? '🏛️ Cán bộ Hội' : '🎓 Sinh viên'}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.05em' }}>{user?.role === 'reviewer' ? 'Mã cán bộ *' : 'Mã số sinh viên (MSSV) *'}</label>
            <input
              type="text"
              value={form.mssv}
              onChange={e => setForm(f => ({ ...f, mssv: e.target.value }))}
              style={{
                width: '100%', padding: '10px 14px', background: 'rgba(0,0,0,0.3)',
                border: '1px solid #1e293b', borderRadius: '8px', color: 'white',
                fontFamily: 'inherit', fontSize: '13px', outline: 'none', boxSizing: 'border-box'
              }}
              placeholder={user?.role === 'reviewer' ? 'Ví dụ: CB001' : 'Ví dụ: 20210001 để xem dữ liệu mock'}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.05em' }}>Trường Đại học *</label>
            <input
              type="text"
              value={form.school}
              onChange={e => setForm(f => ({ ...f, school: e.target.value }))}
              style={{
                width: '100%', padding: '10px 14px', background: 'rgba(0,0,0,0.3)',
                border: '1px solid #1e293b', borderRadius: '8px', color: 'white',
                fontFamily: 'inherit', fontSize: '13px', outline: 'none', boxSizing: 'border-box'
              }}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.05em' }}>{user?.role === 'reviewer' ? 'Chức vụ' : 'Khoa / Ngành'}</label>
            <input
              type="text"
              value={form.faculty}
              onChange={e => setForm(f => ({ ...f, faculty: e.target.value }))}
              style={{
                width: '100%', padding: '10px 14px', background: 'rgba(0,0,0,0.3)',
                border: '1px solid #1e293b', borderRadius: '8px', color: 'white',
                fontFamily: 'inherit', fontSize: '13px', outline: 'none', boxSizing: 'border-box'
              }}
            />
          </div>

          {error && (
            <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            style={{
              width: '100%', padding: '12px', background: 'var(--accent)',
              border: 'none', borderRadius: '8px', color: 'white', fontWeight: 600,
              fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit',
              transition: 'all 0.2s', marginTop: '8px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
            }}
          >
            {saving ? '⏳ Đang thiết lập...' : '🚀 Bắt đầu trải nghiệm'}
          </button>
        </form>
      </div>
    </div>
  );
}

function LayoutInner({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { role, user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isLoginPage = pathname === '/login';
  const isLandingPage = pathname === '/';

  useEffect(() => {
    if (loading) return;
    // Nếu chưa login và không ở trang login/landing → redirect về login
    if (!role && !isLoginPage && !isLandingPage) {
      router.push('/login');
    }
  }, [role, loading, isLoginPage, isLandingPage, router]);

  // Trang login: không có sidebar
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Trang landing: không cần auth, trang mới có nav riêng
  if (isLandingPage) {
    return <>{children}</>;
  }

  // Loading
  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', color: 'var(--muted)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px', animation: 'spin 2s linear infinite' }}>⭐</div>
          <div>Đang tải...</div>
        </div>
      </div>
    );
  }

  // Chưa login → sẽ redirect
  if (!role) return null;

  // Nếu thông tin chưa đầy đủ → hiển thị Form yêu cầu bổ sung thông tin
  const isIncomplete = role && (!user?.mssv || !user?.school || user.mssv.trim() === '' || user.school.trim() === '');
  if (isIncomplete) {
    return <CompleteProfileForm />;
  }

  return (
    <>
      <div className="mobile-header">
        <button className="menu-btn" onClick={() => setSidebarOpen(true)}>☰</button>
        <span className="mobile-header-title">⭐ FiveGood Journey</span>
      </div>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="main-content">
        {/* Ambient floating orbs */}
        <div className="app-orb app-orb--1" aria-hidden="true" />
        <div className="app-orb app-orb--2" aria-hidden="true" />
        <div className="app-orb app-orb--3" aria-hidden="true" />
        {children}
      </main>
    </>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="vi" data-scroll-behavior="smooth">
      <head>
        <title>FiveGood Journey – SV5T Copilot</title>
        <meta name="description" content="AI đồng hành cùng hành trình Sinh viên 5 tốt – Vietnamese Student HackAIthon 2026" />
      </head>
      <body>
        <AuthProvider>
          <LayoutInner>{children}</LayoutInner>
        </AuthProvider>
      </body>
    </html>
  );
}
