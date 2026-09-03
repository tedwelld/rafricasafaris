/**
 * Bókun REST API client (server-side only).
 *
 * Uses HMAC-SHA1 signature auth as documented at
 * https://bokun.dev/booking-api-rest/vU6sCfxwYdJWd1QAcLt12i/configuring-the-platform-for-api-usage-and-authentication
 *
 * Required env vars:
 *   BOKUN_API_BASE    — https://api.bokun.is (live) or https://api.bokuntest.com (test)
 *   BOKUN_ACCESS_KEY  — from the API key set
 *   BOKUN_SECRET_KEY  — from the API key set
 */

const BASE = process.env.BOKUN_API_BASE ?? "https://api.bokun.is";
const ACCESS_KEY = process.env.BOKUN_ACCESS_KEY ?? "";
const SECRET_KEY = process.env.BOKUN_SECRET_KEY ?? "";

function isConfigured() {
  return !!(ACCESS_KEY && SECRET_KEY);
}

async function sign(method: string, path: string, date: string): Promise<string> {
  const data = `${date}${ACCESS_KEY}${method.toUpperCase()}${path}`;
  const encoder = new TextEncoder();
  const key = encoder.encode(SECRET_KEY);
  const msg = encoder.encode(data);
  const cryptoKey = await globalThis.crypto.subtle.importKey(
    "raw",
    key,
    { name: "HMAC", hash: "SHA-1" },
    false,
    ["sign"],
  );
  const sig = await globalThis.crypto.subtle.sign("HMAC", cryptoKey, msg);
  return btoa(String.fromCharCode(...new Uint8Array(sig)));
}

export async function bokunFetch<T>(method: string, path: string, body?: unknown): Promise<T> {
  if (!isConfigured()) {
    throw new Error("Bokun API keys not configured. Set BOKUN_ACCESS_KEY and BOKUN_SECRET_KEY.");
  }
  const date = new Date().toISOString().replace("T", " ").slice(0, 19);
  const signature = await sign(method, path, date);

  const headers: Record<string, string> = {
    "X-Bokun-Date": date,
    "X-Bokun-AccessKey": ACCESS_KEY,
    "X-Bokun-Signature": signature,
  };
  if (body) {
    headers["Content-Type"] = "application/json;charset=UTF-8";
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 25000);

  try {
    const res = await fetch(`${BASE}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Bokun API error ${res.status}: ${text}`);
    }

    return res.json() as Promise<T>;
  } finally {
    clearTimeout(timer);
  }
}

// ---------------------------------------------------------------------------
// Types (based on Bokun API docs)
// ---------------------------------------------------------------------------

export type BokunProduct = {
  id: number;
  title: string;
  description?: string;
  excerpt?: string;
  summary?: string;
  photos?: { originalUrl: string; derived?: { name: string; url: string }[] }[];
  keyPhoto?: { originalUrl: string };
  categories?: { id: number; name: string }[];
  bookingType: "DATE" | "DATE_AND_TIME" | "PASS";
  capacityType: "FREE_SALE" | "LIMITED" | "ON_REQUEST";
  duration?: number;
  durationType?: string;
  durationText?: string;
  durationHours?: number;
  durationDays?: number;
  durationMinutes?: number;
  difficultyLevel?: string;
  meetingType?: string;
  minParticipants?: number;
  maxParticipants?: number;
  pricingCategories?: {
    id: number;
    title: string;
    description?: string;
    minAge?: number;
    maxAge?: number;
    ticketCategory?: string;
    defaultCategory?: boolean;
  }[];
  rates?: {
    id: number;
    title: string;
    defaultRate?: boolean;
    minPerBooking?: number;
    maxPerBooking?: number;
    pricedPerPerson: boolean;
  }[];
  defaultOpeningHours?: { from: string; to: string }[];
  tags?: string[];
  keywords?: string[];
  location?: { lat: number; lng: number; address?: string };
  externalId?: string;
  vendor?: { id: number; title: string; currencyCode?: string };
  reviewRating?: number;
  reviewCount?: number;
  activityType?: string;
  included?: any[];
  excluded?: any[];
  inclusions?: any[];
  exclusions?: any[];
  knowBeforeYouGoItems?: { title: string }[];
  requirements?: string[];
  startTimes?: { id: number; time: string; pickupHour?: number; pickupMinute?: number }[];
  bookableExtras?: any[];
  cancellationPolicy?: any;
};

export type BokunAvailability = {
  id: string;
  date: number;
  startTime?: string;
  startTimeId?: number;
  unlimitedAvailability: boolean;
  availabilityCount: number;
  bookedParticipants: number;
  minParticipants: number;
  minParticipantsToBookNow: number;
  soldOut: boolean;
  rates: { id: number; name: string; minPerBooking?: number; maxPerBooking?: number }[];
  pricesByRate: {
    activityRateId: number;
    pricePerCategoryUnit?: { id: number; amount: { amount: number; currency: string } }[];
    pricePerBooking?: { amount: number; currency: string };
    pickupPrice?: { amount: number; currency: string };
    extraPricePerUnit?: { id: number; amount: { amount: number; currency: string } }[];
  }[];
};

export type BokunSearchResult = {
  tookInMillis: number;
  totalHits: number;
  tagFilters: string[];
  tagFacets: any[];
  termFacets: Record<string, any>;
  items: BokunProduct[];
};

// ---------------------------------------------------------------------------
// API methods
// ---------------------------------------------------------------------------

/** Search products. Returns paginated results. */
export async function searchProducts(params?: {
  page?: number;
  pageSize?: number;
  categoryId?: number;
  text?: string;
}): Promise<BokunSearchResult> {
  return bokunFetch<BokunSearchResult>("POST", "/activity.json/search", {
    page: params?.page ?? 1,
    pageSize: params?.pageSize ?? 50,
    ...(params?.categoryId ? { categoryId: params.categoryId } : {}),
    ...(params?.text ? { text: params.text } : {}),
  });
}

/** Get full product details by ID. */
export async function getProduct(id: number): Promise<BokunProduct> {
  return bokunFetch<BokunProduct>("GET", `/activity.json/${id}`);
}

/** Check availability and pricing for a date range. */
export async function getAvailabilities(
  id: number,
  start: string,
  end: string,
  currency?: string,
): Promise<BokunAvailability[]> {
  let path = `/activity.json/${id}/availabilities?start=${start}&end=${end}`;
  if (currency) path += `&currency=${currency}`;
  return bokunFetch<BokunAvailability[]>("GET", path);
}

/** Get product price list by date range. */
export async function getPriceList(
  id: number,
  start: string,
  end: string,
): Promise<unknown> {
  return bokunFetch("GET", `/activity.json/${id}/price-list?start=${start}&end=${end}`);
}

// ---------------------------------------------------------------------------
// Booking types & API
// ---------------------------------------------------------------------------

export type BokunBookingParticipant = {
  pricingCategoryId: number;
  count: number;
  price?: number;
};

export type BokunBookingRequest = {
  productId: number;
  date: string;
  startTime?: string;
  participants: BokunBookingParticipant[];
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    nationality?: string;
  };
  notes?: string;
  channelId?: string;
};

export type BokunBookingResponse = {
  id: number;
  reference: string;
  status: string;
  paymentUrl?: string;
  totalPrice?: { amount: number; currency: string };
};

/** Create a booking in Bokun. */
export async function createBooking(
  request: BokunBookingRequest,
): Promise<BokunBookingResponse> {
  return bokunFetch<BokunBookingResponse>("POST", "/bookings", request);
}
