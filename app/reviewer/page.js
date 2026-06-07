'use client';
import { useState, useEffect } from 'react';
import { getAllUsers, getAllEvidences } from '@/lib/supabase';

export default function ReviewerPage() {
  const [selected, setSelected] = useState(null);
  const [filterRisk, setFilterRisk] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [actionDone, setActionDone] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [users, evidences] = await Promise.all([
        getAllUsers(),
        getAllEvidences()
      ]);

      if (users && evidences) {
        const apps = users.map(u => {
          const uEvs = evidences.filter(e => e.user_id === u.id);
          const hasSuspect = uEvs.some(e => e.ai_validity === 'SUSPECT');
          const hasWarning = uEvs.some(e => e.ai_validity === 'WARNING');
          
          const aiRiskLevel = hasSuspect ? 'HIGH' : (hasWarning ? 'MEDIUM' : 'LOW');
          let overallScore = Math.min(100, uEvs.length * 20);
          
          let aiSummary = `Sinh viên đã nộp ${uEvs.length}/5 minh chứng. `;
          if (hasSuspect) aiSummary += 'AI phát hiện tài liệu rủi ro cao (SUSPECT), cần cán bộ mở ra kiểm tra thủ công gấp!';
          else if (hasWarning) aiSummary += 'AI cảnh báo một số tài liệu có thể sai sót (WARNING).';
          else aiSummary += 'Chưa phát hiện rủi ro nào từ AI.';

          return {
            id: u.id,
            studentCode: u.mssv,
            fullName: u.name,
            faculty: u.faculty,
            status: uEvs.length > 0 ? 'UNDER_REVIEW' : 'SUBMITTED',
            aiRiskLevel,
            overallScore,
            evidenceCount: uEvs.length,
            criteriaStatus: {
              c1: uEvs.some(e => e.criteria_id === 'c1') ? (uEvs.find(e=>e.criteria_id==='c1').ai_validity==='VALID'?'pass':'review') : 'fail',
              c2: uEvs.some(e => e.criteria_id === 'c2') ? (uEvs.find(e=>e.criteria_id==='c2').ai_validity==='VALID'?'pass':'review') : 'fail',
              c3: uEvs.some(e => e.criteria_id === 'c3') ? (uEvs.find(e=>e.criteria_id==='c3').ai_validity==='VALID'?'pass':'review') : 'fail',
              c4: uEvs.some(e => e.criteria_id === 'c4') ? (uEvs.find(e=>e.criteria_id==='c4').ai_validity==='VALID'?'pass':'review') : 'fail',
              c5: uEvs.some(e => e.criteria_id === 'c5') ? (uEvs.find(e=>e.criteria_id==='c5').ai_validity==='VALID'?'pass':'review') : 'fail',
            },
            aiSummary
          };
        });
        setApplications(apps);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const filtered = applications.filter(a => {
    if (filterRisk !== 'all' && a.aiRiskLevel !== filterRisk) return false;
    if (filterStatus !== 'all' && a.status !== filterStatus) return false;
    return true;
  });

  const handleAction = (action) => {
    setActionDone(action);
    setTimeout(() => setActionDone(null), 2000);
  };

  const riskLabel = { LOW: '🟢 Low', MEDIUM: '🟡 Medium', HIGH: '🔴 High' };
  const statusLabel = { SUBMITTED: 'Đã nộp', UNDER_REVIEW: 'Đang duyệt', APPROVED: 'Đã duyệt', REJECTED: 'Từ chối' };
  const criteriaNames = { c1: 'Đạo đức', c2: 'Học tập', c3: 'Thể lực', c4: 'Tình nguyện', c5: 'Hội nhập' };
  const csLabel = { pass: '✅', partial: '🔶', fail: '❌', review: '⚠️' };

  return (
    <div className="page-container">
      <div className="section-header fade-in">
        <div className="section-num">🏛️</div>
        <div>
          <h2>Dashboard Cán bộ Hội</h2>
          <p>Reviewer Copilot – Duyệt hồ sơ SV5T với AI hỗ trợ</p>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid fade-in">
        <div className="stat-card"><div className="stat-value" style={{color:'var(--accent)'}}>{applications.length}</div><div className="stat-label">Tổng hồ sơ</div></div>
        <div className="stat-card"><div className="stat-value" style={{color:'var(--green)'}}>{applications.filter(a=>a.aiRiskLevel==='LOW').length}</div><div className="stat-label">Risk thấp</div></div>
        <div className="stat-card"><div className="stat-value" style={{color:'var(--yellow)'}}>{applications.filter(a=>a.aiRiskLevel==='MEDIUM').length}</div><div className="stat-label">Risk trung bình</div></div>
        <div className="stat-card"><div className="stat-value" style={{color:'var(--red)'}}>{applications.filter(a=>a.aiRiskLevel==='HIGH').length}</div><div className="stat-label">Risk cao</div></div>
      </div>

      {/* Filters */}
      <div className="filter-bar fade-in">
        <select className="filter-select" value={filterRisk} onChange={e => setFilterRisk(e.target.value)}>
          <option value="all">Tất cả Risk</option>
          <option value="LOW">🟢 Low</option>
          <option value="MEDIUM">🟡 Medium</option>
          <option value="HIGH">🔴 High</option>
        </select>
        <select className="filter-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="all">Tất cả trạng thái</option>
          <option value="SUBMITTED">Đã nộp</option>
          <option value="UNDER_REVIEW">Đang duyệt</option>
        </select>
        <div style={{ marginLeft: 'auto', fontSize: '12px', color: 'var(--muted)' }}>Kỳ xét: SV5T 2025–2026 · Hiển thị {filtered.length}/{applications.length} hồ sơ</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 400px' : '1fr', gap: '20px' }}>
        {/* Table */}
        <div className="card fade-in" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="review-table">
            <thead>
              <tr>
                <th>MSSV</th>
                <th>Họ tên</th>
                <th>Khoa</th>
                <th>Trạng thái</th>
                <th>AI Risk</th>
                <th>Điểm</th>
                <th>MC</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(app => (
                <tr key={app.id} onClick={() => setSelected(app)} className={selected?.id === app.id ? 'row--selected' : ''}>
                  <td style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px' }}>{app.studentCode}</td>
                  <td style={{ fontWeight: 600 }}>{app.fullName}</td>
                  <td style={{ color: 'var(--light)' }}>{app.faculty}</td>
                  <td><span style={{ fontSize: '11px', color: 'var(--light)' }}>{statusLabel[app.status]}</span></td>
                  <td><span className={`risk-badge risk-${app.aiRiskLevel.toLowerCase()}`}>{riskLabel[app.aiRiskLevel]}</span></td>
                  <td style={{ fontWeight: 700, color: app.overallScore >= 80 ? 'var(--green)' : app.overallScore >= 60 ? 'var(--yellow)' : 'var(--red)' }}>{app.overallScore}%</td>
                  <td style={{ color: 'var(--muted)' }}>{app.evidenceCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Detail Panel */}
        {selected && (
          <div className="fade-in">
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '16px', marginBottom: '4px' }}>{selected.fullName}</h3>
                  <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{selected.studentCode} · {selected.faculty}</div>
                </div>
                <span className={`risk-badge risk-${selected.aiRiskLevel.toLowerCase()}`} style={{ fontSize: '11px', padding: '4px 12px' }}>{riskLabel[selected.aiRiskLevel]}</span>
              </div>

              {/* Criteria Status */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent2)', textTransform: 'uppercase', marginBottom: '8px' }}>Tiêu chí</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '4px' }}>
                  {Object.entries(selected.criteriaStatus).map(([k, v]) => (
                    <div key={k} style={{ textAlign: 'center', padding: '6px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', fontSize: '10px' }}>
                      <div style={{ fontSize: '16px', marginBottom: '2px' }}>{csLabel[v]}</div>
                      <div style={{ color: 'var(--muted)' }}>{criteriaNames[k]}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Summary */}
              <div style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.15)', borderRadius: '8px', padding: '12px', marginBottom: '16px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent3)', marginBottom: '6px' }}>🤖 AI Summary</div>
                <p style={{ fontSize: '12px', color: 'var(--light)', lineHeight: 1.6 }}>{selected.aiSummary}</p>
              </div>

              {/* Actions */}
              {actionDone ? (
                <div className="fade-in" style={{ textAlign: 'center', padding: '16px', background: actionDone === 'approve' ? 'rgba(16,185,129,0.1)' : actionDone === 'reject' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)', borderRadius: '8px' }}>
                  <span style={{ fontSize: '24px' }}>{actionDone === 'approve' ? '✅' : actionDone === 'reject' ? '❌' : '📝'}</span>
                  <div style={{ fontSize: '13px', fontWeight: 600, marginTop: '4px', color: actionDone === 'approve' ? 'var(--green)' : actionDone === 'reject' ? 'var(--red)' : 'var(--yellow)' }}>
                    {actionDone === 'approve' ? 'Đã duyệt!' : actionDone === 'reject' ? 'Đã từ chối!' : 'Đã yêu cầu bổ sung!'}
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--muted)', marginTop: '4px' }}>→ Đã ghi review_logs + thông báo sinh viên</div>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn btn-approve" style={{ flex: 1, justifyContent: 'center' }} onClick={() => handleAction('approve')}>✅ Duyệt</button>
                  <button className="btn btn-update" style={{ flex: 1, justifyContent: 'center' }} onClick={() => handleAction('update')}>📝 Yêu cầu bổ sung</button>
                  <button className="btn btn-reject" style={{ flex: 1, justifyContent: 'center' }} onClick={() => handleAction('reject')}>❌ Từ chối</button>
                </div>
              )}
            </div>

            <div className="card" style={{ fontSize: '11px', color: 'var(--light)', lineHeight: 1.6 }}>
              <strong style={{ color: 'var(--yellow)' }}>⚠ Quy tắc:</strong> Cán bộ có quyền OVERRIDE kết quả AI · Mọi quyết định phải kèm ghi chú · Toàn bộ hành động được ghi vào review_logs
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
