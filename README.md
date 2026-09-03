# Rise Africa Safaris

Marketing + booking site for **Rise Africa Safaris** (Victoria Falls). Dark green +
white/black theme. Guests book via **Bókun widgets**, **WhatsApp** (+263 77 532 1238)
or **email** (info@rafricasafaris.com).

## Getting started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Lead guide: **Blessed Gundo** (`public/images/guides/blessed-gundo.jpg`).


## Tech stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4 (theme tokens in `src/app/globals.css`)
- PrimeIcons for UI icons — via `src/components/Pi.tsx`
- Bókun booking widgets (loader + embeds)
- Nodemailer + SMTP for transactional email
- react-hook-form + zod for the booking form

## Branding

- Logo: text wordmark in `src/components/Logo.tsx` (drop `public/images/logo.png` later
  if you want a badge image). SVG emblem: `src/components/LogoMark.tsx`.
- Favicon: `public/images/favicon.svg`
- Icons: PrimeIcons font (`primeicons`), imported once in `src/app/layout.tsx`.

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev                  # http://localhost:3000
```

## Environment variables

See [.env.example](.env.example). For **Bókun widgets** you only need:

| Var | Purpose |
|-----|---------|
| `NEXT_PUBLIC_BOKUN_CHANNEL_UUID` | Bókun booking channel UUID (enables the widgets) |
| `NEXT_PUBLIC_BOKUN_FEATURED_LIST_ID` | Optional product-list id for featured tours |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp business number, E.164 digits only |
| `SMTP_*` / `EMAIL_FROM` / `BOOKING_INBOX` | Email enquiry flow |

REST API keys (`BOKUN_ACCESS_KEY`, etc.) are optional and not required for widget booking.

## The three booking flows

1. **Bókun (online checkout widgets)** — `src/components/BokunWidget.tsx`. Loader in
   `src/app/layout.tsx`. Tour pages embed `experience-calendar`; explore/destination
   pages can embed `experience-list`. Map `slug → bokunExperienceId` in `src/content/tours.ts`.
2. **WhatsApp** — `src/components/WhatsAppButton.tsx`
3. **Email** — `src/components/BookingForm.tsx` → `POST /api/booking`

## Media

- Still photos: `public/images/demo/` (Unsplash/Pexels, free license)
- Cinematic hero / gallery clips: `public/videos/`
- Map locks → files in `src/lib/img.ts`

## Before launch

- Real Bókun channel UUID + per-tour experience IDs
- WhatsApp number, phone, email, address in `src/lib/siteConfig.ts`
- SMTP credentials + booking inbox
- Optional: custom logo at `public/images/logo.png`
