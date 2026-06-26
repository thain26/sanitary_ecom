import React, { forwardRef } from 'react';

const FormInput = forwardRef(({ label, error, required, ...props }, ref) => {
  const hasError = !!error;
  
  return (
    <div style={{ marginBottom: '1.5rem', width: '100%' }}>
      {label && (
        <label style={{ 
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginBottom: '0.6rem', 
          fontSize: '0.75rem', 
          color: 'var(--color-primary)',
          fontWeight: 600,
          fontFamily: 'Outfit, sans-serif',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          <span>{label}</span>
          {required && <span style={{ color: 'var(--color-text-muted)', fontSize: '0.7rem', textTransform: 'none', letterSpacing: '0', fontWeight: 400 }}>(bắt buộc)</span>}
        </label>
      )}
      <input
        ref={ref}
        {...props}
        className={`luxury-input ${props.className || ''}`}
        style={{ 
          width: '100%', 
          padding: '0.85rem 1rem', 
          border: hasError ? '1px solid #ef4444' : '1px solid var(--color-border)', 
          borderRadius: '0px', 
          outline: 'none',
          backgroundColor: '#fff',
          transition: 'all 0.3s ease',
          fontSize: '0.95rem',
          ...(props.style || {})
        }}
        // Remove native required to prevent HTML5 tooltip
        required={false}
      />
      {hasError && (
        <div style={{ 
          color: '#ef4444', 
          fontSize: '0.85rem', 
          marginTop: '0.4rem',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          animation: 'shake 0.4s cubic-bezier(.36,.07,.19,.97) both'
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          {error}
        </div>
      )}
    </div>
  );
});

FormInput.displayName = 'FormInput';

export default FormInput;
