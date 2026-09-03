import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { CtaBand } from "@/components/CtaBand";
import { ExploreView, type ExploreTab } from "./ExploreView";

export const metadata: Metadata = {
  title: "Explore Safaris",
  description:
    "Browse our safari tours, destinations and activities across Zimbabwe, Botswana, Namibia and Zambia — all in one place. Book online, on WhatsApp, or by email.",
};

const valid: ExploreTab[] = ["destinations", "activities", "tours"];

/** Combined Destinations / Activities / Tours page. `?view=` preselects a tab. */
export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const { view } = await searchParams;
  const initialTab: ExploreTab = valid.includes(view as ExploreTab)
    ? (view as ExploreTab)
    : "tours";

  return (
    <>
      <PageHeader
        title="Explore Our Safaris"
        subtitle="Tours, destinations and activities — find your perfect African adventure."
        image="/images/demo/lion-walking.jpg"
      />
      {/* key remounts the view when the ?view= query changes so the right tab shows */}
      <ExploreView key={initialTab} initialTab={initialTab} />
      <CtaBand />
    </>
  );
}
