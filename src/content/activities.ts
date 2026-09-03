/** Activity categories shown as a grid (mirrors the reference site). */

import { demoPhoto } from "@/lib/img";

export type Activity = {
  slug: string;
  name: string;
  description: string;
  icon: string; // content icon name (mapped to PrimeIcons in components/Icon.tsx)
  image: string;
};

export const activities: Activity[] = [
  { slug: "game-drive", name: "Game Drive", description: "Open-vehicle drives in search of the Big Five with expert trackers.", icon: "Binoculars", image: demoPhoto("safari,jeep,lion", 301, 900, 700) },
  { slug: "boat-cruise", name: "Boat Cruise", description: "Sunset cruises on the Zambezi and Chobe rivers.", icon: "Ship", image: demoPhoto("river,boat,sunset,africa", 302, 900, 700) },
  { slug: "bush-walk", name: "Bush Walk", description: "Guided walking safaris that bring the wilderness to life on foot.", icon: "Footprints", image: demoPhoto("bush,walk,savannah", 303, 900, 700) },
  { slug: "mokoro-excursion", name: "Mokoro Excursion", description: "Glide silently through the Okavango Delta by traditional canoe.", icon: "Waves", image: demoPhoto("okavango,canoe,mokoro", 304, 900, 700) },
  { slug: "cultural-village", name: "Cultural Village", description: "Meet local communities and experience living traditions.", icon: "Home", image: demoPhoto("african,village,culture", 305, 900, 700) },
  { slug: "white-water-rafting", name: "White Water Rafting", description: "Take on the legendary rapids below Victoria Falls.", icon: "Waves", image: demoPhoto("rafting,rapids,river", 306, 900, 700) },
  { slug: "helicopter-flight", name: "Helicopter Flight", description: "Soar above the Falls for the 'Flight of Angels'.", icon: "Plane", image: demoPhoto("helicopter,aerial,waterfall", 307, 900, 700) },
  { slug: "quad-biking", name: "Quad Biking", description: "Explore the bush and riverine trails on quad bikes.", icon: "Bike", image: demoPhoto("quad,bike,offroad", 308, 900, 700) },
  { slug: "boma-dinner", name: "Boma Dinner", description: "Traditional open-air feasts under the African stars.", icon: "Utensils", image: demoPhoto("campfire,dinner,africa", 309, 900, 700) },
  { slug: "national-park", name: "National Park", description: "Full-day excursions into the region's iconic parks.", icon: "Trees", image: demoPhoto("national,park,wildlife", 310, 900, 700) },
  { slug: "bungee-jumping", name: "Bungee Jumping", description: "Leap from the Victoria Falls Bridge — 111 metres of thrill.", icon: "MoveDown", image: demoPhoto("bungee,bridge,adventure", 311, 900, 700) },
  { slug: "rock-painting", name: "Rock Painting", description: "Discover ancient San rock art in the Matobo Hills.", icon: "Palette", image: demoPhoto("cave,rock,art", 312, 900, 700) },
];
