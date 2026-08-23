"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  sku: string;
  name: string;
  category: string;
  unitPrice: number;
  qty: number;
  imageUrl?: string | null;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "qty">, qty?: number) => void;
  setQty: (sku: string, qty: number) => void;
  removeItem: (sku: string) => void;
  clear: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item, qty = 1) =>
        set((state) => {
          const existing = state.items.find((i) => i.sku === item.sku);
          if (existing) {
            return {
              items: state.items.map((i) => (i.sku === item.sku ? { ...i, qty: i.qty + qty } : i)),
            };
          }
          return { items: [...state.items, { ...item, qty }] };
        }),
      setQty: (sku, qty) =>
        set((state) => ({
          items: qty <= 0 ? state.items.filter((i) => i.sku !== sku) : state.items.map((i) => (i.sku === sku ? { ...i, qty } : i)),
        })),
      removeItem: (sku) => set((state) => ({ items: state.items.filter((i) => i.sku !== sku) })),
      clear: () => set({ items: [] }),
    }),
    {
      // Bump this suffix if the persisted shape ever changes, so stale carts don't break the app.
      name: "cutmax_cart_v1",
    },
  ),
);

export function cartTotals(items: CartItem[]) {
  const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.qty, 0);
  return { subtotal, count: items.reduce((sum, i) => sum + i.qty, 0) };
}
