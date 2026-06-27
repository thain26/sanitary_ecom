import React from 'react';
import { Card, Statistic } from 'antd';

const StatCard = ({ title, value, formatter, valueColor, icon, style }) => {
  return (
    <Card variant="borderless" style={{ borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', ...style }}>
      <Statistic
        title={<span style={{ color: '#64748b', fontSize: '14px', fontWeight: 500 }}>{title}</span>}
        value={value}
        formatter={formatter}
        valueStyle={{ color: valueColor || '#0f172a', fontWeight: 700, fontSize: '24px' }}
        prefix={icon}
      />
    </Card>
  );
};

export default StatCard;
