import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useUiStore from '../../../store/useUiStore';
import { UserX } from 'lucide-react';

const LoginPromptModal = () => {
  const { loginPromptOpen, closeLoginPrompt } = useUiStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Close modal if route changes
  useEffect(() => {
    closeLoginPrompt();
  }, [location.pathname, closeLoginPrompt]);

  if (!loginPromptOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      backdropFilter: 'blur(3px)'
    }}>
      <div className="animate-fade-in" style={{
        background: '#fff',
        width: '90%',
        maxWidth: '400px',
        padding: '2.5rem 2rem',
        textAlign: 'center',
        position: 'relative',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'var(--color-bg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem',
          color: 'var(--color-accent)'
        }}>
          <UserX size={32} />
        </div>

        <h3 style={{ fontSize: '1.25rem', fontWeight: 300, textTransform: 'uppercase', marginBottom: '1rem', color: 'var(--color-primary)' }}>
          Yêu cầu đăng nhập
        </h3>

        <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem', lineHeight: 1.6 }}>
          Vui lòng đăng nhập hoặc tạo tài khoản để có thể sử dụng tính năng này.
        </p>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={closeLoginPrompt}
            style={{
              flex: 1,
              padding: '0.8rem',
              background: 'transparent',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text)',
              fontFamily: 'Be Vietnam Pro, sans-serif',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.target.style.background = 'var(--color-bg)'}
            onMouseOut={(e) => e.target.style.background = 'transparent'}
          >
            Đóng
          </button>

          <button
            onClick={() => {
              closeLoginPrompt();
              navigate('/dang-nhap');
            }}
            style={{
              flex: 1,
              padding: '0.8rem',
              background: 'var(--color-primary)',
              border: '1px solid var(--color-primary)',
              color: '#fff',
              fontFamily: 'Be Vietnam Pro, sans-serif',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.target.style.background = 'var(--color-accent)'}
            onMouseOut={(e) => e.target.style.background = 'var(--color-primary)'}
          >
            Đăng nhập
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPromptModal;
