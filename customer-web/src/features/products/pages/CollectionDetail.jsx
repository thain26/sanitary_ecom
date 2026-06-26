import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { publicApi } from '../../../services/api';
import { getProductImage } from '../../../utils/image';
import useCartStore from '../../cart/store/useCartStore';
import ProductCard from '../components/ProductCard';
import useToastStore from '../../../store/useToastStore';
import BackButton from '../../../components/common/BackButton';
import { Package } from 'lucide-react';

const CollectionDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const addToCart = useCartStore(state => state.addToCart);
  const showToast = useToastStore(state => state.showToast);

  useEffect(() => {
    setLoading(true);
    publicApi.getCollectionBySlug(slug)
      .then(data => {
        setCollection(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load collection', err);
        setError('Không tìm thấy bộ sưu tập này.');
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '10rem 0', fontFamily: 'Be Vietnam Pro, sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
        Đang tải bộ sưu tập...
      </div>
    );
  }

  if (error || !collection) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '8rem 0' }}>
        <Package size={64} strokeWidth={0.75} style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }} />
        <h1 style={{ fontSize: '1.5rem', fontWeight: 300, marginBottom: '1rem' }}>Không tìm thấy bộ sưu tập</h1>
        <p className="text-muted" style={{ marginBottom: '2rem' }}>Bộ sưu tập này không tồn tại hoặc đã bị ẩn.</p>
        <Link to="/" className="btn btn-primary">Về trang chủ</Link>
      </div>
    );
  }

  const products = collection.products || [];

  return (
    <div className="animate-fade-in">
      {/* Hero Banner */}
      <div
        style={{
          height: '50vh',
          minHeight: '400px',
          backgroundImage: collection.bannerUrl
            ? `url(${collection.bannerUrl})`
            : 'linear-gradient(135deg, #1a1a1a 0%, #2c2c2c 100%)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          marginBottom: '4rem',
        }}
      >
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to right, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.3) 100%)',
        }} />
        <div className="container" style={{ position: 'relative', zIndex: 1, color: '#fff' }}>
          <div style={{
            fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: '0.85rem', letterSpacing: '0.3em',
            textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: '1rem',
            fontWeight: 500
          }}>
            BỘ SƯU TẬP
          </div>
          <h1 style={{
            fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: '3.5rem', fontWeight: 300,
            lineHeight: 1.2, marginBottom: '1rem', letterSpacing: '0.05em',
            color: '#fdfbf7', textShadow: '0 4px 24px rgba(0,0,0,0.5)'
          }}>
            {collection.name}
          </h1>
          {collection.description && (
            <p style={{ fontSize: '1.1rem', fontWeight: 300, maxWidth: '600px', lineHeight: 1.8, color: '#f0f0f0' }}>
              {collection.description}
            </p>
          )}
        </div>
      </div>

      <div className="container" style={{ marginBottom: '6rem' }}>
        <BackButton />

        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
          borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem', marginBottom: '3rem',
        }}>
          <h2 style={{
            fontSize: '1.5rem', fontWeight: 300, textTransform: 'uppercase',
            letterSpacing: '0.1em', color: 'var(--color-primary)',
          }}>
            Sản Phẩm Trong Bộ Sưu Tập
          </h2>
          <span className="text-muted" style={{ fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: '0.9rem' }}>
            {products.length} sản phẩm
          </span>
        </div>

        {products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 0' }}>
            <Package size={48} strokeWidth={0.75} style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }} />
            <p className="text-muted">Bộ sưu tập này chưa có sản phẩm nào.</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '2rem',
          }}>
            {products.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={async (product) => {
                  try {
                    await addToCart(product.id, 1);
                    showToast(`Đã thêm ${product.name} vào giỏ hàng`);
                  } catch {
                    showToast('Không thể thêm vào giỏ hàng.');
                  }
                }}
              />
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default CollectionDetail;
