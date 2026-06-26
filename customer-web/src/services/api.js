import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const storage = localStorage.getItem('sanitary-auth-storage');
  if (storage) {
    try {
      const { state } = JSON.parse(storage);
      if (state?.accessToken) {
        config.headers.Authorization = `Bearer ${state.accessToken}`;
      }
    } catch (e) {
      console.error('Error parsing auth storage', e);
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      localStorage.removeItem('sanitary-auth-storage');
      window.location.href = '/dang-nhap';
    }
    return Promise.reject(error);
  }
);

export const publicApi = {
  getHomeData: () => api.get('/public/home').then(res => res.data),
  getCategories: () => api.get('/public/categories').then(res => res.data),
  getBrands: () => api.get('/public/brands').then(res => res.data),
  getProducts: (params) => api.get('/public/products', { params }).then(res => res.data),
  getProductBySlug: (slug) => api.get('/public/products/' + slug).then(res => res.data),
  suggest: (keyword) => api.get('/public/products/suggest', { params: { keyword: keyword } }).then(res => res.data),
  validateVoucher: (code, orderValue) => api.post('/public/vouchers/validate', null, { params: { code, orderValue } }).then(res => res.data),
  getActiveFlashSale: () => api.get('/public/flash-sales/active').then(res => res.data).catch(() => null),
  trackOrder: (code) => api.get('/public/orders/track', { params: { code } }).then(res => res.data),
  getHeroBannerCollections: () => api.get('/public/collections/hero-banners').then(res => res.data).catch(() => []),
  getCollectionBySlug: (slug) => api.get('/public/collections/' + slug).then(res => res.data),
  getProductReviews: (productId) => api.get('/public/products/' + productId + '/reviews').then(res => res.data),
};


export const cartApi = {
  getCart: (sessionId) => api.get('/cart/' + sessionId).then(res => res.data),
  addToCart: (sessionId, productId, quantity) => api.post('/cart/' + sessionId + '/add', { productId, quantity }).then(res => res.data),
  updateCartItem: (sessionId, productId, quantity) => api.put('/cart/' + sessionId + '/update', { productId, quantity }).then(res => res.data),
  removeFromCart: (sessionId, productId) => api.delete('/cart/' + sessionId + '/remove/' + productId).then(res => res.data),
};

export const orderApi = {
  checkout: (sessionId, orderData) => api.post('/orders/checkout/' + sessionId, orderData).then(res => res.data),
  getMyOrders: () => api.get('/orders/my-orders').then(res => res.data),
  cancelOrder: (orderId) => api.put('/orders/' + orderId + '/cancel').then(res => res.data),
};

export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials).then(res => res.data),
  register: (userData) => api.post('/auth/register', userData).then(res => res.data),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }).then(res => res.data),
  resetPassword: (data) => api.post('/auth/reset-password', data).then(res => res.data),
};

export const userApi = {
  getProfile: () => api.get('/users/profile').then(res => res.data),
  updateProfile: (data) => api.put('/users/profile', data).then(res => res.data),
  getAddresses: () => api.get('/users/addresses').then(res => res.data),
  addAddress: (data) => api.post('/users/addresses', data).then(res => res.data),
  updateAddress: (id, data) => api.put('/users/addresses/' + id, data).then(res => res.data),
  deleteAddress: (id) => api.delete('/users/addresses/' + id).then(res => res.data),
  setDefaultAddress: (id) => api.patch('/users/addresses/' + id + '/default').then(res => res.data)
};

export const wishlistApi = {
  getWishlist: () => api.get('/wishlist').then(res => res.data),
  toggleWishlist: (productId) => api.post(`/wishlist/${productId}`).then(res => res.data)
};

export const reviewApi = {
  createReview: (data) => api.post('/reviews', data).then(res => res.data),
};

export default api;
