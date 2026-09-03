"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

/**
 * Fades + rises its children into view when scrolled to (IntersectionObserver).
 * Inspired by the subtle scroll reveals on immersive safari sites. Pass `delay`
 * (ms) to stagger items in a grid. Respects prefers-reduced-motion via CSS.
 *
 * Toggles the `.is-visible` class imperatively (no React state) so there's no
 * extra re-render.
 */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("is-visible");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          el.classList.add("is-visible");
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn("reveal", className)}
      style={delay ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
