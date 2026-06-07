'use client';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import { useState } from 'react';

export default function RootLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <html lang="vi">
      <head>
        <title>FiveGood Journey – SV5T Copilot</title>
        <meta name="description" content="AI đồng hành cùng hành trình Sinh viên 5 tốt – Vietnamese Student HackAIthon 2026" />
      </head>
      <body>
        <div className="mobile-header">
          <button className="menu-btn" onClick={() => setSidebarOpen(true)}>☰</button>
          <span className="mobile-header-title">⭐ FiveGood Journey</span>
        </div>
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="main-content">
          {children}
        </main>
      </body>
    </html>
  );
}
