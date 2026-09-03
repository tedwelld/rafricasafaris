"use client";

import { useState } from "react";
import { Pi } from "@/components/Pi";
import { cn } from "@/lib/cn";

export function WishlistButton({ className }: { className?: string }) {
  const [saved, setSaved] = useState(false);
  return (
    <button
      type="button"
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSaved((p) => !p); }}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-full transition-all hover:scale-110 active:scale-90",
        className,
      )}
      aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
    >
      <Pi
        name={saved ? "pi-heart-fill" : "pi-heart"}
        className={cn(
          "text-lg drop-shadow-sm transition-colors",
          saved ? "text-rose-500" : "text-white",
        )}
      />
    </button>
  );
}
