'use client';
import { useAuth } from '@/lib/auth';

export default function PassportPage() {
  const { user } = useAuth();
  if (!user) return null;
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
            <div className="passport-name">{user.name || 'Tên Sinh Viên'}</div>
            <div className="passport-title">🏆 Ứng viên Sinh viên 5 Tốt</div>
            <div className="passport-school">{user.school || 'Trường Đại học'} · {user.faculty || 'Khoa'}</div>
            <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '4px' }}>
              MSSV: {user.mssv || 'N/A'} · Năm: 2025 - 2026
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div style={{ position: 'relative' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent2)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>🏅 Thành tích nổi bật</div>
          <div className="achievements-grid">
            <div className="achievement-item">
              <div className="achievement-icon">📚</div>
              <div className="achievement-label">GPA</div>
              <div className="achievement-value">Chưa cập nhật</div>
            </div>
            <div className="achievement-item">
              <div className="achievement-icon">🌍</div>
              <div className="achievement-label">Ngoại ngữ</div>
              <div className="achievement-value">Chưa cập nhật</div>
            </div>
            <div className="achievement-item">
              <div className="achievement-icon">❤️</div>
              <div className="achievement-label">Tình nguyện</div>
              <div className="achievement-value">0 giờ</div>
            </div>
            <div className="achievement-item">
              <div className="achievement-icon">💪</div>
              <div className="achievement-label">Thể thao</div>
              <div className="achievement-value">Chưa có</div>
            </div>
            <div className="achievement-item">
              <div className="achievement-icon">🏆</div>
              <div className="achievement-label">Giải thưởng</div>
              <div className="achievement-value">0 giải</div>
            </div>
            <div className="achievement-item">
              <div className="achievement-icon">🌟</div>
              <div className="achievement-label">Rèn luyện</div>
              <div className="achievement-value">Chưa có</div>
            </div>
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
          <div className="timeline-item">
            <div className="timeline-dot timeline-dot--highlight" style={{ borderColor: 'var(--green)', background: 'var(--green)' }}></div>
            <div className="timeline-date">{new Date().toLocaleDateString('vi-VN')}</div>
            <div className="timeline-event" style={{ color: 'var(--text)', fontWeight: 700 }}>Tạo tài khoản thành công</div>
          </div>
          <div className="timeline-item">
            <div className="timeline-dot" style={{ borderColor: 'var(--muted)', background: 'var(--bg)' }}></div>
            <div className="timeline-date">Sắp tới</div>
            <div className="timeline-event" style={{ color: 'var(--muted)', fontWeight: 400 }}>Tải lên minh chứng đầu tiên</div>
          </div>
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
