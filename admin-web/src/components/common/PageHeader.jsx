import React from 'react';
import { Space } from 'antd';

const PageHeader = ({ title, subtitle, extra, style }) => {
  return (
    <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', ...style }}>
      <div>
        <h1 className="page-title" style={{ margin: 0, fontSize: '24px', fontWeight: 600, color: '#0f172a' }}>{title}</h1>
        {subtitle && <p className="page-subtitle" style={{ margin: 0, marginTop: '4px', color: '#64748b', fontSize: '14px' }}>{subtitle}</p>}
      </div>
      {extra && <Space>{extra}</Space>}
    </div>
  );
};

export default PageHeader;
