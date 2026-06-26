import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '../../../services/api';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      login: async (credentials) => {
        set({ loading: true, error: null });
        try {
          const data = await authApi.login(credentials);
          
          // Verify if user has ADMIN role
          const role = data.role;
          if (role !== 'ADMIN' && role !== 'ROLE_ADMIN') {
            throw new Error('Bạn không có quyền truy cập trang quản trị');
          }

          set({
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            user: {
              id: data.id,
              email: data.email,
              fullName: data.fullName,
              phone: data.phone,
              avatarUrl: data.avatarUrl,
              role: role,
            },
            isAuthenticated: true,
            loading: false,
          });
          return data;
        } catch (err) {
          const errMsg = err.response?.data?.message || err.message || 'Đăng nhập thất bại';
          set({ error: errMsg, loading: false });
          throw new Error(errMsg);
        }
      },

      logout: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          error: null,
        });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'sanitary-admin-auth-storage',
    }
  )
);
