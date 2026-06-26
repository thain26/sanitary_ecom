import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi, userApi } from '../../../services/api';

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
          set({
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            user: {
              id: data.id,
              email: data.email,
              fullName: data.fullName,
              phone: data.phone,
              avatarUrl: data.avatarUrl,
              role: data.role,
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

      register: async (userData) => {
        set({ loading: true, error: null });
        try {
          const data = await authApi.register(userData);
          set({
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            user: {
              id: data.id,
              email: data.email,
              fullName: data.fullName,
              phone: data.phone,
              avatarUrl: data.avatarUrl,
              role: data.role,
            },
            isAuthenticated: true,
            loading: false,
          });
          return data;
        } catch (err) {
          const errMsg = err.response?.data?.message || err.message || 'Đăng ký thất bại';
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

      updateProfile: async (profileData) => {
        set({ loading: true, error: null });
        try {
          const updatedUser = await userApi.updateProfile(profileData);
          set({
            user: {
              id: updatedUser.id,
              email: updatedUser.email,
              fullName: updatedUser.fullName,
              phone: updatedUser.phone,
              avatarUrl: updatedUser.avatarUrl,
              role: updatedUser.role,
            },
            loading: false,
          });
          return updatedUser;
        } catch (err) {
          const errMsg = err.response?.data?.message || err.message || 'Cập nhật thông tin thất bại';
          set({ error: errMsg, loading: false });
          throw new Error(errMsg);
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'sanitary-auth-storage',
    }
  )
);
