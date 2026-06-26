import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProductImage } from '../../../utils/image';
import useCartStore from '../../cart/store/useCartStore';
import useWishlistStore from '../store/useWishlistStore';
import useToastStore from '../../../store/useToastStore';
import { Heart, ShoppingBag } from 'lucide-react';

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

const WishlistTab = () => {
  const addToCart = useCartStore((state) => state.addToCart);
  const showToast = useToastStore((state) => state.showToast);
  
  const wishlist = useWishlistStore(state => state.wishlistItems);
  const wishlistLoading = useWishlistStore(state => state.loading);
  const fetchWishlist = useWishlistStore(state => state.fetchWishlist);
  const toggleWishlist = useWishlistStore(state => state.toggleWishlist);

  useEffect(() => {
    // Luôn fetch data mới nhất khi mở tab này để hiển thị chi tiết sản phẩm
    fetchWishlist();
  }, [fetchWishlist]);

  const handleToggleWishlist = async (productId) => {
    await toggleWishlist(productId);
  };

  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 300, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2rem', color: 'var(--color-primary)', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>Danh sách yêu thích</h2>

      {wishlistLoading ? (
        <p style={{ textAlign: 'center', padding: '2rem 0' }}>Đang tải danh sách yêu thích...</p>
      ) : wishlist.length === 0 ? (
        <p className="text-muted" style={{ textAlign: 'center', padding: '2rem 0' }}>Danh sách yêu thích của bạn đang trống.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem' }}>
          {wishlist.map((item) => (
            <div key={item.id} className="product-card" style={{ border: '1px solid var(--color-border)', background: '#fff', position: 'relative' }}>
              <button
                onClick={() => handleToggleWishlist(item.id)}
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: '#fff',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  color: '#ef4444',
                  zIndex: 10
                }}
                title="Xoá khỏi danh sách"
              >
                <Heart size={18} fill="#ef4444" />
              </button>
              
              <Link to={`/san-pham/${item.slug}`} style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', padding: '1.5rem', borderBottom: '1px solid var(--color-border)' }}>
                <img src={getProductImage(item)} alt={item.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
              </Link>
              
              <div style={{ padding: '1rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontFamily: 'Be Vietnam Pro, sans-serif', textTransform: 'uppercase' }}>
                  {item.brand?.name || 'INAX'}
                </span>
                <Link to={`/san-pham/${item.slug}`} style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 400, margin: '0.5rem 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.name}
                  </h4>
                </Link>
                <div style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--color-accent)', marginBottom: '1rem' }}>
                  {formatPrice(item.salePrice || item.basePrice)}
                </div>
                
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => {
                      addToCart(item.id, 1, item);
                      showToast('Đã thêm sản phẩm vào giỏ hàng');
                    }}
                    style={{
                      flex: 1,
                      padding: '0.6rem 0',
                      background: 'var(--color-primary)',
                      color: '#fff',
                      border: 'none',
                      fontSize: '0.75rem',
                      fontFamily: 'Be Vietnam Pro, sans-serif',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--color-accent)'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--color-primary)'}
                  >
                    <ShoppingBag size={14} /> Mua ngay
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistTab;
