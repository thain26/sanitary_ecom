import { create } from 'zustand';

const useToastStore = create((set) => ({
  message: '',
  isVisible: false,
  type: 'success', // 'success', 'error', 'info'
  showToast: (msg, type = 'success') => {
    set({ message: msg, isVisible: true, type });
    // Auto hide after 3 seconds
    setTimeout(() => {
      set(state => {
        if (state.message === msg) {
          return { isVisible: false };
        }
        return state;
      });
    }, 3000);
  },
  hideToast: () => set({ isVisible: false })
}));

export default useToastStore;
