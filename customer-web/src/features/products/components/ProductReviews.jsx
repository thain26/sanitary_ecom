import React, { useState, useEffect } from 'react';
import { Star, User } from 'lucide-react';

const ProductReviews = ({ reviews }) => {
  if (!reviews || reviews.length === 0) {
    return (
      <div style={{ marginTop: '4rem', marginBottom: '4rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 300, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>
          Đánh Giá Từ Khách Hàng
        </h2>
        <div style={{ textAlign: 'center', padding: '3rem 0', background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}>
          <p className="text-muted">Chưa có đánh giá nào cho sản phẩm này.</p>
        </div>
      </div>
    );
  }

  // Calculate rating stats
  const totalReviews = reviews.length;
  const avgRating = (reviews.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews).toFixed(1);
  const starCounts = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length
  }));

  return (
    <div style={{ marginTop: '4rem', marginBottom: '4rem' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 300, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>
        Đánh Giá Từ Khách Hàng
      </h2>

      {/* Review Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', marginBottom: '3rem', padding: '2rem', background: '#fff', border: '1px solid var(--color-border)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid var(--color-border)' }}>
          <div style={{ fontSize: '3rem', fontWeight: 700, color: '#fbbf24', lineHeight: 1 }}>{avgRating}</div>
          <div style={{ display: 'flex', gap: '0.2rem', margin: '0.5rem 0' }}>
            {[1, 2, 3, 4, 5].map(i => (
              <Star key={i} size={20} fill={i <= Math.round(avgRating) ? '#fbbf24' : 'none'} stroke={i <= Math.round(avgRating) ? 'none' : '#cbd5e1'} />
            ))}
          </div>
          <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>{totalReviews} đánh giá</div>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', justifyContent: 'center' }}>
          {starCounts.map(({ star, count }) => (
            <div key={star} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', width: '40px' }}>
                <span style={{ fontSize: '0.9rem' }}>{star}</span>
                <Star size={14} fill="#fbbf24" stroke="none" />
              </div>
              <div style={{ flexGrow: 1, height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${totalReviews === 0 ? 0 : (count / totalReviews) * 100}%`, height: '100%', background: '#fbbf24', borderRadius: '4px' }}></div>
              </div>
              <div style={{ width: '40px', fontSize: '0.85rem', color: 'var(--color-text-muted)', textAlign: 'right' }}>{count}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Review List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {reviews.map(review => (
          <div key={review.id} style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                {review.user?.avatarUrl ? (
                  <img src={review.user.avatarUrl} alt={review.user.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <User size={20} color="var(--color-text-muted)" />
                )}
              </div>
              <div style={{ flexGrow: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem', fontWeight: 500 }}>
                      {review.user?.fullName || 'Khách hàng'}
                    </h4>
                    <div style={{ display: 'flex', gap: '0.1rem', marginBottom: '0.5rem' }}>
                      {[1, 2, 3, 4, 5].map(i => (
                        <Star key={i} size={14} fill={i <= review.rating ? '#fbbf24' : 'none'} stroke={i <= review.rating ? 'none' : '#cbd5e1'} />
                      ))}
                    </div>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                    {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                  </div>
                </div>
                
                {review.isVerified && (
                  <div style={{ fontSize: '0.8rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.5rem' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    Đã mua hàng
                  </div>
                )}
                
                <p style={{ margin: '0.5rem 0', lineHeight: 1.6, color: 'var(--color-text)' }}>
                  {review.content}
                </p>

                {review.imagesJson && review.imagesJson.length > 0 && (
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                    {review.imagesJson.map((img, idx) => (
                      <div key={idx} style={{ width: '80px', height: '80px', border: '1px solid var(--color-border)', borderRadius: '4px', overflow: 'hidden' }}>
                        <img src={img} alt="review detail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductReviews;
