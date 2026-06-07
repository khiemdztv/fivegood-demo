'use client';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const { login, register, getUsers, ROLE_DEFAULTS } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState('select'); // select | register | accounts
  const [regRole, setRegRole] = useState('student');
  const [form, setForm] = useState({ name: '', mssv: '', school: '', faculty: '' });
  const [error, setError] = useState('');

  const [regLoading, setRegLoading] = useState(false);

  const handleQuickLogin = (role) => {
    const defaults = {
      student: { name: 'Nguyễn Minh Anh', mssv: '20210001', school: 'ĐH Bách Khoa TP.HCM', faculty: 'Khoa CNTT' },
      reviewer: { name: 'Trần Văn Bình', mssv: 'CB001', school: 'ĐH Bách Khoa TP.HCM', faculty: 'Phó ban Phong trào' },
    };
    const d = defaults[role];
    const rd = ROLE_DEFAULTS[role];
    login({
      id: Date.now(), name: d.name, mssv: d.mssv, school: d.school, faculty: d.faculty,
      role, label: rd.label, icon: rd.icon, color: rd.color, homePath: rd.homePath,
      sub: role === 'student' ? `MSSV: ${d.mssv} · ${d.faculty} · ${d.school}` : `${d.faculty} · ${d.school}`,
    });
    router.push(rd.homePath);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.school.trim()) {
      setError('Vui lòng điền đầy đủ họ tên và trường');
      return;
    }
    setRegLoading(true);
    setError('');
    try {
      const newUser = await register(form.name, form.mssv, form.school, form.faculty, regRole);
      login(newUser);
      router.push(newUser.homePath);
    } catch (err) {
      setError('Đăng ký thất bại: ' + err.message);
      setRegLoading(false);
    }
  };

  const handleSelectAccount = (user) => {
    login(user);
    router.push(user.homePath);
  };

  const users = typeof window !== 'undefined' ? getUsers() : [];

  const inputStyle = {
    width: '100%', padding: '10px 14px', background: '#0f172a', border: '1px solid #243050',
    borderRadius: '8px', color: '#e2e8f0', fontSize: '13px', fontFamily: "'Be Vietnam Pro', sans-serif",
    outline: 'none', transition: 'border 0.2s',
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0b0f1a 0%, #0f172a 40%, #1e1b4b 100%)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '-120px', right: '-80px', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }}></div>
      <div style={{ position: 'absolute', bottom: '-100px', left: '-60px', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }}></div>

      <div style={{ maxWidth: '540px', width: '100%', padding: '0 24px', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>⭐</div>
          <h1 style={{ fontSize: '32px', fontWeight: 800, background: 'linear-gradient(135deg, #e2e8f0 0%, #93c5fd 50%, #c4b5fd 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: '8px' }}>
            FiveGood Journey
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '14px' }}>Nền tảng AI hỗ trợ hành trình Sinh viên 5 Tốt</p>
          <div style={{ marginTop: '12px', display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)', borderRadius: '100px', padding: '4px 14px', fontSize: '10px', fontWeight: 600, color: '#3b82f6', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            🏆 HackAIthon 2026 · Bảng B · Đề tài 5
          </div>
        </div>

        {/* MODE: SELECT */}
        {mode === 'select' && (
          <>
            <div style={{ marginBottom: '16px', textAlign: 'center', fontSize: '13px', color: '#64748b', fontWeight: 600 }}>
              Chọn vai trò để truy cập nhanh
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {[
                { role: 'student', icon: '🎓', label: 'Sinh viên', color: '#3b82f6', grad: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', features: ['Dashboard cá nhân', 'AI Mentor hỏi đáp', 'Upload minh chứng', 'Digital Passport'] },
                { role: 'reviewer', icon: '🏛️', label: 'Cán bộ Hội', color: '#8b5cf6', grad: 'linear-gradient(135deg, #8b5cf6, #ec4899)', features: ['Duyệt hồ sơ SV5T', 'Thống kê & Báo cáo', 'AI Copilot hỗ trợ', 'Batch Processing'] },
              ].map((r) => (
                <button key={r.role} onClick={() => handleQuickLogin(r.role)} style={{
                  background: '#1a2236', border: '1px solid #243050', borderRadius: '16px',
                  padding: '28px 16px', cursor: 'pointer', transition: 'all 0.3s',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px',
                  fontFamily: "'Be Vietnam Pro', sans-serif", color: '#e2e8f0',
                }} onMouseOver={e => { e.currentTarget.style.borderColor = r.color; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 8px 30px ${r.color}25`; }}
                   onMouseOut={e => { e.currentTarget.style.borderColor = '#243050'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: `linear-gradient(135deg, ${r.color}20, ${r.color}05)`, border: `2px solid ${r.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>{r.icon}</div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: r.color }}>{r.label}</div>
                  <div style={{ fontSize: '10px', color: '#64748b', lineHeight: 1.5, textAlign: 'center' }}>
                    {r.features.map((f, i) => <span key={i}>{f}<br/></span>)}
                  </div>
                  <div style={{ marginTop: '2px', background: r.grad, padding: '7px 20px', borderRadius: '8px', fontSize: '11px', fontWeight: 600, color: 'white' }}>
                    Truy cập nhanh →
                  </div>
                </button>
              ))}
            </div>

            {/* Register & Account buttons */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button onClick={() => setMode('register')} style={{
                flex: 1, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)',
                borderRadius: '10px', padding: '12px', color: '#10b981', fontSize: '13px', fontWeight: 600,
                cursor: 'pointer', fontFamily: "'Be Vietnam Pro', sans-serif", transition: 'all 0.2s',
              }}>
                ✨ Đăng ký tài khoản mới
              </button>
              {users.length > 0 && (
                <button onClick={() => setMode('accounts')} style={{
                  flex: 1, background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.25)',
                  borderRadius: '10px', padding: '12px', color: '#3b82f6', fontSize: '13px', fontWeight: 600,
                  cursor: 'pointer', fontFamily: "'Be Vietnam Pro', sans-serif", transition: 'all 0.2s',
                }}>
                  👥 Tài khoản đã đăng ký ({users.length})
                </button>
              )}
            </div>
          </>
        )}

        {/* MODE: REGISTER */}
        {mode === 'register' && (
          <div style={{ background: '#1a2236', border: '1px solid #243050', borderRadius: '16px', padding: '28px' }}>
            <div style={{ fontSize: '16px', fontWeight: 700, color: '#e2e8f0', marginBottom: '4px' }}>✨ Đăng ký tài khoản</div>
            <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '20px' }}>Tạo tài khoản để sử dụng FiveGood Journey</div>

            {/* Role selector */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              {[
                { role: 'student', icon: '🎓', label: 'Sinh viên', color: '#3b82f6' },
                { role: 'reviewer', icon: '🏛️', label: 'Cán bộ Hội', color: '#8b5cf6' },
              ].map(r => (
                <button key={r.role} onClick={() => setRegRole(r.role)} style={{
                  flex: 1, padding: '10px', borderRadius: '8px', cursor: 'pointer',
                  fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: '12px', fontWeight: 600,
                  background: regRole === r.role ? `${r.color}15` : 'transparent',
                  border: `1px solid ${regRole === r.role ? r.color : '#243050'}`,
                  color: regRole === r.role ? r.color : '#64748b', transition: 'all 0.2s',
                }}>
                  {r.icon} {r.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600, marginBottom: '4px', display: 'block' }}>Họ và tên *</label>
                <input style={inputStyle} placeholder="Nguyễn Văn A" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} onFocus={e => e.target.style.borderColor = '#3b82f6'} onBlur={e => e.target.style.borderColor = '#243050'} />
              </div>
              <div>
                <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600, marginBottom: '4px', display: 'block' }}>{regRole === 'student' ? 'MSSV' : 'Mã cán bộ'}</label>
                <input style={inputStyle} placeholder={regRole === 'student' ? '20210001' : 'CB001'} value={form.mssv} onChange={e => setForm(f => ({...f, mssv: e.target.value}))} onFocus={e => e.target.style.borderColor = '#3b82f6'} onBlur={e => e.target.style.borderColor = '#243050'} />
              </div>
              <div>
                <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600, marginBottom: '4px', display: 'block' }}>Trường *</label>
                <input style={inputStyle} placeholder="ĐH Bách Khoa TP.HCM" value={form.school} onChange={e => setForm(f => ({...f, school: e.target.value}))} onFocus={e => e.target.style.borderColor = '#3b82f6'} onBlur={e => e.target.style.borderColor = '#243050'} />
              </div>
              <div>
                <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600, marginBottom: '4px', display: 'block' }}>{regRole === 'student' ? 'Khoa / Ngành' : 'Chức vụ'}</label>
                <input style={inputStyle} placeholder={regRole === 'student' ? 'Khoa CNTT' : 'Phó ban Phong trào'} value={form.faculty} onChange={e => setForm(f => ({...f, faculty: e.target.value}))} onFocus={e => e.target.style.borderColor = '#3b82f6'} onBlur={e => e.target.style.borderColor = '#243050'} />
              </div>

              {error && <div style={{ color: '#ef4444', fontSize: '12px', padding: '8px', background: 'rgba(239,68,68,0.08)', borderRadius: '6px' }}>⚠️ {error}</div>}

              <button type="submit" style={{
                width: '100%', padding: '12px', borderRadius: '10px', border: 'none',
                background: regRole === 'student' ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                color: 'white', fontSize: '14px', fontWeight: 700, cursor: 'pointer',
                fontFamily: "'Be Vietnam Pro', sans-serif", transition: 'all 0.2s',
              }}>
                🚀 Đăng ký & Đăng nhập
              </button>
            </form>

            <button onClick={() => { setMode('select'); setError(''); }} style={{
              width: '100%', marginTop: '10px', padding: '10px', background: 'transparent',
              border: '1px solid #243050', borderRadius: '8px', color: '#64748b', fontSize: '12px',
              cursor: 'pointer', fontFamily: "'Be Vietnam Pro', sans-serif",
            }}>
              ← Quay lại
            </button>
          </div>
        )}

        {/* MODE: ACCOUNTS */}
        {mode === 'accounts' && (
          <div style={{ background: '#1a2236', border: '1px solid #243050', borderRadius: '16px', padding: '28px' }}>
            <div style={{ fontSize: '16px', fontWeight: 700, color: '#e2e8f0', marginBottom: '4px' }}>👥 Tài khoản đã đăng ký</div>
            <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '16px' }}>Chọn tài khoản để đăng nhập</div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '300px', overflow: 'auto' }}>
              {users.map((u, i) => (
                <button key={i} onClick={() => handleSelectAccount(u)} style={{
                  display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px',
                  background: 'rgba(255,255,255,0.02)', border: '1px solid #243050', borderRadius: '10px',
                  cursor: 'pointer', fontFamily: "'Be Vietnam Pro', sans-serif", color: '#e2e8f0',
                  transition: 'all 0.2s', textAlign: 'left', width: '100%',
                }} onMouseOver={e => { e.currentTarget.style.borderColor = u.color; e.currentTarget.style.background = `${u.color}08`; }}
                   onMouseOut={e => { e.currentTarget.style.borderColor = '#243050'; e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: `${u.color}15`, border: `1px solid ${u.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>{u.icon}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: 700 }}>{u.name}</div>
                    <div style={{ fontSize: '10px', color: u.color, fontWeight: 600 }}>{u.label}</div>
                    <div style={{ fontSize: '10px', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.sub}</div>
                  </div>
                  <div style={{ color: u.color, fontSize: '14px' }}>→</div>
                </button>
              ))}
            </div>

            <button onClick={() => setMode('select')} style={{
              width: '100%', marginTop: '12px', padding: '10px', background: 'transparent',
              border: '1px solid #243050', borderRadius: '8px', color: '#64748b', fontSize: '12px',
              cursor: 'pointer', fontFamily: "'Be Vietnam Pro', sans-serif",
            }}>
              ← Quay lại
            </button>
          </div>
        )}

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '11px', color: '#475569' }}>
          FiveGood Journey · SV5T Copilot · Powered by Groq AI + Supabase
        </div>
      </div>
    </div>
  );
}
