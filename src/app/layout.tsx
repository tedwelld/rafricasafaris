import type { Metadata } from "next";
import { DM_Sans, Libre_Baskerville } from "next/font/google";
import Script from "next/script";
import "primeicons/primeicons.css";
import "./globals.css";
import { siteConfig } from "@/lib/siteConfig";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Footer } from "@/components/Footer";
import { WhatsAppFab } from "@/components/WhatsAppButton";
import { StructuredData } from "@/components/StructuredData";
import { CartProvider } from "@/lib/cart-context";

const sans = DM_Sans({
  variable: "--font-sans-face",
  subsets: ["latin"],
  display: "swap",
});

const serif = Libre_Baskerville({
  variable: "--font-serif-face",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: { icon: "/images/logo.jpg", apple: "/images/logo.jpg" },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const bokunLoader = `https://widgets.bokun.io/assets/javascripts/apps/build/BokunWidgetsLoader.js?bookingChannelUUID=${siteConfig.bokunChannelUUID}`;
  const bokunConfigured = !siteConfig.bokunChannelUUID.startsWith("00000000");

  return (
    <html
      lang={siteConfig.locale}
      className={`${sans.variable} ${serif.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var e=document.documentElement;e.classList.add('js');if(localStorage.getItem('theme')==='dark'){e.classList.add('dark');}}catch(err){}})();",
          }}
        />
      </head>
      <body className="flex min-h-full flex-col bg-cream pb-16 text-foreground lg:pb-0">
        {bokunConfigured && <Script src={bokunLoader} strategy="afterInteractive" />}

        <StructuredData />
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
        </CartProvider>
        <Footer />
        <BottomNav />
        <WhatsAppFab />
      </body>
    </html>
  );
}
