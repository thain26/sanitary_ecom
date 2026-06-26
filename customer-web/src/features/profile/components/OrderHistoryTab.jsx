import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { orderApi, reviewApi } from '../../../services/api';
import { getProductImage } from '../../../utils/image';
import ConfirmModal from '../../../components/common/ConfirmModal';
import useToastStore from '../../../store/useToastStore';

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

const OrderHistoryTab = () => {
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const showToast = useToastStore(state => state.showToast);
  const [cancelModalState, setCancelModalState] = useState({ isOpen: false, orderId: null });

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    productId: null,
    productName: '',
    orderItemId: null,
    rating: 5,
    content: ''
  });
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const data = await orderApi.getMyOrders();
      setOrders(data);
    } catch (err) {
      console.error('Failed to fetch orders', err);
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const confirmCancelOrder = async () => {
    if (!cancelModalState.orderId) return;
    try {
      await orderApi.cancelOrder(cancelModalState.orderId);
      fetchOrders();
      showToast('Huỷ đơn hàng thành công.', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || err.message || 'Không thể huỷ đơn hàng này.', 'error');
    } finally {
      setCancelModalState({ isOpen: false, orderId: null });
    }
  };

  const openCancelModal = (id) => {
    setCancelModalState({ isOpen: true, orderId: id });
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError('');
    setReviewSuccess('');
    try {
      await reviewApi.createReview({
        productId: reviewForm.productId,
        orderItemId: reviewForm.orderItemId,
        rating: reviewForm.rating,
        content: reviewForm.content
      });
      setReviewSuccess('Đăng đánh giá thành công! Cảm ơn ý kiến đóng góp của bạn.');
      setTimeout(() => {
        setShowReviewModal(false);
        setReviewForm({ productId: null, productName: '', orderItemId: null, rating: 5, content: '' });
        setReviewSuccess('');
        fetchOrders(); // refresh review flags
      }, 2000);
    } catch (err) {
      setReviewError(err.response?.data?.message || err.message || 'Lỗi gửi đánh giá.');
    }
  };

  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 300, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2rem', color: 'var(--color-primary)', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>Lịch sử đơn hàng</h2>

      {ordersLoading ? (
        <p style={{ textAlign: 'center', padding: '2rem 0' }}>Đang tải danh sách đơn hàng...</p>
      ) : orders.length === 0 ? (
        <p className="text-muted" style={{ textAlign: 'center', padding: '2rem 0' }}>Bạn chưa có đơn hàng nào.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {orders.map((order) => (
            <div key={order.id} style={{ border: '1px solid var(--color-border)', background: '#fff' }}>
              {/* Order Header */}
              <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', backgroundColor: 'var(--color-bg)' }}>
                <div>
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontFamily: 'Be Vietnam Pro, sans-serif', textTransform: 'uppercase' }}>Mã đơn hàng:</span>
                  <strong style={{ fontSize: '0.95rem', marginLeft: '0.5rem', color: 'var(--color-primary)' }}>{order.orderCode}</strong>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{
                    fontSize: '0.75rem',
                    fontFamily: 'Be Vietnam Pro, sans-serif',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    padding: '0.25rem 0.75rem',
                    border: '1px solid',
                    borderColor: order.status === 'DELIVERED' ? '#10b981' : order.status === 'CANCELLED' ? '#ef4444' : 'var(--color-accent)',
                    color: order.status === 'DELIVERED' ? '#10b981' : order.status === 'CANCELLED' ? '#ef4444' : 'var(--color-accent)',
                    backgroundColor: '#fff'
                  }}>
                    {order.status === 'PENDING' ? 'Chờ xác nhận' :
                      order.status === 'CONFIRMED' ? 'Đã xác nhận' :
                      order.status === 'PROCESSING' ? 'Đang xử lý' :
                      order.status === 'SHIPPING' ? 'Đang giao hàng' :
                      order.status === 'DELIVERED' ? 'Đã giao' :
                      order.status === 'CANCELLED' ? 'Đã hủy' : order.status}
                  </span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                    {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div style={{ padding: '1.5rem' }}>
                {order.items?.map((item) => (
                  <div key={item.id} style={{ display: 'flex', gap: '1rem', paddingBottom: '1rem', marginBottom: '1rem', borderBottom: '1px solid #f7f7f7', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <div style={{ width: '60px', height: '60px', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '0.25rem', background: '#fff' }}>
                        <img src={getProductImage(item)} alt={item.productName} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                      </div>
                      <div>
                        <h4 style={{ fontSize: '0.95rem', margin: 0, fontWeight: 400 }}>{item.productName}</h4>
                        <p className="text-muted" style={{ fontSize: '0.8rem', margin: '0.25rem 0' }}>Mã SP: {item.modelCode} | Số lượng: {item.quantity}</p>
                        <p style={{ fontSize: '0.9rem', fontWeight: 500, margin: 0 }}>{formatPrice(item.price)}</p>
                      </div>
                    </div>

                    <div>
                      {order.status === 'DELIVERED' && (
                        item.reviewed ? (
                          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>Đã đánh giá</span>
                        ) : (
                          <button
                            onClick={() => {
                              setReviewForm({
                                productId: item.productId || item.product?.id,
                                productName: item.productName,
                                orderItemId: item.id,
                                rating: 5,
                                content: ''
                              });
                              setShowReviewModal(true);
                            }}
                            style={{
                              background: 'var(--color-primary)',
                              border: '1px solid var(--color-primary)',
                              color: '#fff',
                              padding: '0.5rem 1rem',
                              fontSize: '0.85rem',
                              fontFamily: 'Be Vietnam Pro, sans-serif',
                              textTransform: 'uppercase',
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                              borderRadius: '2px',
                              fontWeight: 500
                            }}
                            onMouseOver={(e) => { e.target.style.backgroundColor = 'var(--color-accent)'; e.target.style.borderColor = 'var(--color-accent)'; }}
                            onMouseOut={(e) => { e.target.style.backgroundColor = 'var(--color-primary)'; e.target.style.borderColor = 'var(--color-primary)'; }}
                          >
                            Viết đánh giá
                          </button>
                        )
                      )}
                    </div>
                  </div>
                ))}

                {/* Address & Total */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '1.5rem', flexWrap: 'wrap', gap: '1.5rem' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', maxWidth: '400px' }}>
                    <strong style={{ color: 'var(--color-text)', display: 'block', marginBottom: '0.25rem' }}>Địa chỉ nhận hàng:</strong>
                    {order.orderAddress ? (
                      <span>{order.orderAddress.recipientName} - {order.orderAddress.phone}<br />
                      {order.orderAddress.streetDetail}, {order.orderAddress.ward}, {order.orderAddress.district}, {order.orderAddress.province}</span>
                    ) : (
                      <span>{order.customerName} - {order.customerPhone}<br />
                      {order.shippingAddress}</span>
                    )}
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <table style={{ borderCollapse: 'collapse', marginLeft: 'auto', fontSize: '0.9rem' }}>
                      <tbody>
                        <tr>
                          <td style={{ textAlign: 'right', padding: '0.25rem 1rem', color: 'var(--color-text-muted)' }}>Tạm tính:</td>
                          <td style={{ textAlign: 'right', padding: '0.25rem 0' }}>{formatPrice(order.subtotal)}</td>
                        </tr>
                        {order.discountAmount > 0 && (
                          <tr>
                            <td style={{ textAlign: 'right', padding: '0.25rem 1rem', color: '#ef4444' }}>Giảm giá:</td>
                            <td style={{ textAlign: 'right', padding: '0.25rem 0', color: '#ef4444' }}>-{formatPrice(order.discountAmount)}</td>
                          </tr>
                        )}
                        <tr>
                          <td style={{ textAlign: 'right', padding: '0.25rem 1rem', color: 'var(--color-text-muted)' }}>Phí vận chuyển:</td>
                          <td style={{ textAlign: 'right', padding: '0.25rem 0' }}>{formatPrice(order.shippingFee)}</td>
                        </tr>
                        <tr style={{ borderTop: '1px solid var(--color-border)', fontWeight: 500, fontSize: '1.1rem' }}>
                          <td style={{ textAlign: 'right', padding: '0.5rem 1rem 0 1rem', color: 'var(--color-primary)' }}>Tổng cộng:</td>
                          <td style={{ textAlign: 'right', padding: '0.5rem 0 0 0', color: 'var(--color-accent)' }}>{formatPrice(order.total)}</td>
                        </tr>
                      </tbody>
                    </table>

                    {(order.status === 'PENDING' || order.status === 'CONFIRMED') && (
                      <button
                        onClick={() => openCancelModal(order.id)}
                        style={{
                          marginTop: '1.5rem',
                          background: 'transparent',
                          border: '1px solid #ef4444',
                          color: '#ef4444',
                          padding: '0.4rem 1rem',
                          fontSize: '0.8rem',
                          fontFamily: 'Be Vietnam Pro, sans-serif',
                          textTransform: 'uppercase',
                          cursor: 'pointer'
                        }}
                      >
                        Huỷ đơn hàng
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && createPortal(
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 999999
        }}>
          <div style={{ background: '#fff', padding: '2rem', width: '100%', maxWidth: '500px', position: 'relative' }}>
            <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.25rem', fontWeight: 300, textTransform: 'uppercase' }}>Đánh giá sản phẩm</h3>
            <button
              onClick={() => setShowReviewModal(false)}
              style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', fontSize: '1.5rem', cursor: 'pointer', lineHeight: 1 }}
            >×</button>

            <p style={{ marginBottom: '1rem', fontWeight: 500 }}>{reviewForm.productName}</p>

            {reviewError && <div style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '0.9rem' }}>{reviewError}</div>}
            {reviewSuccess && <div style={{ color: '#10b981', marginBottom: '1rem', fontSize: '0.9rem' }}>{reviewSuccess}</div>}

            {!reviewSuccess && (
              <form onSubmit={handleReviewSubmit}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Đánh giá của bạn</label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {[1, 2, 3, 4, 5].map(star => (
                      <span
                        key={star}
                        onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                        style={{
                          fontSize: '1.5rem',
                          cursor: 'pointer',
                          color: star <= reviewForm.rating ? '#fbbf24' : '#e5e7eb'
                        }}
                      >★</span>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Nội dung đánh giá</label>
                  <textarea
                    value={reviewForm.content}
                    onChange={(e) => setReviewForm({ ...reviewForm, content: e.target.value })}
                    rows={4}
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--color-border)', outline: 'none', resize: 'vertical' }}
                    placeholder="Hãy chia sẻ cảm nhận của bạn về sản phẩm..."
                    required
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Gửi đánh giá</button>
              </form>
            )}
          </div>
        </div>,
        document.body
      )}

      <ConfirmModal
        isOpen={cancelModalState.isOpen}
        title="Xác nhận hủy đơn hàng"
        message="Bạn có chắc chắn muốn hủy đơn hàng này không? Hành động này không thể hoàn tác."
        confirmText="Hủy Đơn"
        cancelText="Quay lại"
        onConfirm={confirmCancelOrder}
        onCancel={() => setCancelModalState({ isOpen: false, orderId: null })}
      />
    </div>
  );
};

export default OrderHistoryTab;
