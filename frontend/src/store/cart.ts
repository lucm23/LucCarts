// Zustand store (+persist) for cart state
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/lib/products';

export interface CartItem {
  product: Product;
  qty: number;
}

export interface Receipt {
  id: string;
  items: { id: string; name: string; qty: number; price: number }[];
  subtotal: number;
  tax: number;
  total: number;
  createdAt: string;
}

interface CartStore {
  items: CartItem[];
  add: (product: Product) => void;
  remove: (productId: string) => void;
  setQty: (productId: string, qty: number) => void;
  clear: () => void;
  totalCents: () => number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      add: (product: Product) => {
        set((state) => {
          const existingItem = state.items.find(item => item.product.id === product.id);
          if (existingItem) {
            return {
              items: state.items.map(item =>
                item.product.id === product.id
                  ? { ...item, qty: item.qty + 1 }
                  : item
              ),
            };
          } else {
            return {
              items: [...state.items, { product, qty: 1 }],
            };
          }
        });
      },
      
      remove: (productId: string) => {
        set((state) => ({
          items: state.items.filter(item => item.product.id !== productId),
        }));
      },
      
      setQty: (productId: string, qty: number) => {
        if (qty < 1) return;
        set((state) => ({
          items: state.items.map(item =>
            item.product.id === productId
              ? { ...item, qty }
              : item
          ),
        }));
      },
      
      clear: () => {
        set({ items: [] });
      },
      
      totalCents: () => {
        const { items } = get();
        return items.reduce((total, item) => total + (item.product.price * item.qty), 0);
      },
    }),
    {
      name: 'mini-shop-cart',
    }
  )
);
