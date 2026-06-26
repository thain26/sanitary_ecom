import React from 'react';
import { createPortal } from 'react-dom';

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Xác nhận', cancelText = 'Hủy' }) => {
  if (!isOpen) return null;

  return createPortal(
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 999999,
      backdropFilter: 'blur(4px)'
    }}>
      <div style={{
        background: 'var(--color-bg, #fff)',
        padding: '2.5rem',
        width: '100%',
        maxWidth: '450px',
        position: 'relative',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        border: '1px solid var(--color-border)',
        textAlign: 'center'
      }}>
        <h3 style={{
          margin: '0 0 1rem 0',
          fontSize: '1.25rem',
          fontWeight: 500,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          color: 'var(--color-text)'
        }}>
          {title}
        </h3>
        
        <p style={{
          margin: '0 0 2rem 0',
          fontSize: '0.95rem',
          color: 'var(--color-text-muted)',
          lineHeight: 1.6
        }}>
          {message}
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button
            onClick={onCancel}
            style={{
              padding: '0.75rem 2rem',
              background: 'transparent',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text)',
              fontSize: '0.85rem',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontFamily: 'inherit'
            }}
            onMouseOver={(e) => { e.target.style.backgroundColor = '#f3f4f6'; }}
            onMouseOut={(e) => { e.target.style.backgroundColor = 'transparent'; }}
          >
            {cancelText}
          </button>
          
          <button
            onClick={onConfirm}
            style={{
              padding: '0.75rem 2rem',
              background: '#ef4444',
              border: '1px solid #ef4444',
              color: '#fff',
              fontSize: '0.85rem',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontFamily: 'inherit'
            }}
            onMouseOver={(e) => { e.target.style.backgroundColor = '#dc2626'; e.target.style.borderColor = '#dc2626'; }}
            onMouseOut={(e) => { e.target.style.backgroundColor = '#ef4444'; e.target.style.borderColor = '#ef4444'; }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ConfirmModal;
