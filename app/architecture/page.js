'use client';
import { apiMapping } from '@/data/mockData';

export default function ArchitecturePage() {
  return (
    <div className="page-container">
      <div className="section-header fade-in">
        <div className="section-num">📐</div>
        <div>
          <h2>Kiến trúc hệ thống</h2>
          <p>Thiết kế tổng quan và tích hợp API VNPT</p>
        </div>
      </div>

      {/* Architecture Diagram */}
      <div className="card fade-in">
        <div className="card-title">🏗️ Kiến trúc Logic</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
          {/* Users Layer */}
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', width: '100%' }}>
            {[
              { icon: '🎓', label: 'Sinh viên', color: '#3b82f6' },
              { icon: '🏛️', label: 'Cán bộ Hội', color: '#8b5cf6' },
              { icon: '⚙️', label: 'Admin', color: '#f59e0b' },
            ].map((u, i) => (
              <div key={i} className="arch-box" style={{ borderColor: u.color, flex: 1, maxWidth: '180px' }}>
                <div style={{ fontSize: '24px', marginBottom: '4px' }}>{u.icon}</div>
                <div style={{ color: u.color }}>{u.label}</div>
              </div>
            ))}
          </div>

          <div className="arch-arrow">▼</div>

          {/* Frontend */}
          <div className="arch-box" style={{ width: '60%', borderColor: 'var(--accent2)', background: 'rgba(6,182,212,0.06)' }}>
            <div style={{ color: 'var(--accent2)', marginBottom: '4px' }}>🌐 Frontend Web App</div>
            <div style={{ fontSize: '10px', color: 'var(--muted)' }}>Next.js · React · Mobile-first · Responsive</div>
          </div>

          <div className="arch-arrow">▼</div>

          {/* Backend */}
          <div className="arch-box" style={{ width: '60%', borderColor: 'var(--accent)', background: 'rgba(59,130,246,0.06)' }}>
            <div style={{ color: 'var(--accent)', marginBottom: '4px' }}>⚡ Backend API Gateway</div>
            <div style={{ fontSize: '10px', color: 'var(--muted)' }}>FastAPI / NestJS · REST API · Worker Queue</div>
          </div>

          <div className="arch-arrow">▼</div>

          {/* Services Layer */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', width: '100%' }}>
            <div className="arch-box" style={{ borderColor: '#f59e0b', background: 'rgba(245,158,11,0.06)' }}>
              <div style={{ fontSize: '20px', marginBottom: '4px' }}>🗄️</div>
              <div style={{ color: '#f59e0b', fontSize: '11px' }}>PostgreSQL</div>
              <div style={{ fontSize: '9px', color: 'var(--muted)' }}>Database chính</div>
            </div>
            <div className="arch-box" style={{ borderColor: '#10b981', background: 'rgba(16,185,129,0.06)' }}>
              <div style={{ fontSize: '20px', marginBottom: '4px' }}>📦</div>
              <div style={{ color: '#10b981', fontSize: '11px' }}>Object Storage</div>
              <div style={{ fontSize: '9px', color: 'var(--muted)' }}>S3 / MinIO</div>
            </div>
            <div className="arch-box" style={{ borderColor: '#ef4444', background: 'rgba(239,68,68,0.06)' }}>
              <div style={{ fontSize: '20px', marginBottom: '4px' }}>🔄</div>
              <div style={{ color: '#ef4444', fontSize: '11px' }}>Redis Queue</div>
              <div style={{ fontSize: '9px', color: 'var(--muted)' }}>Job OCR/AI</div>
            </div>
            <div className="arch-box" style={{ borderColor: '#8b5cf6', background: 'rgba(139,92,246,0.06)' }}>
              <div style={{ fontSize: '20px', marginBottom: '4px' }}>🧠</div>
              <div style={{ color: '#8b5cf6', fontSize: '11px' }}>Risk Engine</div>
              <div style={{ fontSize: '9px', color: 'var(--muted)' }}>AI Pipeline</div>
            </div>
          </div>

          <div className="arch-arrow">▼</div>

          {/* VNPT APIs */}
          <div style={{ width: '100%', background: 'rgba(6,182,212,0.04)', border: '1px solid rgba(6,182,212,0.2)', borderRadius: '12px', padding: '16px' }}>
            <div style={{ textAlign: 'center', fontSize: '12px', fontWeight: 700, color: 'var(--accent2)', marginBottom: '12px' }}>🔌 VNPT AI API Ecosystem</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
              {apiMapping.map((api, i) => (
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

      {/* API Mapping Table */}
      <div className="section-header fade-in">
        <div className="section-num">🔌</div>
        <div>
          <h2>Mapping chức năng ↔ API VNPT</h2>
          <p>8/8 nhóm API được tích hợp chuyên biệt</p>
        </div>
      </div>

      <div className="card fade-in" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="api-table">
          <thead>
            <tr>
              <th>Chức năng hệ thống</th>
              <th>API VNPT</th>
              <th>Mô tả tích hợp</th>
            </tr>
          </thead>
          <tbody>
            {apiMapping.map((api, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 500 }}>{api.feature}</td>
                <td><span className="api-badge" style={{ background: `${api.color}18`, color: api.color }}>{api.api}</span></td>
                <td style={{ color: 'var(--light)' }}>{api.desc}</td>
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
          <p>Công nghệ sử dụng cho MVP</p>
        </div>
      </div>

      <div className="features-grid fade-in">
        {[
          { icon: '⚛️', title: 'Frontend', desc: 'Next.js 15 · React · Vanilla CSS · Mobile-first responsive', color: '#06b6d4' },
          { icon: '⚡', title: 'Backend', desc: 'FastAPI (Python) hoặc NestJS · REST API · Worker queue cho OCR/AI', color: '#3b82f6' },
          { icon: '🗄️', title: 'Database', desc: 'PostgreSQL · JSONB cho dữ liệu OCR · Index tối ưu', color: '#f59e0b' },
          { icon: '📦', title: 'Storage', desc: 'S3 / MinIO · Lưu ảnh & PDF minh chứng', color: '#10b981' },
          { icon: '🐳', title: 'Deploy', desc: 'Docker Compose · Cài đặt 1 lệnh · Vercel cho frontend', color: '#8b5cf6' },
          { icon: '🔒', title: 'Security', desc: 'HTTPS · RBAC · Audit log · bcrypt · AES-256', color: '#ef4444' },
        ].map((tech, i) => (
          <div key={i} className="feature-card">
            <div className="feature-icon" style={{ background: `${tech.color}15`, border: `1px solid ${tech.color}40` }}>{tech.icon}</div>
            <h3 style={{ color: tech.color }}>{tech.title}</h3>
            <p>{tech.desc}</p>
          </div>
        ))}
      </div>

      <div className="divider"></div>

      {/* ERD Summary */}
      <div className="section-header fade-in">
        <div className="section-num">📊</div>
        <div>
          <h2>Mô hình dữ liệu (ERD)</h2>
          <p>Các bảng chính trong hệ thống</p>
        </div>
      </div>

      <div className="card fade-in" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="review-table">
          <thead>
            <tr>
              <th>Bảng</th>
              <th>Vai trò</th>
              <th>Quan hệ chính</th>
            </tr>
          </thead>
          <tbody>
            {[
              { name: 'users', role: 'Tài khoản đăng nhập, phân quyền', rel: '1–1 students' },
              { name: 'students', role: 'Hồ sơ sinh viên (MSSV, họ tên, khoa)', rel: '1–N applications' },
              { name: 'application_cycles', role: 'Kỳ xét SV5T (thời gian, trạng thái)', rel: '1–N applications' },
              { name: 'applications', role: 'Hồ sơ ứng tuyển SV5T', rel: '1–N evidences, criteria_scores' },
              { name: 'criteria / subcriteria', role: '5 tiêu chí SV5T + tiêu chí con', rel: '1–N subcriteria' },
              { name: 'evidences', role: 'Minh chứng (file, OCR, AI label, score)', rel: 'N–1 applications' },
              { name: 'criteria_scores', role: 'Điểm từng tiêu chí (AI + reviewer)', rel: 'N–1 applications' },
              { name: 'review_logs', role: 'Log duyệt (ai, hành động, ghi chú)', rel: 'N–1 applications' },
              { name: 'bot_sessions', role: 'Lịch sử hội thoại AI Mentor', rel: 'N–1 users' },
            ].map((t, i) => (
              <tr key={i}>
                <td><span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', background: 'rgba(59,130,246,0.1)', color: 'var(--accent)', padding: '2px 8px', borderRadius: '4px' }}>{t.name}</span></td>
                <td style={{ color: 'var(--light)' }}>{t.role}</td>
                <td style={{ color: 'var(--muted)', fontSize: '12px' }}>{t.rel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Deploy Info */}
      <div className="card fade-in" style={{ marginTop: '24px', background: 'rgba(16,185,129,0.05)', borderColor: 'rgba(16,185,129,0.2)' }}>
        <div className="card-title" style={{ color: 'var(--green)' }}>🚀 Deploy & Demo</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '12px', color: 'var(--light)' }}>
          <div>
            <div style={{ fontWeight: 700, color: 'var(--text)', marginBottom: '6px' }}>Cài đặt 1 lệnh</div>
            <div style={{ background: 'var(--bg)', borderRadius: '6px', padding: '10px', fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: 'var(--green)' }}>
              $ docker compose up -d
            </div>
          </div>
          <div>
            <div style={{ fontWeight: 700, color: 'var(--text)', marginBottom: '6px' }}>Yêu cầu vòng 2 đáp ứng</div>
            <div style={{ lineHeight: 1.8 }}>
              ✅ Demo MVP ổn định<br />
              ✅ Repo code + README<br />
              ✅ Script test tự động<br />
              ✅ Docker 1 lệnh
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
