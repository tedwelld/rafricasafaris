"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { Pi } from "@/components/Pi";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

type PricingCat = { id: number; title: string; price: number; ticketCategory?: string; defaultCategory?: boolean };
type Step = "tour" | "dates" | "pricing" | "done";

type Product = {
  id: number;
  title: string;
  excerpt?: string;
  durationText?: string;
  difficultyLevel?: string;
  activityType?: string;
};

export function CheckAvailabilityModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("tour");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [date, setDate] = useState("");
  const [availError, setAvailError] = useState("");
  const [availData, setAvailData] = useState<any[]>([]);
  const [categoryPrices, setCategoryPrices] = useState<Record<number, number>>({});
  const [pricingCategories, setPricingCategories] = useState<PricingCat[]>([]);
  const [participants, setParticipants] = useState<Record<number, number>>({});
  const [loadingAvail, setLoadingAvail] = useState(false);

  useEffect(() => { if (!open) setAvailError(""); }, [open]);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setProducts([]);
    setAvailError("");
    fetch("/api/bokun/activity.json/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ page: 1, pageSize: 50 }),
    })
      .then(async (r) => {
        if (!r.ok) {
          const text = await r.text().catch(() => "");
          throw new Error(`HTTP ${r.status}: ${text}`);
        }
        return r.json();
      })
      .then((data: any) => {
        setProducts(
          (Array.isArray(data.items) ? data.items : []).map((p: any) => ({
            id: p.id,
            title: p.title,
            excerpt: p.excerpt ?? p.summary,
            durationText: p.durationText,
            difficultyLevel: p.difficultyLevel,
            activityType: p.activityType,
          })),
        );
      })
      .catch((err: Error) => {
        setAvailError(err.message);
      })
      .finally(() => setLoading(false));
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const fetchAvailAndPricing = useCallback(async (productId: number, dt: string) => {
    setLoadingAvail(true);
    setAvailError("");
    setParticipants({});
    setCategoryPrices({});
    setPricingCategories([]);
    try {
      const [availRes, productRes] = await Promise.all([
        fetch(`/api/bokun/activity.json/${productId}/availabilities?start=${dt}&end=${dt}&currency=USD`),
        fetch(`/api/bokun/activity.json/${productId}`),
      ]);
      if (!availRes.ok) throw new Error(`Availability fetch failed: ${availRes.status}`);
      if (!productRes.ok) throw new Error(`Product fetch failed: ${productRes.status}`);
      const availJson = await availRes.json();
      const productJson = await productRes.json();
      const slots: any[] = Array.isArray(availJson) ? availJson : [];
      setAvailData(slots);
      if (productJson.pricingCategories) {
        const prices: Record<number, number> = {};
        for (const s of slots) {
          for (const rate of s.pricesByRate ?? []) {
            for (const pu of rate.pricePerCategoryUnit ?? []) {
              if (pu.amount?.amount && !prices[pu.id]) prices[pu.id] = pu.amount.amount;
            }
          }
        }
        const cats: PricingCat[] = productJson.pricingCategories.map((pc: any) => ({
          id: pc.id,
          title: pc.title,
          price: prices[pc.id] ?? 0,
          ticketCategory: pc.ticketCategory,
          defaultCategory: pc.defaultCategory,
        }));
        setCategoryPrices(prices);
        setPricingCategories(cats);
        const init: Record<number, number> = {};
        for (const pc of cats) {
          init[pc.id] = pc.ticketCategory === "ADULT" || pc.defaultCategory ? 1 : 0;
        }
        setParticipants(init);
      }
    } catch (err) {
      setAvailError(err instanceof Error ? err.message : "Failed to load pricing");
    } finally {
      setLoadingAvail(false);
    }
  }, []);

  const next = () => {
    if (step === "tour") setStep("dates");
    else if (step === "dates") {
      if (selectedId && date) fetchAvailAndPricing(selectedId, date);
      setStep("pricing");
    }
    else if (step === "pricing") setStep("done");
  };

  const back = () => {
    if (step === "dates") setStep("tour");
    else if (step === "pricing") setStep("dates");
    else if (step === "done") setStep("pricing");
  };

  const handleViewProduct = () => {
    if (selectedId) {
      onClose();
      router.push(`/product/${selectedId}`);
    }
  };

  const totalTravelers = Object.values(participants).reduce((s, v) => s + v, 0);
  const totalPrice = pricingCategories.reduce((t, pc) => t + (participants[pc.id] ?? 0) * (categoryPrices[pc.id] ?? pc.price), 0);

  if (!open) return null;

  const selected = products.find((p) => p.id === selectedId);
  const difficultyLabel = selected?.difficultyLevel
    ? ({ EASY: "Easy", MODERATE: "Moderate", HARD: "Hard", CHALLENGING: "Challenging" } as Record<string, string>)[selected.difficultyLevel] ?? selected.difficultyLevel
    : selected?.activityType ?? "Activity";

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-start justify-center bg-black/80 px-4 pt-24 pb-8 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-lg rounded-3xl border border-line bg-surface p-6 shadow-2xl sm:p-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {step !== "tour" && (
              <button
                type="button"
                onClick={back}
                className="flex h-8 w-8 items-center justify-center rounded-full text-ink-soft hover:bg-muted hover:text-foreground transition-colors"
              >
                <Pi name="pi-arrow-left" className="text-lg" />
              </button>
            )}
            <h2 className="text-xl font-semibold text-foreground">Check Availability</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-ink-soft hover:bg-muted hover:text-foreground transition-colors"
          >
            <Pi name="pi-times" className="text-lg" />
          </button>
        </div>

        {/* Step indicator */}
        <div className="mt-5 flex items-center gap-2">
          {(["tour", "dates", "pricing"] as const).map((label, i) => {
            const completed = step === "dates" ? i < 1 : step === "pricing" ? i < 2 : step === "done" ? true : false;
            return (
              <div key={label} className="flex items-center gap-2">
                <div
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                    completed || step === label ? "bg-gold text-white" : "bg-muted text-ink-soft",
                  )}
                >
                  {completed ? <Pi name="pi-check" className="text-[10px]" /> : i + 1}
                </div>
                {i < 2 && <div className={cn("h-px w-6", completed ? "bg-gold" : "bg-line")} />}
              </div>
            );
          })}
        </div>

        {/* Step content */}
        <div className="mt-6">
          {/* Step 1: Pick a tour from API */}
          {step === "tour" && (
            <div>
              <p className="text-sm text-ink-soft">Select a safari to check availability:</p>
              {loading ? (
                <p className="mt-4 text-sm text-ink-soft">Loading available tours...</p>
              ) : availError ? (
                <p className="mt-4 text-sm text-red-600">Error: {availError}</p>
              ) : products.length === 0 ? (
                <p className="mt-4 text-sm text-ink-soft">No tours available at the moment.</p>
              ) : (
                <div className="mt-3 max-h-60 space-y-2 overflow-y-auto">
                  {products.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setSelectedId(p.id);
                        setTimeout(next, 200);
                      }}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all",
                        selectedId === p.id
                          ? "border-gold bg-gold/5"
                          : "border-line hover:border-gold/50",
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                          selectedId === p.id ? "border-gold bg-gold" : "border-line",
                        )}
                      >
                        {selectedId === p.id && <Pi name="pi-check" className="text-xs text-neutral-900" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{p.title}</p>
                        {p.durationText && (
                          <p className="text-xs text-ink-soft">{p.durationText}</p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
              <div className="mt-5 flex justify-end">
                <Button onClick={next} disabled={!selectedId}>
                  Continue <Pi name="pi-arrow-right" className="text-sm" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Pick dates */}
          {step === "dates" && (
            <div>
              <p className="text-sm text-ink-soft">When would you like to go?</p>
              <div className="mt-3">
                <label className="block text-xs font-medium text-foreground mb-1.5">Preferred date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-xl border border-line bg-cream px-4 py-3 text-sm text-foreground outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
                />
              </div>
              <div className="mt-5 flex justify-between">
                <Button variant="ghost" onClick={back}>
                  <Pi name="pi-arrow-left" className="text-sm" /> Back
                </Button>
                <Button onClick={next} disabled={!date}>
                  Continue <Pi name="pi-arrow-right" className="text-sm" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Pricing & Guests */}
          {step === "pricing" && (
            <div>
              <p className="text-sm text-ink-soft">
                {selected?.title} — {date ? new Date(date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : ""}
              </p>

              {loadingAvail ? (
                <p className="mt-4 text-sm text-ink-soft animate-pulse">Loading pricing &amp; availability...</p>
              ) : availError ? (
                <p className="mt-4 text-sm text-red-600">Error: {availError}</p>
              ) : pricingCategories.length === 0 ? (
                <p className="mt-4 text-sm text-ink-soft">No pricing information available for this date.</p>
              ) : (
                <>
                  {/* Availability summary */}
                  {availData.length > 0 && (
                    <div className="mt-4 rounded-xl bg-muted p-3 text-sm">
                      {(() => {
                        const totalAvail = availData.reduce((sum, a) => sum + (a.availabilityCount ?? 0), 0);
                        const soldOut = availData.every((a) => a.soldOut);
                        return soldOut ? (
                          <p className="text-red-600">Sold out for this date.</p>
                        ) : (
                          <p className="text-ink-soft">{totalAvail} {totalAvail === 1 ? "seat" : "seats"} available</p>
                        );
                      })()}
                    </div>
                  )}

                  {/* Pricing categories */}
                  <div className="mt-4 space-y-3">
                    {pricingCategories.map((pc) => (
                      <div key={pc.id} className="flex items-center justify-between rounded-xl border border-line p-3">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-foreground">{pc.title}</p>
                          <p className="text-xs text-ink-soft">{categoryPrices[pc.id] ?? pc.price} USD</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 ml-3">
                          <button type="button"
                            onClick={() => setParticipants((p) => ({ ...p, [pc.id]: Math.max(0, (p[pc.id] ?? 0) - 1) }))}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-foreground hover:bg-muted transition-colors">
                            <Pi name="pi-minus" className="text-xs" />
                          </button>
                          <span className="w-6 text-center font-semibold text-foreground">{participants[pc.id] ?? 0}</span>
                          <button type="button"
                            onClick={() => setParticipants((p) => ({ ...p, [pc.id]: (p[pc.id] ?? 0) + 1 }))}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-foreground hover:bg-muted transition-colors">
                            <Pi name="pi-plus" className="text-xs" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  {totalTravelers > 0 && (
                    <div className="mt-4 flex items-center justify-between rounded-xl bg-muted p-3">
                      <span className="text-sm font-medium text-foreground">Total ({totalTravelers} {totalTravelers === 1 ? "person" : "people"})</span>
                      <span className="text-lg font-semibold text-gold-dark">{totalPrice} USD</span>
                    </div>
                  )}
                </>
              )}

              <div className="mt-5 flex justify-between">
                <Button variant="ghost" onClick={back}>
                  <Pi name="pi-arrow-left" className="text-sm" /> Back
                </Button>
                <Button onClick={next} disabled={totalTravelers === 0}>
                  Continue <Pi name="pi-arrow-right" className="text-sm" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Done */}
          {step === "done" && selected && (
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold/10">
                <Pi name="pi-check-circle" className="text-3xl text-gold-dark" />
              </div>
              <h3 className="mt-4 text-xl text-foreground">Availability confirmed!</h3>
              <div className="mt-4 rounded-xl bg-muted p-4 text-left text-sm">
                <p className="flex justify-between">
                  <span className="text-ink-soft">Tour:</span>
                  <span className="font-medium text-foreground">{selected.title}</span>
                </p>
                <p className="mt-2 flex justify-between">
                  <span className="text-ink-soft">Date:</span>
                  <span className="font-medium text-foreground">{date ? new Date(date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "Flexible"}</span>
                </p>
                <div className="mt-3 border-t border-line pt-3 space-y-1.5">
                  {pricingCategories.filter((pc) => (participants[pc.id] ?? 0) > 0).map((pc) => (
                    <p key={pc.id} className="flex justify-between text-sm">
                      <span className="text-ink-soft">{pc.title} × {participants[pc.id]}</span>
                      <span className="text-foreground font-medium">{(categoryPrices[pc.id] ?? pc.price) * (participants[pc.id] ?? 0)} USD</span>
                    </p>
                  ))}
                </div>
                <p className="mt-3 flex justify-between border-t border-line pt-3 text-base font-semibold">
                  <span className="text-foreground">Total</span>
                  <span className="text-gold-dark">{totalPrice} USD</span>
                </p>
              </div>
              <div className="mt-6 flex flex-col gap-3">
                <Button onClick={handleViewProduct} className="w-full">
                  View Tour &amp; Book
                </Button>
                <Button variant="secondary" onClick={back} className="w-full">
                  Adjust details
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (typeof document === "undefined") return null;
  return createPortal(modalContent, document.body);
}
