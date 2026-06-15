'use client';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase, createUser, findUserByMssv, getUser } from '@/lib/supabase';

export default function LoginPage() {
  const { login, register, signIn, ROLE_DEFAULTS } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState('login'); // login | register
  const [role, setRole] = useState('student');
  const [showPw, setShowPw] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', name: '', mssv: '', school: '', faculty: '' });
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlRole = params.get('role');
      if (urlRole === 'student' || urlRole === 'reviewer') {
        setRole(urlRole);
      }
    }
  }, []);

  useEffect(() => {
    if (!supabase) return;
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setLoading(true);
        try {
          const authUser = session.user;
          const savedRole = localStorage.getItem('fg_google_role') || 'student';
          const meta = authUser.user_metadata || {};
          const dbId = meta.dbId;
          
          let dbUser = null;
          if (dbId) {
            dbUser = await getUser(dbId);
          } else if (meta.mssv) {
            dbUser = await findUserByMssv(meta.mssv);
          }
          
          if (!dbUser) {
            const defaultMssv = meta.mssv || '';
            const { data: created, error: dbError } = await createUser({
              name: meta.full_name || meta.name || authUser.email.split('@')[0],
              mssv: defaultMssv,
              school: meta.school || '',
              faculty: meta.faculty || '',
              role: savedRole
            });
            dbUser = created;
            
            // Save dbId to auth user metadata
            await supabase.auth.updateUser({
              data: { dbId: dbUser.id, mssv: defaultMssv }
            });
          } else if (!dbId && dbUser.id) {
            // Sync dbId back to metadata
            await supabase.auth.updateUser({
              data: { dbId: dbUser.id }
            });
          }
          
          const defaults = ROLE_DEFAULTS[savedRole];
          const loggedInUser = {
            id: dbUser?.id || Date.now(),
            dbId: dbUser?.id || null,
            name: dbUser?.name || meta.full_name || meta.name || authUser.email.split('@')[0],
            mssv: dbUser?.mssv || '',
            school: dbUser?.school || '',
            faculty: dbUser?.faculty || '',
            role: savedRole,
            label: defaults.label,
            icon: defaults.icon,
            color: defaults.color,
            homePath: defaults.homePath,
            sub: savedRole === 'student'
              ? (dbUser?.mssv && dbUser?.school
                  ? `MSSV: ${dbUser.mssv} · ${dbUser.faculty} · ${dbUser.school}`
                  : 'Chưa cập nhật thông tin')
              : (dbUser?.school
                  ? `${dbUser.faculty} · ${dbUser.school}`
                  : 'Chưa cập nhật thông tin'),
            email: authUser.email,
          };
          
          login(loggedInUser);
          localStorage.removeItem('fg_google_role');
          router.push(defaults.homePath);
        } catch (err) {
          setError('Lỗi đăng nhập Google: ' + err.message);
        } finally {
          setLoading(false);
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [router, ROLE_DEFAULTS, login]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!form.email.trim() || !form.password.trim()) {
      setError('Vui lòng nhập đầy đủ email và mật khẩu');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const loggedInUser = await signIn(form.email, form.password);
      router.push(loggedInUser.homePath);
    } catch (err) {
      setError(err.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.school.trim() || !form.email.trim() || !form.password.trim()) {
      setError('Vui lòng điền đầy đủ các thông tin bắt buộc (*)');
      return;
    }
    if (form.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const newUser = await register(
        form.name,
        form.mssv || `SV-${Date.now().toString().substring(8)}`,
        form.school,
        form.faculty || 'Chưa cập nhật',
        role,
        form.email,
        form.password
      );
      router.push(newUser.homePath);
    } catch (err) {
      setError('Đăng ký thất bại: ' + err.message);
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    localStorage.setItem('fg_google_role', role);
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/login',
      }
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const features = [
    { icon: '🤖', title: 'AI Mentor 24/7', desc: 'Đồng hành, gợi ý và đánh giá thông minh' },
    { icon: '📷', title: 'OCR & Xác thực', desc: 'Tự động trích xuất và xác minh minh chứng' },
    { icon: '🎫', title: 'Digital Passport', desc: 'Lưu trữ thành tích và xuất hồ sơ SV5T điện tử' },
    { icon: '📊', title: 'Thống kê & Báo cáo', desc: 'Theo dõi tiến độ và báo cáo trực quan' },
  ];

  return (
    <div className="lg">
      {/* Background effects */}
      <div className="lg-orb lg-orb--1" />
      <div className="lg-orb lg-orb--2" />

      {/* Nav */}
      <nav className="lg-nav">
        <Link href="/" className="lg-nav-logo">⭐ FiveGood Journey</Link>
        <Link href="/" className="lg-nav-back">🏠 Trang chủ</Link>
      </nav>

      <div className="lg-wrapper">
        {/* ── LEFT SIDE ── */}
        <div className="lg-left">
          <div className="lg-left-content">
            <div className="fg-badge">🏆 HackAIthon 2026 · Bảng B · Đề tài 5</div>
            <h1 className="lg-welcome">
              <span className="lg-welcome-sub">Chào mừng trở lại!</span>
              <span className="lg-welcome-brand">FiveGood Journey</span>
            </h1>
            <p className="lg-welcome-desc">
              Nền tảng AI hỗ trợ toàn bộ hành trình<br/>Sinh viên 5 Tốt.
            </p>

            <div className="lg-features">
              {features.map((f, i) => (
                <div key={i} className="lg-feature">
                  <div className="lg-feature-icon">{f.icon}</div>
                  <div>
                    <div className="lg-feature-title">{f.title}</div>
                    <div className="lg-feature-desc">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT SIDE ── */}
        <div className="lg-right">
          <div className="lg-card">
            {mode === 'login' ? (
              <>
                <h2 className="lg-card-title">Đăng nhập</h2>
                <p className="lg-card-sub">Chọn vai trò và đăng nhập để tiếp tục sử dụng</p>

                {/* Role selector */}
                <div className="lg-roles">
                  <button className={`lg-role ${role === 'student' ? 'lg-role--active lg-role--sv' : ''}`} onClick={() => setRole('student')}>
                    🎓 Sinh viên
                  </button>
                  <button className={`lg-role ${role === 'reviewer' ? 'lg-role--active lg-role--cb' : ''}`} onClick={() => setRole('reviewer')}>
                    🏛️ Cán bộ Hội
                  </button>
                </div>

                <form onSubmit={handleLogin} className="lg-form">
                  {/* Email */}
                  <div className="lg-field">
                    <label>Email hoặc mã số sinh viên</label>
                    <div className="lg-input-wrap">
                      <span className="lg-input-icon">✉️</span>
                      <input type="text" placeholder="Nhập email hoặc MSSV" value={form.email}
                        onChange={e => setForm(f => ({...f, email: e.target.value}))} />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="lg-field">
                    <label>Mật khẩu</label>
                    <div className="lg-input-wrap">
                      <span className="lg-input-icon">🔒</span>
                      <input type={showPw ? 'text' : 'password'} placeholder="Nhập mật khẩu" value={form.password}
                        onChange={e => setForm(f => ({...f, password: e.target.value}))} />
                      <button type="button" className="lg-pw-toggle" onClick={() => setShowPw(!showPw)}>
                        {showPw ? '🙈' : '👁️'}
                      </button>
                    </div>
                  </div>

                  {/* Remember + Forgot */}
                  <div className="lg-meta">
                    <label className="lg-checkbox">
                      <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} />
                      <span>Ghi nhớ đăng nhập</span>
                    </label>
                    <a href="#" className="lg-forgot">Quên mật khẩu?</a>
                  </div>

                  {error && <div className="lg-error">⚠️ {error}</div>}

                  <button type="submit" className="lg-submit" disabled={loading}>
                    {loading ? '⏳ Đang đăng nhập...' : 'Đăng nhập'}
                  </button>
                </form>

                {/* Divider */}
                <div className="lg-divider"><span>hoặc</span></div>

                {/* Google Login */}
                <button className="lg-google" onClick={handleGoogleLogin} disabled={loading}>
                  <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                  Đăng nhập với Google
                </button>

                {/* Register link */}
                <p className="lg-switch">
                  Chưa có tài khoản? <button onClick={() => { setMode('register'); setError(''); }}>Đăng ký tại đây</button>
                </p>
              </>
            ) : (
              <>
                <h2 className="lg-card-title">Đăng ký tài khoản</h2>
                <p className="lg-card-sub">Tạo tài khoản mới để sử dụng FiveGood Journey</p>

                {/* Role selector */}
                <div className="lg-roles">
                  <button className={`lg-role ${role === 'student' ? 'lg-role--active lg-role--sv' : ''}`} onClick={() => setRole('student')}>
                    🎓 Sinh viên
                  </button>
                  <button className={`lg-role ${role === 'reviewer' ? 'lg-role--active lg-role--cb' : ''}`} onClick={() => setRole('reviewer')}>
                    🏛️ Cán bộ Hội
                  </button>
                </div>

                <form onSubmit={handleRegister} className="lg-form">
                  <div className="lg-field">
                    <label>Họ và tên *</label>
                    <div className="lg-input-wrap">
                      <span className="lg-input-icon">👤</span>
                      <input placeholder="Nguyễn Văn A" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} required />
                    </div>
                  </div>
                  <div className="lg-field">
                    <label>Email *</label>
                    <div className="lg-input-wrap">
                      <span className="lg-input-icon">✉️</span>
                      <input type="email" placeholder="email@example.com" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} required />
                    </div>
                  </div>
                  <div className="lg-field">
                    <label>Mật khẩu *</label>
                    <div className="lg-input-wrap">
                      <span className="lg-input-icon">🔒</span>
                      <input type={showPw ? 'text' : 'password'} placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)" value={form.password} onChange={e => setForm(f => ({...f, password: e.target.value}))} required />
                      <button type="button" className="lg-pw-toggle" onClick={() => setShowPw(!showPw)}>
                        {showPw ? '🙈' : '👁️'}
                      </button>
                    </div>
                  </div>
                  <div className="lg-field">
                    <label>{role === 'student' ? 'MSSV' : 'Mã cán bộ'}</label>
                    <div className="lg-input-wrap">
                      <span className="lg-input-icon">🆔</span>
                      <input placeholder={role === 'student' ? '20210001' : 'CB001'} value={form.mssv} onChange={e => setForm(f => ({...f, mssv: e.target.value}))} />
                    </div>
                  </div>
                  <div className="lg-field">
                    <label>Trường *</label>
                    <div className="lg-input-wrap">
                      <span className="lg-input-icon">🏫</span>
                      <input placeholder="ĐH Bách Khoa TP.HCM" value={form.school} onChange={e => setForm(f => ({...f, school: e.target.value}))} required />
                    </div>
                  </div>
                  <div className="lg-field">
                    <label>{role === 'student' ? 'Khoa / Ngành' : 'Chức vụ'}</label>
                    <div className="lg-input-wrap">
                      <span className="lg-input-icon">📋</span>
                      <input placeholder={role === 'student' ? 'Khoa CNTT' : 'Phó ban Phong trào'} value={form.faculty} onChange={e => setForm(f => ({...f, faculty: e.target.value}))} />
                    </div>
                  </div>

                  {error && <div className="lg-error">⚠️ {error}</div>}

                  <button type="submit" className="lg-submit" disabled={loading}>
                    {loading ? '⏳ Đang xử lý...' : '🚀 Đăng ký & Đăng nhập'}
                  </button>
                </form>

                <div className="lg-divider"><span>hoặc</span></div>

                <button className="lg-google" onClick={handleGoogleLogin} disabled={loading}>
                  <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                  Đăng ký với Google
                </button>

                <p className="lg-switch">
                  Đã có tài khoản? <button onClick={() => { setMode('login'); setError(''); }}>Đăng nhập tại đây</button>
                </p>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="lg-footer">
            <span>FiveGood Journey · SV5T Copilot</span>
            <span>Powered by Groq AI + Supabase</span>
          </div>
        </div>
      </div>
    </div>
  );
}
