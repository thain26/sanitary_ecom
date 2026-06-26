import React from 'react';
import { Heart, Star } from 'lucide-react';
import useWishlistStore from '../../wishlist/store/useWishlistStore';
import Accordion from '../../../components/common/Accordion';

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

const ProductInfo = ({ product, quantity, setQuantity, onAddToCart }) => {
  const wishlistIds = useWishlistStore(state => state.wishlistIds);
  const toggleWishlist = useWishlistStore(state => state.toggleWishlist);
  const isWishlisted = wishlistIds.includes(product.id);


  return (
    <div>
      <div className="product-brand" style={{ fontSize: '1rem', marginBottom: '1rem' }}>{product.brand?.name || 'INAX'}</div>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: 300 }}>{product.name}</h1>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ fontSize: '1.2rem', color: 'var(--color-text-muted)' }}>Mã SP: {product.modelCode}</div>
        {product.ratingCount > 0 && (
          <>
            <span style={{ color: 'var(--color-text-muted)' }}>|</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#fbbf24' }}>
              <Star size={16} fill="#fbbf24" stroke="none" />
              <span style={{ fontWeight: 600, color: 'var(--color-text)', marginLeft: '0.25rem' }}>{product.ratingAvg}</span>
              <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>({product.ratingCount} đánh giá)</span>
            </div>
          </>
        )}
      </div>
      
      <div style={{ fontSize: '2rem', color: 'var(--color-primary)', fontFamily: 'Be Vietnam Pro, sans-serif', fontWeight: 300, marginBottom: '2rem' }}>
        {formatPrice(product.salePrice || product.basePrice)}
      </div>

      <div 
        style={{ lineHeight: 1.8, color: 'var(--color-text-muted)', marginBottom: '3rem', fontSize: '1rem' }}
        dangerouslySetInnerHTML={{ __html: product.description }}
      />

      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--color-border)', borderRadius: '2px' }}>
          <button 
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            style={{ padding: '0.8rem 1.2rem', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}
          >-</button>
          <input 
            type="text" 
            value={quantity} 
            readOnly 
            style={{ width: '50px', textAlign: 'center', border: 'none', fontSize: '1rem', outline: 'none' }} 
          />
          <button 
            onClick={() => setQuantity(quantity + 1)}
            style={{ padding: '0.8rem 1.2rem', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}
          >+</button>
        </div>
        
        <button 
          className="btn btn-primary" 
          style={{ flexGrow: 1 }} 
          onClick={onAddToCart}
          disabled={product.stock <= 0}
        >
          {product.stock > 0 ? 'THÊM VÀO GIỎ HÀNG' : 'HẾT HÀNG'}
        </button>
        
        <button
          onClick={() => toggleWishlist(product.id)}
          style={{
            background: 'transparent',
            border: '1px solid var(--color-border)',
            padding: '0 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          title={isWishlisted ? "Bỏ yêu thích" : "Thêm vào yêu thích"}
        >
          <Heart size={24} fill={isWishlisted ? "#ef4444" : "none"} stroke={isWishlisted ? "#ef4444" : "var(--color-text)"} />
        </button>
      </div>

      <div style={{ marginTop: '3rem', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
        <Accordion 
          items={[
            ...(product.detail ? [{
              title: 'Thông số kỹ thuật & Chi tiết',
              content: <div dangerouslySetInnerHTML={{ __html: product.detail }} className="product-detail-html" />
            }] : []),
            {
              title: 'Vận chuyển & Lắp đặt',
              content: (
                <ul style={{ paddingLeft: '1.2rem' }}>
                  <li>Miễn phí vận chuyển cho các đơn hàng khu vực nội thành.</li>
                  <li>Dịch vụ lắp đặt tiêu chuẩn với đội ngũ kỹ thuật viên được cấp chứng chỉ.</li>
                  <li>Đội ngũ chuyên viên sẵn sàng hỗ trợ tư vấn và đo đạc không gian miễn phí.</li>
                </ul>
              )
            },
            {
              title: 'Chính sách bảo hành',
              content: (
                <ul style={{ paddingLeft: '1.2rem' }}>
                  <li>Bảo hành chính hãng phần sứ lên đến 10 năm.</li>
                  <li>Bảo hành linh kiện điện tử 2 năm (lỗi 1 đổi 1 trong 30 ngày đầu tiên nếu do NSX).</li>
                  <li>Hỗ trợ kiểm tra và bảo dưỡng định kỳ miễn phí trong năm đầu tiên.</li>
                </ul>
              )
            }
          ]}
        />
      </div>
    </div>
  );
};

export default ProductInfo;
