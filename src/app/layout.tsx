import type { Metadata, Viewport } from "next";
import { Allura, Cormorant_Garamond, Great_Vibes } from "next/font/google";

import { siteConfig } from "@/data/config";

import "./globals.css";

/** Allura has clearer capital initials than Great Vibes alone */
const allura = Allura({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-allura",
  display: "swap",
});

const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-great-vibes",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteConfig.couple.displayNames} — Wedding Invitation`,
    template: `%s · ${siteConfig.couple.displayNames}`,
  },
  description: `You are invited to the wedding of ${siteConfig.couple.displayNames} at ${siteConfig.venue.name}.`,
  openGraph: {
    title: `${siteConfig.couple.displayNames} — You are invited`,
    description: `${siteConfig.weddingDateLabel} · ${siteConfig.venue.name}`,
    url: siteUrl,
    siteName: siteConfig.projectName,
    images: [{ url: "/og.svg", width: 1200, height: 630, alt: siteConfig.couple.displayNames }],
    locale: "en_LK",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.couple.displayNames} — You are invited`,
    description: `${siteConfig.weddingDateLabel} · ${siteConfig.venue.name}`,
    images: ["/og.svg"],
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#FBF6F2",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${allura.variable} ${greatVibes.variable} ${cormorant.variable}`}>
      <body className="min-h-dvh overflow-x-hidden">{children}</body>
    </html>
  );
}
