"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Pi } from "@/components/Pi";
import { Button } from "@/components/ui/Button";
import { activities } from "@/content/activities";
import { cn } from "@/lib/cn";
import {
  buildMailtoUrlFromCompose,
  buildWhatsappUrlFromCompose,
  type BookingDetails,
  type ContactIntent,
} from "@/lib/templates";

export type ContactChannel = "whatsapp" | "email";

const INTENTS: { id: ContactIntent; label: string; hint: string; icon: string }[] = [
  {
    id: "enquiry",
    label: "Enquiry",
    hint: "Ask about dates, prices or trip ideas",
    icon: "pi-comments",
  },
  {
    id: "booking",
    label: "Booking",
    hint: "Ready to reserve an experience",
    icon: "pi-calendar",
  },
  {
    id: "other",
    label: "Other",
    hint: "Something else — tell us below",
    icon: "pi-ellipsis-h",
  },
];

export function ContactIntentModal({
  open,
  onClose,
  channel,
  details,
}: {
  open: boolean;
  onClose: () => void;
  channel: ContactChannel;
  details?: BookingDetails;
}) {
  const [intent, setIntent] = useState<ContactIntent>("enquiry");
  const [selected, setSelected] = useState<string[]>([]);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!open) return;
    setIntent(details?.tourName ? "booking" : "enquiry");
    setSelected([]);
    setNotes(details?.message ?? "");
  }, [open, details?.tourName, details?.message]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  const needsActivities = intent === "enquiry" || intent === "booking";
  const canSend = !needsActivities || selected.length > 0;

  const toggleActivity = (name: string) => {
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name],
    );
  };

  const send = () => {
    if (!canSend) return;
    const compose = {
      intent,
      activities: needsActivities ? selected : [],
      notes: notes.trim() || undefined,
      details,
    };
    const url =
      channel === "whatsapp"
        ? buildWhatsappUrlFromCompose(compose)
        : buildMailtoUrlFromCompose(compose);
    window.open(url, "_blank", "noopener,noreferrer");
    onClose();
  };

  const title =
    channel === "whatsapp" ? "Message us on WhatsApp" : "Email Rise Africa";
  const sendLabel = channel === "whatsapp" ? "Open WhatsApp" : "Open email";

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-end justify-center bg-black/60 p-4 sm:items-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-intent-title"
        className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-line bg-surface shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <div className="flex items-center gap-3">
            <span
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full text-white",
                channel === "whatsapp" ? "bg-[#25D366]" : "bg-gold",
              )}
            >
              <Pi
                name={channel === "whatsapp" ? "pi-whatsapp" : "pi-envelope"}
                className="text-lg"
              />
            </span>
            <div>
              <h2 id="contact-intent-title" className="text-lg font-semibold text-foreground">
                {title}
              </h2>
              <p className="text-xs text-ink-soft">Choose why you&apos;re writing, then send.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink-soft hover:bg-muted hover:text-foreground"
            aria-label="Close"
          >
            <Pi name="pi-times" className="text-lg" />
          </button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-soft">
              I want to…
            </p>
            <div className="grid gap-2 sm:grid-cols-3">
              {INTENTS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setIntent(item.id)}
                  className={cn(
                    "rounded-2xl border px-3 py-3 text-left transition-colors",
                    intent === item.id
                      ? "border-gold bg-gold/10 text-foreground"
                      : "border-line bg-surface text-ink-soft hover:border-gold/40",
                  )}
                >
                  <Pi name={item.icon} className="text-lg text-gold-dark" />
                  <p className="mt-2 text-sm font-semibold text-foreground">{item.label}</p>
                  <p className="mt-1 text-[11px] leading-snug text-ink-soft">{item.hint}</p>
                </button>
              ))}
            </div>
          </div>

          {needsActivities && (
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-ink-soft">
                Activities of interest
              </p>
              <p className="mb-3 text-xs text-ink-soft">Select one or more experiences.</p>
              {details?.tourName && (
                <p className="mb-3 rounded-xl bg-muted px-3 py-2 text-xs text-ink-soft">
                  Related tour: <span className="font-medium text-foreground">{details.tourName}</span>
                </p>
              )}
              <div className="grid max-h-48 grid-cols-2 gap-2 overflow-y-auto sm:grid-cols-3">
                {activities.map((a) => {
                  const on = selected.includes(a.name);
                  return (
                    <button
                      key={a.slug}
                      type="button"
                      onClick={() => toggleActivity(a.name)}
                      className={cn(
                        "rounded-xl border px-2.5 py-2 text-left text-xs font-medium transition-colors",
                        on
                          ? "border-gold bg-gold text-white"
                          : "border-line bg-cream text-foreground hover:border-gold/50",
                      )}
                    >
                      {a.name}
                    </button>
                  );
                })}
              </div>
              {!canSend && (
                <p className="mt-2 text-xs text-red-600">Pick at least one activity to continue.</p>
              )}
            </div>
          )}

          <div>
            <label htmlFor="contact-notes" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-ink-soft">
              {intent === "other" ? "Your message" : "Extra notes (optional)"}
            </label>
            <textarea
              id="contact-notes"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={
                intent === "other"
                  ? "Tell us how we can help…"
                  : "Dates, group size, or anything else…"
              }
              className="w-full rounded-2xl border border-line bg-cream px-4 py-3 text-sm text-foreground outline-none placeholder:text-ink-soft/60 focus:border-gold focus:ring-2 focus:ring-gold/20"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3 border-t border-line px-5 py-4">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            variant={channel === "whatsapp" ? "whatsapp" : "primary"}
            onClick={send}
            disabled={!canSend}
          >
            <Pi
              name={channel === "whatsapp" ? "pi-whatsapp" : "pi-send"}
              className="text-base"
            />
            {sendLabel}
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
