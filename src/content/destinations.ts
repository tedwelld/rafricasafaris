/**
 * Destination marketing content for Rise Africa Safaris.
 */

import { demoPhoto } from "@/lib/img";

export type Destination = {
  slug: string;
  name: string;
  country: string;
  tagline: string;
  description: string;
  highlights: string[];
  image: string;
  bokunProductListId?: string;
};

export const destinations: Destination[] = [
  {
    slug: "zimbabwe",
    name: "Zimbabwe",
    country: "Zimbabwe",
    tagline: "Victoria Falls spray, Zambezi sunsets, Hwange herds",
    description:
      "Our home base. Walk the Falls rainforest trails, cruise the Zambezi for hippo and elephant, then push inland to Hwange for big herds and classic game drives with Rise Africa guiding.",
    highlights: ["Victoria Falls", "Hwange National Park", "Zambezi River", "Matobo Hills"],
    image: "/vicfalls.jpeg",
  },
  {
    slug: "botswana",
    name: "Botswana",
    country: "Botswana",
    tagline: "Delta channels and Chobe riverbanks",
    description:
      "Link from Victoria Falls into Chobe for river-edge elephants, or continue to the Okavango for mokoro days and quiet floodplain wildlife. We time transfers so the journey feels continuous, not rushed.",
    highlights: ["Okavango Delta", "Chobe National Park", "Mokoro days", "Big cats"],
    image: demoPhoto("okavango,delta,botswana", 102, 1200, 900),
  },
  {
    slug: "namibia",
    name: "Namibia",
    country: "Namibia",
    tagline: "Dunes, desert elephants, huge skies",
    description:
      "Add Namibia when you want space: Sossusvlei dunes, Etosha waterholes and Damaraland tracking. Rise Africa builds the road or air links so the contrast with green Victoria Falls country lands properly.",
    highlights: ["Sossusvlei dunes", "Etosha National Park", "Skeleton Coast", "Damaraland"],
    image: demoPhoto("namibia,desert,dunes", 103, 1200, 900),
  },
  {
    slug: "zambia",
    name: "Zambia",
    country: "Zambia",
    tagline: "Walking country and Lower Zambezi quiet",
    description:
      "Cross to Zambia for walking-focused days in South Luangwa or canoe time on the Lower Zambezi. Ideal when you want fewer vehicles and more time on foot with a skilled guide.",
    highlights: ["South Luangwa", "Lower Zambezi", "Walking days", "Canoe safaris"],
    image: demoPhoto("zambia,safari,river", 104, 1200, 900),
  },
];

export const getDestination = (slug: string) =>
  destinations.find((d) => d.slug === slug);
