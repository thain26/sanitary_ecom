import React from 'react';

const DataTableCard = ({ children, style, noPadding = false }) => {
  return (
    <div style={{ 
      backgroundColor: '#fff', 
      padding: noPadding ? '0' : '16px', 
      borderRadius: '12px', 
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
      ...style 
    }}>
      {children}
    </div>
  );
};

export default DataTableCard;
