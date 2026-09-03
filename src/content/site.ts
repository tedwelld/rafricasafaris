/** Guides, testimonials, gallery, and brand pillars for Rise Africa Safaris. */

import { demoPhoto } from "@/lib/img";

export type Guide = {
  name: string;
  role: string;
  bio: string;
  image: string;
};

export const guides: Guide[] = [
  {
    name: "Blessed Gundo",
    role: "Lead Safari Guide & Boat Captain",
    bio: "Blessed knows the Zambezi and surrounding parks like a second home. From river cruises to game drives, he keeps every journey safe, personal and full of wildlife stories you will not get from a brochure.",
    image: "/images/guides/blessed-gundo.jpg",
  },
];

export type Testimonial = {
  quote: string;
  author: string;
  location: string;
  rating: number;
};

export const testimonials: Testimonial[] = [
  {
    quote:
      "Blessed spotted wildlife we would have missed completely. The boat cruise felt private, calm and expertly run from start to finish.",
    author: "Amelia T.",
    location: "Australia",
    rating: 5,
  },
  {
    quote:
      "WhatsApp replies were quick and clear. Rise Africa built a trip around our dates without pressure — exactly what we needed.",
    author: "Daniel & Priya",
    location: "Canada",
    rating: 5,
  },
  {
    quote:
      "Victoria Falls by day, river wildlife by evening. Honest advice, solid vehicles and a guide who clearly loves this work.",
    author: "Noah K.",
    location: "Netherlands",
    rating: 5,
  },
];

export type Pillar = {
  title: string;
  description: string;
  icon: string;
};

export const pillars: Pillar[] = [
  {
    title: "Guide-led trips",
    description: "You travel with people who work these routes daily — not a scripted coach tour.",
    icon: "Award",
  },
  {
    title: "Clear communication",
    description: "Ask anything on WhatsApp or email. We confirm details before you fly.",
    icon: "ShieldCheck",
  },
  {
    title: "River & park know-how",
    description: "Boat, vehicle and walking options across Victoria Falls and neighbouring parks.",
    icon: "Leaf",
  },
  {
    title: "Built around you",
    description: "Private or small-group days shaped to your pace, budget and interests.",
    icon: "Sparkles",
  },
];

export const gallery: { src: string; alt: string }[] = [
  { src: demoPhoto("elephant,waterhole", 501, 800, 1000), alt: "Elephant herd at a waterhole" },
  { src: demoPhoto("lion,africa", 502, 800, 800), alt: "Lion resting in afternoon light" },
  { src: demoPhoto("victoria-falls", 503, 800, 800), alt: "Victoria Falls spray and gorge" },
  { src: demoPhoto("okavango,mokoro", 504, 800, 1000), alt: "Quiet waterways in the Delta" },
  { src: demoPhoto("sossusvlei,dune", 505, 800, 800), alt: "Namib dunes at first light" },
  { src: demoPhoto("giraffe,acacia", 506, 800, 800), alt: "Giraffe against an acacia skyline" },
  { src: demoPhoto("zambezi,sunset,cruise", 507, 800, 1000), alt: "Evening cruise on the Zambezi" },
  { src: demoPhoto("leopard,tree", 508, 800, 800), alt: "Leopard resting at dusk" },
];
