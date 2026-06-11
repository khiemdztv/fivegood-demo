'use client';
import { useState, useRef, useEffect } from 'react';
import { criteria } from '@/data/mockData';
import { uploadEvidence, saveEvidence, updateCriteriaProgress, findUserByMssv, createUser } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';

const SUBCATEGORIES_MAP = {
  c1: [{ value: 'Điểm rèn luyện', label: '🌟 Điểm rèn luyện' }],
  c2: [{ value: 'GPA', label: '📚 Điểm GPA' }, { value: 'Giải thưởng', label: '🏆 Giải thưởng học thuật/NCKH' }],
  c3: [{ value: 'Thể thao', label: '💪 Thể thao/Thể chất' }],
  c4: [{ value: 'Tình nguyện', label: '❤️ Hoạt động tình nguyện' }],
  c5: [{ value: 'Ngoại ngữ', label: '🌍 Chứng chỉ ngoại ngữ' }, { value: 'Giải thưởng', label: '🏆 Giải thưởng/Chứng nhận khác' }]
};

export default function UploadPage() {
  const [step, setStep] = useState('idle');
  const [selectedCriteria, setSelectedCriteria] = useState('c4');
  const [subCategory, setSubCategory] = useState('Tình nguyện');
  const [volunteerDaysInput, setVolunteerDaysInput] = useState('1');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [uploadInfo, setUploadInfo] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [ocrResult, setOcrResult] = useState(null);
  const [error, setError] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef(null);
  const { user, login } = useAuth();

  const currentOptions = SUBCATEGORIES_MAP[selectedCriteria] || [];

  useEffect(() => {
    if (currentOptions.length > 0) {
      setSubCategory(currentOptions[0].value);
    } else {
      setSubCategory('');
    }
  }, [selectedCriteria]);

  // Nén ảnh về max 1200px để Groq Vision xử lý được
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

  // Trích xuất text từ PDF bằng unpdf (không cần worker)
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

  const processFile = async (file) => {
    if (!file) return;
    setFileName(file.name);
    setFileSize((file.size / 1024 / 1024).toFixed(2));
    setStep('uploading');
    setError(null);

    // 1. Upload lên Supabase Storage (nếu có)
    const result = await uploadEvidence(file, '20210001');
    setUploadInfo(result);

    // 2. Xử lý file: ảnh → nén base64, PDF → trích xuất text
    let fileBase64 = null;
    let pdfText = null;
    try {
      if (file.type.startsWith('image/')) {
        fileBase64 = await compressImage(file);
      } else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        pdfText = await extractPdfText(file);
      }
    } catch (e) {
      console.warn('Không xử lý được file:', e);
    }

    // 3. Gọi Groq AI phân tích & xác thực thông tin
    try {
      const res = await fetch('/api/verify-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileBase64: fileBase64,
          pdfText: pdfText,
          expectedSchool: user?.school || '',
          expectedName: user?.name || '',
          scoreType: subCategory
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || `HTTP ${res.status}`);
      }

      const data = await res.json();
      
      const mappedResult = {
        ...data,
        aiValidity: (data.isAuthentic && data.nameMatch && (data.schoolMatch || subCategory === 'Giải thưởng')) ? 'VALID' : 'INVALID',
        aiScore: (data.isAuthentic && data.nameMatch && (data.schoolMatch || subCategory === 'Giải thưởng')) ? 0.95 : 0.25,
        extractedText: data.note,
        fields: [
          { label: 'Họ tên sinh viên', value: `${data.studentName || 'Không phát hiện'}${data.studentName ? (data.nameMatch ? ' (✅ Khớp hồ sơ)' : ' (❌ Sai sinh viên)') : ''}` },
          { label: 'Trường đại học', value: `${data.schoolName || 'Không phát hiện'}${data.schoolName ? (data.schoolMatch ? ' (✅ Khớp hồ sơ)' : (subCategory === 'Giải thưởng' ? ' (✅ Hợp lệ - Giải ngoại trường)' : ' (❌ Sai trường)')) : ''}` },
          { label: `Thành tích trích xuất (${subCategory})`, value: data.extractedScore || 'Không xác định' }
        ],
        criteriaMatch: subCategory,
        note: data.note
      };

      if (subCategory === 'Tình nguyện' && data.extractedScore) {
        const matches = data.extractedScore.match(/\d+/);
        if (matches) {
          setVolunteerDaysInput(matches[0]);
        } else {
          setVolunteerDaysInput('1');
        }
      }

      setOcrResult(mappedResult);
      setStep('result');
    } catch (err) {
      setError(err.message);
      setStep('error');
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e) => { e.preventDefault(); setIsDragOver(true); };
  const handleDragLeave = () => setIsDragOver(false);

  const reset = () => { setStep('idle'); setFileName(''); setOcrResult(null); setError(null); setConfirmed(false); setSaving(false); };

  const handleConfirm = async () => {
    if (!ocrResult || saving || confirmed) return;
    setSaving(true);

    try {
      // Đồng bộ user với Supabase (lấy dbId thật)
      let dbId = user?.dbId;
      if (!dbId || dbId > 1000000000000) {
        let dbUser = user?.mssv ? await findUserByMssv(user.mssv) : null;
        if (!dbUser) {
          const { data } = await createUser({ name: user.name, mssv: user.mssv || '', school: user.school || '', faculty: user.faculty || '', role: user.role });
          dbUser = data;
        }
        if (dbUser?.id) {
          dbId = dbUser.id;
          // Cập nhật localStorage
          const updatedUser = { ...user, dbId: dbUser.id, id: dbUser.id };
          login(updatedUser);
        } else {
          dbId = user.id;
        }
      }
      // 1. Lưu evidence vào Supabase
      await saveEvidence({
        userId: dbId,
        criteriaId: selectedCriteria,
        fileName: fileName,
        fileType: fileName.endsWith('.pdf') ? 'PDF' : 'IMAGE',
        fileUrl: uploadInfo?.url || null,
        aiValidity: ocrResult.aiValidity,
        aiScore: ocrResult.aiScore,
        extractedText: ocrResult.extractedText,
        extractedFields: ocrResult.extractedFields,
        criteriaMatch: ocrResult.criteriaMatch,
        aiNote: ocrResult.note,
      });

      // 2. Cập nhật tiến độ criteria (tăng lên)
      const newProgress = ocrResult.aiValidity === 'VALID' ? 100
        : ocrResult.aiValidity === 'SUSPECT' ? 60 : 30;
      await updateCriteriaProgress(dbId, selectedCriteria, newProgress);

      // 3. Cập nhật Passport stats locally & timeline
      if (user) {
        const updatedUser = { ...user, dbId };
        let updatedText = '';

        if (subCategory === 'GPA') {
          updatedUser.gpa = ocrResult.extractedScore || '';
          updatedText = `Cập nhật GPA: ${updatedUser.gpa} / 4.0 qua minh chứng AI`;
        } else if (subCategory === 'Điểm rèn luyện') {
          updatedUser.trainingScore = ocrResult.extractedScore || '';
          updatedText = `Cập nhật Điểm rèn luyện: ${updatedUser.trainingScore} / 100 qua minh chứng AI`;
        } else if (subCategory === 'Ngoại ngữ') {
          updatedUser.foreignLanguage = ocrResult.extractedScore || '';
          updatedText = `Cập nhật Ngoại ngữ: ${updatedUser.foreignLanguage} qua minh chứng AI`;
        } else if (subCategory === 'Thể thao') {
          updatedUser.sports = ocrResult.extractedScore || '';
          updatedText = `Cập nhật Thể thao: ${updatedUser.sports} qua minh chứng AI`;
        } else if (subCategory === 'Giải thưởng') {
          updatedUser.awards = ocrResult.extractedScore || '';
          updatedText = `Cập nhật Giải thưởng: ${updatedUser.awards} qua minh chứng AI`;
        } else if (subCategory === 'Tình nguyện') {
          const daysAdded = Number(volunteerDaysInput || 0);
          updatedUser.volunteerDays = String(Number(user.volunteerDays || 0) + daysAdded);
          updatedText = `Cập nhật Tình nguyện: Tích lũy thêm ${daysAdded} ngày (Tổng: ${updatedUser.volunteerDays} ngày) qua minh chứng AI`;
        }

        if (updatedText) {
          const currentTimeline = user.timelineEvents && user.timelineEvents.length > 0
            ? [...user.timelineEvents]
            : [
                { date: new Date().toLocaleDateString('vi-VN'), text: 'Tạo tài khoản thành công', highlight: true },
                { date: 'Sắp tới', text: 'Tải lên minh chứng đầu tiên', highlight: false }
              ];
          
          currentTimeline.unshift({
            date: new Date().toLocaleDateString('vi-VN'),
            text: updatedText,
            highlight: true
          });

          updatedUser.timelineEvents = currentTimeline;
        }

        login(updatedUser);
      }

      setConfirmed(true);
    } catch (err) {
      console.error('Save error:', err);
      setError('Lỗi lưu: ' + err.message);
    }
    setSaving(false);
  };

  const validityColor = ocrResult?.aiValidity === 'VALID' ? 'var(--green)' : ocrResult?.aiValidity === 'SUSPECT' ? 'var(--yellow)' : 'var(--red)';

  return (
    <div className="page-container">
      <div className="section-header fade-in">
        <div className="section-num">📄</div>
        <div>
          <h2>Upload Minh chứng</h2>
          <p>Upload file thật → Groq AI phân tích → Kết quả OCR tự động</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '20px' }}>
        <div>
          {/* Criteria Selector */}
          <div className="card fade-in">
            <div className="card-title">📋 Chọn tiêu chí</div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {criteria.map(c => (
                <button key={c.id} onClick={() => setSelectedCriteria(c.id)} style={{
                  background: selectedCriteria === c.id ? `${c.color}20` : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${selectedCriteria === c.id ? c.color : 'var(--border)'}`,
                  borderRadius: '8px', padding: '8px 14px', color: selectedCriteria === c.id ? c.color : 'var(--light)',
                  fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: "'Be Vietnam Pro', sans-serif", transition: 'all 0.2s'
                }}>
                  {c.icon} {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Sub-category Selector */}
          <div className="card fade-in" style={{ marginTop: '16px', marginBottom: '16px' }}>
            <div className="card-title" style={{ fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '4px' }}>
              <span>🎯 Mục cập nhật Passport:</span>
              <select
                value={subCategory}
                onChange={e => setSubCategory(e.target.value)}
                style={{
                  background: 'rgba(0,0,0,0.4)',
                  border: '1px solid var(--border)',
                  color: 'white',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 600,
                  outline: 'none',
                  cursor: 'pointer',
                  fontFamily: 'inherit'
                }}
              >
                {currentOptions.map(opt => (
                  <option key={opt.value} value={opt.value} style={{ background: 'var(--bg)', color: 'white' }}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--muted)' }}>
              Minh chứng sau khi được AI xác thực sẽ tự động cập nhật mục tương ứng trong Digital Passport của bạn.
            </div>
          </div>

          {/* Upload Zone */}
          {step === 'idle' && (
            <div
              className={`upload-zone fade-in ${isDragOver ? 'upload-zone--active' : ''}`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileRef.current?.click()}
            >
              <input type="file" ref={fileRef} style={{ display: 'none' }} accept="image/*,.pdf" onChange={handleFileSelect} />
              <div className="upload-zone-icon">📁</div>
              <h3>{isDragOver ? '📥 Thả file vào đây!' : 'Kéo thả file hoặc click để chọn'}</h3>
              <p>Hỗ trợ JPG, PNG (AI Vision đọc nội dung thật) · PDF (phân tích tên file)</p>
            </div>
          )}

          {/* Uploading Animation */}
          {step === 'uploading' && (
            <div className="card fade-in" style={{ textAlign: 'center', padding: '48px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px', animation: 'spin 2s linear infinite' }}>⚙️</div>
              <h3 style={{ marginBottom: '8px' }}>Đang phân tích {fileName}...</h3>
              <p style={{ color: 'var(--muted)', fontSize: '12px', marginBottom: '16px' }}>Groq Vision (Llama 4 Scout) đang đọc nội dung thật từ file</p>
            </div>
          )}

          {/* Error */}
          {step === 'error' && (
            <div className="card fade-in" style={{ textAlign: 'center', padding: '40px', borderColor: 'rgba(239,68,68,0.3)' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>❌</div>
              <h3 style={{ color: 'var(--red)', marginBottom: '8px' }}>Lỗi phân tích</h3>
              <p style={{ color: 'var(--light)', fontSize: '12px', marginBottom: '16px' }}>{error}</p>
              <button className="btn btn-primary" onClick={reset}>🔄 Thử lại</button>
            </div>
          )}

          {/* AI OCR Result */}
          {step === 'result' && ocrResult && (
            <div className="ocr-result fade-in">
              <div className="ocr-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '18px' }}>{fileName.match(/\.pdf$/i) ? '📄' : '🖼️'}</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '14px' }}>{fileName}</div>
                    <div style={{ fontSize: '11px', color: 'var(--muted)' }}>
                      {fileSize} MB · AI phân tích bởi Groq
                      {uploadInfo?.url && <span style={{ color: 'var(--green)' }}> · ☁️ Supabase</span>}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className={`validity-badge badge-${(ocrResult.aiValidity || 'valid').toLowerCase()}`} style={{ fontSize: '12px', padding: '4px 14px' }}>
                    {ocrResult.aiValidity === 'VALID' ? '✅' : ocrResult.aiValidity === 'SUSPECT' ? '⚠️' : '❌'} {ocrResult.aiValidity}
                  </span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '14px', fontWeight: 700, color: validityColor }}>{Number(ocrResult.aiScore).toFixed(2)}</span>
                </div>
              </div>

              <div className="ocr-body">
                {/* Extracted Fields */}
                {ocrResult.fields && ocrResult.fields.length > 0 && (
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent2)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>📋 Trường thông tin bóc tách (AI)</div>
                    {ocrResult.fields.map((f, i) => (
                      <div key={i} className="ocr-field">
                        <span className="ocr-field-label">{f.label}</span>
                        <span className="ocr-field-value">{f.value}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Raw Text */}
                {ocrResult.extractedText && (
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent2)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>📝 Văn bản OCR (AI generated)</div>
                    <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', padding: '14px', fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: 'var(--light)', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                      {ocrResult.extractedText}
                    </div>
                  </div>
                )}

                {/* AI Assessment */}
                <div style={{ background: `${validityColor}08`, border: `1px solid ${validityColor}30`, borderRadius: '10px', padding: '16px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: validityColor, marginBottom: '8px' }}>🤖 Đánh giá AI (Groq Vision)</div>
                  <p style={{ fontSize: '12px', color: 'var(--light)', lineHeight: 1.6 }}>{ocrResult.note}</p>
                  {ocrResult.criteriaMatch && (
                    <div style={{ marginTop: '8px', fontSize: '11px', color: 'var(--muted)' }}>Tiêu chí phù hợp: <strong style={{ color: 'var(--accent)' }}>{ocrResult.criteriaMatch}</strong></div>
                  )}
                </div>

                {/* Enforce strict match requirements */}
                {ocrResult && (!ocrResult.nameMatch || (!ocrResult.schoolMatch && subCategory !== 'Giải thưởng')) && (
                  <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(239,68,68,0.1)', border: '1px solid var(--red)', borderRadius: '8px', color: 'var(--red)', fontSize: '12px', fontWeight: 600, textAlign: 'center' }}>
                    ⚠️ Không thể lưu: Tên sinh viên hoặc trường trên minh chứng không khớp với thông tin của bạn. Vui lòng kiểm tra lại tài liệu nộp!
                  </div>
                )}

                {/* If Volunteer, allow user to input/confirm the number of volunteer days */}
                {ocrResult && subCategory === 'Tình nguyện' && ocrResult.nameMatch && ocrResult.schoolMatch && (
                  <div style={{
                    marginTop: '16px',
                    padding: '12px',
                    background: 'rgba(59,130,246,0.1)',
                    border: '1px solid rgba(59,130,246,0.2)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px'
                  }}>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--light)' }}>Nhập số ngày tình nguyện ghi nhận từ minh chứng:</label>
                    <input
                      type="number"
                      min="1"
                      value={volunteerDaysInput}
                      onChange={e => setVolunteerDaysInput(e.target.value)}
                      style={{
                        width: '70px',
                        background: 'rgba(0,0,0,0.4)',
                        border: '1px solid var(--border)',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        textAlign: 'center',
                        fontWeight: 'bold'
                      }}
                    />
                  </div>
                )}

                {/* Confirm buttons */}
                {confirmed ? (
                  <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '10px', padding: '16px', textAlign: 'center', marginTop: '16px' }}>
                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>🎉</div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--green)', marginBottom: '4px' }}>Đã lưu minh chứng & cập nhật Passport!</div>
                    <div style={{ fontSize: '11px', color: 'var(--muted)' }}>Dữ liệu đã được đồng bộ hóa thành công</div>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '12px', justifyContent: 'center' }}>
                      <button className="btn btn-primary" onClick={reset} style={{ fontSize: '12px' }}>📄 Upload thêm minh chứng</button>
                      <button className="btn btn-update" onClick={() => window.location.href = '/passport'} style={{ fontSize: '12px' }}>🎫 Xem Passport</button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                    <button
                      className="btn btn-approve"
                      style={{
                        flex: 1,
                        justifyContent: 'center',
                        opacity: (saving || !ocrResult.nameMatch || (!ocrResult.schoolMatch && subCategory !== 'Giải thưởng')) ? 0.5 : 1,
                        cursor: (!ocrResult.nameMatch || (!ocrResult.schoolMatch && subCategory !== 'Giải thưởng')) ? 'not-allowed' : 'pointer'
                      }}
                      onClick={handleConfirm}
                      disabled={saving || !ocrResult.nameMatch || (!ocrResult.schoolMatch && subCategory !== 'Giải thưởng')}
                    >
                      {saving ? '⏳ Đang lưu...' : '✅ Xác nhận dùng minh chứng này'}
                    </button>
                    <button className="btn btn-update" onClick={reset}>🔄 Upload file khác</button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Side Panel */}
        <div>
          <div className="card fade-in">
            <div className="card-title">⚡ Pipeline AI</div>
            <div style={{ fontSize: '11px', color: 'var(--light)', lineHeight: 1.8 }}>
              {[
                { step: '1', label: 'Chọn file ảnh/PDF', color: 'var(--accent)' },
                { step: '2', label: 'Upload → Supabase', badge: 'Supabase', color: '#3ecf8e' },
                { step: '3', label: 'AI Vision đọc nội dung', badge: 'Vision', color: '#10b981' },
                { step: '4', label: 'Bóc tách fields thật', badge: 'Llama 4', color: '#8b5cf6' },
                { step: '5', label: 'Scoring + trả kết quả', color: 'var(--green)' },
              ].map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <div style={{ width: '22px', height: '22px', borderRadius: '6px', background: `${s.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700, color: s.color, flexShrink: 0 }}>{s.step}</div>
                  <span style={{ flex: 1 }}>{s.label}</span>
                  {s.badge && <span style={{ background: `${s.color}18`, color: s.color, padding: '1px 6px', borderRadius: '3px', fontSize: '9px', fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}>{s.badge}</span>}
                </div>
              ))}
            </div>
          </div>

          <div className="card fade-in">
            <div className="card-title">📊 Thang điểm</div>
            <div style={{ fontSize: '11px', color: 'var(--light)' }}>
              <div style={{ padding: '8px', background: 'rgba(16,185,129,0.06)', borderRadius: '6px', marginBottom: '4px' }}>
                <span style={{ color: 'var(--green)', fontWeight: 700 }}>≥0.80 VALID</span> – MC hợp lệ, đáng tin cậy
              </div>
              <div style={{ padding: '8px', background: 'rgba(245,158,11,0.06)', borderRadius: '6px', marginBottom: '4px' }}>
                <span style={{ color: 'var(--yellow)', fontWeight: 700 }}>0.50–0.79 SUSPECT</span> – Cần kiểm tra thêm
              </div>
              <div style={{ padding: '8px', background: 'rgba(239,68,68,0.06)', borderRadius: '6px' }}>
                <span style={{ color: 'var(--red)', fontWeight: 700 }}>&lt;0.50 INVALID</span> – Không hợp lệ
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
