import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, MapPin, Calendar, CreditCard, ClipboardList, Check, AlertCircle } from 'lucide-react';
import { publicApi } from '../../../services/api';
import { getProductImage } from '../../../utils/image';

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const STAGES = [
  { status: 'PENDING', label: 'Chờ xác nhận', desc: 'Đơn hàng mới tạo' },
  { status: 'CONFIRMED', label: 'Đã xác nhận', desc: 'Đơn hàng đã duyệt' },
  { status: 'PROCESSING', label: 'Đang chuẩn bị', desc: 'Đang đóng gói hàng' },
  { status: 'SHIPPING', label: 'Đang giao hàng', desc: 'Đang vận chuyển' },
  { status: 'DELIVERED', label: 'Đã giao', desc: 'Nhận hàng thành công' }
];

const OrderTracking = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCode = searchParams.get('code') || '';

  const [code, setCode] = useState(initialCode);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (initialCode) {
      handleTrack(initialCode);
    } else {
      setOrder(null);
      setError('');
      setSearched(false);
    }
  }, [initialCode]);

  const handleTrack = (trackCode) => {
    if (!trackCode.trim()) return;
    setLoading(true);
    setError('');
    setSearched(true);

    publicApi.trackOrder(trackCode.trim())
      .then((res) => {
        setOrder(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Tracking error", err);
        setOrder(null);
        setError(err.response?.data?.message || 'Không tìm thấy đơn hàng với mã đã nhập. Vui lòng kiểm tra lại.');
        setLoading(false);
      });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (code.trim()) {
      setSearchParams({ code: code.trim() });
    }
  };

  // Determine active stage index
  const getActiveStageIndex = (currentStatus) => {
    const statuses = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPING', 'DELIVERED'];
    return statuses.indexOf(currentStatus);
  };

  const activeIndex = order ? getActiveStageIndex(order.status) : -1;
  const isCancelled = order && (order.status === 'CANCELLED' || order.status === 'REFUNDED');

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '6rem', paddingTop: '2rem' }}>
      <h1 style={{ fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: '2.25rem', fontWeight: 300, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '3rem', textAlign: 'center' }}>
        Tra Cứu Đơn Hàng
      </h1>

      {/* Search Input Box */}
      <div style={{ maxWidth: '600px', margin: '0 auto 4rem', background: 'var(--color-surface)', padding: '2rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', boxShadow: 'var(--shadow-sm)' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: '0 1rem', backgroundColor: 'transparent' }}>
            <ClipboardList size={18} style={{ color: 'var(--color-text-muted)', marginRight: '0.75rem' }} />
            <input
              type="text"
              placeholder="Nhập mã đơn hàng (Ví dụ: ORD-20260522-12345)..."
              value={code}
              onChange={(e) => setCode(e.target.value)}
              style={{
                width: '100%',
                border: 'none',
                outline: 'none',
                padding: '0.8rem 0',
                fontSize: '0.95rem',
                fontFamily: 'Be Vietnam Pro, sans-serif',
                backgroundColor: 'transparent'
              }}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ padding: '0 1.5rem', gap: '0.5rem' }}>
            <Search size={16} /> Tìm kiếm
          </button>
        </form>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '4rem 0', fontFamily: 'Be Vietnam Pro, sans-serif', letterSpacing: '0.05em' }}>
          Đang truy vấn thông tin đơn hàng...
        </div>
      )}

      {error && searched && !loading && (
        <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: '#fef2f2', border: '1px solid #fee2e2', color: '#ef4444', padding: '1.5rem', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <AlertCircle size={24} />
          <div style={{ fontFamily: 'Be Vietnam Pro, sans-serif', fontWeight: 500 }}>{error}</div>
        </div>
      )}

      {!searched && !loading && (
        <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', fontWeight: 300, fontSize: '1rem' }}>
          Vui lòng nhập mã đơn hàng của bạn để theo dõi quá trình giao hàng trực tuyến.
        </div>
      )}

      {order && !loading && (
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          
          {/* Timeline Status */}
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

          <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: '3rem' }}>
            {/* Order Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div style={{ background: 'var(--color-surface)', padding: '2.5rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }}>
                <h3 style={{ fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: '1.15rem', fontWeight: 500, borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                  Chi tiết sản phẩm đã đặt
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {order.items && order.items.map((item) => {
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

            {/* Delivery & Status Log */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {/* Shipping address info */}
              <div style={{ background: 'var(--color-surface)', padding: '2rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }}>
                <h3 style={{ fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: '1.15rem', fontWeight: 500, borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
                  Thông tin giao nhận
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem' }}>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <MapPin size={18} style={{ color: 'var(--color-accent)', flexShrink: 0 }} />
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{order.address?.recipientName || order.customerName}</div>
                      <div style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>SĐT: {order.address?.phone || order.customerPhone}</div>
                      <div style={{ color: 'var(--color-text)', marginTop: '0.5rem', lineHeight: 1.5 }}>
                        {order.address ? `${order.address.streetDetail}, ${order.address.ward}, ${order.address.district}, ${order.address.province}` : order.shippingAddress}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', borderTop: '1px solid var(--color-border)', paddingTop: '1rem', marginTop: '0.5rem' }}>
                    <Calendar size={18} style={{ color: 'var(--color-accent)' }} />
                    <div>
                      <div style={{ color: 'var(--color-text-muted)' }}>Thời gian đặt hàng</div>
                      <div style={{ fontWeight: 500, color: 'var(--color-primary)', marginTop: '0.15rem' }}>
                        {formatDate(order.createdAt)}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
                    <CreditCard size={18} style={{ color: 'var(--color-accent)' }} />
                    <div>
                      <div style={{ color: 'var(--color-text-muted)' }}>Hình thức thanh toán</div>
                      <div style={{ fontWeight: 500, color: 'var(--color-primary)', marginTop: '0.15rem' }}>
                        COD (Thanh toán khi nhận hàng) - {order.paymentStatus === 'PAID' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                      </div>
                    </div>
                  </div>

                  {order.note && (
                    <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
                      <div style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>Ghi chú từ khách hàng:</div>
                      <div style={{ color: 'var(--color-text)', marginTop: '0.25rem', fontStyle: 'italic' }}>
                        "{order.note}"
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Status transition log */}
              <div style={{ background: 'var(--color-surface)', padding: '2rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }}>
                <h3 style={{ fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: '1.15rem', fontWeight: 500, borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
                  Lịch sử hành trình
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'relative' }}>
                  {/* Vertical history line */}
                  <div style={{ position: 'absolute', top: '10px', bottom: '10px', left: '6px', width: '1px', backgroundColor: 'var(--color-border)' }} />

                  {order.statusHistory && order.statusHistory.map((history, idx) => (
                    <div key={history.id || idx} style={{ display: 'flex', gap: '1rem', position: 'relative', zIndex: 1 }}>
                      <div style={{
                        width: '13px',
                        height: '13px',
                        borderRadius: '50%',
                        backgroundColor: idx === 0 ? 'var(--color-accent)' : 'var(--color-border)',
                        border: `2px solid ${idx === 0 ? 'var(--color-accent)' : 'var(--color-border)'}`,
                        marginTop: '4px'
                      }} />
                      
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-primary)' }}>
                          {history.status === 'PENDING' && 'Đặt hàng thành công'}
                          {history.status === 'CONFIRMED' && 'Đơn hàng được xác nhận'}
                          {history.status === 'PROCESSING' && 'Đang chuẩn bị sản phẩm'}
                          {history.status === 'SHIPPING' && 'Bàn giao cho đơn vị vận chuyển'}
                          {history.status === 'DELIVERED' && 'Giao hàng thành công'}
                          {history.status === 'CANCELLED' && 'Hủy đơn hàng'}
                          {history.status === 'REFUNDED' && 'Đã hoàn trả tiền'}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.15rem' }}>
                          {formatDate(history.createdAt)}
                        </div>
                        {history.note && (
                          <div style={{ fontSize: '0.8rem', color: 'var(--color-text)', marginTop: '0.25rem', backgroundColor: 'var(--color-bg)', padding: '0.4rem 0.6rem', borderRadius: 'var(--radius-sm)' }}>
                            {history.note}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default OrderTracking;
