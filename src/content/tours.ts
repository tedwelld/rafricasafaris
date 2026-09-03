/**
 * Tour landing-page content for Rise Africa Safaris.
 * Bokun remains the source of truth for live prices once experience IDs are set.
 */

import { demoPhoto } from "@/lib/img";

export type Tour = {
  slug: string;
  name: string;
  destinationSlug: string;
  category: "Accommodated" | "Budget" | "Child Friendly" | "Classic" | "Group" | "Nature Walk";
  durationDays: number;
  summary: string;
  description: string;
  highlights: string[];
  priceFrom?: string;
  image: string;
  bokunExperienceId?: string;
  bokunProductId?: number;
  bookingCount?: number;
};

export const tours: Tour[] = [
  {
    slug: "victoria-falls-classic",
    name: "Falls & Zambezi Starter",
    destinationSlug: "zimbabwe",
    category: "Classic",
    durationDays: 3,
    summary: "Guided Falls walk, evening river cruise and a Hwange day with Rise Africa.",
    description:
      "A compact Victoria Falls base: rainforest viewpoints with your guide, a late-day Zambezi boat run for hippo and elephant, then a full day into Hwange for herds and open country. Built for first-time visitors who want river and park in one short stay.",
    highlights: ["Guided Falls walk", "Zambezi evening cruise", "Hwange day drive", "Transfers arranged"],
    priceFrom: "$65",
    image: demoPhoto("victoria-falls,waterfall", 201, 1200, 800),
    bokunExperienceId: "1228507",
    bokunProductId: 1228507,
    bookingCount: 142,
  },
  {
    slug: "okavango-delta-explorer",
    name: "Okavango Water & Walk",
    destinationSlug: "botswana",
    category: "Accommodated",
    durationDays: 4,
    summary: "Mokoro channels, island walks and floodplain game time in the Delta.",
    description:
      "Four days shaped around water: mokoro through papyrus lanes, short walks with your guide, and drives where the floodplains open. Rise Africa links you from Victoria Falls so the Delta feels like a planned chapter, not a scramble.",
    highlights: ["Mokoro channels", "Guided island walks", "Floodplain drives", "Bush camp nights"],
    priceFrom: "$ on request",
    image: demoPhoto("okavango,delta,canoe", 202, 1200, 800),
    bookingCount: 98,
  },
  {
    slug: "chobe-river-safari",
    name: "Chobe River Days",
    destinationSlug: "botswana",
    category: "Group",
    durationDays: 2,
    summary: "River boats and floodplain drives where elephants gather in numbers.",
    description:
      "Two focused days on the Chobe waterfront — morning drives along the floodplain and an afternoon boat for bankside wildlife. Easy to bolt onto a Victoria Falls stay when you want Botswana without a long itinerary.",
    highlights: ["Chobe boat run", "Floodplain drive", "Birdlife", "Sundowner stop"],
    priceFrom: "$ on request",
    image: demoPhoto("elephant,river,africa", 203, 1200, 800),
    bookingCount: 156,
  },
  {
    slug: "sossusvlei-dunes-adventure",
    name: "Sossusvlei Dune Circuit",
    destinationSlug: "namibia",
    category: "Nature Walk",
    durationDays: 5,
    summary: "Sunrise dunes, Deadvlei walks and desert wildlife in open Namibia.",
    description:
      "Climb early for dune light, walk Deadvlei’s clay pans, and watch for desert-adapted game on the drive days. We stage the logistics so this desert stretch pairs cleanly with your Zimbabwe or Botswana legs.",
    highlights: ["Dune sunrise", "Deadvlei walk", "Desert wildlife", "Night skies"],
    priceFrom: "$ on request",
    image: demoPhoto("sossusvlei,dune,desert", 204, 1200, 800),
    bookingCount: 73,
  },
  {
    slug: "south-luangwa-walking-safari",
    name: "Luangwa on Foot",
    destinationSlug: "zambia",
    category: "Nature Walk",
    durationDays: 4,
    summary: "Walking-led days in South Luangwa with drives for the longer reaches.",
    description:
      "South Luangwa rewards time on foot. Track with armed walking guides, then use vehicles for distance. A strong choice when you want fewer engines and more bushcraft — Rise Africa handles the Victoria Falls link.",
    highlights: ["Guided walks", "Game drives", "Riverside camps", "Night drive options"],
    priceFrom: "$ on request",
    image: demoPhoto("safari,walking,leopard", 205, 1200, 800),
    bookingCount: 64,
  },
  {
    slug: "family-falls-adventure",
    name: "Family Falls Pace",
    destinationSlug: "zimbabwe",
    category: "Child Friendly",
    durationDays: 3,
    summary: "Shorter Falls outing, gentle river cruise and a half-day drive for families.",
    description:
      "Built for mixed ages: a paced Falls visit, an easy Zambezi cruise and a shorter game drive with room to rest. We keep transfers simple and the schedule flexible around nap times and energy levels.",
    highlights: ["Family-paced Falls", "Easy river cruise", "Half-day drive", "Flexible timing"],
    priceFrom: "$ on request",
    image: demoPhoto("giraffe,safari,family", 206, 1200, 800),
    bookingCount: 35,
  },
  {
    slug: "victoria-falls-guided-tour",
    name: "Victoria Falls Walk with Guide",
    destinationSlug: "zimbabwe",
    category: "Nature Walk",
    durationDays: 0,
    summary: "Half-day guided walk of the Falls rainforest and viewpoints.",
    description:
      "Meet your Rise Africa guide for a walking circuit of Victoria Falls viewpoints — spray, gorge angles and quieter side paths when conditions allow. Ideal as a single morning or afternoon add-on.",
    highlights: ["Local guide", "Viewpoints", "Photo stops", "Rainforest paths"],
    priceFrom: "$65",
    image: demoPhoto("victoria-falls,waterfall", 201, 1200, 800),
    bokunExperienceId: "1228507",
    bokunProductId: 1228507,
    bookingCount: 200,
  },
];

export const getTour = (slug: string) => tours.find((t) => t.slug === slug);
export const getToursByDestination = (destinationSlug: string) =>
  tours.filter((t) => t.destinationSlug === destinationSlug);
