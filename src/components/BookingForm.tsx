"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { Pi } from "@/components/Pi";
import { bookingSchema, type BookingInput } from "@/lib/bookingSchema";
import { Button } from "@/components/ui/Button";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { cn } from "@/lib/cn";

type Status = "idle" | "submitting" | "success" | "error";

function guestLabel(adults: number, children: number) {
  const parts: string[] = [];
  if (adults > 0) parts.push(`${adults} Adult${adults !== 1 ? "s" : ""}`);
  if (children > 0) parts.push(`${children} Child${children !== 1 ? "ren" : ""}`);
  return parts.join(", ") || "—";
}

/** Email booking flow form. Posts to /api/booking which emails Rise Africa + auto-replies. */
export function BookingForm({ tourName }: { tourName?: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BookingInput>({
    defaultValues: { tour: tourName ?? "" },
  });

  const updateGuests = (a: number, c: number) => {
    setAdults(a);
    setChildren(c);
    setValue("guests", guestLabel(a, c));
  };

  const [dateValue, setDateValue] = useState("");
  const updateDate = (v: string) => {
    setDateValue(v);
    setValue("dates", v);
  };

  const onSubmit = async (values: BookingInput) => {
    // Client-side validation mirrors the server schema.
    const parsed = bookingSchema.safeParse(values);
    if (!parsed.success) {
      setStatus("error");
      setServerError("Please check the highlighted fields.");
      return;
    }
    setStatus("submitting");
    setServerError(null);
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      let json: { ok: boolean; error?: string };
      try {
        json = await res.json();
      } catch {
        setStatus("error");
        setServerError(`Server returned ${res.status}. Check console for details.`);
        return;
      }
      if (!res.ok || !json.ok) {
        setStatus("error");
        setServerError(json.error ?? "Something went wrong. Please try again.");
        return;
      }
      setStatus("success");
      setAdults(2);
      setChildren(0);
      setDateValue("");
      reset({ tour: tourName ?? "" });
    } catch {
      setStatus("error");
      setServerError("Network error. Please try again or use WhatsApp.");
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-line bg-surface p-8 text-center">
        <Pi name="pi-check-circle" className="mx-auto block w-fit text-4xl text-gold-dark" />
        <h3 className="mt-4 text-xl">Enquiry sent!</h3>
        <p className="mt-2 text-ink-soft">
          Thank you — we&apos;ve emailed you a confirmation and our team will be in touch shortly.
        </p>
        <div className="mt-5 flex justify-center">
          <WhatsAppButton size="sm" label="Or chat now on WhatsApp" />
        </div>
        <button
          className="mt-4 text-sm text-gold-dark underline"
          onClick={() => setStatus("idle")}
        >
          Send another enquiry
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-2xl border border-line bg-surface p-6 sm:p-8"
      noValidate
    >
      {/* Honeypot — visually hidden, must stay empty */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
        {...register("company")}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" error={errors.name?.message} required>
          <input className={inputCls} placeholder="Jane Doe" {...register("name", { required: "Please enter your name" })} />
        </Field>
        <Field label="Email" error={errors.email?.message} required>
          <input
            type="email"
            className={inputCls}
            placeholder="jane@example.com"
            {...register("email", { required: "Please enter your email" })}
          />
        </Field>
        <Field label="Phone (optional)" error={errors.phone?.message}>
          <input className={inputCls} placeholder="+1 555 123 4567" {...register("phone")} />
        </Field>
        <Field label="Tour / interest" error={errors.tour?.message}>
          <input className={inputCls} placeholder="e.g. Okavango Delta Explorer" {...register("tour")} />
        </Field>
        <Field label="Preferred dates" error={errors.dates?.message}>
          <input
            type="date"
            className={inputCls}
            value={dateValue}
            onChange={(e) => updateDate(e.target.value)}
          />
        </Field>
        <Field label="Guests" error={errors.guests?.message}>
          <div className="space-y-2">
            <div className="flex items-center justify-between rounded-lg border border-line bg-cream px-3.5 py-2">
              <span className="text-sm text-foreground">Adults</span>
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => updateGuests(Math.max(0, adults - 1), children)} className="flex h-7 w-7 items-center justify-center rounded-full border border-line text-foreground hover:bg-muted transition-colors">
                  <Pi name="pi-minus" className="text-xs" />
                </button>
                <span className="w-6 text-center text-sm font-medium text-foreground">{adults}</span>
                <button type="button" onClick={() => updateGuests(adults + 1, children)} className="flex h-7 w-7 items-center justify-center rounded-full border border-line text-foreground hover:bg-muted transition-colors">
                  <Pi name="pi-plus" className="text-xs" />
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-line bg-cream px-3.5 py-2">
              <span className="text-sm text-foreground">Children</span>
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => updateGuests(adults, Math.max(0, children - 1))} className="flex h-7 w-7 items-center justify-center rounded-full border border-line text-foreground hover:bg-muted transition-colors">
                  <Pi name="pi-minus" className="text-xs" />
                </button>
                <span className="w-6 text-center text-sm font-medium text-foreground">{children}</span>
                <button type="button" onClick={() => updateGuests(adults, children + 1)} className="flex h-7 w-7 items-center justify-center rounded-full border border-line text-foreground hover:bg-muted transition-colors">
                  <Pi name="pi-plus" className="text-xs" />
                </button>
              </div>
            </div>
          </div>
        </Field>
      </div>

      <div className="mt-4">
        <Field label="Message (optional)" error={errors.message?.message}>
          <textarea
            rows={4}
            className={cn(inputCls, "resize-y")}
            placeholder="Tell us what you'd love to experience…"
            {...register("message")}
          />
        </Field>
      </div>

      {status === "error" && serverError && (
        <p className="mt-4 flex items-center gap-2 text-sm text-red-600">
          <Pi name="pi-exclamation-circle" className="text-base" /> {serverError}
        </p>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={status === "submitting"}>
          <Pi name="pi-send" className="text-base" />
          {status === "submitting" ? "Sending…" : "Send enquiry"}
        </Button>
        <WhatsAppButton
          variant="secondary"
          label="Book on WhatsApp instead"
          details={{ tourName, name: watch("name"), dates: dateValue, guests: guestLabel(adults, children) }}
        />
      </div>
    </form>
  );
}

const inputCls =
  "w-full rounded-lg border border-line bg-cream px-3.5 py-2.5 text-sm text-foreground outline-none placeholder:text-ink-soft/60 focus:border-gold focus:ring-2 focus:ring-gold/30";

function Field({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-foreground">
        {label} {required && <span className="text-gold-dark">*</span>}
      </span>
      {children}
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}
