import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { publicApi } from '../../services/api';
import { getProductImage } from '../../utils/image';
import useCartStore from '../cart/store/useCartStore';
import ProductCard from '../products/components/ProductCard';
import HeroSlider from './components/HeroSlider';

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

const Home = () => {
  const [data, setData] = useState({ banners: [], categories: [], featuredProducts: [] });
  const [heroBannerCollections, setHeroBannerCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [flashSale, setFlashSale] = useState(null);
  const [timeLeft, setTimeLeft] = useState('');
  const addToCart = useCartStore(state => state.addToCart);

  useEffect(() => {
    // Load home data
    publicApi.getHomeData()
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load home data", err);
        // Fallback luxury mock data
        setData({
          banners: [{ id: 1, title: 'Bộ sưu tập Satis', imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=2070&auto=format&fit=crop', linkUrl: '#' }],
          categories: [
            { id: 1, name: 'Bồn Cầu Thông Minh', slug: 'bon-cau', imageUrl: 'https://images.unsplash.com/photo-1649083049103-62b1154b7305?w=500&auto=format&fit=crop&q=60' },
            { id: 2, name: 'Chậu Rửa Đặt Bàn', slug: 'lavabo', imageUrl: 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=500&auto=format&fit=crop&q=60' },
            { id: 3, name: 'Vòi Nước Cao Cấp', slug: 'voi-nuoc', imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&auto=format&fit=crop&q=60' }
          ],
          featuredProducts: [
            { id: 1, name: 'Bồn cầu thông minh Satis G AC-618VN', slug: 'satis-g', modelCode: 'AC-618VN', basePrice: 45000000, brand: {name: 'INAX'} },
            { id: 2, name: 'Lavabo đặt bàn Aqua Ceramic AL-652V', slug: 'al-652v', modelCode: 'AL-652V', basePrice: 3200000, brand: {name: 'INAX'} },
            { id: 3, name: 'Vòi lavabo Lumina LFV-5012S', slug: 'lfv-5012s', modelCode: 'LFV-5012S', basePrice: 2440000, brand: {name: 'INAX'} },
            { id: 4, name: 'Bồn cầu cao cấp Satis S AC-818VN', slug: 'satis-s', modelCode: 'AC-818VN', basePrice: 90000000, brand: {name: 'INAX'} },
          ]
        });
        setLoading(false);
      });

    // Load active flash sale
    publicApi.getActiveFlashSale()
      .then(res => {
        if (res && res.id && res.products && res.products.length > 0) {
          setFlashSale(res);
        }
      })
      .catch(err => console.error("Error fetching active flash sale", err));

    // Load hero banner collections
    publicApi.getHeroBannerCollections()
      .then(cols => setHeroBannerCollections(cols))
      .catch(() => setHeroBannerCollections([]));
  }, []);

  // Countdown timer logic
  useEffect(() => {
    if (!flashSale || !flashSale.endTime) return;

    const calculateTimeLeft = () => {
      const difference = new Date(flashSale.endTime) - new Date();
      if (difference <= 0) {
        setFlashSale(null);
        return null;
      }
      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const firstTime = calculateTimeLeft();
    if (firstTime) setTimeLeft(firstTime);

    const timer = setInterval(() => {
      const time = calculateTimeLeft();
      if (time) {
        setTimeLeft(time);
      } else {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [flashSale]);

  if (loading) return <div style={{textAlign: 'center', padding: '10rem 0', fontFamily: 'Be Vietnam Pro, sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase'}}>Đang tải bộ sưu tập...</div>;

  return (
    <div className="home-container animate-fade-in">

      {/* Hero Section */}
      <HeroSlider collections={heroBannerCollections} />

      {/* Flash Sale Section */}
      {flashSale && (
        <section className="container" style={{ marginTop: '5rem' }}>
          <div className="flash-sale-header" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'linear-gradient(135deg, var(--color-primary) 0%, #1a1918 100%)',
            padding: '1.5rem 2rem',
            borderRadius: '2px',
            borderLeft: '4px solid var(--color-accent)',
            color: '#fff',
            marginBottom: '2rem',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <span style={{
                background: 'var(--color-accent)',
                color: '#fff',
                padding: '0.4rem 1rem',
                borderRadius: '0px',
                fontSize: '0.75rem',
                fontWeight: '600',
                letterSpacing: '0.1em',
                textTransform: 'uppercase'
              }}>EXCLUSIVES</span>
              <h2 style={{ color: '#fff', fontSize: '1.6rem', margin: 0, fontFamily: 'Be Vietnam Pro, sans-serif', fontWeight: '300', letterSpacing: '0.05em' }}>{flashSale.name}</h2>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '0.85rem', color: '#a3a3a3', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Kết thúc sau</span>
              <div style={{
                fontFamily: 'Be Vietnam Pro, sans-serif',
                fontSize: '1.4rem',
                fontWeight: '300',
                background: 'transparent',
                padding: '0.4rem 0',
                borderRadius: '0px',
                letterSpacing: '0.1em',
                color: 'var(--color-accent)'
              }}>{timeLeft}</div>
            </div>
          </div>

          <div className="product-grid">
            {flashSale.products.map(item => {
              const p = {
                id: item.productId,
                name: item.name,
                slug: item.slug,
                modelCode: item.modelCode,
                basePrice: item.basePrice,
                salePrice: item.salePrice,
                images: item.imageUrl ? [{ url: item.imageUrl }] : []
              };
              const soldPercentage = item.quantityLimit ? Math.min(100, Math.round((item.soldCount / item.quantityLimit) * 100)) : 0;
              
              return (
                <div key={item.id} className="product-card">
                  <Link to={`/san-pham/${item.slug}`} className="product-img-wrapper">
                    <img src={getProductImage(p)} alt={item.name} width={300} height={300} className="product-img" loading="lazy" />
                  </Link>
                  <div className="product-info">
                    <div className="product-brand" style={{ color: 'var(--color-accent)', fontWeight: '600', fontSize: '0.75rem', letterSpacing: '0.05em' }}>FLASH SALE</div>
                    <Link to={`/san-pham/${item.slug}`} className="product-name" title={item.name}>{item.name}</Link>
                    <div className="product-price" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginTop: '0.5rem' }}>
                      <span style={{ color: 'var(--color-primary)', fontWeight: '600' }}>{formatPrice(item.salePrice)}</span>
                      <span style={{ color: 'var(--color-text-muted)', textDecoration: 'line-through', fontSize: '0.85rem' }}>{formatPrice(item.basePrice)}</span>
                    </div>

                    {/* Progress Bar */}
                    <div style={{ marginTop: '1rem', marginBottom: '1.2rem' }}>
                      <div style={{ width: '100%', height: '4px', backgroundColor: 'var(--color-border)', borderRadius: '0px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${soldPercentage}%`, backgroundColor: 'var(--color-accent)' }}></div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        <span>Đã bán: {item.soldCount}</span>
                        {item.quantityLimit > 0 && <span>Còn lại: {item.quantityLimit - item.soldCount}</span>}
                      </div>
                    </div>

                    <button 
                      className="add-to-cart" 
                      onClick={() => addToCart(p.id, 1, p)}
                      disabled={item.quantityLimit && item.soldCount >= item.quantityLimit}
                      style={{
                        background: (item.quantityLimit && item.soldCount >= item.quantityLimit) ? 'var(--color-border)' : 'var(--color-primary)',
                        color: (item.quantityLimit && item.soldCount >= item.quantityLimit) ? 'var(--color-text-muted)' : '#fff',
                        padding: '0.85rem 1rem',
                        borderRadius: '0px',
                        justifyContent: 'center',
                        width: '100%',
                        fontFamily: 'Outfit, sans-serif',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        fontSize: '0.75rem',
                        border: 'none',
                        cursor: (item.quantityLimit && item.soldCount >= item.quantityLimit) ? 'not-allowed' : 'pointer',
                        transition: 'background-color 0.3s'
                      }}
                      onMouseOver={e => { if (!(item.quantityLimit && item.soldCount >= item.quantityLimit)) e.target.style.background = 'var(--color-accent)'; }}
                      onMouseOut={e => { if (!(item.quantityLimit && item.soldCount >= item.quantityLimit)) e.target.style.background = 'var(--color-primary)'; }}
                    >
                      {item.quantityLimit && item.soldCount >= item.quantityLimit ? 'Đã hết hàng' : 'Thêm Vào Giỏ'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="container" style={{ marginTop: '6rem' }}>
        <h2 className="title-section">Không Gian Tinh Tuyển</h2>
        <div className="category-grid">
          {data.categories.map(cat => (
            <Link to={`/danh-muc/${cat.slug}`} key={cat.id} className="category-item">
              <img src={cat.imageUrl} alt={cat.name} width={400} height={400} loading="lazy" />
              <div className="category-overlay"></div>
              <div className="category-content">
                <div className="category-name">{cat.name}</div>
                <div className="category-link-text">Khám Phá</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container" style={{ marginTop: '8rem' }}>
        <h2 className="title-section">Sản Phẩm Tiêu Biểu</h2>
        <div className="product-grid">
          {data.featuredProducts.map(p => (
            <ProductCard 
              key={p.id} 
              product={p} 
              onAddToCart={addToCart} 
            />
          ))}
        </div>
        <div style={{textAlign: 'center', marginTop: '2rem'}}>
           <Link to="/danh-muc/tat-ca" className="btn btn-outline" onClick={() => window.scrollTo(0, 0)}>Xem Toàn Bộ Sản Phẩm</Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
