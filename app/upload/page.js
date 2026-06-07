'use client';
import { useState, useRef } from 'react';
import { criteria } from '@/data/mockData';
import { uploadEvidence } from '@/lib/supabase';

export default function UploadPage() {
  const [step, setStep] = useState('idle');
  const [selectedCriteria, setSelectedCriteria] = useState('c4');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [uploadInfo, setUploadInfo] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [ocrResult, setOcrResult] = useState(null);
  const [error, setError] = useState(null);
  const fileRef = useRef(null);

  const processFile = async (file) => {
    if (!file) return;
    setFileName(file.name);
    setFileSize((file.size / 1024 / 1024).toFixed(2));
    setStep('uploading');
    setError(null);

    // 1. Upload lên Supabase Storage (nếu có)
    const result = await uploadEvidence(file, '20210001');
    setUploadInfo(result);

    // 2. Gọi Groq AI phân tích qua API route /api/ocr
    const selectedC = criteria.find(c => c.id === selectedCriteria);
    try {
      const res = await fetch('/api/ocr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type || 'application/octet-stream',
          fileSize: (file.size / 1024 / 1024).toFixed(2),
          criteriaName: selectedC?.name || 'SV5T',
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || `HTTP ${res.status}`);
      }

      const data = await res.json();
      setOcrResult(data);
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

  const reset = () => { setStep('idle'); setFileName(''); setOcrResult(null); setError(null); };

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
              <p>Hỗ trợ JPG, PNG, PDF · Groq AI sẽ phân tích nội dung file</p>
            </div>
          )}

          {/* Uploading Animation */}
          {step === 'uploading' && (
            <div className="card fade-in" style={{ textAlign: 'center', padding: '48px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px', animation: 'spin 2s linear infinite' }}>⚙️</div>
              <h3 style={{ marginBottom: '8px' }}>Đang phân tích {fileName}...</h3>
              <p style={{ color: 'var(--muted)', fontSize: '12px', marginBottom: '16px' }}>Groq AI (Llama 3.3 70B) đang OCR và bóc tách thông tin</p>
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
                  <div style={{ fontSize: '12px', fontWeight: 700, color: validityColor, marginBottom: '8px' }}>🤖 Đánh giá AI (Groq Llama 3.3)</div>
                  <p style={{ fontSize: '12px', color: 'var(--light)', lineHeight: 1.6 }}>{ocrResult.note}</p>
                  {ocrResult.criteriaMatch && (
                    <div style={{ marginTop: '8px', fontSize: '11px', color: 'var(--muted)' }}>Tiêu chí phù hợp: <strong style={{ color: 'var(--accent)' }}>{ocrResult.criteriaMatch}</strong></div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                  <button className="btn btn-approve" style={{ flex: 1, justifyContent: 'center' }}>✅ Xác nhận dùng minh chứng này</button>
                  <button className="btn btn-update" onClick={reset}>🔄 Upload file khác</button>
                </div>
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
                { step: '1', label: 'Chọn file thật từ máy', color: 'var(--accent)' },
                { step: '2', label: 'Upload → Supabase Storage', badge: 'Supabase', color: '#3ecf8e' },
                { step: '3', label: 'Groq AI phân tích file', badge: 'Groq', color: '#10b981' },
                { step: '4', label: 'Bóc tách fields + scoring', badge: 'Llama 3.3', color: '#8b5cf6' },
                { step: '5', label: 'Trả kết quả realtime', color: 'var(--green)' },
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
