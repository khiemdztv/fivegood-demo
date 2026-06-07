'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';

const navConfig = {
  student: [
    { label: 'HÀNH TRÌNH SV5T', items: [
      { href: '/dashboard', label: 'Dashboard', icon: '🎓' },
      { href: '/mentor', label: 'AI Mentor', icon: '🤖' },
      { href: '/upload', label: 'Upload MC', icon: '📄' },
      { href: '/passport', label: 'Digital Passport', icon: '🎫' },
    ]},
    { label: 'HỆ THỐNG', items: [
      { href: '/architecture', label: 'Kiến trúc', icon: '📐' },
    ]},
  ],
  reviewer: [
    { label: 'CÔNG TÁC HỘI', items: [
      { href: '/reviewer', label: 'Duyệt hồ sơ', icon: '🏛️' },
      { href: '/analytics', label: 'Thống kê & Báo cáo', icon: '📊' },
    ]},
    { label: 'CÔNG CỤ HỖ TRỢ', items: [
      { href: '/mentor', label: 'AI Copilot', icon: '🤖' },
      { href: '/upload', label: 'Kiểm tra MC', icon: '🔍' },
    ]},
    { label: 'HỆ THỐNG', items: [
      { href: '/architecture', label: 'Kiến trúc', icon: '📐' },
    ]},
  ],
};

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const router = useRouter();
  const { role, user, logout } = useAuth();

  if (!role || !user) return null;

  const sections = navConfig[role] || [];

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
        <div className="sidebar-logo">
          <span className="sidebar-logo-icon">⭐</span>
          <span>FiveGood Journey</span>
        </div>

        {/* User Info */}
        <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: `linear-gradient(135deg, ${user.color}40, ${user.color}15)`, border: `1px solid ${user.color}50`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>
              {user.icon}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</div>
              <div style={{ fontSize: '10px', color: user.color, fontWeight: 600 }}>{user.label}</div>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {sections.map((section, si) => (
            <div key={si}>
              <div style={{
                fontSize: '9px', fontWeight: 700, color: 'var(--muted)',
                textTransform: 'uppercase', letterSpacing: '0.1em',
                padding: '14px 20px 4px', marginTop: si > 0 ? '4px' : 0,
              }}>
                {section.label}
              </div>
              {section.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`sidebar-link ${pathname === item.href ? 'sidebar-link--active' : ''}`}
                  onClick={onClose}
                >
                  <span className="sidebar-link-icon">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          ))}
        </nav>

        {/* Logout */}
        <div className="sidebar-footer">
          <button onClick={handleLogout} style={{
            width: '100%', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: '8px', padding: '8px', color: 'var(--red)', fontSize: '12px', fontWeight: 600,
            cursor: 'pointer', fontFamily: "'Be Vietnam Pro', sans-serif", transition: 'all 0.2s',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '10px',
          }}>
            🚪 Đổi vai trò
          </button>
          <div className="sidebar-footer-text" style={{ textAlign: 'center' }}>HackAIthon 2026 · Bảng B · Đề tài 5</div>
        </div>
      </aside>
    </>
  );
}
