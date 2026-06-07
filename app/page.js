import Link from 'next/link';

const features = [
  { icon: '🤖', title: 'AI Mentor cá nhân hóa', desc: 'Trợ lý AI hiểu trạng thái hồ sơ, gợi ý hành động tiếp theo, trả lời theo context cụ thể của từng sinh viên.', color: '#8b5cf6', href: '/mentor' },
  { icon: '📊', title: 'Journey Dashboard', desc: 'Dashboard trực quan 5 tiêu chí với progress ring, checklist, milestone – biến quy trình hành chính thành hành trình phấn đấu.', color: '#3b82f6', href: '/dashboard' },
  { icon: '🔍', title: 'Evidence Intelligence', desc: 'OCR + AI phân loại minh chứng tự động. Bóc tách thông tin, gắn nhãn Valid/Suspect/Invalid, đưa risk score.', color: '#06b6d4', href: '/upload' },
  { icon: '🏛️', title: 'Reviewer Copilot', desc: 'Dashboard AI-assisted cho cán bộ Hội: lọc theo risk, xem AI summary, duyệt nhanh với audit log tự động.', color: '#10b981', href: '/reviewer' },
  { icon: '🎫', title: 'Digital Passport', desc: 'Hồ sơ năng lực số sau khi đạt danh hiệu – timeline, thành tích, QR chia sẻ. Giá trị vượt khỏi phần mềm nội bộ.', color: '#f59e0b', href: '/passport' },
];

const compareData = [
  { aspect: 'Hướng dẫn sinh viên', before: 'FAQ thủ công / file PDF', after: 'AI Mentor cá nhân hóa' },
  { aspect: 'Chuẩn bị hồ sơ', before: 'Tự gom giấy tờ, nộp qua form', after: 'Journey Dashboard + checklist' },
  { aspect: 'Xử lý minh chứng', before: 'Cán bộ xem thủ công 100%', after: 'OCR + AI extraction + AI label' },
  { aspect: 'Duyệt hồ sơ', before: 'Reviewer đọc toàn bộ từ đầu', after: 'AI Copilot tóm tắt + phân loại' },
  { aspect: 'Sau xét duyệt', before: 'Dừng ở kết quả hành chính', after: 'Digital Passport năng lực số' },
  { aspect: 'Tối ưu trải nghiệm', before: 'Đánh giá cảm tính', after: 'SmartUX data-driven' },
];

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <div className="hero">
        <div className="hero-badge">🏆 Vietnamese Student HackAIthon 2026 · Bảng B Challenger · Đề tài 5</div>
        <h1>FiveGood Journey</h1>
        <p className="hero-sub">
          AI đồng hành cùng hành trình trở thành <strong>Sinh viên 5 tốt</strong> — Nền tảng AI hai chiều
          hỗ trợ sinh viên và cán bộ Hội, từ chuẩn bị minh chứng đến xét duyệt và hồ sơ năng lực số.
        </p>
        <div className="hero-chips">
          <div className="hero-chip"><span className="dot"></span> Demo Live</div>
          <div className="hero-chip">🤖 Tích hợp 8 VNPT AI APIs</div>
          <div className="hero-chip">🎓 Dành cho Sinh viên & Cán bộ Hội</div>
          <div className="hero-chip">📅 HackAIthon 2026</div>
        </div>
        <div className="cta-row">
          <Link href="/dashboard" className="cta-btn cta-btn--primary">🎓 Xem Dashboard Sinh viên</Link>
          <Link href="/reviewer" className="cta-btn cta-btn--secondary">🏛️ Xem Dashboard Reviewer</Link>
          <Link href="/architecture" className="cta-btn cta-btn--secondary">📐 Kiến trúc hệ thống</Link>
        </div>
      </div>

      <div className="page-container">
        {/* STATS */}
        <div className="stats-grid fade-in">
          <div className="stat-card">
            <div className="stat-value" style={{color:'var(--accent)'}}>5</div>
            <div className="stat-label">Giá trị cốt lõi</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{color:'var(--accent3)'}}>8</div>
            <div className="stat-label">VNPT APIs tích hợp</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{color:'var(--green)'}}>70-80%</div>
            <div className="stat-label">Giảm thao tác thủ công</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{color:'var(--accent2)'}}>3 lớp</div>
            <div className="stat-label">Xác minh minh chứng</div>
          </div>
        </div>

        {/* FEATURES */}
        <div className="section-header">
          <div className="section-num">1</div>
          <div>
            <h2>5 Giá trị cốt lõi</h2>
            <p>Cụm đổi mới liên kết tạo nên sự khác biệt</p>
          </div>
        </div>

        <div className="features-grid">
          {features.map((f, i) => (
            <Link href={f.href} key={i} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="feature-card">
                <div className="feature-icon" style={{ background: `${f.color}15`, border: `1px solid ${f.color}40` }}>
                  {f.icon}
                </div>
                <h3 style={{ color: f.color }}>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="divider"></div>

        {/* COMPARE */}
        <div className="section-header">
          <div className="section-num">2</div>
          <div>
            <h2>So sánh trước và sau</h2>
            <p>FiveGood Journey thay đổi toàn bộ quy trình</p>
          </div>
        </div>

        <div className="card">
          <table className="compare-table">
            <thead>
              <tr>
                <th>Khía cạnh</th>
                <th>❌ Cách làm cũ</th>
                <th>✅ FiveGood Journey</th>
              </tr>
            </thead>
            <tbody>
              {compareData.map((row, i) => (
                <tr key={i}>
                  <td style={{fontWeight:600, color:'var(--text)'}}>{row.aspect}</td>
                  <td>{row.before}</td>
                  <td>{row.after}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="divider"></div>

        {/* VNPT APIS */}
        <div className="section-header">
          <div className="section-num">3</div>
          <div>
            <h2>Tận dụng hệ sinh thái VNPT AI</h2>
            <p>8/8 nhóm API được mapping chuyên biệt</p>
          </div>
        </div>

        <div className="features-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          {[
            { icon: '📄', name: 'SmartReader', role: 'OCR minh chứng', color: '#06b6d4' },
            { icon: '🔐', name: 'eKYC', role: 'Xác minh giấy tờ', color: '#3b82f6' },
            { icon: '💬', name: 'Smartbot', role: 'AI Mentor chatbot', color: '#8b5cf6' },
            { icon: '🎙️', name: 'SmartVoice', role: 'STT & TTS', color: '#ec4899' },
            { icon: '📊', name: 'SmartUX', role: 'Analytics UX', color: '#f59e0b' },
            { icon: '👁️', name: 'SmartVision', role: 'Nhận diện hình ảnh', color: '#10b981' },
            { icon: '🌐', name: 'vnSocial', role: 'Phân tích MXH', color: '#ef4444' },
            { icon: '😀', name: 'vnFace', role: 'Face matching', color: '#a855f7' },
          ].map((api, i) => (
            <div key={i} className="feature-card" style={{ padding: '18px', textAlign: 'center' }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>{api.icon}</div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', fontWeight: 600, color: api.color, marginBottom: '4px', padding: '2px 8px', background: `${api.color}18`, borderRadius: '4px', display: 'inline-block' }}>{api.name}</div>
              <p style={{ fontSize: '11px', color: 'var(--light)', marginTop: '6px' }}>{api.role}</p>
            </div>
          ))}
        </div>

        {/* FOOTER */}
        <div className="footer" style={{borderTop: 'none', padding: '40px 0 20px', justifyContent: 'center', flexDirection: 'column', gap: '8px'}}>
          <div style={{fontSize:'13px', fontWeight: 600, color: 'var(--light)'}}>FiveGood Journey · SV5T Copilot</div>
          <div style={{fontSize:'11px'}}>Vietnamese Student HackAIthon 2026 · Bảng B Challenger · Đề tài 5</div>
        </div>
      </div>
    </>
  );
}
