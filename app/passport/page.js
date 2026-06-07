'use client';
import { useState, useRef } from 'react';
import { useAuth } from '@/lib/auth';

export default function PassportPage() {
  const { user, login } = useAuth();
  const [isEditingStats, setIsEditingStats] = useState(false);
  const [gpa, setGpa] = useState(user?.gpa || '');
  const [trainingScore, setTrainingScore] = useState(user?.trainingScore || '');
  
  // AI Scanning state
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [scanningType, setScanningType] = useState('');
  const fileInputRef = useRef(null);

  const compressImage = (file, maxSize = 1200) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let { width, height } = img;
          if (width > maxSize || height > maxSize) {
            if (width > height) { height = Math.round((height * maxSize) / width); width = maxSize; }
            else { width = Math.round((width * maxSize) / height); height = maxSize; }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.8));
        };
        img.onerror = () => resolve(null);
        img.src = e.target.result;
      };
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    });
  };

  const handleScanClick = (type) => {
    setScanningType(type);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsScanning(true);
    setScanResult(null);

    const base64 = await compressImage(file);
    if (!base64) {
      setIsScanning(false);
      return;
    }

    try {
      const res = await fetch('/api/verify-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileBase64: base64,
          expectedSchool: user?.school || '',
          expectedName: user?.name || '',
          scoreType: scanningType
        })
      });

      const data = await res.json();
      setScanResult({ type: scanningType, ...data });
      
      if (data.isAuthentic && data.schoolMatch && data.extractedScore) {
        if (scanningType === 'GPA') setGpa(data.extractedScore);
        else setTrainingScore(data.extractedScore);
      }
    } catch (err) {
      console.error(err);
      setScanResult({ type: scanningType, isAuthentic: false, schoolMatch: false, note: 'Lỗi kết nối máy chủ.' });
    }
    
    setIsScanning(false);
    e.target.value = '';
  };

  const handleSaveStats = () => {
    const updatedUser = { ...user, gpa, trainingScore };
    login(updatedUser);
    setIsEditingStats(false);
  };

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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent2)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>🏅 Thành tích nổi bật</div>
            <button onClick={() => setIsEditingStats(!isEditingStats)} className="btn" style={{ fontSize: '10px', padding: '4px 8px', background: 'rgba(255,255,255,0.05)', color: 'var(--light)', border: '1px solid var(--border)' }}>✏️ Cập nhật điểm</button>
          </div>

          {isEditingStats && (
            <div className="fade-in" style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '8px', marginBottom: '16px', border: '1px dashed var(--border)' }}>
              
              {/* Hidden File Input */}
              <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />

              {/* Status Message */}
              {isScanning && (
                <div style={{ padding: '8px', background: 'rgba(59,130,246,0.1)', color: 'var(--accent)', borderRadius: '4px', marginBottom: '12px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div className="spinner" style={{ width: '12px', height: '12px' }}></div>
                  AI đang quét bảng điểm của {user?.name}...
                </div>
              )}
              {scanResult && !isScanning && (
                <div style={{ padding: '8px', background: scanResult.isAuthentic && scanResult.schoolMatch ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: scanResult.isAuthentic && scanResult.schoolMatch ? 'var(--green)' : 'var(--red)', borderRadius: '4px', marginBottom: '12px', fontSize: '11px' }}>
                  <strong>{scanResult.isAuthentic && scanResult.schoolMatch ? '✅ Xác thực thành công:' : '⚠️ Cảnh báo AI:'}</strong> {scanResult.note}
                </div>
              )}

              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '150px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <label style={{ fontSize: '11px', color: 'var(--light)' }}>GPA (Hệ 4.0)</label>
                    <button onClick={() => handleScanClick('GPA')} className="btn" style={{ fontSize: '9px', padding: '2px 6px', background: 'var(--accent)', color: 'white' }}>📷 Quét AI</button>
                  </div>
                  <input type="number" step="0.01" value={gpa} onChange={e => setGpa(e.target.value)} style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', color: 'white', padding: '8px', borderRadius: '4px', width: '100%', fontSize: '14px' }} placeholder="VD: 3.6" />
                </div>
                
                <div style={{ flex: 1, minWidth: '150px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <label style={{ fontSize: '11px', color: 'var(--light)' }}>Điểm rèn luyện</label>
                    <button onClick={() => handleScanClick('Điểm rèn luyện')} className="btn" style={{ fontSize: '9px', padding: '2px 6px', background: 'var(--accent)', color: 'white' }}>📷 Quét AI</button>
                  </div>
                  <input type="number" value={trainingScore} onChange={e => setTrainingScore(e.target.value)} style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', color: 'white', padding: '8px', borderRadius: '4px', width: '100%', fontSize: '14px' }} placeholder="VD: 90" />
                </div>
              </div>

              <div style={{ marginTop: '16px', textAlign: 'right' }}>
                <button onClick={handleSaveStats} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '12px', fontWeight: 'bold' }}>💾 Lưu thay đổi</button>
              </div>
            </div>
          )}

          <div className="achievements-grid">
            <div className="achievement-item">
              <div className="achievement-icon">📚</div>
              <div className="achievement-label">GPA</div>
              <div className="achievement-value" style={{ color: user.gpa ? 'var(--text)' : 'var(--muted)' }}>{user.gpa ? `${user.gpa} / 4.0` : 'Chưa cập nhật'}</div>
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
              <div className="achievement-value" style={{ color: user.trainingScore ? 'var(--text)' : 'var(--muted)' }}>{user.trainingScore ? `${user.trainingScore} / 100` : 'Chưa có'}</div>
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
