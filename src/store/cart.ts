import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItemType } from "@/types";

interface CartState {
  items: CartItemType[];
  addItem: (item: CartItemType) => void;
  removeItem: (id: string) => void;
  removeSelectedItems: (ids: string[]) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.productId === item.productId);
          const max = item.stockQuantity ?? existing?.stockQuantity ?? null;
          if (existing) {
            const nextQty =
              max != null
                ? Math.min(existing.quantity + item.quantity, Math.max(max, 1))
                : existing.quantity + item.quantity;
            return {
              items: state.items.map((i) =>
                i.productId === item.productId
                  ? {
                      ...i,
                      quantity: nextQty,
                      stockQuantity: max ?? i.stockQuantity,
                    }
                  : i
              ),
            };
          }
          const clampedQty =
            max != null ? Math.min(item.quantity, Math.max(max, 1)) : item.quantity;
          if (max != null && max <= 0) return state;
          return { items: [...state.items, { ...item, quantity: clampedQty }] };
        }),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),

      removeSelectedItems: (ids) =>
        set((state) => ({
          items: state.items.filter((item) => !ids.includes(item.id)),
        })),

      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((i) => {
            if (i.id !== id) return i;
            const max = i.stockQuantity ?? null;
            const clamped =
              max != null
                ? Math.min(Math.max(1, quantity), Math.max(max, 1))
                : Math.max(1, quantity);
            return { ...i, quantity: clamped };
          }),
        })),

      clearCart: () => set({ items: [] }),

      getTotal: () => {
        const state = get();
        return state.items.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      getItemCount: () => {
        const state = get();
        return state.items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: "jewelry-cart",
    }
  )
);
