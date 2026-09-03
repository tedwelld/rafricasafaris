"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/Logo";
import { siteConfig } from "@/lib/siteConfig";
import { Container } from "@/components/ui/Container";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CartButton } from "@/components/CartButton";
import { CartModal } from "@/components/CartModal";
import { cn } from "@/lib/cn";

export function Header() {
  const pathname = usePathname();
  const [cartOpen, setCartOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface">
      <Container className="flex h-20 items-center justify-between gap-4 lg:grid lg:grid-cols-[1fr_auto_1fr]">
        {/* Left: nav (desktop only) */}
        <nav className="hidden items-center gap-7 lg:flex">
          {siteConfig.navLeft.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative text-sm font-medium text-foreground transition-colors hover:text-gold-dark",
                isActive(item.href) &&
                  "text-gold-dark after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:w-full after:bg-gold",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Center: logo */}
        <Link href="/" className="flex justify-start lg:justify-center">
          <Logo className="h-10 lg:h-14" />
        </Link>

        {/* Right: nav (desktop) + cart + theme */}
        <div className="flex items-center justify-end gap-5">
          <nav className="hidden items-center gap-7 lg:flex">
            {siteConfig.navRight.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative text-sm font-medium text-foreground transition-colors hover:text-gold-dark",
                  isActive(item.href) &&
                    "text-gold-dark after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:w-full after:bg-gold",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <CartButton onClick={() => setCartOpen(true)} />
          <ThemeToggle />
        </div>
      </Container>

      <CartModal open={cartOpen} onClose={() => setCartOpen(false)} />
    </header>
  );
}
