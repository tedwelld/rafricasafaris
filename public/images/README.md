# Image assets — Rise Africa Safaris

## Logo / favicon

- `favicon.svg` — site favicon (gold/green mark).
- Optional: drop `logo.png` here for a badge logo; until then the header uses the
  text wordmark in `src/components/Logo.tsx`.

## Demo photography (`demo/`)

Catalog images (destinations, tours, activities, guides, gallery, blog, hero)
are self-hosted Unsplash/Pexels photos (free licenses) in `demo/` and served from
our own domain.

How it works: each content item calls `demoPhoto(tags, lock)` and the `lock`
number is mapped to a file in `demo/` by `src/lib/img.ts`.

## Videos

Cinematic safari clips live in `public/videos/` (muted autoplay on the homepage
hero and gallery accents). Sources are royalty-free (Pexels/Coverr). Keep files
lean for the web (~5–15MB).

Before launch, replace demo stills/clips with rights-cleared Rise Africa Safaris
photography when available.
