import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const BackButton = ({ text = "Quay lại", fallback = -1, style = {} }) => {
  const navigate = useNavigate();

  return (
    <button 
      onClick={() => {
        // Nếu có state fallback custom thì có thể xử lý ở đây, tạm thời dùng -1
        navigate(fallback);
      }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        background: 'transparent',
        border: 'none',
        color: 'var(--color-text-muted)',
        fontFamily: 'Be Vietnam Pro, sans-serif',
        fontSize: '0.9rem',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        cursor: 'pointer',
        marginBottom: '2rem',
        padding: 0,
        transition: 'color 0.2s',
        ...style
      }}
      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}
    >
      <ArrowLeft size={16} />
      <span>{text}</span>
    </button>
  );
};

export default BackButton;
