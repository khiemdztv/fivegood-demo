'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: 'Trang chủ', icon: '🏠' },
  { href: '/dashboard', label: 'Dashboard SV', icon: '🎓' },
  { href: '/mentor', label: 'AI Mentor', icon: '🤖' },
  { href: '/upload', label: 'Upload MC', icon: '📄' },
  { href: '/reviewer', label: 'Reviewer', icon: '🏛️' },
  { href: '/passport', label: 'Digital Passport', icon: '🎫' },
  { href: '/architecture', label: 'Kiến trúc', icon: '📐' },
];

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
        <div className="sidebar-logo">
          <span className="sidebar-logo-icon">⭐</span>
          <span>FiveGood Journey</span>
        </div>
        <div className="sidebar-badge">SV5T Copilot Demo</div>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
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
        </nav>
        <div className="sidebar-footer">
          <div className="sidebar-footer-badge">Vietnamese Student HackAIthon 2026</div>
          <div className="sidebar-footer-text">Bảng B · Đề tài 5</div>
        </div>
      </aside>
    </>
  );
}
