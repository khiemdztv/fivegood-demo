'use client';
import { useState } from 'react';
import { reviewerApplications } from '@/data/mockData';

export default function AnalyticsPage() {
  const [selectedFaculty, setSelectedFaculty] = useState('all');

  // Mock data cho analytics
  const overviewStats = {
    totalApplications: 1247,
    totalPending: 312,
    totalApproved: 856,
    totalRejected: 79,
    avgProcessTime: '2.3 ngày',
    aiAssisted: '89%',
  };

  const facultyData = [
    { name: 'Công nghệ Thông tin', total: 210, approved: 156, pending: 38, rejected: 16, avgScore: 78 },
    { name: 'Quản trị Kinh doanh', total: 185, approved: 130, pending: 42, rejected: 13, avgScore: 72 },
    { name: 'Ngoại ngữ', total: 168, approved: 140, pending: 18, rejected: 10, avgScore: 84 },
    { name: 'Cơ khí', total: 142, approved: 98, pending: 35, rejected: 9, avgScore: 69 },
    { name: 'Luật', total: 130, approved: 105, pending: 18, rejected: 7, avgScore: 81 },
    { name: 'Y Dược', total: 120, approved: 88, pending: 25, rejected: 7, avgScore: 73 },
    { name: 'Kiến trúc', total: 98, approved: 72, pending: 20, rejected: 6, avgScore: 74 },
    { name: 'Sư phạm', total: 94, approved: 67, pending: 22, rejected: 5, avgScore: 71 },
    { name: 'Khoa học Tự nhiên', total: 100, approved: 78, pending: 16, rejected: 6, avgScore: 77 },
  ];

  const criteriaBreakdown = [
    { name: 'Đạo đức tốt', icon: '🌟', passRate: 94, avgScore: 88, topIssue: 'Thiếu xác nhận từ BCS lớp' },
    { name: 'Học tập tốt', icon: '📚', passRate: 78, avgScore: 72, topIssue: 'GPA chưa đạt / thiếu MC NCKH' },
    { name: 'Thể lực tốt', icon: '💪', passRate: 85, avgScore: 79, topIssue: 'MC không rõ nguồn / scan mờ' },
    { name: 'Tình nguyện tốt', icon: '❤️', passRate: 67, avgScore: 64, topIssue: 'Thiếu giấy XN tình nguyện' },
    { name: 'Hội nhập tốt', icon: '🌍', passRate: 71, avgScore: 68, topIssue: 'Thiếu MC ngoại ngữ / QLQT' },
  ];

  const aiInsights = [
    { type: 'warning', icon: '⚠️', text: '23 hồ sơ có MC trùng lặp giữa các sinh viên cùng khoa CNTT – đề xuất kiểm tra chéo', severity: 'high' },
    { type: 'info', icon: '📊', text: 'Tiêu chí "Tình nguyện tốt" có tỷ lệ thiếu MC cao nhất (33%). Đề xuất nhắc nhở SV bổ sung trước deadline.', severity: 'medium' },
    { type: 'success', icon: '✅', text: '156 hồ sơ khoa CNTT đạt AI risk LOW – có thể duyệt nhanh (batch approve)', severity: 'low' },
    { type: 'info', icon: '🔍', text: '12 MC bị phát hiện chỉnh sửa metadata ảnh – đánh dấu SUSPECT tự động', severity: 'high' },
    { type: 'warning', icon: '📅', text: 'Còn 23 ngày đến deadline. 312 hồ sơ chưa duyệt – cần xử lý trung bình 14 HS/ngày', severity: 'medium' },
  ];

  const recentActions = [
    { time: '14:32', staff: 'Nguyễn Văn A', action: 'Duyệt hồ sơ', target: 'Lê Thị Bích Ngọc (20210022)', result: 'APPROVED' },
    { time: '14:15', staff: 'Trần Thị B', action: 'Yêu cầu bổ sung', target: 'Phạm Đức Minh (20210038)', result: 'NEED_MORE_INFO' },
    { time: '13:48', staff: 'Nguyễn Văn A', action: 'Từ chối MC', target: 'Trần Hoàng Nam (20210015)', result: 'REJECTED' },
    { time: '13:30', staff: 'Lê Văn C', action: 'Batch approve', target: '15 hồ sơ AI risk LOW', result: 'APPROVED' },
    { time: '12:55', staff: 'Trần Thị B', action: 'Override AI', target: 'Vũ Thanh Hương (20210045)', result: 'APPROVED' },
  ];

  const maxTotal = Math.max(...facultyData.map(f => f.total));

  return (
    <div className="page-container">
      <div className="section-header fade-in">
        <div className="section-num">📊</div>
        <div>
          <h2>Quản lý & Thống kê</h2>
          <p>Dashboard tổng quan cho cán bộ Hội – AI hỗ trợ đánh giá và xét chọn</p>
        </div>
      </div>

      {/* Overview Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '12px', marginBottom: '24px' }} className="fade-in">
        {[
          { label: 'Tổng hồ sơ', value: overviewStats.totalApplications, color: 'var(--accent)' },
          { label: 'Chờ duyệt', value: overviewStats.totalPending, color: 'var(--yellow)' },
          { label: 'Đã duyệt', value: overviewStats.totalApproved, color: 'var(--green)' },
          { label: 'Từ chối', value: overviewStats.totalRejected, color: 'var(--red)' },
          { label: 'Thời gian TB', value: overviewStats.avgProcessTime, color: 'var(--accent2)' },
          { label: 'AI hỗ trợ', value: overviewStats.aiAssisted, color: 'var(--accent3)' },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-value" style={{ color: s.color, fontSize: '22px' }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '20px', marginBottom: '24px' }}>
        {/* Faculty Chart */}
        <div className="card fade-in">
          <div className="card-title">🏫 Thống kê theo Khoa / Đơn vị</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {facultyData.map((f, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '12px' }}>
                  <span style={{ fontWeight: 500 }}>{f.name}</span>
                  <span style={{ color: 'var(--muted)' }}>{f.total} hồ sơ · <span style={{ color: 'var(--green)' }}>{f.approved}</span> / <span style={{ color: 'var(--yellow)' }}>{f.pending}</span> / <span style={{ color: 'var(--red)' }}>{f.rejected}</span></span>
                </div>
                <div style={{ display: 'flex', height: '14px', borderRadius: '4px', overflow: 'hidden', background: 'var(--border)' }}>
                  <div style={{ width: `${(f.approved / f.total) * 100}%`, background: 'var(--green)', transition: 'width 0.6s' }}></div>
                  <div style={{ width: `${(f.pending / f.total) * 100}%`, background: 'var(--yellow)', transition: 'width 0.6s' }}></div>
                  <div style={{ width: `${(f.rejected / f.total) * 100}%`, background: 'var(--red)', transition: 'width 0.6s' }}></div>
                </div>
              </div>
            ))}
            <div style={{ display: 'flex', gap: '16px', fontSize: '10px', color: 'var(--muted)', marginTop: '4px' }}>
              <span>🟢 Đã duyệt</span><span>🟡 Chờ duyệt</span><span>🔴 Từ chối</span>
            </div>
          </div>
        </div>

        {/* AI Insights */}
        <div className="card fade-in">
          <div className="card-title">🧠 AI Phát hiện & Đề xuất</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {aiInsights.map((insight, i) => {
              const bgColor = insight.severity === 'high' ? 'rgba(239,68,68,0.06)' : insight.severity === 'medium' ? 'rgba(245,158,11,0.06)' : 'rgba(16,185,129,0.06)';
              const borderColor = insight.severity === 'high' ? 'rgba(239,68,68,0.2)' : insight.severity === 'medium' ? 'rgba(245,158,11,0.2)' : 'rgba(16,185,129,0.2)';
              return (
                <div key={i} style={{ background: bgColor, border: `1px solid ${borderColor}`, borderRadius: '8px', padding: '10px 12px', fontSize: '11px', color: 'var(--light)', lineHeight: 1.6 }}>
                  <span style={{ fontSize: '14px', marginRight: '6px' }}>{insight.icon}</span>
                  {insight.text}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Criteria Breakdown */}
      <div className="card fade-in" style={{ marginBottom: '24px' }}>
        <div className="card-title">📋 Phân tích theo 5 Tiêu chí</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
          {criteriaBreakdown.map((c, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '10px', padding: '14px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', marginBottom: '6px' }}>{c.icon}</div>
              <div style={{ fontSize: '12px', fontWeight: 600, marginBottom: '8px' }}>{c.name}</div>
              <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '10px' }}>
                <div>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: c.passRate >= 80 ? 'var(--green)' : c.passRate >= 70 ? 'var(--yellow)' : 'var(--red)' }}>{c.passRate}%</div>
                  <div style={{ fontSize: '9px', color: 'var(--muted)', textTransform: 'uppercase' }}>Tỷ lệ đạt</div>
                </div>
                <div>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--accent2)' }}>{c.avgScore}</div>
                  <div style={{ fontSize: '9px', color: 'var(--muted)', textTransform: 'uppercase' }}>Điểm TB</div>
                </div>
              </div>
              {/* Pass rate bar */}
              <div style={{ height: '4px', borderRadius: '2px', background: 'var(--border)', marginBottom: '8px' }}>
                <div style={{ width: `${c.passRate}%`, height: '100%', borderRadius: '2px', background: c.passRate >= 80 ? 'var(--green)' : c.passRate >= 70 ? 'var(--yellow)' : 'var(--red)' }}></div>
              </div>
              <div style={{ fontSize: '10px', color: 'var(--muted)', lineHeight: 1.4, textAlign: 'left' }}>
                ⚠ {c.topIssue}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
        {/* Batch Actions */}
        <div className="card fade-in">
          <div className="card-title">⚡ Duyệt hàng loạt (Batch Processing)</div>
          <p style={{ fontSize: '12px', color: 'var(--light)', marginBottom: '16px', lineHeight: 1.6 }}>
            AI phân loại hồ sơ theo mức độ rủi ro. Hồ sơ <strong style={{ color: 'var(--green)' }}>LOW risk</strong> có thể duyệt hàng loạt để tối ưu thời gian.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
            {[
              { risk: 'LOW', count: 156, desc: 'Tất cả MC đều VALID, đạt 5/5 tiêu chí', color: 'var(--green)', action: 'Batch Approve' },
              { risk: 'MEDIUM', count: 98, desc: 'Có 1-2 MC SUSPECT, cần review nhanh', color: 'var(--yellow)', action: 'Quick Review' },
              { risk: 'HIGH', count: 58, desc: 'MC INVALID hoặc thiếu nhiều tiêu chí', color: 'var(--red)', action: 'Manual Review' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <span className={`risk-badge risk-${item.risk.toLowerCase()}`} style={{ fontSize: '11px', padding: '4px 10px' }}>{item.risk}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: 600 }}>{item.count} hồ sơ</div>
                  <div style={{ fontSize: '10px', color: 'var(--muted)' }}>{item.desc}</div>
                </div>
                <button className="btn" style={{ background: `${item.color}15`, color: item.color, border: `1px solid ${item.color}40`, fontSize: '11px' }}>{item.action}</button>
              </div>
            ))}
          </div>
          <div style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.15)', borderRadius: '8px', padding: '10px 12px', fontSize: '11px', color: 'var(--light)' }}>
            💡 <strong style={{ color: 'var(--accent3)' }}>Tiết kiệm:</strong> Batch approve 156 HS LOW risk giúp giảm ~<strong>70%</strong> thời gian duyệt thủ công. Mọi quyết định vẫn được ghi log đầy đủ.
          </div>
        </div>

        {/* Recent Actions Log */}
        <div className="card fade-in">
          <div className="card-title">📝 Nhật ký duyệt gần đây</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {recentActions.map((a, i) => {
              const resultColor = a.result === 'APPROVED' ? 'var(--green)' : a.result === 'REJECTED' ? 'var(--red)' : 'var(--yellow)';
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', borderBottom: '1px solid rgba(36,48,80,0.4)', fontSize: '12px' }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: 'var(--muted)', minWidth: '42px' }}>{a.time}</span>
                  <div style={{ flex: 1 }}>
                    <div><strong>{a.staff}</strong> · {a.action}</div>
                    <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{a.target}</div>
                  </div>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: resultColor, padding: '2px 8px', background: `${resultColor}15`, borderRadius: '4px' }}>{a.result}</span>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: '12px', fontSize: '11px', color: 'var(--muted)', textAlign: 'center' }}>
            Toàn bộ hành động được ghi vào <code style={{ background: 'rgba(255,255,255,0.06)', padding: '1px 5px', borderRadius: '3px', fontFamily: "'JetBrains Mono', monospace", fontSize: '10px' }}>review_logs</code> để audit
          </div>
        </div>
      </div>

      {/* Cross-check & Report */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
        <div className="card fade-in">
          <div className="card-title">🔍 AI Kiểm tra chéo (Cross-check)</div>
          <p style={{ fontSize: '12px', color: 'var(--light)', marginBottom: '12px', lineHeight: 1.6 }}>
            AI tự động so sánh minh chứng giữa các hồ sơ để phát hiện trùng lặp, gian lận.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { type: 'Trùng ảnh MC', count: 8, desc: 'Cùng 1 ảnh giấy khen xuất hiện ở 3 hồ sơ', severity: 'high' },
              { type: 'Metadata bất thường', count: 12, desc: 'Ảnh có dấu hiệu chỉnh sửa Photoshop', severity: 'high' },
              { type: 'Ngày tháng mâu thuẫn', count: 5, desc: 'Ngày cấp MC trước ngày hoạt động diễn ra', severity: 'medium' },
              { type: 'Trùng nội dung OCR', count: 15, desc: 'Nội dung giống nhau >90% giữa các SV', severity: 'medium' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', background: item.severity === 'high' ? 'rgba(239,68,68,0.06)' : 'rgba(245,158,11,0.06)', borderRadius: '6px', fontSize: '11px' }}>
                <span style={{ color: item.severity === 'high' ? 'var(--red)' : 'var(--yellow)', fontWeight: 700, minWidth: '24px', textAlign: 'center' }}>{item.count}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: 'var(--text)' }}>{item.type}</div>
                  <div style={{ color: 'var(--muted)', fontSize: '10px' }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card fade-in">
          <div className="card-title">📈 Báo cáo & Xuất dữ liệu</div>
          <p style={{ fontSize: '12px', color: 'var(--light)', marginBottom: '16px', lineHeight: 1.6 }}>
            Tạo báo cáo tổng hợp để trình lên cấp trên, ban giám hiệu, hoặc Trung ương Hội.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { icon: '📊', name: 'Báo cáo tổng hợp kỳ xét', desc: 'Số liệu SV5T toàn trường', format: 'PDF / Excel' },
              { icon: '📋', name: 'Danh sách SV đạt SV5T', desc: 'Kèm điểm và tiêu chí', format: 'Excel / CSV' },
              { icon: '🔍', name: 'Báo cáo AI flagged', desc: 'Hồ sơ bị AI đánh dấu nghi vấn', format: 'PDF' },
              { icon: '📅', name: 'Báo cáo tiến độ duyệt', desc: 'Theo tuần / theo cán bộ', format: 'PDF' },
              { icon: '🏛️', name: 'Hồ sơ gửi Trung ương', desc: 'Đóng gói hồ sơ cấp TW', format: 'ZIP' },
            ].map((r, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', border: '1px solid var(--border)' }}>
                <span style={{ fontSize: '18px' }}>{r.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '12px', fontWeight: 600 }}>{r.name}</div>
                  <div style={{ fontSize: '10px', color: 'var(--muted)' }}>{r.desc}</div>
                </div>
                <button className="btn" style={{ background: 'rgba(59,130,246,0.1)', color: 'var(--accent)', border: '1px solid rgba(59,130,246,0.3)', fontSize: '10px', padding: '4px 10px' }}>📥 {r.format}</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Workload */}
      <div className="card fade-in" style={{ background: 'rgba(59,130,246,0.04)', borderColor: 'rgba(59,130,246,0.2)' }}>
        <div className="card-title" style={{ color: 'var(--accent)' }}>⏱️ Hiệu quả AI đem lại cho công tác Hội</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', fontSize: '12px' }}>
          {[
            { metric: 'Thời gian duyệt 1 HS', before: '~45 phút', after: '~8 phút', reduction: '82%' },
            { metric: 'Xử lý 1000 HS', before: '~30 ngày', after: '~5 ngày', reduction: '83%' },
            { metric: 'Phát hiện MC gian lận', before: 'Dựa kinh nghiệm', after: 'AI auto-flag', reduction: '95%' },
            { metric: 'Làm báo cáo cấp TW', before: '~3 ngày', after: '1 click xuất', reduction: '98%' },
          ].map((m, i) => (
            <div key={i} style={{ textAlign: 'center', padding: '14px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>
              <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text)', marginBottom: '10px' }}>{m.metric}</div>
              <div style={{ fontSize: '11px', color: 'var(--red)', textDecoration: 'line-through', marginBottom: '2px' }}>{m.before}</div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--green)', marginBottom: '4px' }}>{m.after}</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--accent)' }}>↓{m.reduction}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
