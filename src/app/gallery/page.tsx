import { readdirSync, existsSync } from "fs";
import { join } from "path";
import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { CtaBand } from "@/components/CtaBand";
import { GalleryView } from "./GalleryView";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photos and cinematic clips from Rise Africa Safaris days on the Zambezi and in Southern African parks.",
};

export type GalleryItem = {
  src: string;
  alt: string;
  category: string;
  type?: "image" | "video";
  poster?: string;
};

function loadGallery(): GalleryItem[] {
  const items: GalleryItem[] = [
    {
      src: "/videos/safari-elephants.mp4",
      poster: "/images/demo/elephants-grass.jpg",
      alt: "Elephants on safari — cinematic clip",
      category: "Video",
      type: "video",
    },
    {
      src: "/videos/safari-savanna.mp4",
      poster: "/images/demo/elephants-sunset.jpg",
      alt: "Savannah at golden hour — cinematic clip",
      category: "Video",
      type: "video",
    },
  ];

  const dir = join(process.cwd(), "public", "insider");
  if (!existsSync(dir)) return items;

  const folders = readdirSync(dir, { withFileTypes: true });

  for (const folder of folders) {
    if (!folder.isDirectory()) continue;
    const folderPath = join(dir, folder.name);
    const files = readdirSync(folderPath);

    for (const file of files) {
      if (!/\.(jpe?g|png|webp|avif)$/i.test(file)) continue;
      items.push({
        src: `/insider/${encodeURIComponent(folder.name)}/${encodeURIComponent(file)}`,
        alt: file.replace(/\.(jpe?g|png|webp|avif)$/i, "").replace(/[_-]/g, " "),
        category: folder.name,
        type: "image",
      });
    }
  }

  return items;
}

export default function GalleryPage() {
  const gallery = loadGallery();

  return (
    <>
      <PageHeader
        title="Gallery"
        subtitle="Stills and short clips from river days, parks and roads we run."
        image="/images/Sunset.jpeg"
      />
      <GalleryView gallery={gallery} />
      <CtaBand />
    </>
  );
}
