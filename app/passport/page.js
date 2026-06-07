'use client';
import { passportData } from '@/data/mockData';

export default function PassportPage() {
  return (
    <div className="page-container">
      <div className="section-header fade-in">
        <div className="section-num">🎫</div>
        <div>
          <h2>Digital Passport</h2>
          <p>Hồ sơ năng lực số – Giá trị vượt khỏi phần mềm nội bộ</p>
        </div>
      </div>

      {/* Passport Card */}
      <div className="passport-card fade-in">
        <div style={{ textAlign: 'center', marginBottom: '8px', position: 'relative' }}>
          <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '4px' }}>SV5T Digital Passport</div>
          <div style={{ fontSize: '10px', color: 'var(--muted)' }}>Vietnamese Student HackAIthon 2026</div>
        </div>

        <div className="passport-header">
          <div className="passport-avatar">🎓</div>
          <div>
            <div className="passport-name">{passportData.student.fullName}</div>
            <div className="passport-title">🏆 {passportData.student.title}</div>
            <div className="passport-school">{passportData.student.school} · {passportData.student.faculty}</div>
            <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '4px' }}>
              MSSV: {passportData.student.studentCode} · Năm: {passportData.student.year}
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div style={{ position: 'relative' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent2)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>🏅 Thành tích nổi bật</div>
          <div className="achievements-grid">
            {passportData.achievements.map((a, i) => (
              <div key={i} className="achievement-item">
                <div className="achievement-icon">{a.icon}</div>
                <div className="achievement-label">{a.label}</div>
                <div className="achievement-value">{a.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* QR & Actions */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '20px', position: 'relative' }}>
          <button className="btn btn-primary">📱 QR Chia sẻ</button>
          <button className="btn" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'var(--light)' }}>📥 Tải PDF</button>
          <button className="btn" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'var(--light)' }}>🔗 Copy Link</button>
        </div>
      </div>

      <div className="divider"></div>

      {/* Timeline */}
      <div className="section-header fade-in">
        <div className="section-num">📅</div>
        <div>
          <h2>Timeline hành trình</h2>
          <p>Các mốc quan trọng trên hành trình SV5T</p>
        </div>
      </div>

      <div className="card fade-in">
        <div className="timeline">
          {passportData.timeline.map((item, i) => {
            const isLast = i === passportData.timeline.length - 1;
            const colors = { milestone: 'var(--accent)', achievement: 'var(--green)', volunteer: 'var(--red)', sport: 'var(--yellow)', international: 'var(--accent2)', leadership: 'var(--accent3)', award: 'var(--green)' };
            return (
              <div key={i} className="timeline-item">
                <div className={`timeline-dot ${isLast ? 'timeline-dot--highlight' : ''}`} style={{ borderColor: colors[item.type] || 'var(--accent)', background: isLast ? colors[item.type] : 'var(--bg)' }}></div>
                <div className="timeline-date">{item.date}</div>
                <div className="timeline-event" style={{ color: isLast ? 'var(--text)' : 'var(--light)', fontWeight: isLast ? 700 : 400 }}>{item.event}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Value Proposition */}
      <div className="card fade-in" style={{ background: 'rgba(59,130,246,0.05)', borderColor: 'rgba(59,130,246,0.2)', marginTop: '16px' }}>
        <div className="card-title" style={{ color: 'var(--accent)' }}>💡 Giá trị của Digital Passport</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', fontSize: '12px', color: 'var(--light)' }}>
          <div style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
            <div style={{ fontWeight: 700, color: 'var(--text)', marginBottom: '4px' }}>🎓 Cho sinh viên</div>
            Hồ sơ năng lực số có thể chia sẻ với nhà tuyển dụng, tổ chức học bổng
          </div>
          <div style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
            <div style={{ fontWeight: 700, color: 'var(--text)', marginBottom: '4px' }}>🏛️ Cho Hội SV</div>
            Xác nhận điện tử minh bạch, giảm phát hành giấy chứng nhận vật lý
          </div>
          <div style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
            <div style={{ fontWeight: 700, color: 'var(--text)', marginBottom: '4px' }}>📈 Mở rộng</div>
            Tiềm năng phát triển thành CV AI, marketplace học bổng, analytics phong trào
          </div>
        </div>
      </div>
    </div>
  );
}
