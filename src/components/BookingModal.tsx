"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import { Pi } from "@/components/Pi";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { siteConfig } from "@/lib/siteConfig";
import { useCart } from "@/lib/cart-context";

type PricingCategory = { id: number; title: string; price: number; ticketCategory?: string; defaultCategory?: boolean };
type AvailabilitySlot = {
  id: string; date: number; startTime?: string; availabilityCount: number;
  soldOut: boolean; pricesByRate: { pricePerCategoryUnit?: { id: number; amount: { amount: number } }[] }[];
};

type Props = {
  open: boolean;
  onClose: () => void;
  productId: number;
  title: string;
  description?: string;
  excerpt?: string;
  highlights?: string[];
  inclusions?: string[];
  exclusions?: string[];
  knowBeforeYouGo?: { title: string }[];
  location?: { lat: number; lng: number; address?: string };
  meetingType?: string;
  durationText?: string;
  difficulty?: string;
  reviewRating?: number;
  reviewCount?: number;
  vendor?: { id: number; title: string };
  bookingType?: string;
  capacityType?: string;
  maxParticipants?: number;
  cancellationPolicy?: any;
  requirements?: string[];
  photoUrls?: string[];
  pricingCategories: PricingCategory[];
  startTimes: string[];
  currency: string;
};

type Milestone = 1 | 2 | 3 | 4;
type InnerTab = "description" | "itinerary" | "meeting" | "pickup";
type PaymentOption = "full" | "deposit" | "arrival";

const MILESTONES: { n: Milestone; label: string }[] = [
  { n: 1, label: "Complete Booking" },
  { n: 2, label: "Contact Details" },
  { n: 3, label: "Payment Method" },
  { n: 4, label: "Payment Timing" },
];

const INNER_TABS: { id: InnerTab; label: string }[] = [
  { id: "description", label: "Description" },
  { id: "itinerary", label: "Itinerary" },
  { id: "meeting", label: "Meeting Points" },
  { id: "pickup", label: "Pickup" },
];

export function BookingModal({
  open, onClose, productId, title, description, excerpt, highlights, inclusions, exclusions,
  knowBeforeYouGo, location, meetingType, durationText, difficulty, reviewRating, reviewCount,
  vendor, bookingType, capacityType, maxParticipants, cancellationPolicy, requirements, photoUrls,
  pricingCategories, startTimes, currency,
}: Props) {
  const cart = useCart();

  // Milestone state
  const [milestone, setMilestone] = useState<Milestone>(1);
  const [showCart, setShowCart] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [innerTab, setInnerTab] = useState<InnerTab>("description");
  const [selectedImg, setSelectedImg] = useState(0);

  // Milestone 1: date/time/participants
  const [availabilities, setAvailabilities] = useState<AvailabilitySlot[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [selectedTime, setSelectedTime] = useState("");
  const [participants, setParticipants] = useState<Record<number, number>>({});
  const [categoryPrices, setCategoryPrices] = useState<Record<number, number>>({});
  const [loadingAvail, setLoadingAvail] = useState(false);
  const [availError, setAvailError] = useState("");

  // Milestone 2: customer
  const [customer, setCustomer] = useState({ firstName: "", lastName: "", email: "", phone: "", nationality: "" });

  // Milestone 3: payment
  const [paymentOption, setPaymentOption] = useState<PaymentOption>("full");

  // Milestone 4: timing
  const [payTiming, setPayTiming] = useState<"now" | "later">("now");
  const [acceptPolicy, setAcceptPolicy] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [bookingResult, setBookingResult] = useState<{ reference: string } | null>(null);

  const currencySymbol = currency === "USD" ? "$" : currency === "EUR" ? "€" : currency === "GBP" ? "£" : "R";

  const allImages = useMemo(() => photoUrls?.length ? photoUrls : ["/images/demo/safari-jeep.jpg"], [photoUrls]);

  const totalTravelers = Object.values(participants).reduce((s, v) => s + v, 0);
  const totalPrice = useMemo(() => {
    let t = 0;
    for (const cat of pricingCategories) {
      t += (participants[cat.id] ?? 0) * (categoryPrices[cat.id] ?? cat.price ?? 0);
    }
    return t;
  }, [participants, categoryPrices, pricingCategories]);
  const depositAmount = Math.round(totalPrice * 0.3 * 100) / 100;
  const paymentAmount = paymentOption === "arrival" ? 0 : paymentOption === "deposit" ? depositAmount : totalPrice;

  const fetchAvailability = useCallback(async (date: string) => {
    setLoadingAvail(true);
    setAvailError("");
    try {
      const endDate = new Date(new Date(date).getTime() + 31 * 86400000).toISOString().slice(0, 10);
      const res = await fetch(`/api/bokun/activity.json/${productId}/availabilities?start=${date}&end=${endDate}&currency=${siteConfig.bokunDefaultCurrency}`);
      if (!res.ok) throw new Error("Failed to load availability");
      const data = await res.json();
      const slots: AvailabilitySlot[] = Array.isArray(data) ? data : [];
      setAvailabilities(slots);

      const prices: Record<number, number> = {};
      for (const s of slots) {
        for (const rate of s.pricesByRate) {
          for (const pu of rate.pricePerCategoryUnit ?? []) {
            if (pu.amount?.amount && !prices[pu.id]) prices[pu.id] = pu.amount.amount;
          }
        }
      }
      if (Object.keys(prices).length) setCategoryPrices(prices);
    } catch (err) {
      setAvailError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoadingAvail(false);
    }
  }, [productId]);

  const toDateKey = (ts: number) => {
    const ms = ts > 1000000000000 ? ts : ts * 1000;
    return new Date(ms).toISOString().slice(0, 10);
  };

  const dateSlots = availabilities.filter((a) => !a.soldOut && a.availabilityCount > 0);

  const availableDates = useMemo(() => {
    const set = new Set<string>();
    for (const s of dateSlots) set.add(toDateKey(s.date));
    return set;
  }, [dateSlots]);

  const slotsOnDate = dateSlots.filter((a) => toDateKey(a.date) === selectedDate);
  const uniqueTimes = [...new Set(slotsOnDate.map((s) => s.startTime).filter((t): t is string => !!t))].sort();

  const todayStr = new Date().toISOString().slice(0, 10);
  const [calOffset, setCalOffset] = useState(0);
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
  const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const seeded = useRef(false);
  useEffect(() => {
    if (open && !seeded.current) {
      seeded.current = true;
      const init: Record<number, number> = {};
      const prices: Record<number, number> = {};
      for (const pc of pricingCategories) {
        init[pc.id] = pc.ticketCategory === "ADULT" || pc.defaultCategory ? 1 : 0;
        prices[pc.id] = pc.price;
      }
      setParticipants(init);
      setCategoryPrices(prices);
      setSelectedDate(new Date().toISOString().slice(0, 10));
      setSelectedTime("");
      setMilestone(1);
      setShowCart(false);
      setJustAdded(false);
      setBookingResult(null);
      setSubmitError("");
      setInnerTab("description");
      setSelectedImg(0);
      setCalOffset(0);
    }
    if (!open) seeded.current = false;
  }, [open, pricingCategories, fetchAvailability]);

  useEffect(() => {
    if (!open) return;
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() + calOffset);
    fetchAvailability(d.toISOString().slice(0, 10));
  }, [calOffset, open, fetchAvailability]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  const canCompleteM1 = !!selectedTime && totalTravelers >= 1;
  const canCompleteM2 = !!customer.firstName && !!customer.lastName && !!customer.email && !!customer.phone;
  const m1Done = canCompleteM1;
  const m2Done = canCompleteM2;
  const paymentLabel = paymentOption === "full" ? `Pay ${currencySymbol}${totalPrice}` :
    paymentOption === "deposit" ? `Deposit ${currencySymbol}${depositAmount}` : "Pay on arrival";
  const submitLabel = submitting ? "Processing..." : payTiming === "now" ? `Pay ${currencySymbol}${paymentAmount} now` : "Confirm booking";

  const addToCart = () => {
    cart.add({
      id: crypto.randomUUID(), productId, title, imageUrl: allImages[0],
      date: selectedDate, startTime: selectedTime,
      participants: { ...participants }, pricingCategories,
      totalPrice, currency,
    });
    setJustAdded(true);
    setShowCart(true);
  };

  const proceedFromCart = () => {
    setShowCart(false);
    setJustAdded(false);
    setMilestone(2);
  };

  const submitBooking = async () => {
    setSubmitting(true);
    setSubmitError("");
    try {
      const participantList = Object.entries(participants).filter(([, c]) => c > 0).map(([catId, count]) => ({
        pricingCategoryId: Number(catId), count,
      }));
      const res = await fetch("/api/bokun/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId, date: selectedDate, startTime: selectedTime || undefined,
          participants: participantList,
          customer: { firstName: customer.firstName, lastName: customer.lastName, email: customer.email, phone: customer.phone, nationality: customer.nationality || undefined },
          channelId: siteConfig.bokunChannelUUID || undefined,
        }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || "Booking failed");
      }
      const data = await res.json();
      setBookingResult({ reference: data.reference });
      cart.clear();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Booking failed");
    } finally {
      setSubmitting(false);
    }
  };

  const meta = [
    durationText && <span key="dur" className="flex items-center gap-1 text-sm text-ink-soft"><Pi name="pi-clock" className="text-gold-dark" />{durationText}</span>,
    difficulty && <span key="diff" className="flex items-center gap-1 text-sm text-ink-soft"><Pi name="pi-chart-bar" className="text-gold-dark" />{difficulty}</span>,
    location?.address && <span key="loc" className="flex items-center gap-1 text-sm text-ink-soft"><Pi name="pi-map-marker" className="text-gold-dark" />{location.address}</span>,
    (reviewCount ?? 0) > 0 && <span key="rev" className="flex items-center gap-1 text-sm text-ink-soft"><Pi name="pi-star-fill" className="text-gold-dark" />{reviewRating?.toFixed(1)} ({reviewCount})</span>,
  ].filter(Boolean);

  if (!open) return null;

  const closeBtn = (
    <button type="button" onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full text-ink-soft hover:bg-muted hover:text-foreground transition-colors">
      <Pi name="pi-times" className="text-lg" />
    </button>
  );

  const renderMilestoneBar = () => (
    <nav className="flex items-center gap-2 px-6 py-4 border-b border-line overflow-x-auto">
      {MILESTONES.map((m, i) => {
        const completed = milestone > m.n;
        const active = milestone === m.n;
        return (
          <div key={m.n} className="flex items-center gap-2 shrink-0">
            <button type="button" onClick={() => { if (m.n < milestone || (m.n === 1 && m1Done)) setMilestone(m.n); }}
              className={cn("flex items-center gap-2", !completed && !active && "opacity-50")}>
              <span className={cn("flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold",
                completed ? "bg-gold text-white" : active ? "bg-gold text-white" : "bg-muted text-ink-soft")}>
                {completed ? <Pi name="pi-check" /> : m.n}
              </span>
              <span className={cn("text-xs font-medium hidden sm:inline", active ? "text-foreground" : "text-ink-soft")}>{m.label}</span>
            </button>
            {i < MILESTONES.length - 1 && <div className={cn("h-px w-6", completed ? "bg-gold" : "bg-line")} />}
          </div>
        );
      })}
    </nav>
  );

  const renderM1CompleteBooking = () => (
    <div className="flex flex-1 overflow-hidden">
      {/* Left: images + inner tabs */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Image gallery */}
        <div className="relative rounded-xl overflow-hidden mb-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={allImages[selectedImg]} alt={title} className="w-full aspect-[16/10] object-cover" />
          {allImages.length > 1 && (
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
              {allImages.map((_, i) => (
                <button key={i} type="button" onClick={() => setSelectedImg(i)}
                  className={cn("h-2 rounded-full transition-all", i === selectedImg ? "w-6 bg-gold" : "w-2 bg-white/60")} />
              ))}
            </div>
          )}
        </div>

        {/* Title + meta */}
        <h2 className="text-2xl text-foreground font-semibold">{title}</h2>
        <div className="mt-2 flex flex-wrap gap-3">{meta}</div>
        {maxParticipants && <p className="mt-2 text-xs text-ink-soft flex items-center gap-1"><Pi name="pi-users" className="text-gold-dark" /> Up to {maxParticipants} travelers</p>}
        {excerpt && <p className="mt-3 text-sm text-ink-soft">{excerpt}</p>}

        {/* Inner tabs */}
        <div className="mt-6 border-b border-line flex gap-4 overflow-x-auto">
          {INNER_TABS.map((t) => (
            <button key={t.id} type="button" onClick={() => setInnerTab(t.id)}
              className={cn("whitespace-nowrap pb-2 text-sm font-medium border-b-2 -mb-px transition-colors",
                innerTab === t.id ? "border-gold text-foreground" : "border-transparent text-ink-soft hover:text-foreground")}>
              {t.label}
            </button>
          ))}
        </div>

        <div className="mt-4 text-sm text-ink-soft space-y-4">
          {innerTab === "description" && (
            <>
              {description && <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: description }} />}
              {!!highlights?.length && (
                <div><h4 className="font-medium text-foreground mb-2">Highlights</h4>
                  <ul className="space-y-1">{highlights.map((h, i) => <li key={i} className="flex items-start gap-2"><Pi name="pi-check-circle" className="mt-0.5 text-green-600 shrink-0" />{h}</li>)}</ul></div>
              )}
              {!!inclusions?.length && (
                <div><h4 className="font-medium text-foreground mb-2">What's Included</h4>
                  <ul className="space-y-1">{inclusions.map((inc, i) => <li key={i} className="flex items-start gap-2"><Pi name="pi-check" className="mt-0.5 text-green-600 shrink-0" />{inc}</li>)}</ul></div>
              )}
              {!!exclusions?.length && (
                <div><h4 className="font-medium text-foreground mb-2">Exclusions</h4>
                  <ul className="space-y-1">{exclusions.map((exc, i) => <li key={i} className="flex items-start gap-2"><Pi name="pi-minus" className="mt-0.5 text-ink-soft shrink-0" />{exc}</li>)}</ul></div>
              )}
              {!!cancellationPolicy && <div><h4 className="font-medium text-foreground mb-2">Cancellation Policy</h4><p>{typeof cancellationPolicy === "string" ? cancellationPolicy : cancellationPolicy.title ?? "Standard policy applies"}</p></div>}
            </>
          )}
          {innerTab === "itinerary" && (
            <p className="text-ink-soft italic">Itinerary details are being prepared. Contact us for more information.</p>
          )}
          {innerTab === "meeting" && (
            <div>
              {meetingType && <p className="flex items-center gap-2"><Pi name="pi-map-marker" className="text-gold-dark" /> Meeting: {meetingType}</p>}
              {location?.address && <p className="mt-2 flex items-center gap-2"><Pi name="pi-map-marker" className="text-gold-dark" /> {location.address}</p>}
              {location?.lat && location?.lng && (
                <a href={`https://www.google.com/maps?q=${location.lat},${location.lng}`} target="_blank" rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1 text-sm text-gold-dark hover:underline"><Pi name="pi-external-link" className="text-xs" /> View on Google Maps</a>
              )}
            </div>
          )}
          {innerTab === "pickup" && (
            <p className="text-ink-soft italic">Pickup details provided upon booking confirmation.</p>
          )}
        </div>
      </div>

      {/* Right: booking sidebar */}
      <div className="w-full max-w-sm border-l border-line p-6 overflow-y-auto">
        <p className="text-xl font-semibold text-foreground">{currencySymbol}{totalPrice || (pricingCategories[0]?.price ?? 0)} <span className="text-sm font-normal text-ink-soft">USD</span></p>

        {/* Participants */}
        <div className="mt-6 space-y-4">
          {pricingCategories.map((pc) => (
            <div key={pc.id} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">{pc.title}</p>
                <p className="text-xs text-ink-soft">{currencySymbol}{categoryPrices[pc.id] ?? pc.price}</p>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setParticipants((p) => ({ ...p, [pc.id]: Math.max(pc.ticketCategory === "ADULT" || pc.defaultCategory ? 1 : 0, (p[pc.id] ?? 1) - 1) }))}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-foreground hover:bg-muted"><Pi name="pi-minus" className="text-xs" /></button>
                <span className="w-6 text-center font-semibold text-foreground">{participants[pc.id] ?? 0}</span>
                <button type="button" onClick={() => setParticipants((p) => ({ ...p, [pc.id]: (p[pc.id] ?? 1) + 1 }))}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-foreground hover:bg-muted"><Pi name="pi-plus" className="text-xs" /></button>
              </div>
            </div>
          ))}
        </div>

        {/* Calendar */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <button type="button" onClick={() => setCalOffset((o) => o - 1)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-ink-soft hover:bg-muted transition-all">
              <Pi name="pi-chevron-left" className="text-xs" />
            </button>
            <span className="text-sm font-semibold text-foreground">{MONTHS[calMonth]} {calYear}</span>
            <button type="button" onClick={() => setCalOffset((o) => o + 1)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-ink-soft hover:bg-muted transition-all">
              <Pi name="pi-chevron-right" className="text-xs" />
            </button>
          </div>
          <div className="grid grid-cols-7 mb-1 text-center text-[11px] font-medium text-ink-soft uppercase tracking-wider">
            {["S", "M", "T", "W", "T", "F", "S"].map((d) => <div key={d} className="py-1">{d}</div>)}
          </div>
          <div className="grid grid-cols-7 text-center text-sm">
            {Array.from({ length: startDay }).map((_, i) => <div key={`e${i}`} />)}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1;
              const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const isToday = dateStr === todayStr;
              const isSelected = dateStr === selectedDate;
              const hasAvail = availableDates.has(dateStr);
              const isPast = dateStr < todayStr;
              const disabled = isPast && !hasAvail;
              return (
                <button key={day} type="button" disabled={disabled}
                  onClick={() => { setSelectedDate(dateStr); setSelectedTime(""); }}
                  className={cn(
                    "relative flex h-9 w-full items-center justify-center rounded-lg text-sm transition-all",
                    isSelected ? "bg-gold text-white font-semibold" : disabled ? "opacity-25 cursor-not-allowed" : "text-foreground hover:bg-muted",
                    isToday && !isSelected && "ring-1 ring-gold/50",
                  )}>
                  {day}
                  {hasAvail && !isSelected && <span className="absolute bottom-1 h-1 w-1 rounded-full bg-gold" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Time slots */}
        {loadingAvail && <p className="mt-3 text-xs text-ink-soft">Loading availability...</p>}
        {availError && <p className="mt-3 text-xs text-red-600">{availError}</p>}
        {!loadingAvail && uniqueTimes.length > 0 && (
          <div className="mt-3">
            <label className="block text-xs font-medium text-foreground mb-2">Available times</label>
            <div className="grid grid-cols-2 gap-2">
              {uniqueTimes.map((t) => (
                <button key={t} type="button" onClick={() => setSelectedTime(t)}
                  className={cn("rounded-lg border px-3 py-2 text-sm transition-all",
                    selectedTime === t ? "border-gold bg-gold/5 text-foreground" : "border-line text-ink-soft hover:border-gold/50")}>
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}
        {!loadingAvail && uniqueTimes.length === 0 && selectedDate && (
          <p className="mt-3 text-xs text-ink-soft">No times available for this date.</p>
        )}

        {/* Summary */}
        {canCompleteM1 && totalPrice > 0 && (
          <div className="mt-6 rounded-xl bg-muted p-4 space-y-2 text-sm">
            {pricingCategories.filter((pc) => (participants[pc.id] ?? 0) > 0).map((pc) => (
              <div key={pc.id} className="flex justify-between"><span className="text-ink-soft">{pc.title} × {participants[pc.id]}</span><span className="text-foreground">{currencySymbol}{(categoryPrices[pc.id] ?? pc.price) * (participants[pc.id] ?? 0)}</span></div>
            ))}
            <div className="flex justify-between border-t border-line pt-2 font-semibold"><span className="text-foreground">Total</span><span className="text-gold-dark">{currencySymbol}{totalPrice}</span></div>
          </div>
        )}

        <div className="mt-6 space-y-3">
          <Button className="w-full" onClick={() => { addToCart(); }} disabled={!canCompleteM1}>Add to cart</Button>
          <p className="text-[10px] text-center text-ink-soft">Powered by Bókun</p>
        </div>
      </div>
    </div>
  );

  const renderCartView = () => (
    <div className="p-6">
      <h3 className="text-lg text-foreground font-semibold">{justAdded ? "Added to cart!" : "Shopping Cart"}</h3>
      {cart.items.length === 0 ? (
        <p className="mt-4 text-sm text-ink-soft">Cart is empty.</p>
      ) : (
        <>
          <div className="mt-4 space-y-3">
            {cart.items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 rounded-xl border border-line bg-muted p-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.imageUrl ?? "/images/demo/safari-jeep.jpg"} alt="" className="h-14 w-20 rounded-lg object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground text-sm truncate">{item.title}</p>
                  <p className="text-xs text-ink-soft">{item.date} · {item.startTime}</p>
                  <div className="flex flex-wrap gap-x-2 text-xs text-ink-soft">
                    {Object.entries(item.participants).filter(([, c]) => c > 0).map(([catId, count]) => {
                      const cat = item.pricingCategories.find((c) => c.id === Number(catId));
                      return <span key={catId}>{count}× {cat?.title ?? catId}</span>;
                    })}
                  </div>
                </div>
                <p className="font-semibold text-gold-dark shrink-0">{item.totalPrice} {item.currency}</p>
                <button type="button" onClick={() => cart.remove(item.id)} className="text-ink-soft hover:text-red-600">
                  <Pi name="pi-trash" className="text-sm" />
                </button>
              </div>
            ))}
          </div>
          <div className="mt-6 border-t border-line pt-4">
            <div className="flex justify-between font-semibold text-lg"><span className="text-foreground">Total</span><span className="text-gold-dark">{cart.totalPrice} {currency}</span></div>
            <div className="mt-4 flex flex-col gap-3">
              <Button className="w-full" onClick={proceedFromCart} disabled={cart.count === 0}>Proceed to checkout</Button>
              <Button variant="ghost" className="w-full" onClick={() => { setShowCart(false); setJustAdded(false); }}>Continue shopping</Button>
            </div>
          </div>
        </>
      )}
    </div>
  );

  const renderM2Contact = () => (
    <div className="p-6 max-w-lg mx-auto w-full">
      <h3 className="text-lg text-foreground font-semibold">Your details</h3>
      <div className="mt-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div><label className="block text-xs font-medium text-foreground mb-1">First name</label>
            <input type="text" value={customer.firstName} onChange={(e) => setCustomer((c) => ({ ...c, firstName: e.target.value }))}
              className="w-full rounded-xl border border-line bg-cream px-4 py-3 text-sm text-foreground outline-none focus:border-gold" /></div>
          <div><label className="block text-xs font-medium text-foreground mb-1">Last name</label>
            <input type="text" value={customer.lastName} onChange={(e) => setCustomer((c) => ({ ...c, lastName: e.target.value }))}
              className="w-full rounded-xl border border-line bg-cream px-4 py-3 text-sm text-foreground outline-none focus:border-gold" /></div>
        </div>
        <div><label className="block text-xs font-medium text-foreground mb-1">Email</label>
          <input type="email" value={customer.email} onChange={(e) => setCustomer((c) => ({ ...c, email: e.target.value }))}
            className="w-full rounded-xl border border-line bg-cream px-4 py-3 text-sm text-foreground outline-none focus:border-gold" /></div>
        <div><label className="block text-xs font-medium text-foreground mb-1">Phone</label>
          <input type="tel" value={customer.phone} onChange={(e) => setCustomer((c) => ({ ...c, phone: e.target.value }))}
            className="w-full rounded-xl border border-line bg-cream px-4 py-3 text-sm text-foreground outline-none focus:border-gold" /></div>
        <div><label className="block text-xs font-medium text-foreground mb-1">Nationality <span className="text-ink-soft">(optional)</span></label>
          <input type="text" value={customer.nationality} onChange={(e) => setCustomer((c) => ({ ...c, nationality: e.target.value }))}
            className="w-full rounded-xl border border-line bg-cream px-4 py-3 text-sm text-foreground outline-none focus:border-gold" /></div>
      </div>
      <div className="mt-6 flex justify-between">
        <Button variant="ghost" onClick={() => setMilestone(1)}><Pi name="pi-arrow-left" className="text-sm" /> Back</Button>
        <Button onClick={() => setMilestone(3)} disabled={!canCompleteM2}>Continue <Pi name="pi-arrow-right" className="text-sm" /></Button>
      </div>
    </div>
  );

  const renderM3Payment = () => (
    <div className="p-6 max-w-lg mx-auto w-full">
      <h3 className="text-lg text-foreground font-semibold">Payment method</h3>
      <div className="mt-4 space-y-3">
        {([["full", `Pay in full (${currencySymbol}${totalPrice})`], ["deposit", `Pay 30% deposit (${currencySymbol}${depositAmount})`], ["arrival", "Pay on arrival"]] as [PaymentOption, string][]).map(([opt, label]) => (
          <button key={opt} type="button" onClick={() => setPaymentOption(opt)}
            className={cn("flex w-full items-center gap-3 rounded-xl border px-4 py-4 text-left transition-all",
              paymentOption === opt ? "border-gold bg-gold/5" : "border-line hover:border-gold/50")}>
            <div className={cn("flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
              paymentOption === opt ? "border-gold bg-gold" : "border-line")}>
              {paymentOption === opt && <div className="h-2 w-2 rounded-full bg-neutral-900" />}
            </div>
            <div><p className="text-sm font-medium text-foreground">{label}</p>
              {opt === "deposit" && <p className="text-xs text-ink-soft">Remaining {currencySymbol}{totalPrice - depositAmount} due later</p>}</div>
          </button>
        ))}
      </div>
      <div className="mt-6 flex justify-between">
        <Button variant="ghost" onClick={() => setMilestone(2)}><Pi name="pi-arrow-left" className="text-sm" /> Back</Button>
        <Button onClick={() => setMilestone(4)}>Continue <Pi name="pi-arrow-right" className="text-sm" /></Button>
      </div>
    </div>
  );

  const renderM4Timing = () => (
    <div className="p-6 max-w-lg mx-auto w-full">
      <h3 className="text-lg text-foreground font-semibold">Payment timing</h3>
      {paymentOption !== "arrival" && (
        <div className="mt-4 space-y-3">
          {([["now", `Pay ${currencySymbol}${paymentAmount} now`], ["later", `Pay ${currencySymbol}${paymentAmount} later`]] as ["now" | "later", string][]).map(([opt, label]) => (
            <button key={opt} type="button" onClick={() => setPayTiming(opt)}
              className={cn("flex w-full items-center gap-3 rounded-xl border px-4 py-4 text-left transition-all",
                payTiming === opt ? "border-gold bg-gold/5" : "border-line hover:border-gold/50")}>
              <div className={cn("flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
                payTiming === opt ? "border-gold bg-gold" : "border-line")}>
                {payTiming === opt && <div className="h-2 w-2 rounded-full bg-neutral-900" />}
              </div>
              <span className="text-sm font-medium text-foreground">{label}</span>
            </button>
          ))}
        </div>
      )}
      {paymentOption === "arrival" && <p className="mt-4 text-sm text-ink-soft">No payment required now. You can pay when you arrive.</p>}

      <div className="mt-6 rounded-xl bg-muted p-4 space-y-2 text-sm">
        <div className="flex justify-between"><span className="text-ink-soft">Total</span><span className="font-semibold text-foreground">{currencySymbol}{totalPrice}</span></div>
        {paymentOption !== "full" && <div className="flex justify-between"><span className="text-ink-soft">Due now</span><span className="font-semibold text-foreground">{currencySymbol}{paymentAmount}</span></div>}
      </div>

      <label className="mt-4 flex items-start gap-3 cursor-pointer">
        <input type="checkbox" checked={acceptPolicy} onChange={(e) => setAcceptPolicy(e.target.checked)} className="mt-1 h-4 w-4 accent-gold" />
        <span className="text-sm text-ink-soft">I accept the cancellation policy and terms &amp; conditions.</span>
      </label>

      {submitError && <p className="mt-3 text-sm text-red-600">{submitError}</p>}

      <div className="mt-6 flex justify-between">
        <Button variant="ghost" onClick={() => setMilestone(3)}><Pi name="pi-arrow-left" className="text-sm" /> Back</Button>
        <Button onClick={submitBooking} disabled={submitting || !acceptPolicy}>{submitLabel}</Button>
      </div>
    </div>
  );

  const renderBookingResult = () => (
    <div className="p-6 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
        <Pi name="pi-check-circle" className="text-3xl text-green-600" />
      </div>
      <h3 className="mt-4 text-xl text-foreground">Booking confirmed!</h3>
      <p className="mt-2 text-sm text-ink-soft">Reference: <span className="font-medium text-foreground">{bookingResult?.reference}</span></p>
      <p className="mt-1 text-sm text-ink-soft">We'll send confirmation to {customer.email}.</p>
      <Button className="mt-6" onClick={onClose}>Done</Button>
    </div>
  );

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center bg-black/80 px-4 pt-24 pb-8 overflow-y-auto"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="flex w-full max-w-5xl max-h-[90vh] flex-col rounded-3xl border border-line bg-surface shadow-2xl overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-line shrink-0">
          <div className="flex items-center gap-3">
            {showCart || milestone > 1 ? (
              <button type="button" onClick={() => { if (showCart) { setShowCart(false); } else { setMilestone((m) => Math.max(1, m - 1) as Milestone); } }}
                className="flex h-8 w-8 items-center justify-center rounded-full text-ink-soft hover:bg-muted"><Pi name="pi-arrow-left" className="text-lg" /></button>
            ) : null}
            {milestone === 1 && !showCart && (
              <button type="button" onClick={() => { if (cart.count > 0) setShowCart(true); }}
                className="relative flex h-8 w-8 items-center justify-center rounded-full text-ink-soft hover:bg-muted">
                <Pi name="pi-shopping-cart" className="text-lg" />
                {cart.count > 0 && <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[9px] font-bold text-white">{cart.count}</span>}
              </button>
            )}
            <h2 className="text-lg font-semibold text-foreground">{showCart ? "Cart" : title}</h2>
          </div>
          {closeBtn}
        </div>

        {bookingResult ? renderBookingResult() : showCart ? renderCartView() : (
          <>
            {renderMilestoneBar()}
            <div className="flex-1 overflow-y-auto">
              {milestone === 1 && renderM1CompleteBooking()}
              {milestone === 2 && renderM2Contact()}
              {milestone === 3 && renderM3Payment()}
              {milestone === 4 && renderM4Timing()}
            </div>
          </>
        )}
      </div>
    </div>
  );

  if (typeof document === "undefined") return null;
  return createPortal(modalContent, document.body);
}
