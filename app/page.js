'use client';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function HomePage() {
  const { login, getUsers, ROLE_DEFAULTS } = useAuth();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
      const sections = ['overview','features','process','showcase','architecture','impact','demo'];
      for (const id of [...sections].reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 200) { setActiveSection(id); break; }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const go = (role) => {
    router.push(`/login?role=${role}`);
  };

  const navLinks = [
    { id: 'overview', label: 'Tổng quan' },
    { id: 'features', label: 'Tính năng' },
    { id: 'process', label: 'Quy trình' },
    { id: 'impact', label: 'Hiệu quả' },
    { id: 'demo', label: 'Trải nghiệm' },
  ];

  return (
    <div className="fg">
      {/* Background effects */}
      <div className="fg-bg-orb fg-bg-orb--1" />
      <div className="fg-bg-orb fg-bg-orb--2" />
      <div className="fg-bg-orb fg-bg-orb--3" />
      {/* ━━ NAV ━━ */}
      <nav className={`fg-nav ${scrolled ? 'fg-nav--s' : ''}`}>
        <div className="fg-nav-inner">
          <Link href="/" className="fg-logo">⭐ FiveGood Journey</Link>
          <div className="fg-nav-links">
            {navLinks.map(n => (
              <a key={n.id} href={`#${n.id}`} className={`fg-nav-link ${activeSection === n.id ? 'fg-nav-link--active' : ''}`}>{n.label}</a>
            ))}
          </div>
          <Link href="/login" className="fg-nav-cta">Đăng nhập</Link>
        </div>
      </nav>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          SECTION 1 — HERO
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section id="overview" className="fg-hero">
        <div className="fg-hero-glow" />
        <div className="fg-hero-inner">
          {/* Left */}
          <div className="fg-hero-left">
            <div className="fg-badge">🏆 HackAIthon 2026 · Bảng B · Đề tài 5</div>
            <h1 className="fg-hero-h1">
              <span className="fg-hero-h1-brand">FiveGood Journey</span>
              <span className="fg-hero-h1-sub">Nền tảng AI hỗ trợ toàn bộ</span>
              <span className="fg-hero-h1-sub">hành trình <strong className="fg-hero-accent">Sinh viên 5 Tốt</strong></span>
            </h1>
            <p className="fg-hero-desc">
              Từ chuẩn bị minh chứng, kiểm tra bằng AI, xét duyệt<br/>
              đến Digital Passport — tất cả trên một nền tảng duy nhất.
            </p>
            <div className="fg-hero-ctas">
              <button className="fg-btn fg-btn--primary" onClick={() => go('student')}>Trải nghiệm ngay →</button>
              <Link href="/architecture" className="fg-btn fg-btn--ghost">Xem Demo ▶</Link>
            </div>
            <div className="fg-trust">
              {['🤖 AI hỗ trợ 24/7', '⚡ Xử lý nhanh 3-5 phút', '🔒 Bảo mật tuyệt đối'].map((t,i) => (
                <span key={i} className="fg-trust-item">{t}</span>
              ))}
            </div>
          </div>

          {/* Right — Dashboard Mockup */}
          <div className="fg-hero-right">
            <div className="fg-mock">
              {/* Sidebar mini */}
              <div className="fg-mock-side">
                <div className="fg-mock-side-logo">⭐</div>
                {['📊 Tổng quan','📁 Hồ sơ của tôi','🤖 AI Mentor','🎫 Digital Passport','📋 Thống kê','⚙️ Cài đặt'].map((item,i) => (
                  <div key={i} className={`fg-mock-side-item ${i===0?'fg-mock-side-item--active':''}`}>{item}</div>
                ))}
              </div>

              {/* Main content */}
              <div className="fg-mock-main">
                {/* Top bar */}
                <div className="fg-mock-topbar">
                  <div className="fg-mock-user">
                    <span className="fg-mock-user-name">Xin chào, <strong>Nguyễn Văn A</strong> 👋</span>
                    <span className="fg-mock-user-sub">Đây là tổng quan hồ sơ SV5T của bạn</span>
                  </div>
                  <div className="fg-mock-score-wrap">
                    <span className="fg-mock-score-label">Hoàn thành hồ sơ</span>
                    <div className="fg-mock-score-ring">
                      <svg viewBox="0 0 36 36">
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#1e293b" strokeWidth="3"/>
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#7C5CFF" strokeWidth="3" strokeDasharray="82, 100" strokeLinecap="round"/>
                      </svg>
                      <span>82%</span>
                    </div>
                    <span className="fg-mock-score-detail">325 / 395 điểm</span>
                  </div>
                </div>

                {/* 5 criteria */}
                <div className="fg-mock-criteria-label">5 tiêu chí SV5T</div>
                <div className="fg-mock-criteria">
                  {[
                    { name: 'Đạo đức', pct: 100, color: '#22c55e' },
                    { name: 'Học tập', pct: 90, color: '#3B82F6' },
                    { name: 'Thể lực', pct: 70, color: '#f59e0b' },
                    { name: 'Tình nguyện', pct: 90, color: '#7C5CFF' },
                    { name: 'Hội nhập', pct: 50, color: '#ec4899' },
                  ].map((c,i) => (
                    <div key={i} className="fg-mock-crit">
                      <span className="fg-mock-crit-name">{c.name}</span>
                      <div className="fg-mock-crit-bar"><div style={{width:`${c.pct}%`,background:c.color}}/></div>
                      <span className="fg-mock-crit-pct" style={{color:c.color}}>{c.pct}%</span>
                    </div>
                  ))}
                </div>

                {/* Bottom cards */}
                <div className="fg-mock-bottom">
                  <div className="fg-mock-card">
                    <div className="fg-mock-card-h">🤖 AI Mentor gợi ý</div>
                    <ul className="fg-mock-card-list">
                      <li>Bạn còn thiếu 2 hoạt động tình nguyện</li>
                      <li>Tham gia 1 hoạt động hội nhập quốc tế</li>
                      <li>Bổ sung chứng chỉ ngoại ngữ</li>
                    </ul>
                    <span className="fg-mock-card-link">Chat với AI Mentor →</span>
                  </div>
                  <div className="fg-mock-card">
                    <div className="fg-mock-card-h">📄 Hồ sơ còn thiếu</div>
                    <ul className="fg-mock-card-list">
                      <li>Giấy chứng nhận tình nguyện (1)</li>
                      <li>Minh chứng hội nhập (1)</li>
                    </ul>
                    <span className="fg-mock-card-link fg-mock-card-link--blue">Xem chi tiết →</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          SECTION 2 — CORE FEATURES
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section id="features" className="fg-section fg-section--alt">
        <div className="fg-container">
          <h2 className="fg-h2">Nền tảng AI toàn diện</h2>
          <div className="fg-features">
            {[
              { icon: '🤖', title: 'AI Mentor', desc: 'AI đồng hành, gợi ý hoạt động và kiểm tra tiến độ đạt chuẩn.', detail: 'Bạn còn thiếu gì để đạt SV5T?', sub: ['2 hoạt động tình nguyện', '1 hoạt động hội nhập', 'Giấy chứng nhận ngoại ngữ'], tag: 'Confidence: 96%' },
              { icon: '📷', title: 'OCR & Xác thực', desc: 'Công nghệ OCR trích xuất và xác minh minh chứng chính xác.', detail: 'Trích xuất tự động', sub: ['Họ tên, MSSV', 'Ngày, nơi cấp', 'Loại chứng chỉ'], tag: 'Độ tin cậy: 98%' },
              { icon: '🎫', title: 'Digital Passport', desc: 'Lưu trữ thành tích, xuất hồ sơ SV5T điện tử chỉ 1 click.', detail: 'Digital Passport', sub: ['Nguyễn Văn A', 'MSSV: 20210001', 'ĐH Bách Khoa'], tag: null },
              { icon: '📊', title: 'Committee Dashboard', desc: 'Duyệt hồ sơ hàng loạt, thống kê và báo cáo tự động.', detail: 'Thống kê hồ sơ', sub: ['1,248 hồ sơ', 'Duyệt: 89%', 'Chờ xét: 11%'], tag: null },
            ].map((f,i) => (
              <div key={i} className="fg-feat">
                <div className="fg-feat-top">
                  <div className="fg-feat-icon">{f.icon}</div>
                  <h3 className="fg-feat-title">{f.title}</h3>
                  <p className="fg-feat-desc">{f.desc}</p>
                </div>
                {/* Mini preview */}
                <div className="fg-feat-preview">
                  <div className="fg-feat-preview-h">{f.detail}</div>
                  <ul className="fg-feat-preview-list">
                    {f.sub.map((s,j) => <li key={j}>• {s}</li>)}
                  </ul>
                  {f.tag && <div className="fg-feat-preview-tag">{f.tag}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          SECTION 3 — PRODUCT FLOW
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section id="process" className="fg-section">
        <div className="fg-container">
          <h2 className="fg-h2">Quy trình hoạt động</h2>
          <div className="fg-flow">
            <div className="fg-flow-line" />
            {[
              { num: '01', icon: '📤', title: 'Upload minh chứng', desc: 'Sinh viên tải lên minh chứng cho các tiêu chí' },
              { num: '02', icon: '🔄', title: 'OCR & AI kiểm tra', desc: 'Hệ thống OCR trích xuất và AI kiểm tra, đánh giá' },
              { num: '03', icon: '🤖', title: 'AI đánh giá & gợi ý', desc: 'AI phân tích, đánh giá và gợi ý hoạt động còn thiếu' },
              { num: '04', icon: '👥', title: 'Cán bộ Hội xét duyệt', desc: 'Cán bộ Hội xem xét và duyệt hồ sơ' },
              { num: '05', icon: '✅', title: 'Hoàn thành', desc: 'Cập nhật kết quả và lưu trong Digital Passport' },
            ].map((s,i) => (
              <div key={i} className="fg-flow-step">
                <div className="fg-flow-num">{s.num}</div>
                <div className="fg-flow-icon">{s.icon}</div>
                <div className="fg-flow-title">{s.title}</div>
                <div className="fg-flow-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          SECTION 4 — AI SHOWCASE
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section id="showcase" className="fg-section fg-section--alt">
        <div className="fg-container">
          <h2 className="fg-h2">AI Showcase</h2>
          <div className="fg-showcase">
            {/* AI Mentor Chat */}
            <div className="fg-show-card">
              <div className="fg-show-label">AI Mentor</div>
              <div className="fg-chat">
                <div className="fg-chat-msg fg-chat-msg--user">
                  <div className="fg-chat-ava fg-chat-ava--user">SV</div>
                  <div className="fg-chat-bubble">
                    <div className="fg-chat-role">Sinh viên</div>
                    Tôi còn thiếu gì để đạt SV5T?
                  </div>
                </div>
                <div className="fg-chat-msg fg-chat-msg--ai">
                  <div className="fg-chat-ava fg-chat-ava--ai">🤖</div>
                  <div className="fg-chat-bubble fg-chat-bubble--ai">
                    <div className="fg-chat-role">AI Mentor</div>
                    Bạn còn thiếu:
                    <ul>
                      <li>• 10 giờ tình nguyện</li>
                      <li>• 1 hoạt động hội nhập</li>
                      <li>• Chứng chỉ ngoại ngữ</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* OCR Extraction */}
            <div className="fg-show-card">
              <div className="fg-show-label">OCR trích xuất</div>
              <div className="fg-ocr">
                <div className="fg-ocr-doc">
                  <div className="fg-ocr-doc-icon">📄</div>
                  <span>giay_xac_nhan.pdf</span>
                </div>
                <div className="fg-ocr-arrow">→</div>
                <div className="fg-ocr-result">
                  <div className="fg-ocr-row"><span>Họ tên</span><strong>Nguyễn Văn A</strong></div>
                  <div className="fg-ocr-row"><span>Đơn vị</span><strong>THCS Hồ Chí Minh</strong></div>
                  <div className="fg-ocr-row"><span>Thời gian</span><strong>12/03/2025</strong></div>
                  <div className="fg-ocr-row"><span>Kết quả</span><strong className="fg-ocr-pass">Hợp lệ (98%)</strong></div>
                </div>
              </div>
            </div>

            {/* AI Scoring */}
            <div className="fg-show-card">
              <div className="fg-show-label">AI Scoring</div>
              <div className="fg-scoring">
                <div className="fg-scoring-ring">
                  <svg viewBox="0 0 36 36">
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#1e293b" strokeWidth="2.5"/>
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeDasharray="98, 100" strokeLinecap="round"/>
                  </svg>
                  <div className="fg-scoring-val">98<span>%</span></div>
                  <div className="fg-scoring-sub">Confidence</div>
                </div>
                <div className="fg-scoring-list">
                  <div className="fg-scoring-label">Đủ điều kiện:</div>
                  {['Đạo đức','Học tập','Thể lực','Tình nguyện','Hội nhập'].map((c,i) => (
                    <div key={i} className="fg-scoring-item">
                      <span className="fg-scoring-check">✓</span> {c}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          SECTION 5 — ARCHITECTURE
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section id="architecture" className="fg-section">
        <div className="fg-container">
          <h2 className="fg-h2">Kiến trúc hệ thống</h2>
          <div className="fg-arch">
            {[
              { icon: '⚛️', title: 'Frontend', sub: 'Next.js' },
              { icon: '🗄️', title: 'Backend', sub: 'Supabase' },
              { icon: '🧠', title: 'AI Layer', sub: 'Groq + Llama 3.3' },
              { icon: '📷', title: 'OCR Service', sub: 'VNPT OCR' },
              { icon: '💾', title: 'Storage', sub: 'Supabase Storage' },
            ].map((a,i) => (
              <div key={i} className="fg-arch-item">
                {i > 0 && <div className="fg-arch-arrow">- - - →</div>}
                <div className="fg-arch-card">
                  <div className="fg-arch-icon">{a.icon}</div>
                  <div className="fg-arch-title">{a.title}</div>
                  <div className="fg-arch-sub">{a.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          SECTION 6 — IMPACT
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section id="impact" className="fg-section fg-section--alt">
        <div className="fg-container">
          <h2 className="fg-h2">Hiệu quả vượt trội</h2>
          <div className="fg-impact">
            {[
              { icon: '📄', value: '12,450+', label: 'Minh chứng đã xử lý', color: '#3B82F6' },
              { icon: '⚡', value: '3.2 phút', label: 'Thời gian duyệt trung bình', color: '#f59e0b' },
              { icon: '🎯', value: '96%', label: 'Độ chính xác OCR', color: '#22c55e' },
              { icon: '📉', value: '82%', label: 'Giảm thao tác thủ công', color: '#7C5CFF' },
            ].map((m,i) => (
              <div key={i} className="fg-impact-card">
                <div className="fg-impact-icon" style={{color:m.color, background:`${m.color}15`}}>{m.icon}</div>
                <div className="fg-impact-value">{m.value}</div>
                <div className="fg-impact-label">{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          SECTION 7 — DEMO ACCESS
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section id="demo" className="fg-section">
        <div className="fg-container">
          <h2 className="fg-h2">Trải nghiệm nền tảng</h2>
          <p className="fg-h2-sub">Chọn vai trò để khám phá các tính năng phù hợp</p>
          <div className="fg-demo">
            <div className="fg-demo-card fg-demo-card--sv">
              <div className="fg-demo-header">
                <span className="fg-demo-tag">Trải nghiệm với vai trò</span>
                <h3>Sinh viên</h3>
              </div>
              <ul className="fg-demo-list">
                <li>◇ Dashboard cá nhân</li>
                <li>◇ AI Mentor 24/7</li>
                <li>◇ Digital Passport</li>
              </ul>
              <button className="fg-btn fg-btn--primary fg-btn--full" onClick={() => go('student')}>
                Vào Demo Sinh viên →
              </button>
            </div>
            <div className="fg-demo-card fg-demo-card--cb">
              <div className="fg-demo-header">
                <span className="fg-demo-tag">Trải nghiệm với vai trò</span>
                <h3>Cán bộ Hội</h3>
              </div>
              <ul className="fg-demo-list">
                <li>◇ Duyệt hồ sơ hàng loạt</li>
                <li>◇ Thống kê & báo cáo</li>
                <li>◇ Batch Processing</li>
              </ul>
              <button className="fg-btn fg-btn--violet fg-btn--full" onClick={() => go('reviewer')}>
                Vào Demo Cán bộ Hội →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ━━ FOOTER ━━ */}
      <footer className="fg-footer">
        <div className="fg-footer-inner">
          <span>© 2026 FiveGood Journey. All rights reserved.</span>
          <div className="fg-footer-links">
            <a href="#">GitHub</a>
            <a href="#">Documentation</a>
            <a href="#">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
