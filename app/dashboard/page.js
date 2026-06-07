'use client';
import { criteria as defaultCriteria, evidences as demoEvidences } from '@/data/mockData';
import { useAuth } from '@/lib/auth';
import { getUserProgress, getUserEvidences } from '@/lib/supabase';
import Link from 'next/link';
import { useState, useEffect } from 'react';

// Metadata cho criteria
const CRITERIA_META = {
  c1: { name: 'Đạo đức tốt', icon: '🌟', color: '#3b82f6' },
  c2: { name: 'Học tập tốt', icon: '📚', color: '#8b5cf6' },
  c3: { name: 'Thể lực tốt', icon: '💪', color: '#10b981' },
  c4: { name: 'Tình nguyện tốt', icon: '❤️', color: '#ef4444' },
  c5: { name: 'Hội nhập tốt', icon: '🌍', color: '#06b6d4' },
};

// Demo accounts dùng mock data
const DEMO_MSSV = ['20210001', 'CB001'];

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
        {criterion.status === 'complete' ? '✅ Hoàn thành' : criterion.status === 'in_progress' ? '🔶 Đang tiến hành' : '❌ Chưa có MC'}
      </span>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [myCriteria, setMyCriteria] = useState([]);
  const [myEvidences, setMyEvidences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // Demo accounts → dùng mock data
    if (DEMO_MSSV.includes(user.mssv)) {
      setMyCriteria(defaultCriteria);
      setMyEvidences(demoEvidences);
      setLoading(false);
      return;
    }

    // User thật → load từ Supabase
    const loadData = async () => {
      const dbId = user.dbId || user.id;
      try {
        const [progressData, evidenceData] = await Promise.all([
          getUserProgress(dbId),
          getUserEvidences(dbId),
        ]);

        // Map progress data + metadata
        const criteriaList = (progressData || []).map(p => ({
          ...p,
          id: p.criteria_id,
          ...CRITERIA_META[p.criteria_id],
        }));

        setMyCriteria(criteriaList);
        setMyEvidences((evidenceData || []).map(e => ({
          id: e.id,
          criteriaId: e.criteria_id,
          fileName: e.file_name,
          fileType: e.file_type,
          aiValidity: e.ai_validity,
          aiScore: e.ai_score,
          uploadedAt: new Date(e.created_at).toLocaleDateString('vi-VN'),
        })));
      } catch (err) {
        console.error('Load data error:', err);
        // Fallback: empty data
        setMyCriteria(Object.entries(CRITERIA_META).map(([id, meta]) => ({
          id, criteria_id: id, progress: 0, status: 'missing', ...meta,
        })));
        setMyEvidences([]);
      }
      setLoading(false);
    };
    loadData();
  }, [user]);

  const totalProgress = myCriteria.length > 0 ? Math.round(myCriteria.reduce((s, c) => s + c.progress, 0) / myCriteria.length) : 0;
  const displayName = user?.name || 'Sinh viên';
  const firstName = displayName.split(' ').pop();

  const todoItems = myCriteria
    .filter(c => c.progress < 100)
    .map(c => ({ text: `Upload minh chứng cho tiêu chí "${c.name}"`, done: false, urgent: c.progress === 0 }));
  const doneItems = myCriteria
    .filter(c => c.progress >= 100)
    .map(c => ({ text: `Tiêu chí "${c.name}" đã hoàn thành`, done: true, urgent: false }));
  const checklistItems = [...todoItems, ...doneItems].slice(0, 5);

  if (loading) {
    return (
      <div className="page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center', color: 'var(--muted)' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>⏳</div>
          <div>Đang tải dữ liệu từ Supabase...</div>
        </div>
      </div>
    );
  }

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
          <div style={{ fontSize: '20px', fontWeight: 800, color: totalProgress >= 80 ? 'var(--green)' : totalProgress >= 50 ? 'var(--accent)' : 'var(--red)' }}>{totalProgress}%</div>
        </div>
        <div style={{ background: 'var(--border)', borderRadius: '100px', height: '10px', overflow: 'hidden' }}>
          <div style={{ width: `${totalProgress}%`, height: '100%', background: totalProgress >= 80 ? 'linear-gradient(90deg, #10b981, #06b6d4)' : 'linear-gradient(90deg, var(--accent), var(--accent3))', borderRadius: '100px', transition: 'width 1s ease' }}></div>
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
        {myCriteria.map(c => <CriteriaRing key={c.id} criterion={c} />)}
      </div>

      {/* Checklist + AI Mentor */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        <div className="card fade-in">
          <div className="card-title">📝 Việc cần làm tiếp theo</div>
          {checklistItems.length > 0 ? checklistItems.map((item, i) => (
            <div key={i} className="checklist-item">
              <div className="check-icon" style={{ background: item.done ? 'rgba(16,185,129,0.15)' : item.urgent ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)' }}>
                {item.done ? '✅' : item.urgent ? '🔴' : '🔶'}
              </div>
              <span style={{ textDecoration: item.done ? 'line-through' : 'none', color: item.done ? 'var(--muted)' : 'var(--text)' }}>{item.text}</span>
            </div>
          )) : (
            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--muted)', fontSize: '13px' }}>🎉 Bạn đã hoàn thành tất cả tiêu chí!</div>
          )}
        </div>

        <div className="card fade-in">
          <div className="card-title">🤖 AI Mentor gợi ý</div>
          <div style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.15)', borderRadius: '10px', padding: '16px', marginBottom: '12px' }}>
            <p style={{ fontSize: '13px', color: 'var(--light)', lineHeight: 1.7 }}>
              {totalProgress === 0 ? (
                <>Chào {firstName}! 👋 Chào mừng bạn đến với FiveGood Journey. Hãy bắt đầu bằng cách <strong style={{color:'var(--accent)'}}>upload minh chứng</strong> cho từng tiêu chí SV5T nhé! 🚀</>
              ) : totalProgress >= 80 ? (
                <>Tuyệt vời {firstName}! 🎉 Hồ sơ đã hoàn thành <strong style={{color:'var(--green)'}}>{totalProgress}%</strong>. Chỉ còn một chút nữa là đạt SV5T rồi!</>
              ) : (
                <>Chào {firstName}! Hồ sơ của bạn đã hoàn thành <strong style={{color:'var(--accent)'}}>{totalProgress}%</strong>. Hãy tiếp tục upload minh chứng cho các tiêu chí còn thiếu nhé! 💪</>
              )}
            </p>
          </div>
          <Link href="/mentor" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', textDecoration: 'none' }}>💬 Hỏi AI Mentor</Link>
        </div>
      </div>

      {/* Recent Evidences */}
      <div className="card fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div className="card-title" style={{ marginBottom: 0 }}>📎 Minh chứng gần đây</div>
          <Link href="/upload" className="btn btn-primary" style={{ fontSize: '11px', padding: '6px 14px', textDecoration: 'none' }}>+ Upload mới</Link>
        </div>
        {myEvidences.length > 0 ? myEvidences.map(ev => (
          <div key={ev.id} className="evidence-item">
            <div className="evidence-icon" style={{ background: ev.fileType === 'PDF' ? 'rgba(239,68,68,0.1)' : 'rgba(59,130,246,0.1)' }}>
              {ev.fileType === 'PDF' ? '📄' : '🖼️'}
            </div>
            <div className="evidence-info">
              <div className="evidence-name">{ev.fileName}</div>
              <div className="evidence-date">{ev.uploadedAt} · {myCriteria.find(c => c.id === ev.criteriaId)?.name}</div>
            </div>
            <span className={`validity-badge badge-${(ev.aiValidity || 'suspect').toLowerCase()}`}>{ev.aiValidity}</span>
            <span style={{ fontSize: '12px', color: 'var(--muted)', fontFamily: "'JetBrains Mono', monospace" }}>{(ev.aiScore || 0).toFixed(2)}</span>
          </div>
        )) : (
          <div style={{ padding: '32px', textAlign: 'center', color: 'var(--muted)' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>📂</div>
            <div style={{ fontSize: '13px', marginBottom: '8px' }}>Chưa có minh chứng nào</div>
            <Link href="/upload" style={{ color: 'var(--accent)', fontSize: '12px', fontWeight: 600 }}>Upload minh chứng đầu tiên →</Link>
          </div>
        )}
      </div>
    </div>
  );
}
