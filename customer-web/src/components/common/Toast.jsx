import React from 'react';
import useToastStore from '../../store/useToastStore';

const Toast = () => {
  const { message, isVisible, type } = useToastStore();

  if (!isVisible) return null;

  const bgColors = {
    success: '#0f172a',
    error: '#e05a47',
    info: '#3b82f6'
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '100px', // Đẩy lên cao hơn để không bị che bởi Chat Widget
      right: '24px',
      backgroundColor: bgColors[type] || bgColors.success,
      color: 'white',
      padding: '12px 24px',
      borderRadius: '8px',
      zIndex: 9999,
      boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
      animation: 'slideUp 0.3s ease-out',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontWeight: '500',
      letterSpacing: '0.3px',
      fontFamily: 'Inter, sans-serif'
    }}>
      {message}
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Toast;
