import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  timeout: 15000,
});

// Request Interceptor: Attach admin access token
api.interceptors.request.use(
  (config) => {
    const authStorage = localStorage.getItem('sanitary-admin-auth-storage');
    if (authStorage) {
      try {
        const parsed = JSON.parse(authStorage);
        const token = parsed?.state?.accessToken;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (e) {
        console.error("Error parsing admin auth storage", e);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Auto refresh token on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const authStorage = localStorage.getItem('sanitary-admin-auth-storage');
        if (authStorage) {
          const parsed = JSON.parse(authStorage);
          const refreshToken = parsed?.state?.refreshToken;
          if (refreshToken) {
            const res = await axios.post('http://localhost:8080/api/auth/refresh-token', { refreshToken });
            const data = res.data;
            
            // Update admin auth storage
            parsed.state.accessToken = data.accessToken;
            parsed.state.refreshToken = data.refreshToken;
            parsed.state.user = {
              id: data.id,
              email: data.email,
              fullName: data.fullName,
              phone: data.phone,
              avatarUrl: data.avatarUrl,
              role: data.role
            };
            localStorage.setItem('sanitary-admin-auth-storage', JSON.stringify(parsed));
            
            // Retry the original request
            originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
            return api(originalRequest);
          }
        }
      } catch (refreshError) {
        localStorage.removeItem('sanitary-admin-auth-storage');
        window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials).then(res => res.data),
};

export const adminApi = {
  // Dashboard & Statistics
  getDashboardStats: () => api.get('/admin/dashboard/stats').then(res => res.data),
  getRevenueReport: () => api.get('/admin/reports/revenue').then(res => res.data),

  // Product Management
  getProducts: (params) => api.get('/admin/products', { params }).then(res => res.data),
  createProduct: (product) => api.post('/admin/products', product).then(res => res.data),
  updateProduct: (id, product) => api.put(`/admin/products/${id}`, product).then(res => res.data),
  deleteProduct: (id) => api.delete(`/admin/products/${id}`).then(res => res.data),

  // Category Management
  getCategories: () => api.get('/admin/categories').then(res => res.data),
  createCategory: (category) => api.post('/admin/categories', category).then(res => res.data),
  updateCategory: (id, category) => api.put(`/admin/categories/${id}`, category).then(res => res.data),
  deleteCategory: (id) => api.delete(`/admin/categories/${id}`).then(res => res.data),

  // Brand Management
  getBrands: () => api.get('/admin/brands').then(res => res.data),
  createBrand: (brand) => api.post('/admin/brands', brand).then(res => res.data),
  updateBrand: (id, brand) => api.put(`/admin/brands/${id}`, brand).then(res => res.data),
  deleteBrand: (id) => api.delete(`/admin/brands/${id}`).then(res => res.data),

  // Order Management
  getOrders: (params) => api.get('/admin/orders', { params }).then(res => res.data),
  getOrderById: (id) => api.get(`/admin/orders/${id}`).then(res => res.data),
  updateOrderStatus: (id, status, note) => {
    const params = new URLSearchParams();
    params.append('status', status);
    if (note) params.append('note', note);
    return api.patch(`/admin/orders/${id}/status?${params.toString()}`).then(res => res.data);
  },
  updateOrderPaymentStatus: (id, paymentStatus, note) => {
    const params = new URLSearchParams();
    params.append('paymentStatus', paymentStatus);
    if (note) params.append('note', note);
    return api.patch(`/admin/orders/${id}/payment?${params.toString()}`).then(res => res.data);
  },

  // Customer Management
  getUsers: (params) => api.get('/admin/users', { params }).then(res => res.data),
  updateUserStatus: (id, status) => {
    const params = new URLSearchParams();
    params.append('status', status);
    return api.patch(`/admin/users/${id}/status?${params.toString()}`).then(res => res.data);
  },

  // Voucher Management
  getVouchers: () => api.get('/admin/vouchers').then(res => res.data),
  createVoucher: (voucher) => api.post('/admin/vouchers', voucher).then(res => res.data),
  updateVoucher: (id, voucher) => api.put(`/admin/vouchers/${id}`, voucher).then(res => res.data),
  deleteVoucher: (id) => api.delete(`/admin/vouchers/${id}`).then(res => res.data),

  // Report Export
  exportRevenueExcel: () => api.get('/admin/reports/revenue/export/excel', { responseType: 'blob' }).then(res => res.data),
  exportRevenuePdf: () => api.get('/admin/reports/revenue/export/pdf', { responseType: 'blob' }).then(res => res.data),

  // Flash Sale Management
  getFlashSales: () => api.get('/admin/flash-sales').then(res => res.data),
  createFlashSale: (fs) => api.post('/admin/flash-sales', fs).then(res => res.data),
  updateFlashSale: (id, fs) => api.put(`/admin/flash-sales/${id}`, fs).then(res => res.data),
  deleteFlashSale: (id) => api.delete(`/admin/flash-sales/${id}`).then(res => res.data),
  getFlashSaleProducts: (id) => api.get(`/admin/flash-sales/${id}/products`).then(res => res.data),
  addProductToFlashSale: (id, data) => api.post(`/admin/flash-sales/${id}/products`, data).then(res => res.data),
  updateFlashSaleProduct: (id, fsProductId, data) => api.put(`/admin/flash-sales/${id}/products/${fsProductId}`, data).then(res => res.data),
  removeProductFromFlashSale: (id, fsProductId) => api.delete(`/admin/flash-sales/${id}/products/${fsProductId}`).then(res => res.data),

  // Review Management
  getReviews: (modelCode) => {
    let url = '/admin/reviews';
    if (modelCode) url += `?modelCode=${encodeURIComponent(modelCode)}`;
    return api.get(url).then(res => res.data);
  },
  toggleReviewStatus: (id) => api.patch(`/admin/reviews/${id}/status`).then(res => res.data),
};

export default api;
