"use client";

import { createContext, useContext, useState, useCallback, useMemo } from "react";

export type CartItem = {
  id: string;
  productId: number;
  title: string;
  imageUrl?: string;
  date: string;
  startTime: string;
  participants: Record<number, number>;
  pricingCategories: { id: number; title: string }[];
  totalPrice: number;
  currency: string;
};

type CartContext = {
  items: CartItem[];
  count: number;
  totalPrice: number;
  add: (item: CartItem) => void;
  remove: (id: string) => void;
  clear: () => void;
};

const Ctx = createContext<CartContext>({
  items: [],
  count: 0,
  totalPrice: 0,
  add: () => {},
  remove: () => {},
  clear: () => {},
});

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const add = useCallback((item: CartItem) => {
    setItems((prev) => [...prev, item]);
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const clear = useCallback(() => {
    setItems([]);
  }, []);

  const value = useMemo(
    () => ({
      items,
      count: items.length,
      totalPrice: items.reduce((s, i) => s + i.totalPrice, 0),
      add,
      remove,
      clear,
    }),
    [items, add, remove, clear],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  return useContext(Ctx);
}
