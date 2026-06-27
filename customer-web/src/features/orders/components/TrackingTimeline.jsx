import React from 'react';
import { AlertCircle, Check } from 'lucide-react';

const STAGES = [
  { status: 'PENDING', label: 'Chờ xác nhận', desc: 'Đơn hàng mới tạo' },
  { status: 'CONFIRMED', label: 'Đã xác nhận', desc: 'Đơn hàng đã duyệt' },
  { status: 'PROCESSING', label: 'Đang chuẩn bị', desc: 'Đang đóng gói hàng' },
  { status: 'SHIPPING', label: 'Đang giao hàng', desc: 'Đang vận chuyển' },
  { status: 'DELIVERED', label: 'Đã giao', desc: 'Nhận hàng thành công' }
];

const TrackingTimeline = ({ order }) => {
  if (!order) return null;

  const getActiveStageIndex = (currentStatus) => {
    const statuses = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPING', 'DELIVERED'];
    return statuses.indexOf(currentStatus);
  };

  const activeIndex = getActiveStageIndex(order.status);
  const isCancelled = order.status === 'CANCELLED' || order.status === 'REFUNDED';

  return (
    <div style={{ background: 'var(--color-surface)', padding: '3rem 2.5rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', boxShadow: 'var(--shadow-sm)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>
        <h2 style={{ fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: '1.25rem', fontWeight: 500 }}>Trạng thái đơn hàng</h2>
        <span style={{
          fontFamily: 'Be Vietnam Pro, sans-serif',
          textTransform: 'uppercase',
          fontSize: '0.8rem',
          letterSpacing: '0.05em',
          fontWeight: 600,
          padding: '0.4rem 1rem',
          borderRadius: '50px',
          backgroundColor: isCancelled ? '#fee2e2' : 'var(--color-border)',
          color: isCancelled ? '#ef4444' : 'var(--color-primary)'
        }}>
          {order.status === 'PENDING' && 'Chờ xác nhận'}
          {order.status === 'CONFIRMED' && 'Đã xác nhận'}
          {order.status === 'PROCESSING' && 'Đang chuẩn bị hàng'}
          {order.status === 'SHIPPING' && 'Đang giao hàng'}
          {order.status === 'DELIVERED' && 'Đã giao hàng'}
          {order.status === 'CANCELLED' && 'Đã hủy đơn'}
          {order.status === 'REFUNDED' && 'Đã hoàn tiền'}
        </span>
      </div>

      {isCancelled ? (
        <div style={{ color: '#ef4444', backgroundColor: '#fef2f2', border: '1px solid #fee2e2', padding: '1.25rem', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.95rem' }}>
          <AlertCircle size={20} />
          <span>
            Đơn hàng này đã chuyển sang trạng thái <strong>{order.status === 'CANCELLED' ? 'ĐÃ HỦY' : 'ĐÃ HOÀN TIỀN'}</strong>. 
            {order.note ? ` Lý do: ${order.note}` : ''}
          </span>
        </div>
      ) : (
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: '1.5rem' }}>
          {/* Horizontal progress bar */}
          <div style={{
            position: 'absolute',
            top: '18px',
            left: '40px',
            right: '40px',
            height: '2px',
            backgroundColor: 'var(--color-border)',
            zIndex: 1
          }} />
          <div style={{
            position: 'absolute',
            top: '18px',
            left: '40px',
            width: `${activeIndex * 25}%`,
            height: '2px',
            backgroundColor: 'var(--color-accent)',
            transition: 'width 0.5s ease',
            zIndex: 2
          }} />

          {/* Timeline Nodes */}
          {STAGES.map((stage, idx) => {
            const isCompleted = idx <= activeIndex;
            const isActive = idx === activeIndex;

            return (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 10, flex: 1, textAlign: 'center' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: isActive ? 'var(--color-primary)' : (isCompleted ? 'var(--color-accent)' : '#fff'),
                  border: `2px solid ${isActive ? 'var(--color-primary)' : (isCompleted ? 'var(--color-accent)' : 'var(--color-border)')}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isCompleted ? '#fff' : 'var(--color-text-muted)',
                  fontSize: '0.85rem',
                  transition: 'all 0.3s ease',
                  boxShadow: isActive ? '0 0 0 4px rgba(44, 42, 41, 0.15)' : 'none'
                }}>
                  {isCompleted && !isActive ? <Check size={18} strokeWidth={2.5} /> : (idx + 1)}
                </div>
                <div style={{ marginTop: '0.75rem', fontFamily: 'Be Vietnam Pro, sans-serif', fontWeight: isActive ? 600 : 500, fontSize: '0.9rem', color: isActive ? 'var(--color-primary)' : 'var(--color-text)' }}>
                  {stage.label}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.25rem', maxWidth: '120px' }}>
                  {stage.desc}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TrackingTimeline;
