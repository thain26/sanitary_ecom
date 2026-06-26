import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const WELCOME_MESSAGE = {
  role: 'assistant',
  content: 'Xin chào! Tôi là Trợ lý ảo 👋 – chuyên viên tư vấn thiết bị vệ sinh cao cấp tại AQUA LUX.\n\nTôi có thể giúp bạn:\n• 🛁 Tìm bồn cầu, lavabo, bồn tắm phù hợp\n• 💰 Gợi ý sản phẩm theo ngân sách của bạn\n• 🏆 So sánh các thương hiệu INAX, TOTO, Caesar\n\nBạn đang cần tư vấn về sản phẩm nào?',
};

const QUICK_REPLIES = [
  'Tư vấn bồn cầu thông minh',
  'Sản phẩm dưới 10 triệu',
  'So sánh INAX và TOTO',
  'Lavabo cho nhà nhỏ',
];

const formatText = (text) => {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br/>');
};

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasNewMsg, setHasNewMsg] = useState(false);
  const [apiFailed, setApiFailed] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      if (!apiFailed) {
        inputRef.current?.focus();
      }
      setHasNewMsg(false);
    }
  }, [messages, isOpen, apiFailed]);

  const sendMessage = async (text) => {
    const userText = (text || input).trim();
    if (!userText || isLoading || apiFailed) return;

    const userMsg = { role: 'user', content: userText };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const history = newMessages.slice(0, -1).map(m => ({
        role: m.role,
        content: m.content,
      }));

      const res = await axios.post('http://localhost:8080/api/public/chat', {
        message: userText,
        history,
      });

      const assistantMsg = { role: 'assistant', content: res.data.reply };
      setMessages(prev => [...prev, assistantMsg]);
      if (!isOpen) setHasNewMsg(true);
    } catch (err) {
      // Trigger Fallback UI
      setApiFailed(true);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Hệ thống AI hiện đang bảo trì hoặc quá tải. Vui lòng liên hệ trực tiếp với chúng tôi để được tư vấn ngay lập tức.',
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        className="chat-widget-btn"
        onClick={() => setIsOpen(o => !o)}
        aria-label="Mở chat tư vấn"
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          width: '62px',
          height: '62px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #c9a655 0%, #9a7230 100%)',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 6px 24px rgba(184,146,74,0.55)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1) translateY(-3px)'; e.currentTarget.style.boxShadow = '0 10px 32px rgba(184,146,74,0.7)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1) translateY(0)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(184,146,74,0.55)'; }}
      >
        {isOpen ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
        ) : (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
        )}
        {hasNewMsg && !isOpen && (
          <span style={{ position: 'absolute', top: '5px', right: '5px', width: '13px', height: '13px', background: '#ef4444', borderRadius: '50%', border: '2px solid white' }} />
        )}
      </button>

      {/* Chat window */}
      <div style={{
        position: 'fixed',
        bottom: '6.2rem',
        right: '2rem',
        width: '380px',
        maxWidth: 'calc(100vw - 2rem)',
        height: '570px',
        maxHeight: 'calc(100vh - 8rem)',
        borderRadius: '20px',
        background: 'rgba(255,255,255,0.97)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 9998,
        overflow: 'hidden',
        transition: 'all 0.35s cubic-bezier(0.34,1.56,0.64,1)',
        transform: isOpen ? 'scale(1) translateY(0)' : 'scale(0.85) translateY(20px)',
        opacity: isOpen ? 1 : 0,
        pointerEvents: isOpen ? 'all' : 'none',
        border: '1px solid rgba(184,146,74,0.15)',
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #c9a655 0%, #9a7230 100%)',
          padding: '1rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.9rem',
          flexShrink: 0,
        }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.4rem',
            flexShrink: 0,
          }}>🤖</div>
          <div style={{ flex: 1 }}>
            <div style={{ color: 'white', fontWeight: '700', fontSize: '0.95rem', letterSpacing: '0.02em' }}>Trợ lý ảo AQUA LUX</div>
            <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '5px', marginTop: '2px' }}>
              <span style={{ width: '7px', height: '7px', background: '#4ade80', borderRadius: '50%', display: 'inline-block' }} />
              Đang trực tuyến
            </div>
          </div>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem', fontWeight: '600', letterSpacing: '0.05em' }}>AQUA LUX</div>
        </div>

        {/* Messages */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.8rem',
          background: '#faf9f7',
        }}>
          {messages.map((msg, i) => (
            <div key={i} style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              alignItems: 'flex-end',
              gap: '0.5rem',
            }}>
              {msg.role === 'assistant' && (
                <div style={{
                  width: '30px', height: '30px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #c9a655, #9a7230)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.9rem', flexShrink: 0,
                }}>🤖</div>
              )}
              <div style={{
                maxWidth: '78%',
                padding: '0.7rem 1rem',
                borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                background: msg.role === 'user'
                  ? 'linear-gradient(135deg, #c9a655, #9a7230)'
                  : 'white',
                color: msg.role === 'user' ? 'white' : '#333',
                fontSize: '0.875rem',
                lineHeight: '1.55',
                boxShadow: msg.role === 'user' ? '0 2px 10px rgba(184,146,74,0.3)' : '0 2px 8px rgba(0,0,0,0.07)',
                wordBreak: 'break-word',
              }}
                dangerouslySetInnerHTML={{ __html: formatText(msg.content) }}
              />
            </div>
          ))}

          {/* Typing indicator */}
          {isLoading && (
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem' }}>
              <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'linear-gradient(135deg, #c9a655, #9a7230)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>🤖</div>
              <div style={{ background: 'white', borderRadius: '18px 18px 18px 4px', padding: '0.8rem 1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', display: 'flex', gap: '5px', alignItems: 'center' }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{
                    width: '7px', height: '7px', borderRadius: '50%',
                    background: '#c9a655',
                    animation: `chatBounce 1.2s ease-in-out ${i * 0.15}s infinite`,
                  }} />
                ))}
              </div>
            </div>
          )}

          {/* Fallback Error State */}
          {apiFailed && (
            <div style={{
              background: 'linear-gradient(135deg, #fffbf0, #fff7e0)',
              border: '1px solid rgba(184,146,74,0.35)',
              borderRadius: '12px',
              padding: '1.3rem',
              marginTop: '0.5rem',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>📞</div>
              <h4 style={{ margin: '0 0 0.4rem 0', color: '#7a5820', fontSize: '0.95rem', fontWeight: '700' }}>
                Tư vấn viên AQUA LUX
              </h4>
              <p style={{ margin: '0 0 1rem 0', color: '#9a7230', fontSize: '0.83rem', lineHeight: '1.5' }}>
                AI đang bận, chuyên viên của chúng tôi luôn sẵn sàng hỗ trợ bạn trực tiếp!
              </p>
              <a href="tel:19001234" style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, #c9a655, #9a7230)',
                color: 'white',
                padding: '0.75rem 1.75rem',
                borderRadius: '30px',
                textDecoration: 'none',
                fontWeight: '700',
                fontSize: '0.9rem',
                boxShadow: '0 4px 14px rgba(184,146,74,0.4)',
                transition: 'all 0.2s'
              }} onMouseEnter={e => { e.target.style.transform = 'scale(1.03)'; e.target.style.boxShadow = '0 6px 20px rgba(184,146,74,0.55)'; }} onMouseLeave={e => { e.target.style.transform = 'scale(1)'; e.target.style.boxShadow = '0 4px 14px rgba(184,146,74,0.4)'; }}>
                📞 Gọi: 1900 1234
              </a>
              <button onClick={() => { setApiFailed(false); setMessages([WELCOME_MESSAGE]); }} style={{ display: 'block', width: '100%', marginTop: '0.9rem', background: 'none', border: 'none', color: '#b8924a', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.8rem' }}>
                Thử lại AI →
              </button>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick replies (only show after welcome and if not failed) */}
        {messages.length <= 1 && !apiFailed && (
          <div style={{
            padding: '0.5rem 1rem',
            display: 'flex',
            gap: '0.4rem',
            flexWrap: 'wrap',
            background: '#faf9f7',
            borderTop: '1px solid rgba(0,0,0,0.06)',
          }}>
            {QUICK_REPLIES.map((q, i) => (
              <button
                key={i}
                onClick={() => sendMessage(q)}
                style={{
                  padding: '0.3rem 0.75rem',
                  borderRadius: '20px',
                  border: '1px solid rgba(184,146,74,0.4)',
                  background: 'rgba(184,146,74,0.08)',
                  color: '#7a5820',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(184,146,74,0.2)'; e.currentTarget.style.borderColor = 'rgba(184,146,74,0.7)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(184,146,74,0.08)'; e.currentTarget.style.borderColor = 'rgba(184,146,74,0.4)'; }}
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Input area */}
        <div style={{
          padding: '1rem',
          background: '#ffffff',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          gap: '0.75rem',
          alignItems: 'flex-end',
          flexShrink: 0,
        }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={apiFailed ? "Hệ thống AI đang tạm ngưng..." : "Nhập câu hỏi của bạn..."}
            disabled={apiFailed}
            rows={1}
            style={{
              flex: 1,
              border: '1px solid #cbd5e1',
              borderRadius: '0px',
              padding: '0.75rem 1rem',
              fontSize: '0.9rem',
              resize: 'none',
              outline: 'none',
              fontFamily: 'Be Vietnam Pro, sans-serif',
              lineHeight: '1.5',
              maxHeight: '100px',
              overflowY: 'auto',
              transition: 'border-color 0.2s',
              background: apiFailed ? '#f1f5f9' : '#ffffff',
              color: apiFailed ? '#94a3b8' : '#0f172a'
            }}
            onFocus={e => { if(!apiFailed) e.target.style.borderColor = '#0f172a'; }}
            onBlur={e => { if(!apiFailed) e.target.style.borderColor = '#cbd5e1'; }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={isLoading || !input.trim() || apiFailed}
            style={{
              width: '45px',
              height: '45px',
              borderRadius: '0px',
              background: input.trim() && !apiFailed ? '#0f172a' : '#e2e8f0',
              border: 'none',
              cursor: input.trim() && !apiFailed ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
              flexShrink: 0,
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={input.trim() && !apiFailed ? "white" : "#94a3b8"} strokeWidth="2">
              <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" />
            </svg>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes chatBounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
      `}</style>
    </>
  );
};

export default ChatWidget;
