import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Product {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviewCount: number;
  image?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

interface CartStore {
  items: CartItem[];

  addItem: (product: Product) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;

  getTotalItems: () => number;
  getTotalPrice: () => number;
  getItemById: (productId: number) => CartItem | undefined;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        const items = get().items;
        const existingItem = items.find(item => item.id === product.id);

        if (existingItem) {
          set({
            items: items.map(item =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          set({
            items: [...items, { ...product, quantity: 1 }],
          });
        }
      },

      removeItem: (productId) => {
        set({
          items: get().items.filter(item => item.id !== productId),
        });
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        set({
          items: get().items.map(item =>
            item.id === productId
              ? { ...item, quantity }
              : item
          ),
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },

      getItemById: (productId) => {
        return get().items.find(item => item.id === productId);
      },
    }),
    {
      name: 'cart-storage', // localStorage key
      // Optional: Add items you don't want to persist
      // partialize: (state) => ({ items: state.items }),
    }
  )
);
