import { create } from 'zustand';

const useUiStore = create((set) => ({
  loginPromptOpen: false,
  
  openLoginPrompt: () => set({ loginPromptOpen: true }),
  closeLoginPrompt: () => set({ loginPromptOpen: false }),
}));

export default useUiStore;
