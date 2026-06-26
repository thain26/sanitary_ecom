import { create } from 'zustand';
import { wishlistApi } from '../../../services/api';
import { useAuthStore } from '../../auth/store/authStore';
import useUiStore from '../../../store/useUiStore';

const useWishlistStore = create((set, get) => ({
  wishlistItems: [], // Mảng chứa toàn bộ object Product
  wishlistIds: [],   // Mảng chứa ID của các Product (để check nhanh)
  loading: false,

  fetchWishlist: async () => {
    // Chỉ fetch nếu đã đăng nhập
    const isAuthenticated = useAuthStore.getState().isAuthenticated;
    if (!isAuthenticated) {
      set({ wishlistItems: [], wishlistIds: [], loading: false });
      return;
    }

    set({ loading: true });
    try {
      const data = await wishlistApi.getWishlist();
      const ids = data.map(item => item.id);
      set({ wishlistItems: data, wishlistIds: ids, loading: false });
    } catch (error) {
      console.error("Failed to fetch wishlist", error);
      set({ loading: false });
    }
  },

  toggleWishlist: async (productId) => {
    const isAuthenticated = useAuthStore.getState().isAuthenticated;
    if (!isAuthenticated) {
      useUiStore.getState().openLoginPrompt();
      return false;
    }

    try {
      // Optimistic update
      const currentIds = get().wishlistIds;
      const isCurrentlyWishlisted = currentIds.includes(productId);
      
      if (isCurrentlyWishlisted) {
        set({ wishlistIds: currentIds.filter(id => id !== productId) });
      } else {
        set({ wishlistIds: [...currentIds, productId] });
      }

      await wishlistApi.toggleWishlist(productId);
      
      // Fetch lại để đồng bộ chính xác object (nếu cần thiết cho WishlistTab)
      get().fetchWishlist();
      return true;
    } catch (error) {
      console.error("API Toggle Wishlist failed", error);
      // Revert if failed
      get().fetchWishlist();
      return false;
    }
  },
  
  clearWishlist: () => {
    set({ wishlistItems: [], wishlistIds: [] });
  }
}));

export default useWishlistStore;
