"use client";

import { useState, FormEvent } from "react";
import { Pi } from "@/components/Pi";
import { cn } from "@/lib/cn";

export function NewsletterSignup({ className, variant = "inline" }: { className?: string; variant?: "inline" | "cta" }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("idle");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className={cn(className)}>
      <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">
        Field updates
      </h4>
      <p className={cn("mt-2 text-sm text-ink-soft", variant === "cta" && "text-ink-soft")}>
        Occasional trip notes, dates and offers from Rise Africa — no spam.
      </p>
      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <input
          type="email"
          required
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={cn(
            "min-w-0 flex-1 rounded-full border px-4 py-2 text-sm focus:outline-none focus:ring-1",
            variant === "cta"
              ? "border-line bg-surface text-foreground placeholder:text-ink-soft/60 focus:border-gold focus:ring-gold"
              : "border-line bg-surface text-foreground placeholder:text-ink-soft/60 focus:border-gold focus:ring-gold",
          )}
        />
        <button
          type="submit"
          className={cn(
            "flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors",
            "bg-gold text-white hover:bg-gold-dark",
          )}
        >
          <Pi name="pi-send" className="text-xs" />
          {variant === "cta" ? "Subscribe" : "Join"}
        </button>
      </form>
      {status === "success" && (
        <p className="mt-2 text-xs text-green-600">Thanks! You&rsquo;re subscribed.</p>
      )}
      {status === "error" && (
        <p className="mt-2 text-xs text-red-500">Something went wrong. Try again.</p>
      )}
    </div>
  );
}
