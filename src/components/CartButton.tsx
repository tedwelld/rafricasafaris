"use client";

import { Pi } from "@/components/Pi";
import { useCart } from "@/lib/cart-context";

export function CartButton({ onClick }: { onClick: () => void }) {
  const { count } = useCart();

  return (
    <button type="button" onClick={onClick} className="relative" aria-label="Shopping cart">
      <Pi name="pi-shopping-cart" className="text-xl text-foreground hover:text-gold-dark transition-colors" />
      {count > 0 && (
        <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-white">
          {count}
        </span>
      )}
    </button>
  );
}
