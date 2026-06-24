import { create } from 'zustand'

const useUiStore = create((set) => ({
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
}))

export default useUiStore
