"use client";

import { useState, useEffect } from "react";
import { Pi } from "@/components/Pi";

type Props = {
  productId?: number;
  fallbackCount?: number;
};

export function BookingBadge({ productId, fallbackCount }: Props) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    if (!productId) return;
    fetch("/api/bokun/stats")
      .then((r) => r.json())
      .then((data: { id: number; reviewCount: number }[]) => {
        const stat = data.find((s) => s.id === productId);
        if (stat) setCount(stat.reviewCount);
      })
      .catch(() => {});
  }, [productId]);

  const display = count ?? fallbackCount;
  if (!display) return null;

  return (
    <span className="inline-flex items-center gap-1 text-sm text-ink-soft">
      <Pi name="pi-heart-fill" className="text-base text-gold-dark" /> {display} booked
    </span>
  );
}
