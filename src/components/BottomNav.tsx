"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Pi } from "@/components/Pi";
import { cn } from "@/lib/cn";

const items = [
  { label: "Home", href: "/", icon: "pi-home" },
  { label: "Explore", href: "/explore", icon: "pi-compass" },
  { label: "Gallery", href: "/gallery", icon: "pi-images" },
  { label: "About", href: "/about", icon: "pi-info-circle" },
  { label: "Blog", href: "/blog", icon: "pi-book" },
  { label: "Contact", href: "/contact", icon: "pi-envelope" },
];

export function BottomNav() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-4 bottom-2 z-40 rounded-2xl border border-line/50 bg-surface/95 px-2 py-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.12)] backdrop-blur-xl dark:bg-[#1a1814]/95 lg:hidden"
    >
      <div className="mx-auto grid max-w-md grid-cols-6 gap-1">
        {items.map((item) => {
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex min-h-12 flex-col items-center justify-center gap-1 rounded-md px-1 text-[0.68rem] font-medium text-ink-soft transition-colors hover:bg-muted hover:text-gold-dark",
                active && "bg-muted text-gold-dark",
              )}
            >
              <Pi name={item.icon} className="text-lg" />
              <span className="max-w-full truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
