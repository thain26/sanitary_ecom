export const getProductImage = (product) => {
  if (product && product.images && product.images.length > 0) {
    const primaryImg = product.images.find(img => img.primary || img.isPrimary);
    if (primaryImg) return primaryImg.url;
    return product.images[0].url;
  }
  return `https://placehold.co/400x500/faf9f7/2c2a29?font=playfair-display&text=${product?.modelCode || 'INAX'}`;
};
