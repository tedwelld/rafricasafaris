"use client";

import { useEffect, useMemo, useState } from "react";
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

type Step = "intent" | "activities" | "details" | "other";

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

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function toIso(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function PaxStepper({
  label,
  value,
  min = 0,
  onChange,
}: {
  label: string;
  value: number;
  min?: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-line bg-cream px-4 py-3">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label={`Decrease ${label}`}
          disabled={value <= min}
          onClick={() => onChange(Math.max(min, value - 1))}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-surface text-foreground transition-colors hover:border-gold disabled:opacity-40"
        >
          <Pi name="pi-minus" className="text-xs" />
        </button>
        <span className="w-6 text-center text-base font-semibold text-foreground">{value}</span>
        <button
          type="button"
          aria-label={`Increase ${label}`}
          onClick={() => onChange(value + 1)}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-surface text-foreground transition-colors hover:border-gold"
        >
          <Pi name="pi-plus" className="text-xs" />
        </button>
      </div>
    </div>
  );
}

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
  const [step, setStep] = useState<Step>("intent");
  const [intent, setIntent] = useState<ContactIntent>("enquiry");
  const [selected, setSelected] = useState<string[]>([]);
  const [travelDate, setTravelDate] = useState("");
  const [travelEndDate, setTravelEndDate] = useState("");
  const [pickingEnd, setPickingEnd] = useState(false);
  const [calOffset, setCalOffset] = useState(0);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [notes, setNotes] = useState("");

  const todayIso = useMemo(() => {
    const t = new Date();
    return toIso(t.getFullYear(), t.getMonth(), t.getDate());
  }, []);

  const calDate = useMemo(() => {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() + calOffset);
    return d;
  }, [calOffset]);

  const calYear = calDate.getFullYear();
  const calMonth = calDate.getMonth();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const startDay = new Date(calYear, calMonth, 1).getDay();

  useEffect(() => {
    if (!open) return;
    setStep("intent");
    setIntent(details?.tourName ? "booking" : "enquiry");
    setSelected([]);
    setTravelDate("");
    setTravelEndDate("");
    setPickingEnd(false);
    setCalOffset(0);
    setAdults(2);
    setChildren(0);
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

  const totalPax = adults + children;
  const needsTripFlow = intent === "enquiry" || intent === "booking";
  const canContinueActivities = selected.length > 0;
  const canSendDetails = !!travelDate && totalPax >= 1;
  const canSendOther = notes.trim().length > 0;

  const toggleActivity = (name: string) => {
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name],
    );
  };

  const pickDate = (iso: string) => {
    if (!pickingEnd || !travelDate) {
      setTravelDate(iso);
      setTravelEndDate("");
      setPickingEnd(true);
      return;
    }
    if (iso < travelDate) {
      setTravelDate(iso);
      setTravelEndDate("");
      return;
    }
    setTravelEndDate(iso);
    setPickingEnd(false);
  };

  const clearDates = () => {
    setTravelDate("");
    setTravelEndDate("");
    setPickingEnd(false);
  };

  const send = () => {
    if (needsTripFlow && (!canContinueActivities || !canSendDetails)) return;
    if (intent === "other" && !canSendOther) return;

    const compose = {
      intent,
      activities: needsTripFlow ? selected : [],
      travelDate: needsTripFlow ? travelDate : undefined,
      travelEndDate: needsTripFlow && travelEndDate ? travelEndDate : undefined,
      pax: needsTripFlow ? { adults, children } : undefined,
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

  const chooseIntent = (next: ContactIntent) => {
    setIntent(next);
    if (next === "other") setStep("other");
    else setStep("activities");
  };

  const title =
    channel === "whatsapp" ? "Message us on WhatsApp" : "Email Rise Africa";
  const sendLabel = channel === "whatsapp" ? "Open WhatsApp" : "Open email";

  const stepLabel =
    step === "intent"
      ? "Step 1 of 3"
      : step === "activities"
        ? "Step 2 of 3"
        : step === "details"
          ? "Step 3 of 3"
          : "Message";

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
              <p className="text-xs text-ink-soft">{stepLabel}</p>
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
          {step === "intent" && (
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-soft">
                I want to…
              </p>
              <div className="grid gap-2 sm:grid-cols-3">
                {INTENTS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => chooseIntent(item.id)}
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
          )}

          {step === "activities" && (
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-ink-soft">
                Activities of interest
              </p>
              <p className="mb-3 text-xs text-ink-soft">Select one or more experiences.</p>
              {details?.tourName && (
                <p className="mb-3 rounded-xl bg-muted px-3 py-2 text-xs text-ink-soft">
                  Related tour:{" "}
                  <span className="font-medium text-foreground">{details.tourName}</span>
                </p>
              )}
              <div className="grid max-h-64 grid-cols-2 gap-2 overflow-y-auto sm:grid-cols-3">
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
              {!canContinueActivities && (
                <p className="mt-2 text-xs text-red-600">Pick at least one activity to continue.</p>
              )}
            </div>
          )}

          {step === "details" && (
            <div className="space-y-6">
              <div>
                <div className="mb-2 flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink-soft">
                    Preferred dates
                  </p>
                  {(travelDate || travelEndDate) && (
                    <button
                      type="button"
                      onClick={clearDates}
                      className="text-xs font-medium text-gold-dark hover:underline"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <p className="mb-3 text-xs text-ink-soft">
                  Tap a start date, then optionally an end date for multi-day trips.
                </p>
                <div className="rounded-2xl border border-line bg-cream p-3">
                  <div className="mb-3 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setCalOffset((o) => o - 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-surface text-ink-soft hover:bg-muted"
                      aria-label="Previous month"
                    >
                      <Pi name="pi-chevron-left" className="text-xs" />
                    </button>
                    <span className="text-sm font-semibold text-foreground">
                      {MONTHS[calMonth]} {calYear}
                    </span>
                    <button
                      type="button"
                      onClick={() => setCalOffset((o) => o + 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-surface text-ink-soft hover:bg-muted"
                      aria-label="Next month"
                    >
                      <Pi name="pi-chevron-right" className="text-xs" />
                    </button>
                  </div>
                  <div className="mb-1 grid grid-cols-7 text-center text-[11px] font-medium uppercase tracking-wider text-ink-soft">
                    {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
                      <div key={d} className="py-1">
                        {d}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 text-center text-sm">
                    {Array.from({ length: startDay }).map((_, i) => (
                      <div key={`e${i}`} />
                    ))}
                    {Array.from({ length: daysInMonth }, (_, i) => {
                      const day = i + 1;
                      const iso = toIso(calYear, calMonth, day);
                      const isPast = iso < todayIso;
                      const isStart = iso === travelDate;
                      const isEnd = iso === travelEndDate;
                      const inRange =
                        !!travelDate &&
                        !!travelEndDate &&
                        iso >= travelDate &&
                        iso <= travelEndDate;
                      return (
                        <button
                          key={day}
                          type="button"
                          disabled={isPast}
                          onClick={() => pickDate(iso)}
                          className={cn(
                            "relative flex h-9 w-full items-center justify-center rounded-lg text-sm transition-all",
                            isPast && "cursor-not-allowed opacity-25",
                            !isPast && !isStart && !isEnd && !inRange && "text-foreground hover:bg-muted",
                            inRange && !isStart && !isEnd && "bg-gold/15 text-foreground",
                            (isStart || isEnd) && "bg-gold font-semibold text-white",
                          )}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <p className="mt-2 text-xs text-ink-soft">
                  {travelDate
                    ? travelEndDate
                      ? `Selected: ${travelDate} → ${travelEndDate}`
                      : `Start: ${travelDate}${pickingEnd ? " — tap an end date (optional)" : ""}`
                    : "No date selected yet"}
                </p>
              </div>

              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-soft">
                  Number of pax
                </p>
                <div className="space-y-2">
                  <PaxStepper label="Adults" value={adults} min={1} onChange={setAdults} />
                  <PaxStepper label="Children" value={children} min={0} onChange={setChildren} />
                </div>
                <p className="mt-2 text-xs text-ink-soft">
                  Total: <span className="font-medium text-foreground">{totalPax}</span> traveller
                  {totalPax === 1 ? "" : "s"}
                </p>
              </div>

              <div>
                <label
                  htmlFor="contact-notes"
                  className="mb-2 block text-xs font-semibold uppercase tracking-wider text-ink-soft"
                >
                  Extra notes (optional)
                </label>
                <textarea
                  id="contact-notes"
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Special requests, pickup point, etc."
                  className="w-full rounded-2xl border border-line bg-cream px-4 py-3 text-sm text-foreground outline-none placeholder:text-ink-soft/60 focus:border-gold focus:ring-2 focus:ring-gold/20"
                />
              </div>
            </div>
          )}

          {step === "other" && (
            <div>
              <label
                htmlFor="contact-other"
                className="mb-2 block text-xs font-semibold uppercase tracking-wider text-ink-soft"
              >
                Your message
              </label>
              <textarea
                id="contact-other"
                rows={5}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Tell us how we can help…"
                className="w-full rounded-2xl border border-line bg-cream px-4 py-3 text-sm text-foreground outline-none placeholder:text-ink-soft/60 focus:border-gold focus:ring-2 focus:ring-gold/20"
              />
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-5 py-4">
          <div>
            {step !== "intent" && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  if (step === "activities" || step === "other") setStep("intent");
                  if (step === "details") setStep("activities");
                }}
              >
                <Pi name="pi-arrow-left" className="text-sm" /> Back
              </Button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            {step === "activities" && (
              <Button
                type="button"
                variant="primary"
                disabled={!canContinueActivities}
                onClick={() => setStep("details")}
              >
                Continue <Pi name="pi-arrow-right" className="text-sm" />
              </Button>
            )}
            {(step === "details" || step === "other") && (
              <Button
                type="button"
                variant={channel === "whatsapp" ? "whatsapp" : "primary"}
                onClick={send}
                disabled={step === "other" ? !canSendOther : !canSendDetails}
              >
                <Pi
                  name={channel === "whatsapp" ? "pi-whatsapp" : "pi-send"}
                  className="text-base"
                />
                {sendLabel}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
