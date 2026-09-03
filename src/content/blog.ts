/** Simple in-repo blog content. Swap to a CMS later if needed. */

import { demoPhoto } from "@/lib/img";

export type BlogSection = {
  id: string;
  label: string;
  content: string;
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string; // ISO
  author: string;
  image: string;
  /** Brief introductory paragraph shown above the tabs. */
  body: string;
  /** Tabbed deep-dive sections for the full article. */
  sections: BlogSection[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "best-time-to-visit-hwange",
    title: "The Best Time to Visit Hwange National Park",
    excerpt:
      "When the rains retreat, the elephants gather. Here's how to time your Hwange safari for the very best game viewing.",
    date: "2026-05-12",
    author: "Rise Africa Safaris",
    image: demoPhoto("hwange,elephant,africa", 601, 1200, 700),
    body:
      "Hwange is Zimbabwe's largest national park and home to one of Africa's biggest elephant populations. Timing your visit is the key to an unforgettable safari experience.",
    sections: [
      {
        id: "overview",
        label: "Overview",
        content:
          "Spanning over 14,600 square kilometres, Hwange National Park sits in the northwest of Zimbabwe, near the edge of the Kalahari sands. Its diverse habitats — from teak forests to grassy plains — support over 100 mammal species and nearly 400 bird species.\n\nThe park is famous for its huge elephant herds, which can number in the hundreds during the dry months. Lion, leopard, wild dog, giraffe, zebra and countless antelope species thrive here. Hwange also holds one of Africa's densest populations of brown hyena."
      },
      {
        id: "dry-season",
        label: "Dry Season (May–Oct)",
        content:
          "The dry season is Hwange's prime game-viewing window. By July, most natural water sources have evaporated, drawing enormous herds to the park's 60+ pumped waterholes. Sightings are reliable and spectacular.\n\nTemperatures are mild in the mornings and evenings, warming up by midday. This is also the best time for walking safaris and night drives. The golden light and clear skies make for exceptional photography.\n\nAccommodation books out well in advance — we recommend planning at least 4–6 months ahead for peak season (August–October)."
      },
      {
        id: "green-season",
        label: "Green Season (Nov–Apr)",
        content:
          "The rains transform Hwange into a lush emerald paradise. Migrant birds arrive, wildflowers bloom, and the park is quiet with far fewer visitors. This is a magical time for birders, photographers and those who value solitude.\n\nGame viewing requires more patience as animals disperse across the park. However, this is also the season for newborn animals and dramatic storm skies.\n\nMany lodges offer off-peak rates during this period, making it an excellent value-for-money option. Short, heavy rains usually clear by midday, leaving fresh afternoon light."
      },
      {
        id: "wildlife",
        label: "Wildlife Highlights",
        content:
          "Hwange's elephant population — estimated at over 45,000 — is the park's crown jewel. During the dry season, you can watch hundreds of elephants gather at a single waterhole, a truly humbling sight.\n\nThe park also boasts strong populations of lion and the Endangered African wild dog. Leopards are more elusive but regularly seen in the wooded areas. Hwange is also one of the best places in Zimbabwe to see cheetah.\n\nFor bird enthusiasts, look out for kori bustard, southern ground hornbill, bateleur eagles and the striking carmine bee-eater during the summer months."
      }
    ]
  },
  {
    slug: "victoria-falls-beyond-the-falls",
    title: "Victoria Falls: Beyond the Falls",
    excerpt:
      "The Falls are just the beginning. Discover the adventures, cruises and culture that make this one of Africa's great destinations.",
    date: "2026-04-28",
    author: "Rise Africa Safaris",
    image: "/vicfalls.jpeg",
    body:
      "Most travellers come for the thundering curtain of water — and it never disappoints. But Victoria Falls is also a vibrant hub of adventure, culture and natural beauty.",
    sections: [
      {
        id: "the-falls",
        label: "The Falls",
        content:
          "Victoria Falls — known locally as Mosi-oa-Tunya, 'The Smoke that Thunders' — is one of the Seven Natural Wonders of the World. At 1,708 metres wide and 108 metres tall, it is the largest curtain of falling water on Earth.\n\nThe best views are from the Zimbabwe side, where a well-maintained path offers 16 lookout points. During high water (February–July), the spray can soak you from hundreds of metres away — take a raincoat!\n\nFor a unique perspective, take a helicopter 'Flight of Angels' or a microlight flight over the gorge. The sunset from above the Falls is simply unforgettable."
      },
      {
        id: "adventures",
        label: "Adventures",
        content:
          "Victoria Falls is the adventure capital of Southern Africa. The Zambezi River below the gorge offers world-class white-water rafting through rapids with names like 'The Terminator' and 'Oblivion'.\n\nFor a different thrill, bungee jump from the Victoria Falls Bridge — 111 metres above the gorge, with the border between Zimbabwe and Zambia at your feet.\n\nOther must-try activities include jet-boating, zip-lining, abseiling, and horse-back safaris along the river. Most activities depart from the town of Victoria Falls and are available year-round."
      },
      {
        id: "culture",
        label: "Cultural Experiences",
        content:
          "Beyond the natural wonders, Victoria Falls offers rich cultural encounters. Visit a local village to experience traditional music, dance and daily life. The Boma Dinner — a feast of wild game and traditional dishes — is a highlight for many visitors.\n\nArt galleries and craft markets showcase the incredible talent of local sculptors and painters. Zimbabwe is famous for its Shona stone sculpture, and you can watch artists at work in several studios around town.\n\nA guided tour with a local historian brings the stories of the region to life — from the Toka-Leya people who first inhabited the area to the colonial era and modern conservation efforts."
      },
      {
        id: "planning",
        label: "Planning Tips",
        content:
          "The best time to visit depends on what you want. For the most dramatic waterfall views, come in April–June when the water is at its peak. For adventure activities like rafting, the low-water season (August–January) is better.\n\nWe recommend a minimum of 3 nights to experience the Falls, a sunset cruise, and one adventure activity. Adding a game drive in nearby Hwange National Park transforms a good trip into a classic safari.\n\nVisa requirements vary by nationality — most visitors can obtain a visa on arrival. The town is walkable, but we arrange all transfers so you can relax and enjoy."
      }
    ]
  },
  {
    slug: "why-walking-safaris",
    title: "Why a Walking Safari Changes Everything",
    excerpt:
      "There's no substitute for experiencing the bush on foot. Here's what makes a walking safari unforgettable.",
    date: "2026-04-02",
    author: "Rise Africa Safaris",
    image: demoPhoto("walking,safari,bush", 603, 1200, 700),
    body:
      "On foot, the bush reveals itself differently. You notice tracks, scents and the small details a vehicle rushes past. It's immersive, humbling and utterly memorable.",
    sections: [
      {
        id: "what-to-expect",
        label: "What to Expect",
        content:
          "A walking safari is not a strenuous hike — it's a slow, sensory journey. Led by an armed professional guide and tracker, you walk at a relaxed pace, stopping frequently to examine tracks, plants and insects.\n\nWalks typically last 2–4 hours and take place in the early morning or late afternoon when temperatures are cool. You'll learn to identify bird calls, read animal tracks, and understand the intricate web of life that makes up the bush.\n\nChildren aged 12+ are welcome on most walking safaris. No prior experience is needed — just a sense of curiosity and comfortable walking shoes."
      },
      {
        id: "best-destinations",
        label: "Best Destinations",
        content:
          "Zambia's South Luangwa National Park is widely regarded as the birthplace of the walking safari and remains the gold standard. The park's expert guides and abundant wildlife make every walk extraordinary.\n\nHwange National Park in Zimbabwe offers excellent walking safaris in the company of experienced trackers. The open woodlands provide good visibility, and the chance to encounter elephant on foot is electrifying.\n\nIn Botswana, the Okavango Delta offers a unique water-and-walk combination. Explore islands on foot with a guide, learning about medicinal plants and tracking wildlife through floodplain habitats.\n\nNamibia's Damaraland offers a different walking experience — tracking desert-adapted rhino and elephant on foot across starkly beautiful landscapes."
      },
      {
        id: "safety",
        label: "Safety & Preparation",
        content:
          "Safety is paramount on any walking safari. Our guides are licensed, highly trained, and carry rifles for emergency use only — they have an intimate understanding of animal behaviour and will always keep you at a safe distance.\n\nWhat to bring: closed-toe walking shoes, neutral-coloured clothing (avoid bright colours), sunscreen, a hat, and plenty of water. Your guide will brief you on safety protocols before you set off.\n\nMost importantly, follow the guide's instructions at all times. Stay calm, stay quiet, and trust your guide. The experience is far safer than most people imagine."
      },
      {
        id: "why-it-matters",
        label: "Why It Matters",
        content:
          "A walking safari changes your perspective forever. Without the hum of an engine, you hear the bush breathe. You smell wild sage crushed underfoot. You feel the ground tremble as elephants pass.\n\nIt connects you to the ancient rhythm of the wilderness — the same rhythm our ancestors knew. It fosters a deep respect for nature and a understanding of why conservation matters.\n\nMany travellers say their walking safari was the most meaningful experience of their entire trip. It's not just a activity; it's a transformation."
      }
    ]
  },
  {
    slug: "ultimate-okavango-delta-guide",
    title: "The Ultimate Guide to the Okavango Delta",
    excerpt:
      "A pristine wilderness where water and wildlife converge. Everything you need to plan your Okavango Delta safari.",
    date: "2026-06-01",
    author: "Rise Africa Safaris",
    image: demoPhoto("okavango,delta,water", 604, 1200, 700),
    body:
      "The Okavango Delta is one of Africa's last great wilderness areas — a vast, inland river delta that floods seasonally, creating a mosaic of waterways, islands and floodplains teeming with wildlife.",
    sections: [
      {
        id: "overview",
        label: "Overview",
        content:
          "The Okavango Delta in northern Botswana is a UNESCO World Heritage Site and one of the most unique ecosystems on Earth. Each year, floodwaters from the Angolan highlands travel over 1,000 kilometres to spread across the Kalahari Desert, creating a 15,000-square-kilometre oasis.\n\nThis annual flood transforms the landscape, attracting wildlife from across the region. The delta is home to the Big Five, large herds of elephant and buffalo, African wild dog, hippo, crocodile, and over 400 bird species.\n\nAccess is primarily by light aircraft, landing on remote airstrips at luxury camps. It's exclusive, remote and utterly unforgettable."
      },
      {
        id: "wildlife",
        label: "Wildlife & Seasons",
        content:
          "The Okavango offers year-round game viewing, but each season has its character. The dry season (May–October) coincides with the flood, concentrating wildlife on permanent water sources. This is prime time for big-game sightings.\n\nThe green season (November–April) sees the floodwaters recede and the rains arrive. Lush vegetation attracts migratory birds, and the landscape is at its most beautiful. This is also calving season for many antelope species.\n\nSpecial sightings include the rare sitatunga antelope, Pel's fishing owl, and large prides of lion adapted to hunting in floodplain environments. The delta also hosts one of Africa's highest densities of African wild dog."
      },
      {
        id: "mokoro",
        label: "Mokoro Safaris",
        content:
          "No visit to the Okavango is complete without a mokoro ride. These traditional dugout canoes glide silently through the delta's clear channels, allowing you to approach wildlife without disturbance.\n\nYour poler stands at the back, navigating through papyrus-lined channels with expert precision. You sit close to the water's surface, watching frogs, lily-trotters and, if you're lucky, elephants crossing ahead.\n\nMokoro trips typically last 2–3 hours and are suitable for all ages. Combine a mokoro ride with a walking safari on an island for the ultimate Okavango experience."
      },
      {
        id: "camps",
        label: "Camps & Accommodation",
        content:
          "Accommodation in the Okavango ranges from classic tented camps to ultra-luxury lodges. Most camps are small — 6 to 12 tents — ensuring an intimate, low-impact experience.\n\nPopular areas include the Moremi Game Reserve (excellent year-round), the private concessions north of the delta (exclusive wildlife viewing), and the seasonal floodplains of the south (best accessed by boat).\n\nWe recommend a minimum of 3 nights to fully appreciate the delta's diversity. Many travellers combine an Okavango safari with Victoria Falls or Chobe National Park."
      }
    ]
  },
  {
    slug: "safari-packing-list",
    title: "The Ultimate Safari Packing List",
    excerpt:
      "Packing for an African safari is different from any other trip. Here's exactly what to bring — and what to leave at home.",
    date: "2026-05-20",
    author: "Rise Africa Safaris",
    image: demoPhoto("safari,packing,bag", 605, 1200, 700),
    body:
      "Packing for an African safari is about balance — you need to be prepared for warm days, cool nights, dust and surprise rain showers, all while keeping your luggage light for small aircraft.",
    sections: [
      {
        id: "clothing",
        label: "Clothing",
        content:
          "The golden rule: neutral colours (khaki, olive, beige, brown). Bright colours scare wildlife, and dark colours attract tsetse flies. Avoid blue and black.\n\nEssentials: 3–4 lightweight long-sleeved shirts (for sun and mosquito protection), 2–3 pairs of comfortable trousers, a warm fleece or jacket for early morning game drives, a waterproof jacket, and a wide-brimmed hat.\n\nFor women, a lightweight scarf is invaluable — for dust, sun, and covering up at cultural sites. Swimwear is essential — most camps have pools.\n\nLaundry services are available at most lodges, so pack for 4–5 days and re-wear items. A 15–20kg soft-sided duffel bag is ideal for bush flights."
      },
      {
        id: "gear",
        label: "Essential Gear",
        content:
          "Binoculars are non-negotiable. A good pair (8×42 is ideal) transforms your game-viewing experience. If you don't own one, we can provide a pair, but having your own is better.\n\nA headlamp or small torch is essential for walking around camp at night. A reusable water bottle (most lodges provide filtered water), sunscreen (SPF 50+), and insect repellent with DEET are also must-haves.\n\nOther useful items: a power bank for charging devices, a small daypack for walks, earplugs (for noisy nights), and a travel journal. Leave valuables and jewellery at home — safaris are casual."
      },
      {
        id: "health",
        label: "Health & Safety",
        content:
          "Consult your doctor or a travel clinic 4–6 weeks before your trip. Recommended vaccinations may include yellow fever, hepatitis A, typhoid and tetanus. Malaria prophylaxis is strongly recommended for most safari regions.\n\nBring a basic first-aid kit with plasters, antiseptic, pain relievers, antihistamines, oral rehydration salts, and any prescription medications (in original packaging with a copy of your prescription).\n\nTravel insurance with medical evacuation coverage is essential. We work with certified operators who can arrange emergency evacuation if needed."
      },
      {
        id: "photography",
        label: "Photography Tips",
        content:
          "A DSLR or mirrorless camera with a 200–400mm lens is ideal for wildlife photography. A 70–200mm zoom is a good all-rounder. Don't forget spare batteries (cold mornings drain them fast) and plenty of memory cards.\n\nA smartphone with a good camera is a great backup. For the best results, shoot in early morning and late afternoon golden light. Use a fast shutter speed (1/500s or faster) for moving animals.\n\nMost importantly: put the camera down sometimes. Some of the most magical moments happen when you're just watching, not shooting."
      }
    ]
  },
  {
    slug: "cultural-encounters-southern-africa",
    title: "Cultural Encounters in Southern Africa",
    excerpt:
      "Beyond the wildlife, the people of Southern Africa offer some of the richest travel experiences. Here's how to engage respectfully and meaningfully.",
    date: "2026-05-08",
    author: "Rise Africa Safaris",
    image: demoPhoto("african,village,culture", 606, 1200, 700),
    body:
      "Southern Africa's cultural heritage is as diverse and beautiful as its landscapes. From San rock art in the Matobo Hills to vibrant township tours, meaningful encounters with local communities enrich every safari.",
    sections: [
      {
        id: "traditions",
        label: "Living Traditions",
        content:
          "The region is home to dozens of ethnic groups, each with distinct languages, customs and traditions. The Shona and Ndebele of Zimbabwe, the Tswana of Botswana, the Himba of Namibia, and the Lozi of Zambia are just a few.\n\nMusic and dance are central to community life. Traditional drumming, mbira music and energetic dance performances are common during festivals and celebrations. Many lodges invite local performers to share their art with guests.\n\nArtisan crafts — including basket-weaving, wood carving, pottery and beadwork — are both beautiful and deeply symbolic. Purchasing directly from artisans supports local economies and preserves traditional skills."
      },
      {
        id: "responsible-tourism",
        label: "Responsible Tourism",
        content:
          "Meaningful cultural exchange requires respect and sensitivity. Always ask permission before taking photographs of people. Dress modestly when visiting villages. Learn a few words of the local language — greetings go a long way.\n\nChoose community-run tourism initiatives where the benefits flow directly to local people. Many lodges support education, healthcare and conservation projects in surrounding communities.\n\nWe partner with operators who employ local guides, pay fair wages, and invest in community development. Your safari should benefit the people who call these wild places home."
      },
      {
        id: "experiences",
        label: "Recommended Experiences",
        content:
          "In Zimbabwe, visit the Matobo Hills to see ancient San rock paintings and meet local guides who share the spiritual significance of these sacred hills. A village walk near Victoria Falls offers insight into daily rural life.\n\nIn Botswana, a visit to a Herders' village in the Okavango Delta provides a glimpse into traditional life alongside wildlife. Learn how local communities co-exist with elephants and lions.\n\nIn Namibia, meet the Himba people in Kunene Region — one of Africa's last semi-nomadic pastoralist cultures. In Zambia, experience a village stay in the Luangwa Valley, where community scouts protect wildlife and welcome visitors."
      },
      {
        id: "conservation",
        label: "Conservation & Community",
        content:
          "The connection between conservation and community is inseparable. Many of Africa's most successful conservation areas are community-managed, where local people benefit directly from tourism.\n\nZimbabwe's CAMPFIRE programme allows communities to manage wildlife on their land, generating income from hunting and photographic tourism. In Namibia, communal conservancies cover over 20% of the country.\n\nBy choosing responsible tourism, you directly support these efforts. Your visit helps prove that wildlife is worth more alive than dead, supporting jobs, schools and conservation across the region."
      }
    ]
  },
  {
    slug: "photography-on-safari",
    title: "Photography on Safari: Tips for Stunning Shots",
    excerpt:
      "Capture the magic of your African safari with these practical photography tips — from gear selection to composition and light.",
    date: "2026-04-15",
    author: "Rise Africa Safaris",
    image: demoPhoto("safari,photography,camera", 607, 1200, 700),
    body:
      "An African safari offers some of the most extraordinary photography opportunities on Earth. With a little preparation, you can capture images that will tell your story for a lifetime.",
    sections: [
      {
        id: "gear",
        label: "Camera Gear",
        content:
          "For wildlife photography, a DSLR or mirrorless camera with interchangeable lenses is ideal. A 100–400mm or 200–500mm zoom lens covers most situations — from distant lions to close-up portraits.\n\nFor landscape and camp life, a 24–70mm standard zoom is perfect. A fast prime lens (50mm f/1.8) is great for low-light conditions and portraits.\n\nIf you don't want to carry heavy gear, modern smartphones with telephoto capabilities can produce excellent results. A pair of compact binoculars is still worth packing.\n\nEssentials: spare batteries (cold mornings drain them fast), a dust-proof camera bag, lens cleaning cloth, and at least 128GB of memory cards."
      },
      {
        id: "settings",
        label: "Camera Settings",
        content:
          "Start with Shutter Priority mode. For moving animals, use a fast shutter speed of 1/500s or faster. For stationary subjects, 1/250s is sufficient.\n\nSet your ISO to Auto with a maximum of 3200–6400, depending on your camera. For action shots, use continuous autofocus (AI Servo / AF-C) with burst mode.\n\nShoot in RAW format for maximum editing flexibility. If you prefer JPEG, set your picture profile to 'Vivid' or 'Landscape' to capture the rich African colours.\n\nA simple trick: slightly underexpose (‑0.3 to ‑0.7 EV) to avoid blowing out highlights in bright midday sun."
      },
      {
        id: "composition",
        label: "Composition Tips",
        content:
          "Use the rule of thirds: place your subject off-centre for more dynamic images. Leave space in the direction the animal is looking or moving.\n\nGet low to the ground for eye-level portraits — this creates an intimate, powerful connection with your subject. Early morning and late afternoon golden light adds warmth and depth.\n\nInclude environmental context: a lion silhouetted against a setting sun, elephants crossing a river, a giraffe against a baobab tree. These images tell a richer story than close-ups alone.\n\nDon't forget the details — textures of elephant skin, patterns on zebra, reflections in a waterhole. These intimate shots add variety to your collection."
      },
      {
        id: "ethics",
        label: "Ethical Photography",
        content:
          "Never harass or disturb wildlife for a photo. Keep a respectful distance, stay in your vehicle, and never use flash, drones or loud noises. A good photo is never worth causing stress to an animal.\n\nWhen photographing people, always ask permission first. A smile and a greeting go a long way. Offer to share the photo if you promised to — build trust and make a connection.\n\nRespect cultural sites — some places are sacred and photography may be restricted. Your guide will advise you. When in doubt, ask or simply enjoy the moment without a camera.\n\nFinally, sometimes the best photo is the one you don't take. Put the camera down and let the experience sink in. The memories will last longer than any image."
      }
    ]
  },
  {
    slug: "victoria-falls-travel-guide",
    title: "Victoria Falls Travel Guide: Everything You Need to Know",
    excerpt:
      "From when to go and where to stay to the best viewpoints and adventure activities — this is your complete guide to Victoria Falls.",
    date: "2026-06-05",
    author: "Rise Africa Safaris",
    image: demoPhoto("victoria-falls,zambezi,spray", 608, 1200, 700),
    body:
      "Victoria Falls is one of Africa's most spectacular destinations. This comprehensive guide covers everything you need to plan the perfect visit.",
    sections: [
      {
        id: "overview",
        label: "Overview",
        content:
          "Victoria Falls straddles the border between Zimbabwe and Zambia, approximately 1,700 kilometres upstream from the Indian Ocean. The falls are 1,708 metres wide and 108 metres tall, making them the largest curtain of falling water on Earth.\n\nThe town of Victoria Falls (Zimbabwe side) is the primary tourism hub, with a wide range of accommodation, restaurants and activity operators. Livingstone (Zambia side) offers a more relaxed, historical atmosphere.\n\nBoth sides provide different perspectives of the falls, and a combined visit is recommended. A valid passport, visa and crossing fee allow you to move between the two countries during your stay."
      },
      {
        id: "when-to-visit",
        label: "When to Visit",
        content:
          "The best time to visit Victoria Falls depends on what you want to see and do. High water season (February–July) offers the most dramatic waterfall views — the spray can be seen from kilometres away, and the mist creates permanent rainbows.\n\nLow water season (August–January) offers clearer views of the rock face and is better for adventure activities like white-water rafting and bungee jumping. Devil's Pool, a natural infinity pool at the edge of the falls, is accessible only during low water (typically August–December).\n\nYear-round temperatures are pleasant, with hot summers (October–November) and mild winters (June–August). Pack for sun and carry a raincoat for the falls spray regardless of season."
      },
      {
        id: "activities",
        label: "Top Activities",
        content:
          "The Falls Tour is a must — follow the 16 lookout points on the Zimbabwe side for the best views. The Zambezi sunset cruise is equally iconic, offering river views, wildlife sightings and sundowner drinks.\n\nAdventure seekers have endless options: white-water rafting below the gorge, bungee jumping from the Victoria Falls Bridge, the 'Flight of Angels' helicopter ride, zip-lining, jet-boating, and horse-riding along the river.\n\nFor a slower pace, visit the Victoria Falls Rainforest, take a guided cultural village tour, or explore the craft markets. A game drive in nearby Hwange National Park or Zambezi National Park completes the experience."
      },
      {
        id: "accommodation",
        label: "Where to Stay",
        content:
          "Accommodation ranges from luxury lodges and five-star hotels to comfortable guesthouses and budget backpackers. The town of Victoria Falls is compact and walkable, with most properties within a short distance of the falls entrance.\n\nFor luxury, consider the iconic Victoria Falls Hotel (colonial grandeur), Matetsi Water Lodge (river frontage), or the intimate Ilala Lodge. Mid-range options include Pioneers Camp, Stanley & Livingstone Boutique Hotel, and numerous excellent guesthouses.\n\nFor a unique experience, stay at a camp in the surrounding national parks — you trade walking distance for game drives and total immersion in the bush."
      },
      {
        id: "practical",
        label: "Practical Tips",
        content:
          "Visas: Most nationalities can obtain a visa on arrival at Victoria Falls Airport or the border. The Kaza UniVisa allows multiple entry between Zimbabwe and Zambia, plus a day trip to Botswana's Chobe National Park. Check requirements before you travel.\n\nCurrency: Zimbabwe uses a multi-currency system — US dollars are widely accepted. Carry small bills for tips, markets and taxis. Credit cards are accepted at most hotels and activities.\n\nHealth: Malaria prophylaxis is recommended. The falls area is in a low-risk malaria zone, but precautions are wise. Yellow fever vaccination is required if travelling from an endemic country.\n\nPacking: Lightweight clothing, a raincoat or poncho for the falls spray, comfortable walking shoes, sunscreen, insect repellent, and a camera with a waterproof bag or cover."
      }
    ]
  },
  {
    slug: "hwange-safari-guide",
    title: "Hwange National Park Safari Guide",
    excerpt:
      "Everything you need to know about visiting Zimbabwe's largest national park — from wildlife highlights to the best camps and seasonal tips.",
    date: "2026-06-03",
    author: "Rise Africa Safaris",
    image: demoPhoto("hwange,elephant,waterhole", 609, 1200, 700),
    body:
      "Hwange National Park is Zimbabwe's premier safari destination. Spanning over 14,600 square kilometres, it protects an extraordinary diversity of wildlife and landscapes.",
    sections: [
      {
        id: "overview",
        label: "Overview",
        content:
          "Named after a local Nhanzwa chief, Hwange National Park was established in 1928 as a game reserve and later designated a national park. It sits in the northwest of Zimbabwe, bordering Botswana's Chobe National Park to the south.\n\nThe park's location on the edge of the Kalahari Desert gives it a unique character — ancient teak forests, acacia woodlands, grassy plains and fossil riverbeds. Over 60 pumped waterholes ensure wildlife thrives even during the driest months.\n\nHwange is famous for its enormous elephant herds, healthy lion and wild dog populations, and exceptional bird diversity. It's a year-round destination with distinct seasonal highlights."
      },
      {
        id: "wildlife",
        label: "Wildlife Highlights",
        content:
          "Hwange holds one of Africa's largest elephant populations — over 45,000 individuals. During the dry season, sightings of 100+ elephants at a single waterhole are common. The park is also a stronghold for the Endangered African wild dog.\n\nLion sightings are excellent, particularly in the northern and central areas. Leopards are more elusive but regularly seen in the woodland areas. Hwange also supports cheetah, spotted hyena, brown hyena, and abundant plains game including giraffe, zebra, sable, roan and gemsbok.\n\nOver 400 bird species have been recorded, including kori bustard, southern ground hornbill, bateleur eagle, carmine bee-eater and the rare African skimmer. Birding is exceptional from November to March."
      },
      {
        id: "safari-experiences",
        label: "Safari Experiences",
        content:
          "Game drives are the primary activity, offered in open 4×4 vehicles with expert guides. Morning and afternoon drives provide the best light and wildlife activity. Night drives are available in some areas and reveal the park's nocturnal inhabitants.\n\nWalking safaris offer a different perspective — tracking wildlife on foot with armed guides. Several camps offer guided walks within their private concessions. The experience is safe, educational and deeply rewarding.\n\nFor photographers, Hwange is a dream. The waterholes provide reliable action, and the golden light of the dry season is extraordinary. Many camps have hides where you can photograph wildlife at eye level."
      },
      {
        id: "accommodation",
        label: "Camps & Lodges",
        content:
          "Accommodation ranges from classic tented camps to luxury lodges and self-catering options. Most camps are located in private concessions or near permanent waterholes, offering exclusive game-viewing access.\n\nTop options include Linkwasha Camp (luxury, private concession), Somalisa Camp (intimate, elephant-focused), Camp Hwange (ecofriendly, great guiding), and Elephant's Eye (family-friendly). Self-catering options are available at Main Camp and Sinamatella.\n\nThe park also offers a range of national park accommodation — from basic camping to comfortable chalets at Main Camp, Sinamatella and Robins Camp. These are budget-friendly but book out quickly."
      },
      {
        id: "getting-there",
        label: "Getting There & Tips",
        content:
          "Hwange is easily accessible from Victoria Falls. The drive takes approximately two hours via the main road to Main Camp entrance. The park is also accessible from Bulawayo (4 hours) and by light aircraft to private airstrips.\n\nCharter flights from Victoria Falls and Johannesburg land at Hwange National Park Airport or private airstrips at the camps. Most luxury camps include road or air transfers from Victoria Falls.\n\nTips: Book well in advance for peak season (August–October). The park is malarial — take prophylaxis. Pack neutral-coloured clothing, a warm jacket for morning drives, and binoculars. A good camera with a 200–400mm lens is ideal."
      }
    ]
  },
  {
    slug: "zambia-safari-guide",
    title: "Zambia Safari Guide: South Luangwa & Beyond",
    excerpt:
      "Discover why Zambia is Africa's best-kept safari secret — from walking safaris in South Luangwa to canoe trips on the Lower Zambezi.",
    date: "2026-06-07",
    author: "Rise Africa Safaris",
    image: demoPhoto("zambia,safari,river", 610, 1200, 700),
    body:
      "Zambia is the birthplace of the walking safari and one of Africa's most rewarding destinations for adventurous, low-impact wildlife experiences.",
    sections: [
      {
        id: "overview",
        label: "Overview",
        content:
          "Zambia is a landlocked country in Southern Africa, bordered by eight nations. It is home to some of Africa's most pristine wilderness areas, renowned for their expert guiding, uncrowded parks and authentic safari experiences.\n\nThe country's safari reputation rests on three iconic parks: South Luangwa National Park, Lower Zambezi National Park, and Kafue National Park. Each offers a distinct character and unique wildlife encounters.\n\nZambia is also home to the Zambian side of Victoria Falls, the historic town of Livingstone, and the magnificent Lake Tanganyika — the world's longest freshwater lake."
      },
      {
        id: "south-luangwa",
        label: "South Luangwa",
        content:
          "South Luangwa is the crown jewel of Zambian safaris. The park is famous for its walking safaris — widely regarded as the best in Africa. Guides undergo rigorous training and are among the most knowledgeable on the continent.\n\nThe Luangwa River supports an incredible concentration of wildlife, including leopard, lion, wild dog, elephant, buffalo and Thornicroft's giraffe (endemic to the region). The park is especially famous for its leopard sightings.\n\nThe dry season (May–October) offers exceptional game viewing as wildlife concentrates along the river. The park is also fantastic for night drives — expect encounters with genets, civets, hyenas and the occasional pangolin."
      },
      {
        id: "lower-zambezi",
        label: "Lower Zambezi",
        content:
          "Lower Zambezi National Park is a pristine wilderness along the northern bank of the Zambezi River, opposite Zimbabwe's Mana Pools National Park. The river is the lifeblood of the park, attracting large herds of elephant and buffalo.\n\nCanoe safaris are the signature experience — paddling silently past hippos, crocodiles and elephants on the riverbanks. The perspective from water level is extraordinary.\n\nThe park is remote and exclusive, with a handful of luxury lodges offering world-class guiding, fishing, walking safaris and game drives. Access is by light aircraft or boat from Chirundu."
      },
      {
        id: "other-parks",
        label: "Other Parks",
        content:
          "Kafue National Park, covering 22,400 square kilometres, is Zambia's largest and oldest national park. The Busanga Plains in the north offer exceptional game viewing, particularly for lion, cheetah and herds of puku and red lechwe.\n\nLiuwa Plain National Park is a remote gem, famous for its wildebeest migration (the second largest in Africa) and the story of Lady Liuwa — the last surviving lioness who became a symbol of conservation.\n\nKasanka National Park hosts Africa's largest mammal migration — up to 10 million straw-coloured fruit bats fill the sky each November and December. It's one of Africa's most extraordinary wildlife spectacles."
      },
      {
        id: "planning",
        label: "Planning Your Trip",
        content:
          "The dry season (May–October) is the best time for game viewing across most of Zambia. The wet season (November–April) is excellent for birding and offers substantially lower rates.\n\nVisa: Most visitors can obtain a visa on arrival. The Kaza UniVisa allows access to Zambia and Zimbabwe, plus a day trip to Botswana. Check requirements before travel.\n\nHealth: Malaria is present throughout Zambia — prophylaxis is essential. Yellow fever vaccination is not required for direct travel but may be needed if arriving from an endemic country.\n\nGetting there: International flights arrive at Kenneth Kaunda International Airport in Lusaka. Domestic flights connect to Mfuwe (South Luangwa), Royal (Lower Zambezi) and other park airstrips."
      }
    ]
  },
  {
    slug: "botswana-safari-guide",
    title: "Botswana Safari Guide: Okavango, Chobe & More",
    excerpt:
      "Botswana is the gold standard of African safaris. Explore the Okavango Delta, Chobe National Park and the wild Kalahari.",
    date: "2026-06-09",
    author: "Rise Africa Safaris",
    image: demoPhoto("botswana,okavango,elephant", 611, 1200, 700),
    body:
      "Botswana offers Africa's most exclusive and pristine safari experiences. With a high-value, low-impact tourism model, it is the ultimate destination for serious wildlife enthusiasts.",
    sections: [
      {
        id: "overview",
        label: "Overview",
        content:
          "Botswana is a land of superlatives. It is home to the Okavango Delta — the world's largest inland delta — the vast Kalahari Desert, and Chobe National Park with Africa's highest elephant density.\n\nThe country's tourism philosophy prioritises quality over quantity. Camps are small and exclusive, and visitor numbers are carefully managed. The result is an unparalleled wilderness experience.\n\nBotswana is also a conservation success story. The country has dedicated over 40% of its land to protected areas, and community-managed conservancies ensure that tourism benefits local people directly."
      },
      {
        id: "okavango",
        label: "Okavango Delta",
        content:
          "The Okavango Delta is a UNESCO World Heritage Site and one of Africa's most extraordinary ecosystems. Each year, floodwaters from the Angolan highlands spread across the Kalahari, creating a 15,000 km² mosaic of waterways and islands.\n\nWildlife viewing is exceptional year-round. The dry season (May–October) coincides with the flood, concentrating animals on permanent water sources. Expect large herds of elephant and buffalo, lion, leopard, wild dog, hippo and abundant antelope.\n\nThe delta is best explored by mokoro (traditional canoe), game drive and walking safari. Most visitors stay at luxury camps on private concessions, accessed by light aircraft."
      },
      {
        id: "chobe",
        label: "Chobe National Park",
        content:
          "Chobe National Park is famous for its enormous elephant population — estimated at 50,000 individuals. The park's riverfront area along the Chobe River offers exceptional game viewing, particularly during the dry season.\n\nBoat cruises on the Chobe River are the signature experience. From the water, you'll see elephants swimming between islands, buffalo grazing along the banks, and enormous crocodiles basking in the sun.\n\nThe park also supports strong predator populations — lion, leopard, and the elusive wild dog. The Savuti region in the west is famous for its lion prides and the dramatic rock formations of the Gcwihaba Hills."
      },
      {
        id: "kalahari",
        label: "The Kalahari",
        content:
          "The Kalahari Desert covers much of central and southern Botswana. It is not a true desert — enough rain falls to support grasslands, acacia woodlands and remarkable wildlife adapted to arid conditions.\n\nThe Central Kalahari Game Reserve is one of the most remote safari destinations in Africa. The reserve is famous for its brown hyenas, cheetahs, and the seasonal zebra and wildebeest migration.\n\nVisit during the green season (December–March) when the desert transforms into grasslands teeming with antelope and their predators. The night skies are among the darkest in Africa."
      },
      {
        id: "practical-botswana",
        label: "Practical Guide",
        content:
          "Best time to visit: Dry season (May–October) is peak. Green season (November–April) offers lush landscapes, birding and lower rates.\n\nGetting there: Most visitors fly into Maun (gateway to the Okavango) or Kasane (gateway to Chobe). Light aircraft transfers connect to wilderness camps.\n\nVisas: Many nationalities receive a free 30-day visa on arrival. Check requirements before travel.\n\nHealth: Malaria is present — prophylaxis recommended. Medical facilities are limited in remote areas — comprehensive travel insurance with evacuation cover is essential.\n\nPacking: Lightweight clothing, a warm fleece for cold mornings, a sun hat, sunscreen, insect repellent, binoculars and a good camera. Most camps provide laundry services."
      }
    ]
  },
  {
    slug: "namibia-safari-guide",
    title: "Namibia Safari Guide: Dunes, Desert & Wildlife",
    excerpt:
      "From the red dunes of Sossusvlei to the wildlife of Etosha, Namibia offers landscapes and experiences found nowhere else on Earth.",
    date: "2026-06-08",
    author: "Rise Africa Safaris",
    image: demoPhoto("namibia,desert,dunes", 612, 1200, 700),
    body:
      "Namibia is a land of dramatic contrasts — towering dunes, vast salt pans, ancient canyons and a coastline where the desert meets the Atlantic. It is one of Africa's most visually stunning countries.",
    sections: [
      {
        id: "overview",
        label: "Overview",
        content:
          "Namibia is one of Africa's most sparsely populated countries, with a landscape that feels otherworldly. From the red dunes of Sossusvlei to the wildlife-rich plains of Etosha, the country offers a safari experience unlike any other.\n\nThe country is also a conservation pioneer. Namibia was the first African country to incorporate environmental protection into its constitution, and community-managed conservancies now cover over 20% of the country.\n\nNamibia is ideal for self-drive safaris — the roads are excellent, navigation is straightforward, and the freedom of travelling independently is unmatched."
      },
      {
        id: "sossusvlei",
        label: "Sossusvlei & Namib Desert",
        content:
          "Sossusvlei is Namibia's most iconic destination. The towering red dunes — some over 300 metres tall — rise from the barren plains of the Namib Desert, the world's oldest desert.\n\nVisit at sunrise for the best light — the dunes glow deep orange and red as the sun rises. Climb Dune 45 or Big Daddy for panoramic views over the sea of sand.\n\nDeadvlei, a white clay pan dotted with 900-year-old dead camel thorn trees, is one of Africa's most photographed landscapes. The contrast between the black trees, white pan and red dunes is extraordinary.\n\nNearby attractions include Sesriem Canyon and the scenic drive through Elim Dune. Spend at least two nights to experience both sunrise and sunset in the dunes."
      },
      {
        id: "etosha",
        label: "Etosha National Park",
        content:
          "Etosha National Park is Namibia's premier wildlife destination. The park centres on the Etosha Pan, a vast, shimmering salt pan visible from space. Wildlife concentrates around the permanent waterholes along the pan's edge.\n\nEtosha is famous for its large elephant herds, black rhino, lion, leopard, cheetah, giraffe, zebra and abundant antelope including springbok, gemsbok and eland. Birding is excellent, with over 340 species recorded.\n\nThe park's network of floodlit waterholes at Okaukuejo, Halali and Namutoni camps offer extraordinary night-time game viewing — watch elephants, rhinos and lions drink under the stars.\n\nThe dry season (May–October) is best for game viewing. The park is easily self-driven, with excellent roads and well-maintained rest camps."
      },
      {
        id: "skeleton-coast",
        label: "Skeleton Coast & Damaraland",
        content:
          "The Skeleton Coast is one of Africa's most hauntingly beautiful regions. The cold Benguela Current creates a dense fog that rolls over the desert, creating a surreal landscape of shipwrecks, seal colonies and desert-adapted wildlife.\n\nAccess is restricted — only the southern section (up to the Ugab River) is open to self-drive visitors. The northern section requires a permit and guided tour, offering true wilderness experiences.\n\nDamaraland, inland from the coast, is home to desert-adapted elephants and rhinos — populations that have evolved to survive in one of the harshest environments on Earth. Tracking them on foot with a guide is an unforgettable experience.\n\nOther highlights include Twyfelfontein (a UNESCO site with ancient rock engravings), the Brandberg Mountain (highest in Namibia), and the bizarre Organ Pipes rock formation."
      },
      {
        id: "practical-namibia",
        label: "Practical Guide",
        content:
          "Best time to visit: Dry season (May–October) is ideal for wildlife viewing. The green season (November–April) is excellent for photography with dramatic skies and fewer crowds.\n\nGetting there: Fly into Windhoek's Hosea Kutako International Airport. From there, self-drive or fly to regional airports at Swakopmund, Ondangwa (Etosha) or Luderitz.\n\nVisa: Many nationalities receive a 30-day visa on arrival. Check requirements before travel.\n\nHealth: Namibia is a low-risk malaria destination, but prophylaxis is recommended for Etosha and the northern regions. The country has excellent medical facilities in Windhoek and Swakopmund.\n\nPacking: Lightweight clothing, a warm jacket (desert nights are cold), a sun hat, high-SPF sunscreen, sunglasses, binoculars, and a camera with a wide-angle lens for landscapes."
      }
    ]
  }
];

export const getPost = (slug: string) => blogPosts.find((p) => p.slug === slug);
