import React from 'react';
import { getProductImage } from '../../../utils/image';

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

const OrderSummaryCard = ({ order }) => {
  if (!order || !order.items) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ background: 'var(--color-surface)', padding: '2.5rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }}>
        <h3 style={{ fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: '1.15rem', fontWeight: 500, borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
          Chi tiết sản phẩm đã đặt
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {order.items.map((item) => {
            const productImg = getProductImage(item.product);
            return (
              <div key={item.id} style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <img src={productImg} alt={item.productName} style={{ width: '80px', height: '80px', objectFit: 'contain', padding: '0.5rem', border: '1px solid var(--color-border)', backgroundColor: '#fff' }} />
                
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 400, marginBottom: '0.25rem' }}>{item.productName}</h4>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Mã model: {item.modelCode}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                    Số lượng: {item.quantity}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <div style={{ fontSize: '1rem', fontFamily: 'Be Vietnam Pro, sans-serif', fontWeight: 500 }}>
                    {formatPrice(item.subtotal)}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    Đơn giá: {formatPrice(item.price)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: '2rem', borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
            <span style={{ color: 'var(--color-text-muted)' }}>Tạm tính</span>
            <span style={{ fontWeight: 500 }}>{formatPrice(order.subtotal)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
            <span style={{ color: 'var(--color-text-muted)' }}>Phí vận chuyển</span>
            <span style={{ color: '#10b981', fontWeight: 500 }}>Miễn phí</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontFamily: 'Be Vietnam Pro, sans-serif', color: 'var(--color-primary)', borderTop: '1px solid var(--color-border)', paddingTop: '0.75rem', marginTop: '0.5rem' }}>
            <span>Tổng thanh toán</span>
            <span style={{ fontWeight: 600 }}>{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummaryCard;
