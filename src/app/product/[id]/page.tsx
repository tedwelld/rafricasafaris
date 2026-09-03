import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct, getAvailabilities, searchProducts } from "@/lib/bokun";
import { siteConfig } from "@/lib/siteConfig";
import { ProductContent } from "@/components/ProductContent";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { id } = await params;
    const product = await getProduct(Number(id));
    return { title: product.title, description: product.excerpt ?? product.summary };
  } catch {
    return {};
  }
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const productId = Number(id);

  let product: Awaited<ReturnType<typeof getProduct>>;
  let availabilities: Awaited<ReturnType<typeof getAvailabilities>>;
  let searchResult: Awaited<ReturnType<typeof searchProducts>> | null = null;

  try {
    [product, availabilities, searchResult] = await Promise.all([
      getProduct(productId),
      getAvailabilities(
        productId,
        new Date().toISOString().slice(0, 10),
        new Date(Date.now() + 60 * 86400000).toISOString().slice(0, 10),
        siteConfig.bokunDefaultCurrency,
      ),
      searchProducts({ pageSize: 50 }).catch(() => null),
    ]);
  } catch {
    notFound();
  }

  const priceRange = availabilities
    .flatMap((a: any) => a.pricesByRate ?? [])
    .flatMap((r: any) => r.pricePerCategoryUnit ?? [])
    .map((p: any) => p.amount?.amount)
    .filter(Boolean);
  const minPrice = priceRange.length ? Math.min(...priceRange) : null;
  const currency = availabilities[0]?.pricesByRate?.[0]?.pricePerCategoryUnit?.[0]?.amount?.currency ?? "USD";

  const photos = (product as any).photos?.length
    ? (product as any).photos.map((p: any) => ({ src: p.originalUrl, alt: product.title }))
    : (product as any).keyPhoto
      ? [{ src: (product as any).keyPhoto.originalUrl, alt: product.title }]
      : [];

  const pricingCategories: { id: number; title: string; price: number; ticketCategory?: string; defaultCategory?: boolean }[] =
    (product as any).pricingCategories?.map((pc: any) => {
      const priceInfo = availabilities
        .flatMap((a: any) => a.pricesByRate ?? [])
        .flatMap((r: any) => r.pricePerCategoryUnit ?? [])
        .find((p: any) => p.id === pc.id);
      return { id: pc.id, title: pc.title, price: priceInfo?.amount?.amount ?? 0, ticketCategory: pc.ticketCategory, defaultCategory: pc.defaultCategory };
    }) ?? [];

  const durationText = (product as any).durationText;
  const meetingType =
    (product as any).meetingType === "MEET_ON_LOCATION"
      ? "Meet on location"
      : (product as any).meetingType ?? "N/A";

  const difficultyLabels: Record<string, string> = {
    EASY: "Easy",
    MODERATE: "Moderate",
    HARD: "Hard",
    CHALLENGING: "Challenging",
  };
  const difficulty =
    difficultyLabels[(product as any).difficultyLevel] ?? (product as any).difficultyLevel;

  const inclusions: string[] =
    (product as any).included ?? (product as any).inclusions ?? [];
  const exclusions: string[] =
    (product as any).excluded ?? (product as any).exclusions ?? [];

  const startTimes = [
    ...new Set(availabilities.map((a: any) => a.startTime).filter(Boolean)),
  ].sort() as string[];

  const highlights: string[] = (product as any).highlights ?? [];
  const knowBeforeYouGo: { title: string }[] =
    (product as any).knowBeforeYouGoItems ?? [];
  const location = (product as any).location;
  const vendor = (product as any).vendor;
  const cancellationPolicy = (product as any).cancellationPolicy;
  const requirements: string[] = (product as any).requirements ?? [];
  const activityType = (product as any).activityType;
  const bookingType = (product as any).bookingType;
  const capacityType = (product as any).capacityType;
  const minParticipants = (product as any).minParticipants;
  const maxParticipants = (product as any).maxParticipants;

  const relatedProducts = (searchResult?.items ?? [])
    .filter((p: any) => p.id !== productId)
    .slice(0, 4)
    .map((p: any) => ({
      id: p.id,
      title: p.title,
      excerpt: p.excerpt ?? p.summary,
      photoUrl: p.keyPhoto?.originalUrl ?? p.photos?.[0]?.originalUrl,
    }));

  return (
    <ProductContent
      productId={productId}
      title={product.title}
      excerpt={(product as any).excerpt}
      description={product.description}
      photos={photos.length ? photos : [{ src: "/images/demo/safari-jeep.jpg", alt: product.title }]}
      difficulty={difficulty}
      durationText={durationText}
      meetingType={meetingType}
      reviewRating={(product as any).reviewRating}
      reviewCount={(product as any).reviewCount}
      currency={currency}
      minPrice={minPrice}
      pricingCategories={pricingCategories}
      startTimes={startTimes}
      availabilities={availabilities}
      inclusions={inclusions}
      exclusions={exclusions}
      knowBeforeYouGo={knowBeforeYouGo}
      highlights={highlights}
      location={location}
      vendor={vendor}
      cancellationPolicy={cancellationPolicy}
      requirements={requirements}
      activityType={activityType}
      bookingType={bookingType}
      capacityType={capacityType}
      minParticipants={minParticipants}
      maxParticipants={maxParticipants}
      relatedProducts={relatedProducts}
    />
  );
}
