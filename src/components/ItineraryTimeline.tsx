import { Pi } from "@/components/Pi";

type Day = {
  day: number;
  title: string;
  description: string;
  activities?: string[];
};

const sampleItineraries: Record<string, Day[]> = {
  "victoria-falls-classic": [
    { day: 1, title: "Arrival & Falls Tour", description: "Arrive at Victoria Falls Airport. Afternoon guided tour of the mighty Victoria Falls.", activities: ["Airport transfer", "Guided Falls tour"] },
    { day: 2, title: "Hwange Game Drive", description: "Full-day game drive in Hwange National Park with picnic lunch.", activities: ["Dawn game drive", "Bush picnic", "Afternoon siesta"] },
    { day: 3, title: "Zambezi Sunset Cruise", description: "Morning at leisure. Sunset cruise on the Zambezi River. Departure transfer.", activities: ["Leisure morning", "Sunset cruise", "Departure"] },
  ],
  "okavango-delta-explorer": [
    { day: 1, title: "Arrival in Maun", description: "Fly into Maun and transfer to the delta camp.", activities: ["Flight to Maun", "Scenic transfer", "Camp welcome"] },
    { day: 2, title: "Mokoro Safari", description: "Explore the delta channels by traditional mokoro canoe.", activities: ["Mokoro ride", "Island walk", "Sundowners"] },
    { day: 3, title: "Game Drive", description: "Full-day game drive in the Moremi Game Reserve.", activities: ["Big game viewing", "Bush lunch", "Night drive"] },
    { day: 4, title: "Departure", description: "Morning bird walk. Scenic flight back to Maun.", activities: ["Bird walk", "Scenic flight", "Departure"] },
  ],
  "chobe-river-safari": [
    { day: 1, title: "Chobe River Cruise", description: "Afternoon river cruise along the Chobe River.", activities: ["Game drive en route", "River cruise", "Sundowners"] },
    { day: 2, title: "Chobe Game Drive", description: "Full-day game drive in Chobe National Park. Departure.", activities: ["Dawn drive", "Bush breakfast", "Departure"] },
  ],
  "sossusvlei-dunes-adventure": [
    { day: 1, title: "Arrival in Windhoek", description: "Arrive and drive to Sossusvlei.", activities: ["Road transfer", "Dune lodge check-in"] },
    { day: 2, title: "Dune 45 & Deadvlei", description: "Sunrise climb of Dune 45. Explore Deadvlei clay pan.", activities: ["Dune climb", "Deadvlei walk", "Photography"] },
    { day: 3, title: "Sesriem Canyon", description: "Morning walk in Sesriem Canyon. Afternoon at leisure.", activities: ["Canyon walk", "Pool time", "Stargazing"] },
    { day: 4, title: "Elim Dune & Departure", description: "Sunrise at Elim Dune. Drive back to Windhoek.", activities: ["Elim Dune", "Road transfer", "Departure"] },
    { day: 5, title: "Etosha Extension", description: "Optional extension to Etosha National Park.", activities: ["Etosha game drive", "Salt pan viewing"] },
  ],
  "south-luangwa-walking-safari": [
    { day: 1, title: "Arrival in Mfuwe", description: "Fly to Mfuwe. Transfer to camp in South Luangwa.", activities: ["Light aircraft flight", "Game drive transfer"] },
    { day: 2, title: "Walking Safari", description: "Full-day walking safari with expert guides.", activities: ["Bush walk", "Tracking", "Bush lunch"] },
    { day: 3, title: "Game Drive & Night Drive", description: "Morning game drive. Afternoon night drive.", activities: ["Big cats", "Sundowners", "Night spotlighting"] },
    { day: 4, title: "Departure", description: "Morning walk. Depart from Mfuwe.", activities: ["Final walk", "Departure"] },
  ],
  "family-falls-adventure": [
    { day: 1, title: "Family Falls Tour", description: "Gentle guided tour of Victoria Falls suitable for children.", activities: ["Falls tour", "Pool time"] },
    { day: 2, title: "Chobe River Cruise", description: "Scenic river cruise with wildlife viewing. Child-friendly pace.", activities: ["River cruise", "Lunch at lodge"] },
    { day: 3, title: "Departure", description: "Half-day game drive. Departure transfer.", activities: ["Short game drive", "Departure"] },
  ],
};

export function ItineraryTimeline({ tourSlug }: { tourSlug: string }) {
  const days = sampleItineraries[tourSlug];

  if (!days) {
    return (
      <div className="rounded-xl bg-muted p-6 text-center text-sm text-ink-soft">
        Detailed itinerary available on request. Please contact us.
      </div>
    );
  }

  return (
    <div className="relative">
      {days.map((day, i) => (
        <div key={day.day} className="relative pl-8 pb-8 last:pb-0">
          {/* Timeline line */}
          {i < days.length - 1 && (
            <div className="absolute left-[11px] top-6 bottom-0 w-0.5 bg-gradient-to-b from-gold to-gold/20" />
          )}
          {/* Timeline dot */}
          <div className="absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-gold text-xs font-bold text-white">
            {day.day}
          </div>
          <div>
            <h4 className="text-lg font-medium text-foreground">{day.title}</h4>
            <p className="mt-1 text-sm text-ink-soft leading-relaxed">{day.description}</p>
            {day.activities && (
              <div className="mt-2 flex flex-wrap gap-2">
                {day.activities.map((a) => (
                  <span
                    key={a}
                    className="flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs text-ink-soft"
                  >
                    <Pi name="pi-check-circle" className="text-xs text-gold-dark" /> {a}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
