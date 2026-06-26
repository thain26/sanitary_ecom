import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../auth/store/authStore';
import { wishlistApi } from '../../../services/api';
import { getProductImage } from '../../../utils/image';
import useCartStore from '../../cart/store/useCartStore';
import useToastStore from '../../../store/useToastStore';
import { Heart, ChevronRight, ShoppingBag } from 'lucide-react';

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

const Wishlist = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const addToCart = useCartStore((state) => state.addToCart);

  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const showToast = useToastStore(state => state.showToast);

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    }
  }, [isAuthenticated]);

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const data = await wishlistApi.getWishlist();
      setWishlist(data);
    } catch (err) {
      console.error('Failed to fetch wishlist', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleWishlist = async (productId) => {
    try {
      await wishlistApi.toggleWishlist(productId);
      showToast('Đã xóa sản phẩm khỏi danh sách yêu thích');
      fetchWishlist();
    } catch (err) {
      console.error(err);
    }
  };


  return (
    <div className="animate-fade-in" style={{ paddingBottom: '5rem', minHeight: 'calc(100vh - 200px)' }}>

      <div className="container">
        {/* Breadcrumbs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '2rem 0', fontSize: '0.85rem', color: 'var(--color-text-muted)', fontFamily: 'Be Vietnam Pro, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <Link to="/" style={{ color: 'inherit' }}>Trang chủ</Link>
          <ChevronRight size={14} />
          <span style={{ color: 'var(--color-primary)' }}>Danh sách yêu thích</span>
        </div>

        <h1 style={{ fontSize: '2.25rem', fontWeight: 300, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '3rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>
          Danh Sách Yêu Thích
        </h1>

        {!isAuthenticated ? (
          <div style={{ textAlign: 'center', padding: '5rem 1rem', border: '1px solid var(--color-border)', background: '#fff' }}>
            <Heart size={48} style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 300, marginBottom: '1rem' }}>Đăng nhập để xem danh sách yêu thích</h2>
            <p className="text-muted" style={{ marginBottom: '2rem', maxWidth: '400px', margin: '0 auto 2rem' }}>
              Hãy lưu lại những sản phẩm bạn quan tâm để dễ dàng theo dõi và đặt mua sau này.
            </p>
            <Link to="/dang-nhap" className="btn btn-primary">Đăng nhập ngay</Link>
          </div>
        ) : loading ? (
          <div style={{ textAlign: 'center', padding: '5rem 0', fontFamily: 'Be Vietnam Pro, sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Đang tải danh sách yêu thích...
          </div>
        ) : wishlist.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 1rem', border: '1px solid var(--color-border)', background: '#fff' }}>
            <Heart size={48} style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 300, marginBottom: '1rem' }}>Danh sách yêu thích của bạn trống</h2>
            <p className="text-muted" style={{ marginBottom: '2rem' }}>
              Hãy khám phá các sản phẩm thiết bị vệ sinh cao cấp và thêm chúng vào danh sách yêu thích.
            </p>
            <Link to="/" className="btn btn-primary">Khám phá sản phẩm</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '2rem' }}>
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
                
                <Link to={`/san-pham/${item.slug}`} style={{ height: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', padding: '1.5rem', borderBottom: '1px solid var(--color-border)' }}>
                  <img src={getProductImage(item)} alt={item.name} width={240} height={240} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} loading="lazy" />
                </Link>
                
                <div style={{ padding: '1.5rem' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontFamily: 'Be Vietnam Pro, sans-serif', textTransform: 'uppercase' }}>
                    {item.brand?.name || 'INAX'}
                  </span>
                  <Link to={`/san-pham/${item.slug}`} style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: 400, margin: '0.5rem 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.name}
                    </h4>
                  </Link>
                  <div style={{ fontSize: '1.1rem', fontWeight: 500, color: 'var(--color-accent)', marginBottom: '1rem' }}>
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
                        padding: '0.75rem 0',
                        background: 'var(--color-primary)',
                        color: '#fff',
                        border: 'none',
                        fontSize: '0.8rem',
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
    </div>
  );
};

export default Wishlist;
