import { NextResponse } from "next/server";
import { searchProducts } from "@/lib/bokun";

export type ProductStat = {
  id: number;
  reviewCount: number;
  reviewRating: number;
  title: string;
};

export async function GET() {
  try {
    const result = await searchProducts({ pageSize: 100 });
    const stats: ProductStat[] = result.items.map((p) => ({
      id: p.id,
      reviewCount: p.reviewCount ?? 0,
      reviewRating: p.reviewRating ?? 0,
      title: p.title,
    }));
    return NextResponse.json(stats);
  } catch {
    return NextResponse.json({ error: "Failed to fetch product stats" }, { status: 500 });
  }
}
