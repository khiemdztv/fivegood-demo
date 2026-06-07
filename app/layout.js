'use client';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import { AuthProvider, useAuth } from '@/lib/auth';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

function LayoutInner({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { role, loading } = useAuth();
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

  // Trang landing: không cần auth
  if (isLandingPage) {
    return (
      <>
        <div className="mobile-header">
          <button className="menu-btn" onClick={() => setSidebarOpen(true)}>☰</button>
          <span className="mobile-header-title">⭐ FiveGood Journey</span>
        </div>
        {role && <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />}
        <main className={role ? 'main-content' : ''} style={!role ? { marginLeft: 0 } : undefined}>
          {children}
        </main>
      </>
    );
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

  return (
    <>
      <div className="mobile-header">
        <button className="menu-btn" onClick={() => setSidebarOpen(true)}>☰</button>
        <span className="mobile-header-title">⭐ FiveGood Journey</span>
      </div>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="main-content">
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
