import { create } from 'zustand';
import { cartApi } from '../../../services/api';

// Tạo session ID đơn giản cho guest nếu chưa có
const getSessionId = () => {
  let sessionId = localStorage.getItem('guest_session_id');
  if (!sessionId) {
    // Tạo UUID v4 đơn giản
    sessionId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
    localStorage.setItem('guest_session_id', sessionId);
  }
  return sessionId;
};

const useCartStore = create((set, get) => ({
  cart: { items: [] },
  loading: false,
  sessionId: getSessionId(),

  fetchCart: async () => {
    set({ loading: true });
    try {
      const data = await cartApi.getCart(get().sessionId);
      set({ cart: data, loading: false });
    } catch (error) {
      console.error("Failed to fetch cart", error);
      // Fallback cho FE test
      set({ loading: false });
    }
  },

  addToCart: async (productId, quantity = 1, productMock = null) => {
    try {
      // Gọi API thực tế
      const data = await cartApi.addToCart(get().sessionId, productId, quantity);
      set({ cart: data });
    } catch (error) {
      console.warn("API Add to Cart failed, using local mock");
      // Fallback khi BE chưa chạy: thêm vào local state
      const currentCart = get().cart;
      const existingItemIndex = currentCart.items.findIndex(item => item.product?.id === productId || item.productId === productId);
      
      let newItems = [...currentCart.items];
      if (existingItemIndex >= 0) {
        newItems[existingItemIndex].quantity += quantity;
      } else {
        newItems.push({
          id: Date.now(),
          productId: productId,
          product: productMock || { id: productId, name: 'Sản phẩm ' + productId, basePrice: 1000000 },
          quantity: quantity
        });
      }
      set({ cart: { ...currentCart, items: newItems } });
    }
  },

  updateQuantity: async (productId, quantity) => {
    try {
      const data = await cartApi.updateCartItem(get().sessionId, productId, quantity);
      set({ cart: data });
    } catch (error) {
       console.warn("API Update Cart failed, using local mock");
       const currentCart = get().cart;
       const newItems = currentCart.items.map(item => {
           if(item.product?.id === productId || item.productId === productId) {
               return {...item, quantity};
           }
           return item;
       }).filter(item => item.quantity > 0);
       set({ cart: { ...currentCart, items: newItems } });
    }
  },

  removeFromCart: async (productId) => {
    try {
      const data = await cartApi.removeFromCart(get().sessionId, productId);
      set({ cart: data });
    } catch (error) {
      console.warn("API Remove Cart failed, using local mock");
      const currentCart = get().cart;
      const newItems = currentCart.items.filter(item => item.product?.id !== productId && item.productId !== productId);
      set({ cart: { ...currentCart, items: newItems } });
    }
  },
  
  clearCart: () => {
    set({ cart: { items: [] } });
  },

  getCartCount: () => {
    const cart = get().cart;
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((count, item) => count + item.quantity, 0);
  },

  getCartTotal: () => {
    const cart = get().cart;
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total, item) => {
      const price = item.product?.salePrice ?? item.product?.basePrice ?? 0;
      return total + price * item.quantity;
    }, 0);
  }
}));

export default useCartStore;
