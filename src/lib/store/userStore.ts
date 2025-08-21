import userRequests from '@/app/apis/requests/user';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Product = {
  broadBandData: number;
  mobileData: number;
  packageType: string;
};

type User = {
  totalOrders: number;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  product: Product;
};

interface UserStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  clearUser: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  fetchUser: () => Promise<void>;
}

const useUserStore = create<UserStore>()(
  persist(
    set => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      setUser: user =>
        set({
          user,
          isAuthenticated: !!user,
          error: null,
        }),
      clearUser: () =>
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        }),
      setLoading: isLoading => set({ isLoading }),
      setError: error => set({ error }),
      fetchUser: async () => {
        set({ isLoading: true, error: null });
        try {
          const userData = await userRequests.getMe();
          set({
            user: userData,
            isAuthenticated: !!userData,
            isLoading: false,
            error: null,
          });
        } catch (err: any) {
          set({
            error: err?.message || 'Failed to fetch user',
            isLoading: false,
          });
        }
      },
    }),
    {
      name: 'user-storage',
      partialize: state => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useUserStore;
