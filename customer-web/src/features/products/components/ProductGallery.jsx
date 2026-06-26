import React, { useState } from 'react';

const ProductGallery = ({ images, fallbackText }) => {
  // Use primary image as default if available
  const defaultIndex = images && images.length > 0 
    ? Math.max(0, images.findIndex(img => img.primary || img.isPrimary))
    : 0;
  
  const [activeIndex, setActiveIndex] = useState(defaultIndex);
  if (!images || images.length === 0) {
    return (
      <div style={{ backgroundColor: 'var(--color-surface)', padding: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <img 
          src={`https://placehold.co/600x600/faf9f7/2c2a29?font=playfair-display&text=${fallbackText}`} 
          alt={fallbackText} 
          style={{ width: '100%', maxWidth: '500px', objectFit: 'contain' }}
        />
      </div>
    );
  }

  // Find primary image index to set as default if we haven't touched it yet
  // But wait, we just set activeIndex to 0 by default. Let's make sure it's correct.
  // Actually it's better to just use the activeIndex state.
  
  // Sort images so primary is first, or just use them as is. Let's use as is.
  const activeImage = images[activeIndex];

  return (
    <div className="product-gallery">
      {/* Main Image */}
      <div style={{ backgroundColor: 'var(--color-surface)', padding: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '1rem', position: 'relative', paddingTop: '100%' }}>
        <img 
          src={activeImage.url} 
          alt={activeImage.alt || fallbackText} 
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain', padding: '2rem', mixBlendMode: 'darken' }}
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '1rem' }}>
          {images.map((img, idx) => (
            <div 
              key={idx} 
              onClick={() => setActiveIndex(idx)}
              style={{ 
                cursor: 'pointer', 
                border: `2px solid ${activeIndex === idx ? 'var(--color-primary)' : 'transparent'}`,
                backgroundColor: 'var(--color-surface)',
                paddingTop: '100%',
                position: 'relative'
              }}
            >
              <img 
                src={img.url} 
                alt={img.alt || `Thumbnail ${idx}`} 
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain', padding: '0.5rem', mixBlendMode: 'darken' }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
