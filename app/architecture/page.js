'use client';

const currentApis = [
  { api: 'Groq Vision', feature: 'OCR Ảnh minh chứng', desc: 'Llama 4 Scout đọc nội dung thật từ ảnh', color: '#10b981' },
  { api: 'Groq LLM', feature: 'AI Mentor chatbot', desc: 'Llama 3.3 70B hỏi đáp SV5T realtime', color: '#3b82f6' },
  { api: 'Groq LLM', feature: 'Phân tích PDF text', desc: 'Trích xuất + bóc tách thông tin minh chứng', color: '#8b5cf6' },
  { api: 'unpdf', feature: 'PDF Text Extraction', desc: 'Trích xuất text từ PDF client-side', color: '#f59e0b' },
  { api: 'Supabase', feature: 'Object Storage', desc: 'Lưu trữ file minh chứng (ảnh, PDF)', color: '#3ecf8e' },
  { api: 'Supabase', feature: 'PostgreSQL DB', desc: 'Database hồ sơ SV5T (vòng 2)', color: '#3ecf8e' },
];

const vnptApis = [
  { api: 'SmartReader', desc: 'OCR bảng điểm, chứng chỉ', color: '#06b6d4' },
  { api: 'eKYC', desc: 'Xác minh CCCD sinh viên', color: '#10b981' },
  { api: 'SmartBot', desc: 'FAQ + LLM tiếng Việt', color: '#8b5cf6' },
  { api: 'SmartVoice', desc: 'STT & TTS tiếng Việt', color: '#ef4444' },
  { api: 'SmartUX', desc: 'Phân tích UX người dùng', color: '#f59e0b' },
  { api: 'SmartVision', desc: 'Nhận dạng ảnh minh chứng', color: '#3b82f6' },
  { api: 'vnSocial', desc: 'Xác minh hoạt động MXH', color: '#ec4899' },
  { api: 'vnFace', desc: 'Nhận dạng khuôn mặt', color: '#06b6d4' },
];

export default function ArchitecturePage() {
  return (
    <div className="page-container">
      <div className="section-header fade-in">
        <div className="section-num">📐</div>
        <div>
          <h2>Kiến trúc hệ thống</h2>
          <p>Thiết kế tổng quan FiveGood Journey – Demo Vòng 1</p>
        </div>
      </div>

      {/* Architecture Diagram */}
      <div className="card fade-in">
        <div className="card-title">🏗️ Kiến trúc Logic – Vòng 1 (Demo hiện tại)</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
          {/* Users Layer */}
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', width: '100%' }}>
            {[
              { icon: '🎓', label: 'Sinh viên', color: '#3b82f6' },
              { icon: '🏛️', label: 'Cán bộ Hội', color: '#8b5cf6' },
            ].map((u, i) => (
              <div key={i} className="arch-box" style={{ borderColor: u.color, flex: 1, maxWidth: '220px' }}>
                <div style={{ fontSize: '24px', marginBottom: '4px' }}>{u.icon}</div>
                <div style={{ color: u.color, fontWeight: 600 }}>{u.label}</div>
              </div>
            ))}
          </div>

          <div className="arch-arrow">▼</div>

          {/* Login */}
          <div className="arch-box" style={{ width: '50%', borderColor: '#f59e0b', background: 'rgba(245,158,11,0.06)' }}>
            <div style={{ color: '#f59e0b', marginBottom: '4px' }}>🔐 Login & Phân quyền</div>
            <div style={{ fontSize: '10px', color: 'var(--muted)' }}>Role-based: Sinh viên ↔ Cán bộ Hội · localStorage</div>
          </div>

          <div className="arch-arrow">▼</div>

          {/* Frontend */}
          <div className="arch-box" style={{ width: '70%', borderColor: 'var(--accent2)', background: 'rgba(6,182,212,0.06)' }}>
            <div style={{ color: 'var(--accent2)', marginBottom: '4px' }}>🌐 Frontend (Next.js 15 App Router)</div>
            <div style={{ fontSize: '10px', color: 'var(--muted)' }}>React · Vanilla CSS · Vercel Deploy · Mobile-first</div>
          </div>

          <div className="arch-arrow">▼</div>

          {/* API Routes */}
          <div className="arch-box" style={{ width: '70%', borderColor: 'var(--accent)', background: 'rgba(59,130,246,0.06)' }}>
            <div style={{ color: 'var(--accent)', marginBottom: '4px' }}>⚡ Next.js API Routes (Server-side)</div>
            <div style={{ fontSize: '10px', color: 'var(--muted)' }}>/api/chat (AI Mentor) · /api/ocr (OCR Analysis)</div>
          </div>

          <div className="arch-arrow">▼</div>

          {/* Services Layer */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', width: '100%' }}>
            <div className="arch-box" style={{ borderColor: '#10b981', background: 'rgba(16,185,129,0.06)' }}>
              <div style={{ fontSize: '20px', marginBottom: '4px' }}>🧠</div>
              <div style={{ color: '#10b981', fontSize: '11px', fontWeight: 600 }}>Groq AI</div>
              <div style={{ fontSize: '9px', color: 'var(--muted)' }}>Vision + LLM · Llama 4 Scout · Llama 3.3 70B</div>
            </div>
            <div className="arch-box" style={{ borderColor: '#3ecf8e', background: 'rgba(62,207,142,0.06)' }}>
              <div style={{ fontSize: '20px', marginBottom: '4px' }}>📦</div>
              <div style={{ color: '#3ecf8e', fontSize: '11px', fontWeight: 600 }}>Supabase</div>
              <div style={{ fontSize: '9px', color: 'var(--muted)' }}>Storage · PostgreSQL · Auth (vòng 2)</div>
            </div>
            <div className="arch-box" style={{ borderColor: '#f59e0b', background: 'rgba(245,158,11,0.06)' }}>
              <div style={{ fontSize: '20px', marginBottom: '4px' }}>📄</div>
              <div style={{ color: '#f59e0b', fontSize: '11px', fontWeight: 600 }}>unpdf</div>
              <div style={{ fontSize: '9px', color: 'var(--muted)' }}>PDF text extraction · Client-side</div>
            </div>
          </div>

          <div className="arch-arrow">▼</div>

          {/* VNPT APIs - Vòng 2 */}
          <div style={{ width: '100%', background: 'rgba(6,182,212,0.04)', border: '1px dashed rgba(6,182,212,0.3)', borderRadius: '12px', padding: '16px' }}>
            <div style={{ textAlign: 'center', fontSize: '12px', fontWeight: 700, color: 'var(--accent2)', marginBottom: '4px' }}>🔌 VNPT AI API Ecosystem (Tích hợp Vòng 2)</div>
            <div style={{ textAlign: 'center', fontSize: '10px', color: 'var(--muted)', marginBottom: '12px' }}>Sẽ được tích hợp khi nhận API key chính thức từ BTC</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
              {vnptApis.map((api, i) => (
                <div key={i} style={{ textAlign: 'center', padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                  <div style={{ background: `${api.color}18`, color: api.color, padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 600, fontFamily: "'JetBrains Mono', monospace", display: 'inline-block', marginBottom: '4px' }}>{api.api}</div>
                  <div style={{ fontSize: '9px', color: 'var(--muted)' }}>{api.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="divider"></div>

      {/* Current API Mapping */}
      <div className="section-header fade-in">
        <div className="section-num">🔌</div>
        <div>
          <h2>Tích hợp API hiện tại (Demo Vòng 1)</h2>
          <p>Các dịch vụ đang hoạt động trong phiên bản demo</p>
        </div>
      </div>

      <div className="card fade-in" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="api-table">
          <thead>
            <tr>
              <th>Chức năng</th>
              <th>Dịch vụ</th>
              <th>Mô tả</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {currentApis.map((api, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 500 }}>{api.feature}</td>
                <td><span className="api-badge" style={{ background: `${api.color}18`, color: api.color }}>{api.api}</span></td>
                <td style={{ color: 'var(--light)' }}>{api.desc}</td>
                <td><span style={{ color: 'var(--green)', fontSize: '11px', fontWeight: 600 }}>✅ LIVE</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="divider"></div>

      {/* Tech Stack */}
      <div className="section-header fade-in">
        <div className="section-num">🛠️</div>
        <div>
          <h2>Tech Stack</h2>
          <p>Công nghệ sử dụng cho MVP Demo</p>
        </div>
      </div>

      <div className="features-grid fade-in">
        {[
          { icon: '⚛️', title: 'Frontend', desc: 'Next.js 15 (App Router) · React 19 · Vanilla CSS · Mobile-first responsive', color: '#06b6d4' },
          { icon: '⚡', title: 'API Routes', desc: 'Next.js Route Handlers · Server-side · Groq SDK integration', color: '#3b82f6' },
          { icon: '🧠', title: 'AI Engine', desc: 'Groq Cloud: Llama 4 Scout (Vision) + Llama 3.3 70B (Text)', color: '#10b981' },
          { icon: '📦', title: 'Storage', desc: 'Supabase Storage · Lưu ảnh & PDF minh chứng · PostgreSQL (vòng 2)', color: '#3ecf8e' },
          { icon: '🚀', title: 'Deploy', desc: 'Vercel (Production) · GitHub CI/CD · Auto-deploy on push', color: '#8b5cf6' },
          { icon: '🔒', title: 'Security', desc: 'HTTPS · Role-based access · Environment variables · API key server-side', color: '#ef4444' },
        ].map((tech, i) => (
          <div key={i} className="feature-card">
            <div className="feature-icon" style={{ background: `${tech.color}15`, border: `1px solid ${tech.color}40` }}>{tech.icon}</div>
            <h3 style={{ color: tech.color }}>{tech.title}</h3>
            <p>{tech.desc}</p>
          </div>
        ))}
      </div>

      <div className="divider"></div>

      {/* Data Flow */}
      <div className="section-header fade-in">
        <div className="section-num">🔄</div>
        <div>
          <h2>Data Flow – Upload & OCR</h2>
          <p>Luồng xử lý khi sinh viên upload minh chứng</p>
        </div>
      </div>

      <div className="card fade-in">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px', textAlign: 'center' }}>
          {[
            { step: '1', icon: '📁', label: 'Upload file', sub: 'Ảnh / PDF', color: '#3b82f6' },
            { step: '2', icon: '🔄', label: 'Xử lý client', sub: 'Nén ảnh / Extract PDF text', color: '#f59e0b' },
            { step: '3', icon: '☁️', label: 'Supabase', sub: 'Lưu file gốc', color: '#3ecf8e' },
            { step: '4', icon: '🧠', label: 'Groq AI', sub: 'Vision/LLM phân tích', color: '#10b981' },
            { step: '5', icon: '✅', label: 'Kết quả', sub: 'Fields + Score + Validity', color: '#8b5cf6' },
          ].map((s, i) => (
            <div key={i}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: `${s.color}15`, border: `2px solid ${s.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px', fontSize: '18px' }}>{s.icon}</div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: s.color }}>{s.label}</div>
              <div style={{ fontSize: '9px', color: 'var(--muted)', marginTop: '2px' }}>{s.sub}</div>
              {i < 4 && <div style={{ color: 'var(--muted)', fontSize: '16px', marginTop: '4px' }}>→</div>}
            </div>
          ))}
        </div>
      </div>

      <div className="divider"></div>

      {/* Roadmap */}
      <div className="section-header fade-in">
        <div className="section-num">🗺️</div>
        <div>
          <h2>Roadmap: Vòng 1 → Vòng 2</h2>
          <p>Kế hoạch phát triển</p>
        </div>
      </div>

      <div className="card fade-in">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '10px', padding: '16px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--green)', marginBottom: '10px' }}>✅ Vòng 1 – Demo MVP (Hiện tại)</div>
            <div style={{ fontSize: '11px', color: 'var(--light)', lineHeight: 1.8 }}>
              ✅ Login phân quyền SV / Cán bộ<br/>
              ✅ Dashboard tiến độ SV5T<br/>
              ✅ AI Mentor chatbot (Groq Llama 3.3)<br/>
              ✅ Upload OCR ảnh (Groq Vision)<br/>
              ✅ Upload OCR PDF (unpdf + Groq)<br/>
              ✅ Digital Passport SV5T<br/>
              ✅ Reviewer Dashboard (Cán bộ)<br/>
              ✅ Analytics & Thống kê<br/>
              ✅ Deploy Vercel production
            </div>
          </div>
          <div style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '10px', padding: '16px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent)', marginBottom: '10px' }}>🔮 Vòng 2 – Tích hợp VNPT API</div>
            <div style={{ fontSize: '11px', color: 'var(--light)', lineHeight: 1.8 }}>
              🔄 Tích hợp VNPT SmartReader (OCR chuyên sâu)<br/>
              🔄 eKYC xác minh CCCD sinh viên<br/>
              🔄 SmartBot tiếng Việt nâng cao<br/>
              🔄 SmartVoice (hỏi đáp bằng giọng nói)<br/>
              🔄 Supabase Auth (đăng nhập thật)<br/>
              🔄 PostgreSQL database (dữ liệu thật)<br/>
              🔄 Batch processing hồ sơ<br/>
              🔄 Export báo cáo PDF/Excel<br/>
              🔄 Mobile app (React Native)
            </div>
          </div>
        </div>
      </div>

      {/* Deploy Info */}
      <div className="card fade-in" style={{ marginTop: '24px', background: 'rgba(16,185,129,0.05)', borderColor: 'rgba(16,185,129,0.2)' }}>
        <div className="card-title" style={{ color: 'var(--green)' }}>🚀 Deploy & Demo</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '12px', color: 'var(--light)' }}>
          <div>
            <div style={{ fontWeight: 700, color: 'var(--text)', marginBottom: '6px' }}>Production URL</div>
            <div style={{ background: 'var(--bg)', borderRadius: '6px', padding: '10px', fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: 'var(--green)' }}>
              🌐 fivegood-demo.vercel.app
            </div>
          </div>
          <div>
            <div style={{ fontWeight: 700, color: 'var(--text)', marginBottom: '6px' }}>Repo & Docs</div>
            <div style={{ lineHeight: 1.8 }}>
              📂 github.com/khiemdztv/fivegood-demo<br/>
              📄 Proposal Vòng 1 đính kèm<br/>
              🏆 HackAIthon 2026 · Bảng B · Đề tài 5
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
