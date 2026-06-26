import React from 'react';
import { Link } from 'react-router-dom';
import { getProductImage } from '../../../utils/image';
import { Heart } from 'lucide-react';
import useWishlistStore from '../../wishlist/store/useWishlistStore';
import useToastStore from '../../../store/useToastStore';

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

const ProductCard = ({ product, onAddToCart }) => {
  const showToast = useToastStore(state => state.showToast);
  const wishlistIds = useWishlistStore(state => state.wishlistIds);
  const toggleWishlist = useWishlistStore(state => state.toggleWishlist);
  const isWishlisted = wishlistIds.includes(product.id);

  return (
    <div className="product-card" style={{ position: 'relative' }}>
      <button
        onClick={(e) => {
          e.preventDefault();
          toggleWishlist(product.id);
        }}
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
          color: isWishlisted ? '#ef4444' : 'var(--color-text-muted)',
          zIndex: 10
        }}
        title={isWishlisted ? "Bỏ yêu thích" : "Thêm vào yêu thích"}
      >
        <Heart size={18} fill={isWishlisted ? "#ef4444" : "none"} strokeWidth={isWishlisted ? 0 : 2} />
      </button>
      <Link to={`/san-pham/${product.slug}`} className="product-img-wrapper">
        <img src={getProductImage(product)} alt={product.name} className="product-img" />
      </Link>
      <div className="product-info">
        <div className="product-brand">{product.brand?.name || 'INAX'}</div>
        <Link to={`/san-pham/${product.slug}`} className="product-name" title={product.name}>
          {product.name}
        </Link>
        <div className="product-price">
          {formatPrice(product.salePrice || product.basePrice)}
        </div>
        {product.stock > 0 ? (
          <button 
            className="add-to-cart" 
            onClick={() => {
              onAddToCart(product.id, 1, product);
              if (showToast) showToast('Đã thêm sản phẩm vào giỏ hàng', 'success');
            }}
          >
            + Thêm Vào Giỏ
          </button>
        ) : (
          <button 
            className="add-to-cart" 
            disabled 
            style={{ background: 'var(--color-border)', color: 'var(--color-text-muted)', cursor: 'not-allowed' }}
          >
            Hết hàng
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
