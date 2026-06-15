'use client';
import { useState, useRef, useEffect } from 'react';
import { criteria } from '@/data/mockData';
import { useAuth } from '@/lib/auth';

const studentSuggestions = [
  'Em còn thiếu tiêu chí nào?',
  'Minh chứng giấy khen CLB có dùng được không?',
  'Em có IELTS 6.5, cần thêm gì cho tiêu chí Hội nhập?',
  'Hồ sơ em đang ở trạng thái nào rồi?'
];

const reviewerSuggestions = [
  'Hôm nay có bao nhiêu hồ sơ nộp mới?',
  'Liệt kê các sinh viên có rủi ro (SUSPECT) cần duyệt',
  'Tiến độ nộp minh chứng của Khoa CNTT đạt bao nhiêu %?',
  'Tóm tắt số liệu các hồ sơ đã duyệt trong tuần này'
];

export default function MentorPage() {
  const { user } = useAuth();
  const isReviewer = user?.role === 'reviewer';

  const [messages, setMessages] = useState([]);
  
  useEffect(() => {
    if (user) {
      setMessages([
        { 
          role: 'bot', 
          text: user.role === 'reviewer'
            ? 'Xin chào! 👋 Mình là **AI Copilot** dành riêng cho Cán bộ Hội, tích hợp **Truy vấn Cơ sở dữ liệu (RAG)** qua **Groq AI**.\n\nMình có thể giúp bạn:\n- 📊 Báo cáo thống kê tiến độ nộp hồ sơ\n- ⚠️ Rà soát các hồ sơ có mức độ rủi ro cao (SUSPECT)\n- 📋 Tra cứu nhanh trạng thái theo sinh viên hoặc khoa\n\nHãy yêu cầu mình nhé! 🚀'
            : 'Xin chào! 👋 Mình là **AI Mentor** của FiveGood Journey, được hỗ trợ bởi **Groq AI (Llama 3.3 70B)**.\n\nMình có thể giúp bạn:\n- 📋 Kiểm tra tiến độ hồ sơ SV5T\n- 📎 Hướng dẫn chuẩn bị minh chứng\n- ❓ Giải đáp thắc mắc về quy trình\n\nHãy hỏi mình bất cứ điều gì! 🚀' 
        }
      ]);
    }
  }, [user]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputText, setInputText] = useState('');
  const [usedSuggestions, setUsedSuggestions] = useState([]);
  const [temperature, setTemperature] = useState(0.2);
  const [promptStrategy, setPromptStrategy] = useState('few-shot');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendToGroq = async (allMessages) => {
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: allMessages,
          userName: user?.name,
          userInfo: user?.sub,
          userRole: user?.role,
          userId: user?.dbId || user?.mssv || '20210001',
          temperature,
          promptStrategy,
        }),
      });
      const data = await res.json();
      return data.message;
    } catch {
      return '❌ Không thể kết nối AI. Vui lòng kiểm tra GROQ_API_KEY trong .env.local và thử lại.';
    }
  };

  const handleSend = async (text) => {
    if (!text.trim() || isTyping) return;

    const userMsg = { role: 'user', text: text.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputText('');
    setIsTyping(true);

    const reply = await sendToGroq(newMessages);
    setIsTyping(false);
    setMessages(prev => [...prev, { role: 'bot', text: reply }]);
  };

  const handleSuggestion = (text) => {
    setUsedSuggestions(prev => [...prev, text]);
    handleSend(text);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(inputText);
    }
  };

  const currentSuggestions = isReviewer ? reviewerSuggestions : studentSuggestions;
  const availableSuggestions = currentSuggestions.filter(s => !usedSuggestions.includes(s));

  const formatText = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br/>');
  };

  return (
    <div className="page-container">
      <div className="section-header fade-in">
        <div className="section-num">🤖</div>
        <div>
          <h2>{isReviewer ? 'AI Copilot' : 'AI Mentor'}</h2>
          <p>{isReviewer ? 'Trợ lý nghiệp vụ & Truy xuất dữ liệu' : 'Trợ lý AI cá nhân hóa'} – Powered by Groq · Llama 3.3 70B</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '20px' }}>
        <div className="card" style={{ padding: 0, display: 'flex', flexDirection: 'column', height: '650px' }}>
          {/* Header */}
          <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent3), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>🤖</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '14px' }}>{isReviewer ? 'FiveGood AI Copilot' : 'FiveGood AI Mentor'}</div>
              <div style={{ fontSize: '11px', color: 'var(--green)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--green)', display: 'inline-block', animation: 'pulse 2s infinite' }}></span>
                Groq AI · Llama 3.3 70B
              </div>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
            {messages.map((msg, i) => (
              <div key={i} className={`chat-bubble chat-bubble--${msg.role === 'user' ? 'user' : 'bot'}`}
                dangerouslySetInnerHTML={{ __html: formatText(msg.text) }} />
            ))}
            {isTyping && (
              <div className="chat-bubble chat-bubble--bot">
                <div className="typing-indicator">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          {availableSuggestions.length > 0 && (
            <div style={{ padding: '10px 20px', borderTop: '1px solid var(--border)' }}>
              <div style={{ fontSize: '10px', color: 'var(--muted)', marginBottom: '6px' }}>💡 Câu hỏi gợi ý:</div>
              <div className="chat-suggestions" style={{ paddingTop: 0, paddingBottom: 0 }}>
                {availableSuggestions.slice(0, 3).map((s, i) => (
                  <button key={i} className="chat-suggestion-btn" onClick={() => handleSuggestion(s)}>{s}</button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="chat-input-area" style={{ padding: '12px 20px' }}>
            <input
              className="chat-input"
              placeholder="Nhập câu hỏi về SV5T..."
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button className="chat-send-btn" onClick={() => handleSend(inputText)} disabled={!inputText.trim() || isTyping}>
              {isTyping ? '⏳' : '➤'}
            </button>
          </div>
        </div>

        {/* Context Panel */}
        <div>
          {/* AI Settings Panel requested by teacher */}
          <div className="card fade-in" style={{ border: '1px solid rgba(59, 130, 246, 0.3)', background: 'rgba(59, 130, 246, 0.03)' }}>
            <div className="card-title" style={{ color: 'var(--accent)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>⚙️ Cấu hình AI (Thầy Đề xuất)</span>
            </div>
            
            {/* Prompt Strategy */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--light)', marginBottom: '6px' }}>
                Phương pháp Prompting:
              </label>
              <select 
                value={promptStrategy} 
                onChange={e => setPromptStrategy(e.target.value)} 
                style={{ 
                  width: '100%', 
                  background: 'var(--surface)', 
                  color: 'var(--text)', 
                  border: '1px solid var(--border)', 
                  borderRadius: '6px', 
                  padding: '6px 8px', 
                  fontSize: '12px',
                  outline: 'none'
                }}
              >
                <option value="few-shot">Few-Shot + Guardrails (Chống lỗi 'tiếng Rồng')</option>
                <option value="zero-shot">Zero-Shot (Cơ bản - Dễ ảo giác)</option>
              </select>
            </div>

            {/* Temperature Slider */}
            <div style={{ marginBottom: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 600, color: 'var(--light)', marginBottom: '4px' }}>
                <span>Độ chính xác (Temperature):</span>
                <span style={{ color: 'var(--accent2)', fontFamily: 'monospace' }}>{temperature.toFixed(1)}</span>
              </div>
              <input 
                type="range" 
                min="0.1" 
                max="1.0" 
                step="0.1" 
                value={temperature} 
                onChange={e => setTemperature(parseFloat(e.target.value))} 
                style={{ width: '100%', accentColor: 'var(--accent)' }} 
              />
              <div style={{ fontSize: '10px', color: 'var(--muted)', marginTop: '4px', lineHeight: '1.3' }}>
                {temperature <= 0.2 ? (
                  <span style={{ color: 'var(--green)' }}>🟢 <strong>Factual Mode</strong>: 1000 câu trả lời như 1. Thích hợp để hỏi quy chế chính xác.</span>
                ) : temperature <= 0.6 ? (
                  <span style={{ color: 'var(--yellow)' }}>🟡 <strong>Balanced Mode</strong>: Cân bằng linh hoạt và chính xác.</span>
                ) : (
                  <span style={{ color: 'var(--red)' }}>🔴 <strong>Creative Mode</strong>: Linh hoạt/Sáng tạo. Dễ sinh ảo giác nếu hỏi quy chế.</span>
                )}
              </div>
            </div>

            {/* Guardrail explanation */}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '10px', marginTop: '10px', fontSize: '10px', color: 'var(--muted)', lineHeight: '1.4' }}>
              <strong>Giảm lỗi AI:</strong> Khi bật <i>Few-Shot</i>, prompt ép AI từ chối các từ khóa sai lệch (như <code>tiếng Rồng</code>) và yêu cầu người dùng tự kiểm tra đầu vào (self-check).
            </div>
          </div>

          <div className="card fade-in">
            <div className="card-title">📊 Trạng thái hồ sơ</div>
            {criteria.map(c => (
              <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(36,48,80,0.4)' }}>
                <span style={{ fontSize: '12px' }}>{c.icon} {c.name}</span>
                <span className={`criteria-status status-${c.status}`} style={{ fontSize: '9px' }}>{c.progress}%</span>
              </div>
            ))}
          </div>

          <div className="card fade-in">
            <div className="card-title">🔌 Công nghệ AI</div>
            {[
              { name: 'Groq', desc: 'Inference siêu nhanh', color: '#10b981' },
              { name: 'Llama 3.3 70B', desc: 'LLM versatile', color: '#8b5cf6' },
            ].map((api, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 0' }}>
                <span style={{ background: `${api.color}18`, color: api.color, padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}>{api.name}</span>
                <span style={{ fontSize: '11px', color: 'var(--muted)' }}>{api.desc}</span>
              </div>
            ))}
          </div>

          <div className="card fade-in" style={{ background: 'rgba(59,130,246,0.05)', borderColor: 'rgba(59,130,246,0.2)' }}>
            <div style={{ fontSize: '11px', color: 'var(--light)', lineHeight: 1.6 }}>
              <strong style={{ color: 'var(--accent)' }}>💡 Cách hoạt động:</strong><br />
              AI Mentor dùng <strong style={{color:'var(--green)'}}>Groq</strong> (Llama 3.3 70B) với system prompt chứa đầy đủ context hồ sơ SV5T. Vòng 2 sẽ tích hợp VNPT Smartbot (RAG) + SmartVoice (STT/TTS).
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
