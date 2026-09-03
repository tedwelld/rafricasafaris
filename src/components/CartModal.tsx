"use client";

import Link from "next/link";
import { createPortal } from "react-dom";
import { Pi } from "@/components/Pi";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/lib/cart-context";

type Props = {
  open: boolean;
  onClose: () => void;
  onCheckout?: () => void;
};

export function CartModal({ open, onClose, onCheckout }: Props) {
  const { items, count, totalPrice, remove } = useCart();

  if (!open) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center bg-black/80 px-4 pt-24 pb-8 overflow-y-auto" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="w-full max-w-lg rounded-3xl border border-line bg-surface p-6 shadow-2xl sm:p-8 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">
            {count === 0 ? "Cart is empty" : `Shopping cart (${count})`}
          </h2>
          <button type="button" onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full text-ink-soft hover:bg-muted hover:text-foreground transition-colors">
            <Pi name="pi-times" className="text-lg" />
          </button>
        </div>

        {count === 0 ? (
          <div className="mt-6 text-center">
            <Pi name="pi-shopping-cart" className="mx-auto text-4xl text-ink-soft" />
            <p className="mt-3 text-sm text-ink-soft">No items in your cart yet.</p>
            <Link href="/explore?view=tours" className="mt-4 inline-block text-sm font-medium text-gold-dark hover:underline" onClick={onClose}>
              Browse tours
            </Link>
          </div>
        ) : (
          <>
            <div className="mt-4 space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 rounded-xl border border-line bg-muted p-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{item.title}</p>
                    <p className="text-xs text-ink-soft">{item.date}{item.startTime ? ` · ${item.startTime}` : ""}</p>
                    <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-ink-soft">
                      {Object.entries(item.participants).filter(([, c]) => c > 0).map(([catId, count]) => {
                        const cat = item.pricingCategories.find((c) => c.id === Number(catId));
                        return <span key={catId}>{count}× {cat?.title ?? catId}</span>;
                      })}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-semibold text-gold-dark">{item.totalPrice} {item.currency}</p>
                  </div>
                  <button type="button" onClick={() => remove(item.id)} className="shrink-0 text-ink-soft hover:text-red-600 transition-colors">
                    <Pi name="pi-trash" className="text-sm" />
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-6 border-t border-line pt-4">
              <div className="flex items-center justify-between text-lg font-semibold">
                <span className="text-foreground">Total</span>
                <span className="text-gold-dark">{totalPrice} {items[0]?.currency ?? "USD"}</span>
              </div>
              <div className="mt-4 flex flex-col gap-3">
                {onCheckout && (
                  <Button className="w-full" onClick={onCheckout}>
                    Proceed to checkout
                  </Button>
                )}
                <Button variant="secondary" className="w-full" onClick={onClose}>
                  Continue shopping
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );

  if (typeof document === "undefined") return null;
  return createPortal(modalContent, document.body);
}
