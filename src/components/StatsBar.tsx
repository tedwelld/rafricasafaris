"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

type Stat = { value: string; label: string; prefix?: string };

const stats: Stat[] = [
  { value: "1200", label: "Happy Travelers", prefix: "+" },
  { value: "4.9", label: "Average Rating", prefix: "" },
  { value: "15", label: "Years Experience", prefix: "+" },
  { value: "98", label: "Would Recommend", prefix: "" },
];

function AnimatedNumber({ target, suffix }: { target: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!ref.current || started.current) return;
    started.current = true;
    const el = ref.current;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const duration = 2000;
          const start = performance.now();
          const animate = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [target]);

  return (
    <span ref={ref}>
      {display}{suffix}
    </span>
  );
}

export function StatsBar() {
  return (
    <section className="border-y border-line bg-muted">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 py-12 sm:grid-cols-4">
        {stats.map((s) => {
          const num = parseFloat(s.value);
          const suffix = s.prefix ?? "";
          return (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-bold text-gold-dark sm:text-4xl">
                {!isNaN(num) ? (
                  <AnimatedNumber target={num} suffix={s.prefix === "+" ? "+" : ""} />
                ) : (
                  s.value
                )}
                {!s.prefix && <span className="text-gold-dark">%</span>}
              </p>
              <p className="mt-1 text-sm text-ink-soft">{s.label}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
