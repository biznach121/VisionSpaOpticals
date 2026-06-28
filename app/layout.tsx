import type { Metadata } from "next";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ProductModal } from "@/components/product-modal";
import { CartDrawer } from "@/components/cart-drawer";
import { StickyGlasses } from "@/components/sticky-glasses";
import { OrganizationJsonLd } from "@/components/json-ld";
import { Suspense } from "react";
import { brand } from "@/lib/brand";
import { getSiteUrl } from "@/lib/site-url";
import { getNavMenu, getCategoryMenu } from "@/lib/nav-menu";

// Stage 4 fonts (generated).
const display = Cormorant_Garamond({
  weight: ["600", "700"],
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
});

const body = Montserrat({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = await getSiteUrl();
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: brand.name,
      template: `%s — ${brand.name}`,
    },
    description: brand.description,
    openGraph: {
      type: "website",
      siteName: brand.name,
      locale: brand.locale,
      images: [{ url: brand.assets.hero, alt: brand.name }],
    },
    twitter: { card: "summary_large_image" },
    icons: {
      icon: brand.assets.logo,
      shortcut: brand.assets.logo,
      apple: brand.assets.logo,
    },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [menu, categories] = await Promise.all([getNavMenu(), getCategoryMenu()]);
  return (
    <html lang="en" suppressHydrationWarning className={`${display.variable} ${body.variable}`}>
      <body
        suppressHydrationWarning
        className="min-h-screen flex flex-col bg-background text-foreground font-sans"
      >
        <Suspense fallback={null}>
          <OrganizationJsonLd />
        </Suspense>
        <Providers>
          <Header menu={menu} categories={categories} />
          <main className="flex-1 w-full">
            <Suspense fallback={null}>{children}</Suspense>
          </main>
          <Footer />
          <Suspense fallback={null}>
            <ProductModal />
          </Suspense>
          <CartDrawer />
          <StickyGlasses />
        </Providers>
      </body>
    </html>
  );
}
