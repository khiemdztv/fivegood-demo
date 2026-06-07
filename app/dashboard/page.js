'use client';
import { criteria, evidences } from '@/data/mockData';
import { useAuth } from '@/lib/auth';
import Link from 'next/link';

function CriteriaRing({ criterion }) {
  const r = 34;
  const c = 2 * Math.PI * r;
  const offset = c - (criterion.progress / 100) * c;

  return (
    <div className="criteria-card">
      <div className="criteria-ring">
        <svg width="80" height="80" viewBox="0 0 80 80">
          <circle className="criteria-ring-bg" cx="40" cy="40" r={r} />
          <circle
            className="criteria-ring-fill"
            cx="40" cy="40" r={r}
            stroke={criterion.color}
            strokeDasharray={c}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="criteria-ring-text">{criterion.icon}</div>
      </div>
      <div className="criteria-name">{criterion.name}</div>
      <div style={{ fontSize: '18px', fontWeight: 700, color: criterion.color, marginBottom: '6px' }}>{criterion.progress}%</div>
      <span className={`criteria-status status-${criterion.status}`}>
        {criterion.status === 'complete' ? '✅ Hoàn thành' : criterion.status === 'in_progress' ? '🔶 Đang tiến hành' : '❌ Còn thiếu'}
      </span>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const totalProgress = Math.round(criteria.reduce((s, c) => s + c.progress, 0) / criteria.length);
  const displayName = user?.name || 'Sinh viên';
  const firstName = displayName.split(' ').pop();

  return (
    <div className="page-container">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }} className="fade-in">
        <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), var(--accent3))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0 }}>🎓</div>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700 }}>Xin chào, {displayName}!</h1>
          <p style={{ color: 'var(--muted)', fontSize: '13px' }}>{user?.sub || ''}</p>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="card fade-in" style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(139,92,246,0.08))', borderColor: 'rgba(59,130,246,0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ fontSize: '14px', fontWeight: 600 }}>📊 Tiến độ tổng thể hồ sơ SV5T</div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--accent)' }}>{totalProgress}%</div>
        </div>
        <div style={{ background: 'var(--border)', borderRadius: '100px', height: '10px', overflow: 'hidden' }}>
          <div style={{ width: `${totalProgress}%`, height: '100%', background: 'linear-gradient(90deg, var(--accent), var(--accent3))', borderRadius: '100px', transition: 'width 1s ease' }}></div>
        </div>
        <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '8px' }}>Kỳ xét: SV5T năm học 2025–2026 · Deadline: 30/06/2026</div>
      </div>

      {/* 5 Criteria */}
      <div className="section-header">
        <div className="section-num">📋</div>
        <div>
          <h2>5 Tiêu chí SV5T</h2>
          <p>Tiến độ từng tiêu chí của bạn</p>
        </div>
      </div>

      <div className="criteria-grid fade-in">
        {criteria.map(c => <CriteriaRing key={c.id} criterion={c} />)}
      </div>

      {/* Checklist */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        <div className="card fade-in">
          <div className="card-title">📝 Việc cần làm tiếp theo</div>
          {[
            { text: 'Bổ sung giấy xác nhận tình nguyện', done: false, urgent: true },
            { text: 'Upload minh chứng hoạt động giao lưu quốc tế', done: false, urgent: false },
            { text: 'Bổ sung minh chứng NCKH/đề tài', done: false, urgent: false },
            { text: 'Upload phiếu điểm rèn luyện', done: true, urgent: false },
            { text: 'Upload bảng điểm HK1', done: true, urgent: false },
          ].map((item, i) => (
            <div key={i} className="checklist-item">
              <div className="check-icon" style={{ background: item.done ? 'rgba(16,185,129,0.15)' : item.urgent ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)' }}>
                {item.done ? '✅' : item.urgent ? '🔴' : '🔶'}
              </div>
              <span style={{ textDecoration: item.done ? 'line-through' : 'none', color: item.done ? 'var(--muted)' : 'var(--text)' }}>{item.text}</span>
            </div>
          ))}
        </div>

        <div className="card fade-in">
          <div className="card-title">🤖 AI Mentor gợi ý</div>
          <div style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.15)', borderRadius: '10px', padding: '16px', marginBottom: '12px' }}>
            <p style={{ fontSize: '13px', color: 'var(--light)', lineHeight: 1.7 }}>
              Chào {firstName}! Hồ sơ của bạn đã hoàn thành <strong style={{color:'var(--accent)'}}>{totalProgress}%</strong>. 
              Bạn còn thiếu <strong style={{color:'var(--red)'}}>minh chứng tình nguyện</strong> – đây là tiêu chí 
              quan trọng nhất cần bổ sung. Trường mình sắp có chiến dịch Mùa Hè Xanh, bạn nên đăng ký tham gia nhé! 🌿
            </p>
          </div>
          <Link href="/mentor" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', textDecoration: 'none' }}>
            💬 Hỏi AI Mentor
          </Link>
        </div>
      </div>

      {/* Recent Evidences */}
      <div className="card fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div className="card-title" style={{ marginBottom: 0 }}>📎 Minh chứng gần đây</div>
          <Link href="/upload" className="btn btn-primary" style={{ fontSize: '11px', padding: '6px 14px', textDecoration: 'none' }}>+ Upload mới</Link>
        </div>
        {evidences.map(ev => (
          <div key={ev.id} className="evidence-item">
            <div className="evidence-icon" style={{ background: ev.fileType === 'PDF' ? 'rgba(239,68,68,0.1)' : 'rgba(59,130,246,0.1)' }}>
              {ev.fileType === 'PDF' ? '📄' : '🖼️'}
            </div>
            <div className="evidence-info">
              <div className="evidence-name">{ev.fileName}</div>
              <div className="evidence-date">{ev.uploadedAt} · {criteria.find(c => c.id === ev.criteriaId)?.name}</div>
            </div>
            <span className={`validity-badge badge-${ev.aiValidity.toLowerCase()}`}>{ev.aiValidity}</span>
            <span style={{ fontSize: '12px', color: 'var(--muted)', fontFamily: "'JetBrains Mono', monospace" }}>{ev.aiScore.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
