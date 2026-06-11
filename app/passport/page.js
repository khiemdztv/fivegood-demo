'use client';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/lib/auth';

export default function PassportPage() {
  const { user, login } = useAuth();
  const [isEditingStats, setIsEditingStats] = useState(false);
  const [gpa, setGpa] = useState('');
  const [trainingScore, setTrainingScore] = useState('');
  const [sports, setSports] = useState('');
  const [awards, setAwards] = useState('');
  const [volunteerDays, setVolunteerDays] = useState('');
  const [foreignLanguage, setForeignLanguage] = useState('');
  const [showQrModal, setShowQrModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [timelineEvents, setTimelineEvents] = useState([]);
  
  // AI Scanning state
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [scanningType, setScanningType] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      setGpa(user.gpa || '');
      setTrainingScore(user.trainingScore || '');
      setSports(user.sports || '');
      setAwards(user.awards || '');
      setVolunteerDays(user.volunteerDays || '');
      setForeignLanguage(user.foreignLanguage || '');
      
      if (user.timelineEvents && user.timelineEvents.length > 0) {
        setTimelineEvents(user.timelineEvents);
      } else {
        setTimelineEvents([
          { date: new Date().toLocaleDateString('vi-VN'), text: 'Tạo tài khoản thành công', highlight: true },
          { date: 'Sắp tới', text: 'Tải lên minh chứng đầu tiên', highlight: false }
        ]);
      }
    }
  }, [user]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      showToast('🔗 Đã sao chép liên kết Passport!');
    }
  };

  const handlePrintPdf = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

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

  const extractPdfText = async (file) => {
    try {
      const { extractText, getDocumentProxy } = await import('unpdf');
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await getDocumentProxy(new Uint8Array(arrayBuffer));
      const { text } = await extractText(pdf, { mergePages: false });

      let fullText = '';
      const pages = text.slice(0, 3); // Tối đa 3 trang đầu
      pages.forEach((pageText, i) => {
        if (pageText.trim()) {
          fullText += `[Trang ${i + 1}]\n${pageText.trim()}\n\n`;
        }
      });

      return fullText.trim() || null;
    } catch (err) {
      console.error('PDF text extraction error:', err);
      return null;
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsScanning(true);
    setScanResult(null);

    let base64 = null;
    let pdfText = null;

    if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      pdfText = await extractPdfText(file);
      if (!pdfText) {
        setIsScanning(false);
        showToast('❌ Không thể trích xuất văn bản từ PDF này.');
        return;
      }
    } else {
      base64 = await compressImage(file);
      if (!base64) {
        setIsScanning(false);
        showToast('❌ Không thể xử lý tệp ảnh.');
        return;
      }
    }

    try {
      const res = await fetch('/api/verify-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileBase64: base64,
          pdfText: pdfText,
          expectedSchool: user?.school || '',
          expectedName: user?.name || '',
          scoreType: scanningType
        })
      });

      const data = await res.json();
      setScanResult({ type: scanningType, ...data });
      
      if (data.isAuthentic && (data.schoolMatch || scanningType === 'Giải thưởng') && data.nameMatch && data.extractedScore) {
        if (scanningType === 'GPA') setGpa(data.extractedScore);
        else if (scanningType === 'Điểm rèn luyện') setTrainingScore(data.extractedScore);
        else if (scanningType === 'Thể thao') setSports(data.extractedScore);
        else if (scanningType === 'Giải thưởng') setAwards(data.extractedScore);
        else if (scanningType === 'Ngoại ngữ') setForeignLanguage(data.extractedScore);
        else if (scanningType === 'Tình nguyện') {
          const matches = data.extractedScore.match(/\d+/);
          if (matches) {
            setVolunteerDays(matches[0]);
          }
        }
      }
    } catch (err) {
      console.error(err);
      setScanResult({ type: scanningType, isAuthentic: false, nameMatch: false, schoolMatch: false, note: 'Lỗi kết nối máy chủ.' });
    }
    
    setIsScanning(false);
    e.target.value = '';
  };

  const handleSaveStats = () => {
    const updatedUser = {
      ...user,
      gpa,
      trainingScore,
      sports,
      awards,
      volunteerDays,
      foreignLanguage
    };

    const newTimelineEvents = [...timelineEvents];
    let changed = false;

    if (gpa !== user.gpa) {
      newTimelineEvents.unshift({
        date: new Date().toLocaleDateString('vi-VN'),
        text: `Cập nhật GPA: ${gpa || 'Chưa có'} / 4.0`,
        highlight: true
      });
      changed = true;
    }
    if (trainingScore !== user.trainingScore) {
      newTimelineEvents.unshift({
        date: new Date().toLocaleDateString('vi-VN'),
        text: `Cập nhật Điểm rèn luyện: ${trainingScore || 'Chưa có'} / 100`,
        highlight: true
      });
      changed = true;
    }
    if (sports !== user.sports) {
      newTimelineEvents.unshift({
        date: new Date().toLocaleDateString('vi-VN'),
        text: `Cập nhật Thể thao: ${sports || 'Chưa có'}`,
        highlight: true
      });
      changed = true;
    }
    if (awards !== user.awards) {
      newTimelineEvents.unshift({
        date: new Date().toLocaleDateString('vi-VN'),
        text: `Cập nhật Giải thưởng: ${awards || '0 giải'}`,
        highlight: true
      });
      changed = true;
    }
    if (volunteerDays !== user.volunteerDays) {
      newTimelineEvents.unshift({
        date: new Date().toLocaleDateString('vi-VN'),
        text: `Cập nhật Tình nguyện: ${volunteerDays || '0'} ngày`,
        highlight: true
      });
      changed = true;
    }
    if (foreignLanguage !== user.foreignLanguage) {
      newTimelineEvents.unshift({
        date: new Date().toLocaleDateString('vi-VN'),
        text: `Cập nhật Ngoại ngữ: ${foreignLanguage || 'Chưa có'}`,
        highlight: true
      });
      changed = true;
    }

    if (changed) {
      updatedUser.timelineEvents = newTimelineEvents;
      setTimelineEvents(newTimelineEvents);
    }

    login(updatedUser);
    setIsEditingStats(false);
    setScanResult(null);
    showToast('💾 Đã cập nhật thành công!');
  };

  if (!user) {
    return (
      <div className="page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center', color: 'var(--muted)' }}>
          <div className="spinner" style={{ width: '32px', height: '32px', margin: '0 auto 12px' }}></div>
          <div>Đang tải thông tin Passport...</div>
        </div>
      </div>
    );
  }

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
            <div className="fade-in" style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '12px', marginBottom: '20px', border: '1px dashed var(--border)' }}>
              
              {/* Hidden File Input */}
              <input type="file" accept="image/*,.pdf" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />

              {/* Status Message */}
              {isScanning && (
                <div style={{ padding: '8px', background: 'rgba(59,130,246,0.1)', color: 'var(--accent)', borderRadius: '4px', marginBottom: '12px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div className="spinner" style={{ width: '12px', height: '12px' }}></div>
                  AI đang quét minh chứng của {user?.name}...
                </div>
              )}

              {/* Scan Results Display */}
              {scanResult && !isScanning && (
                <div style={{
                  background: 'rgba(20, 30, 50, 0.8)',
                  border: '1px solid var(--border)',
                  padding: '16px',
                  borderRadius: '10px',
                  marginBottom: '16px'
                }}>
                  <div style={{ fontWeight: 700, fontSize: '12px', color: 'var(--accent2)', marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
                    <span>🔍 AI PHÂN TÍCH MINH CHỨNG ({scanResult.type})</span>
                    <button onClick={() => setScanResult(null)} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer' }}>✕</button>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span><strong>Họ tên sinh viên:</strong> {scanResult.studentName || 'Không phát hiện'}</span>
                      {scanResult.studentName && (
                        <span style={{ color: scanResult.nameMatch ? 'var(--green)' : 'var(--red)', fontWeight: 600 }}>
                          {scanResult.nameMatch ? '✅ Khớp hồ sơ' : '❌ Sai sinh viên'}
                        </span>
                      )}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span><strong>Trường học:</strong> {scanResult.schoolName || 'Không phát hiện'}</span>
                      {scanResult.schoolName && (
                        <span style={{ color: (scanResult.schoolMatch || scanResult.type === 'Giải thưởng') ? 'var(--green)' : 'var(--red)', fontWeight: 600 }}>
                          {scanResult.schoolMatch ? '✅ Khớp hồ sơ' : (scanResult.type === 'Giải thưởng' ? '✅ Hợp lệ (Giải ngoại trường)' : '❌ Sai trường')}
                        </span>
                      )}
                    </div>
                    <div>
                      <strong>Giá trị đọc được:</strong> <span style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '14px' }}>{scanResult.extractedScore || 'Không xác định'}</span>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '8px', borderRadius: '4px', fontSize: '11px', color: 'var(--light)', fontStyle: 'italic' }}>
                      {scanResult.note}
                    </div>
                  </div>

                  {/* Enforce strict match requirements */}
                  {(!scanResult.nameMatch || (!scanResult.schoolMatch && scanResult.type !== 'Giải thưởng')) ? (
                    <div style={{ padding: '8px', background: 'rgba(239,68,68,0.1)', border: '1px solid var(--red)', borderRadius: '6px', color: 'var(--red)', fontSize: '11px', fontWeight: 600 }}>
                      ⚠️ Không thể lưu: Tên sinh viên hoặc trường trên minh chứng không khớp với thông tin của bạn. Vui lòng kiểm tra lại tài liệu nộp!
                    </div>
                  ) : (
                    <div style={{ padding: '8px', background: 'rgba(16,185,129,0.1)', border: '1px solid var(--green)', borderRadius: '6px', color: 'var(--green)', fontSize: '11px', fontWeight: 600 }}>
                      ✅ Xác thực thành công: Bạn có thể cập nhật thông tin này vào Passport.
                    </div>
                  )}

                  {/* If Volunteer, allow user to input/confirm the number of volunteer days */}
                  {scanResult.type === 'Tình nguyện' && scanResult.nameMatch && scanResult.schoolMatch && (
                    <div style={{
                      marginTop: '12px',
                      padding: '10px',
                      background: 'rgba(59,130,246,0.1)',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}>
                      <label style={{ fontSize: '11px', fontWeight: 700 }}>Nhập số ngày tình nguyện ghi nhận từ minh chứng:</label>
                      <input
                        type="number"
                        min="1"
                        value={volunteerDays}
                        onChange={e => setVolunteerDays(e.target.value)}
                        style={{
                          width: '70px',
                          background: 'rgba(0,0,0,0.4)',
                          border: '1px solid var(--border)',
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          textAlign: 'center'
                        }}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Form inputs grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', alignItems: 'center' }}>
                    <label style={{ fontSize: '11px', color: 'var(--light)', fontWeight: 600 }}>📚 GPA (Hệ 4.0)</label>
                    <button onClick={() => handleScanClick('GPA')} className="btn" style={{ fontSize: '9px', padding: '2px 8px', background: 'var(--accent)', color: 'white', borderRadius: '4px' }}>📷 Quét AI</button>
                  </div>
                  <input type="number" step="0.01" value={gpa} onChange={e => setGpa(e.target.value)} style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', color: 'white', padding: '8px', borderRadius: '4px', width: '100%', fontSize: '13px' }} placeholder="VD: 3.65" />
                </div>
                
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', alignItems: 'center' }}>
                    <label style={{ fontSize: '11px', color: 'var(--light)', fontWeight: 600 }}>🌟 Điểm rèn luyện</label>
                    <button onClick={() => handleScanClick('Điểm rèn luyện')} className="btn" style={{ fontSize: '9px', padding: '2px 8px', background: 'var(--accent)', color: 'white', borderRadius: '4px' }}>📷 Quét AI</button>
                  </div>
                  <input type="number" value={trainingScore} onChange={e => setTrainingScore(e.target.value)} style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', color: 'white', padding: '8px', borderRadius: '4px', width: '100%', fontSize: '13px' }} placeholder="VD: 90" />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', alignItems: 'center' }}>
                    <label style={{ fontSize: '11px', color: 'var(--light)', fontWeight: 600 }}>💪 Thể thao</label>
                    <button onClick={() => handleScanClick('Thể thao')} className="btn" style={{ fontSize: '9px', padding: '2px 8px', background: 'var(--accent)', color: 'white', borderRadius: '4px' }}>📷 Quét AI</button>
                  </div>
                  <input type="text" value={sports} onChange={e => setSports(e.target.value)} style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', color: 'white', padding: '8px', borderRadius: '4px', width: '100%', fontSize: '13px' }} placeholder="VD: Đạt chuẩn thể lực" />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', alignItems: 'center' }}>
                    <label style={{ fontSize: '11px', color: 'var(--light)', fontWeight: 600 }}>🏆 Giải thưởng</label>
                    <button onClick={() => handleScanClick('Giải thưởng')} className="btn" style={{ fontSize: '9px', padding: '2px 8px', background: 'var(--accent)', color: 'white', borderRadius: '4px' }}>📷 Quét AI</button>
                  </div>
                  <input type="text" value={awards} onChange={e => setAwards(e.target.value)} style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', color: 'white', padding: '8px', borderRadius: '4px', width: '100%', fontSize: '13px' }} placeholder="VD: Giải Nhất NCKH" />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', alignItems: 'center' }}>
                    <label style={{ fontSize: '11px', color: 'var(--light)', fontWeight: 600 }}>🌍 Ngoại ngữ</label>
                    <button onClick={() => handleScanClick('Ngoại ngữ')} className="btn" style={{ fontSize: '9px', padding: '2px 8px', background: 'var(--accent)', color: 'white', borderRadius: '4px' }}>📷 Quét AI</button>
                  </div>
                  <input type="text" value={foreignLanguage} onChange={e => setForeignLanguage(e.target.value)} style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', color: 'white', padding: '8px', borderRadius: '4px', width: '100%', fontSize: '13px' }} placeholder="VD: IELTS 6.5" />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', alignItems: 'center' }}>
                    <label style={{ fontSize: '11px', color: 'var(--light)', fontWeight: 600 }}>❤️ Tình nguyện (Số ngày tích lũy)</label>
                    <button onClick={() => handleScanClick('Tình nguyện')} className="btn" style={{ fontSize: '9px', padding: '2px 8px', background: 'var(--accent)', color: 'white', borderRadius: '4px' }}>📷 Quét minh chứng</button>
                  </div>
                  <input type="number" value={volunteerDays} onChange={e => setVolunteerDays(e.target.value)} style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', color: 'white', padding: '8px', borderRadius: '4px', width: '100%', fontSize: '13px' }} placeholder="VD: 5" />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
                <button onClick={() => { setIsEditingStats(false); setScanResult(null); }} className="btn" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--light)', border: '1px solid var(--border)' }}>Hủy</button>
                <button
                  onClick={handleSaveStats}
                  className="btn btn-primary"
                  disabled={scanResult && (!scanResult.nameMatch || (!scanResult.schoolMatch && scanResult.type !== 'Giải thưởng'))}
                  style={{
                    padding: '8px 20px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    opacity: (scanResult && (!scanResult.nameMatch || (!scanResult.schoolMatch && scanResult.type !== 'Giải thưởng'))) ? 0.5 : 1,
                    cursor: (scanResult && (!scanResult.nameMatch || (!scanResult.schoolMatch && scanResult.type !== 'Giải thưởng'))) ? 'not-allowed' : 'pointer'
                  }}
                >
                  💾 Lưu thay đổi
                </button>
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
              <div className="achievement-value" style={{ color: user.foreignLanguage ? 'var(--text)' : 'var(--muted)' }}>{user.foreignLanguage || 'Chưa cập nhật'}</div>
            </div>
            <div className="achievement-item">
              <div className="achievement-icon">❤️</div>
              <div className="achievement-label">Tình nguyện</div>
              <div className="achievement-value">{user.volunteerDays ? `${user.volunteerDays} ngày` : '0 ngày'}</div>
            </div>
            <div className="achievement-item">
              <div className="achievement-icon">💪</div>
              <div className="achievement-label">Thể thao</div>
              <div className="achievement-value">{user.sports || 'Chưa có'}</div>
            </div>
            <div className="achievement-item">
              <div className="achievement-icon">🏆</div>
              <div className="achievement-label">Giải thưởng</div>
              <div className="achievement-value">{user.awards || '0 giải'}</div>
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
          <button onClick={() => setShowQrModal(true)} className="btn btn-primary">📱 QR Chia sẻ</button>
          <button onClick={handlePrintPdf} className="btn" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'var(--light)' }}>📥 Tải PDF</button>
          <button onClick={handleCopyLink} className="btn" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'var(--light)' }}>🔗 Copy Link</button>
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
          {timelineEvents.map((evt, i) => (
            <div key={i} className="timeline-item">
              <div className={`timeline-dot ${evt.highlight ? 'timeline-dot--highlight' : ''}`} style={{
                borderColor: evt.highlight ? 'var(--green)' : 'var(--muted)',
                background: evt.highlight ? 'var(--green)' : 'var(--bg)'
              }}></div>
              <div className="timeline-date">{evt.date}</div>
              <div className="timeline-event" style={{
                color: evt.highlight ? 'var(--text)' : 'var(--muted)',
                fontWeight: evt.highlight ? 700 : 400
              }}>{evt.text}</div>
            </div>
          ))}
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

      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(20, 30, 50, 0.95)',
          border: '1px solid var(--accent)',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '8px',
          zIndex: 1100,
          fontSize: '13px',
          fontWeight: 'bold',
          boxShadow: '0 4px 20px rgba(59,130,246,0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backdropFilter: 'blur(8px)',
          animation: 'fadeSlideDown 0.3s ease'
        }}>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* QR Sharing Modal */}
      {showQrModal && (
        <div className="modal-overlay" onClick={() => setShowQrModal(false)} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{
            background: 'var(--card)', border: '1px solid var(--border)', padding: '32px', borderRadius: '16px', textAlign: 'center', maxWidth: '360px', width: '90%'
          }}>
            <h3 style={{ marginBottom: '16px', color: 'var(--accent)' }}>QR Code Passport</h3>
            <div style={{ background: 'white', padding: '16px', borderRadius: '12px', display: 'inline-block', marginBottom: '16px' }}>
              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`} alt="QR Code" style={{ display: 'block', width: '200px', height: '200px' }} />
            </div>
            <p style={{ fontSize: '12px', color: 'var(--light)', marginBottom: '24px' }}>Quét mã QR để xem và chia sẻ Hồ sơ năng lực số của {user?.name}</p>
            <button className="btn" onClick={() => setShowQrModal(false)} style={{ background: 'var(--border)', color: 'var(--text)', width: '100%' }}>Đóng</button>
          </div>
        </div>
      )}

      {/* Print PDF specific CSS */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body * {
            visibility: hidden !important;
          }
          .passport-card, .passport-card * {
            visibility: visible !important;
          }
          .passport-card {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            max-width: 100% !important;
            border: none !important;
            background: #0f172a !important;
            color: white !important;
            box-shadow: none !important;
            padding: 40px !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .passport-card button, .passport-card .btn {
            display: none !important;
          }
        }
      `}} />

    </div>
  );
}
