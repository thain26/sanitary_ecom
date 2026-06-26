import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useCartStore from '../store/useCartStore';
import { Trash2 } from 'lucide-react';
import BackButton from '../../../components/common/BackButton';

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

const Cart = () => {
  const { cart, fetchCart, updateQuantity, removeFromCart } = useCartStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const items = cart?.items || [];
  
  const subtotal = items.reduce((sum, item) => {
    const price = item.price || item.product?.salePrice || item.product?.basePrice || 0;
    return sum + (price * item.quantity);
  }, 0);

  return (
    <div className="container animate-fade-in" style={{ marginTop: '2rem', marginBottom: '6rem', minHeight: '50vh' }}>
      <BackButton />

      <h1 className="title-section">Giỏ Hàng Của Bạn</h1>
      
      {items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <p style={{ marginBottom: '2rem', color: 'var(--color-text-muted)' }}>Giỏ hàng của bạn đang trống.</p>
          <Link to="/danh-muc/tat-ca" className="btn btn-primary">Tiếp Tục Mua Sắm</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '3rem' }}>
          {/* Cart Items List */}
          <div>
            <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem', marginBottom: '1.5rem', display: 'grid', gridTemplateColumns: '3fr 1fr 1fr 0.2fr', color: 'var(--color-text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <div>Sản Phẩm</div>
              <div style={{textAlign: 'center'}}>Số Lượng</div>
              <div style={{textAlign: 'right'}}>Tổng</div>
              <div></div>
            </div>

            {items.map(item => {
              const product = item.product;
              const price = item.price || product?.salePrice || product?.basePrice || 0;
              
              return (
                <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '3fr 1fr 1fr 0.2fr', alignItems: 'center', padding: '1.5rem 0', borderBottom: '1px solid var(--color-border)' }}>
                  <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <img src={`https://placehold.co/100x100/faf9f7/2c2a29?text=${product?.modelCode || 'IMG'}`} alt={product?.name} style={{ width: '80px', height: '80px', objectFit: 'contain', backgroundColor: 'var(--color-surface)' }} />
                    <div>
                      <div style={{ fontWeight: 500, marginBottom: '0.5rem' }}>{product?.name}</div>
                      <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>{formatPrice(price)}</div>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div style={{ display: 'inline-flex', border: '1px solid var(--color-border)', borderRadius: '2px' }}>
                      <button onClick={() => updateQuantity(product.id, item.quantity - 1)} style={{ padding: '0.4rem 0.8rem', background: 'transparent', border: 'none', cursor: 'pointer' }}>-</button>
                      <input type="text" value={item.quantity} readOnly style={{ width: '40px', textAlign: 'center', border: 'none', outline: 'none' }} />
                      <button onClick={() => updateQuantity(product.id, item.quantity + 1)} style={{ padding: '0.4rem 0.8rem', background: 'transparent', border: 'none', cursor: 'pointer' }}>+</button>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', fontWeight: 500 }}>
                    {formatPrice(price * item.quantity)}
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <button onClick={() => removeFromCart(product.id)} style={{ background: 'transparent', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div style={{ backgroundColor: 'var(--color-surface)', padding: '2rem', border: '1px solid var(--color-border)', alignSelf: 'start' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '2rem', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>Tóm Tắt Đơn Hàng</h3>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'var(--color-text-muted)' }}>
              <span>Tạm tính</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', color: 'var(--color-text-muted)' }}>
              <span>Phí giao hàng</span>
              <span>Miễn phí</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', fontSize: '1.2rem', fontWeight: 500, borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
              <span>Tổng cộng</span>
              <span style={{ color: 'var(--color-primary)' }}>{formatPrice(subtotal)}</span>
            </div>

            <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => navigate('/thanh-toan')}>
              TIẾN HÀNH ĐẶT HÀNG
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
