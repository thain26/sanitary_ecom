import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { publicApi } from '../../../services/api';
import useCartStore from '../../cart/store/useCartStore';
import BackButton from '../../../components/common/BackButton';
import { ArrowLeft } from 'lucide-react';
import ProductGallery from '../components/ProductGallery';
import ProductCard from '../components/ProductCard';
import ProductInfo from '../components/ProductInfo';
import ProductReviews from '../components/ProductReviews';
import useToastStore from '../../../store/useToastStore';

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const addToCart = useCartStore(state => state.addToCart);
  const showToast = useToastStore(state => state.showToast);

  useEffect(() => {
    setLoading(true);
    publicApi.getProductBySlug(slug)
      .then(res => {
        setProduct(res);
        if (res.category?.slug) {
          publicApi.getProducts({ categorySlug: res.category.slug, size: 4 })
            .then(relRes => {
              // Filter out the current product from related
              const related = (relRes.content || relRes).filter(p => p.id !== res.id).slice(0, 4);
              setRelatedProducts(related);
            })
            .catch(err => console.error("Failed to load related products", err));
        }
        if (res.id) {
          publicApi.getProductReviews(res.id)
            .then(revs => setReviews(revs))
            .catch(err => console.error("Failed to load reviews", err));
        }
        setLoading(false);
      })
      .catch(err => {
        console.warn("API failed, using mock data for detail");
        setLoading(false);
      });
  }, [slug]);

  const handleAddToCart = () => {
    addToCart(product.id, quantity, product);
    showToast('Đã thêm sản phẩm vào giỏ hàng');
  };

  if (loading) return <div style={{textAlign: 'center', padding: '10rem 0', fontFamily: 'Be Vietnam Pro, sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase'}}>Đang tải chi tiết...</div>;
  if (!product) return <div style={{textAlign: 'center', padding: '10rem 0', fontFamily: 'Be Vietnam Pro, sans-serif'}}>Không tìm thấy sản phẩm</div>;

  return (
    <div className="animate-fade-in container" style={{ padding: '3rem 0' }}>

      {/* Back Button */}
      <div style={{ marginBottom: '2rem' }}>
        <BackButton fallback="/danh-muc/tat-ca" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', marginBottom: '4rem' }}>
        
        {/* Product Images */}
        <div>
          <ProductGallery images={product.images} fallbackText={product.modelCode || 'INAX'} />
        </div>

        {/* Product Info */}
        <ProductInfo 
          product={product} 
          quantity={quantity} 
          setQuantity={setQuantity} 
          onAddToCart={handleAddToCart} 
        />
      </div>

      {/* Reviews */}
      <ProductReviews reviews={reviews} />

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section style={{ marginTop: '6rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 300, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>
            Sản Phẩm Cùng Danh Mục
          </h2>
          <div className="product-grid" style={{ marginBottom: 0 }}>
            {relatedProducts.map(p => (
              <ProductCard 
                key={p.id} 
                product={p} 
                onAddToCart={addToCart} 
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;
