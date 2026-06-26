import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, Copy, Search, ArrowRight, Home } from 'lucide-react';
import { useState } from 'react';

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderCode = searchParams.get('code') || 'ORD-UNKNOWN';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(orderCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="animate-fade-in" style={{ padding: '8rem 0', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
        <CheckCircle size={72} strokeWidth={1} style={{ color: 'var(--color-accent)' }} />
      </div>

      <h1 style={{ fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: '2.5rem', fontWeight: 300, letterSpacing: '0.02em', color: 'var(--color-primary)', marginBottom: '1rem' }}>
        Đặt Hàng Thành Công
      </h1>

      <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem', fontWeight: 300, lineHeight: 1.8, marginBottom: '3rem' }}>
        Cảm ơn quý khách đã tin tưởng và lựa chọn thiết bị vệ sinh cao cấp từ AQUALUX. Đơn hàng của quý khách đang được xử lý.
      </p>

      {/* Order Code Box */}
      <div style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        padding: '2rem',
        borderRadius: 'var(--radius-sm)',
        marginBottom: '4rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <span style={{ fontSize: '0.8rem', fontFamily: 'Be Vietnam Pro, sans-serif', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-muted)' }}>
          Mã đơn hàng của quý khách
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '1.75rem', fontFamily: 'Be Vietnam Pro, sans-serif', fontWeight: 600, letterSpacing: '0.05em', color: 'var(--color-primary)' }}>
            {orderCode}
          </span>
          <button
            onClick={handleCopy}
            style={{
              background: 'none',
              border: 'none',
              color: copied ? '#10b981' : 'var(--color-text-muted)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.5rem',
              transition: 'color 0.2s'
            }}
            title="Sao chép mã đơn hàng"
          >
            <Copy size={20} strokeWidth={1.5} />
          </button>
        </div>
        {copied && (
          <span style={{ fontSize: '0.8rem', color: '#10b981', fontFamily: 'Be Vietnam Pro, sans-serif' }}>
            Đã sao chép vào bộ nhớ tạm!
          </span>
        )}
      </div>

      {/* Quick Action Links */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <Link to={`/tra-cuu?code=${orderCode}`} className="btn btn-primary" style={{ width: '100%', gap: '0.5rem' }}>
          <Search size={16} /> Theo dõi trạng thái đơn hàng <ArrowRight size={16} />
        </Link>
        <Link to="/" className="btn btn-outline" style={{ width: '100%', gap: '0.5rem' }}>
          <Home size={16} /> Quay lại trang chủ
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
