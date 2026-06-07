'use client';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { login, ROLES } = useAuth();
  const router = useRouter();

  const handleLogin = (role) => {
    login(role);
    router.push(ROLES[role].homePath);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0b0f1a 0%, #0f172a 40%, #1e1b4b 100%)', position: 'relative', overflow: 'hidden' }}>
      {/* Decorative blobs */}
      <div style={{ position: 'absolute', top: '-120px', right: '-80px', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }}></div>
      <div style={{ position: 'absolute', bottom: '-100px', left: '-60px', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }}></div>

      <div style={{ maxWidth: '520px', width: '100%', padding: '0 24px', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>⭐</div>
          <h1 style={{ fontSize: '32px', fontWeight: 800, background: 'linear-gradient(135deg, #e2e8f0 0%, #93c5fd 50%, #c4b5fd 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: '8px' }}>
            FiveGood Journey
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '14px' }}>Nền tảng AI hỗ trợ hành trình Sinh viên 5 Tốt</p>
          <div style={{ marginTop: '12px', display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)', borderRadius: '100px', padding: '4px 14px', fontSize: '10px', fontWeight: 600, color: '#3b82f6', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            🏆 HackAIthon 2026 · Bảng B · Đề tài 5
          </div>
        </div>

        {/* Role Selection */}
        <div style={{ marginBottom: '16px', textAlign: 'center', fontSize: '13px', color: '#64748b', fontWeight: 600 }}>
          Chọn vai trò để truy cập hệ thống
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {/* Student */}
          <button onClick={() => handleLogin('student')} style={{
            background: '#1a2236', border: '1px solid #243050', borderRadius: '16px',
            padding: '32px 20px', cursor: 'pointer', transition: 'all 0.3s',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
            fontFamily: "'Be Vietnam Pro', sans-serif", color: '#e2e8f0',
          }} onMouseOver={e => { e.currentTarget.style.borderColor = '#3b82f6'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(59,130,246,0.15)'; }}
             onMouseOut={e => { e.currentTarget.style.borderColor = '#243050'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(59,130,246,0.05))', border: '2px solid rgba(59,130,246,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' }}>🎓</div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: '#3b82f6' }}>Sinh viên</div>
            <div style={{ fontSize: '11px', color: '#64748b', lineHeight: 1.5, textAlign: 'center' }}>
              Dashboard cá nhân<br/>
              AI Mentor hỏi đáp<br/>
              Upload minh chứng<br/>
              Digital Passport
            </div>
            <div style={{ marginTop: '4px', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', padding: '8px 24px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, color: 'white' }}>
              Đăng nhập →
            </div>
          </button>

          {/* Reviewer */}
          <button onClick={() => handleLogin('reviewer')} style={{
            background: '#1a2236', border: '1px solid #243050', borderRadius: '16px',
            padding: '32px 20px', cursor: 'pointer', transition: 'all 0.3s',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
            fontFamily: "'Be Vietnam Pro', sans-serif", color: '#e2e8f0',
          }} onMouseOver={e => { e.currentTarget.style.borderColor = '#8b5cf6'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(139,92,246,0.15)'; }}
             onMouseOut={e => { e.currentTarget.style.borderColor = '#243050'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(139,92,246,0.05))', border: '2px solid rgba(139,92,246,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' }}>🏛️</div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: '#8b5cf6' }}>Cán bộ Hội</div>
            <div style={{ fontSize: '11px', color: '#64748b', lineHeight: 1.5, textAlign: 'center' }}>
              Duyệt hồ sơ SV5T<br/>
              Thống kê & Báo cáo<br/>
              AI Copilot hỗ trợ<br/>
              Batch Processing
            </div>
            <div style={{ marginTop: '4px', background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', padding: '8px 24px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, color: 'white' }}>
              Đăng nhập →
            </div>
          </button>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '32px', fontSize: '11px', color: '#475569' }}>
          FiveGood Journey · SV5T Copilot · Powered by Groq AI + Supabase
        </div>
      </div>
    </div>
  );
}
