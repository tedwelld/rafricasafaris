/**
 * Demo imagery helper — now SELF-HOSTED.
 *
 * Previously these pointed at loremflickr.com, but that service became
 * unreliable (HTTP 500s), so images failed to load in production. Images are now
 * curated Unsplash photos downloaded into `public/images/demo/` and served from
 * our own domain (Vercel CDN) — fast and reliable, no third-party runtime call.
 *
 * Each content item passes a stable `lock` number (unchanged from before); the
 * map below resolves that lock to a local image. The `tags`/`width`/`height`
 * args are kept only so existing call sites don't need to change.
 *
 * These are DEMO images (Unsplash license). Replace with rights-cleared
 * Rise Africa Safaris photography by dropping files in `public/images` and
 * updating the content files to local paths before launch.
 */

const DEMO_DIR = "/images/demo";

/** lock -> image filename (without extension) in public/images/demo */
const lockImage: Record<number, string> = {
  // Hero / page chrome
  1: "elephants-sunset", // homepage hero
  2: "giraffe-sunset", // inner page-header default
  3: "safari-jeep", // about page

  // Destinations (101-104)
  101: "waterfall", // Zimbabwe — Victoria Falls
  102: "forest-stream", // Botswana — Okavango Delta (water)
  103: "desert-dunes", // Namibia — dunes
  104: "rhinos-road", // Zambia — bush/safari

  // Tours (201-206)
  201: "waterfall", // Victoria Falls Classic
  202: "forest-stream", // Okavango Delta Explorer
  203: "elephants-grass", // Chobe River Safari
  204: "desert-dunes", // Sossusvlei Dunes Adventure
  205: "leopard-log", // South Luangwa Walking Safari
  206: "rhino-calf", // Family Falls Adventure (mother + calf)

  // Activities (301-312)
  301: "safari-jeep", // Game Drive
  302: "elephants-sunset", // Boat Cruise (sunset)
  303: "giraffe-sunset", // Bush Walk
  304: "forest-stream", // Mokoro Excursion (water)
  305: "portrait-woman", // Cultural Village
  306: "waterfall", // White Water Rafting
  307: "desert-rock", // Helicopter Flight (aerial landscape)
  308: "safari-jeep", // Quad Biking
  309: "tent-camp", // Boma Dinner (camp)
  310: "rhinos-road", // National Park
  311: "waterfall", // Bungee Jumping (gorge/water)
  312: "desert-rock", // Rock Painting

  // Guides (401-403)
  401: "portrait-man",
  402: "portrait-woman",
  403: "portrait-man",

  // Gallery (501-508)
  501: "elephants-grass", // elephant herd
  502: "lion-portrait", // lion
  503: "waterfall", // Victoria Falls
  504: "forest-stream", // mokoro / delta
  505: "desert-dunes", // dunes
  506: "giraffe-portrait", // giraffe
  507: "elephants-sunset", // sunset cruise
  508: "leopard-log", // leopard

  // Blog (601-603)
  601: "elephants-grass", // Hwange elephants
  602: "waterfall", // Victoria Falls
  603: "giraffe-sunset", // walking safari
};

export function demoPhoto(
  tags: string,
  lock: number,
  width = 1200,
  height = 800,
): string {
  // tags/width/height retained for call-site compatibility only.
  void tags;
  void width;
  void height;
  return `${DEMO_DIR}/${lockImage[lock] ?? "safari-jeep"}.jpg`;
}
