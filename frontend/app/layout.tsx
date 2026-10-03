import type { Metadata } from "next";
import { Quicksand, Nunito_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import SkyBotSheet from "@/components/SkyBotSheet";
import { SkyBotProvider } from "@/context/SkyBotContext";

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-quicksand",
  display: "swap",
});

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  weight: ["400", "700", "800"],
  variable: "--font-nunito-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://skyb-ecommerce.vercel.app"),
  title: {
    default: "skyB | Playful & Safe Kids' Essentials",
    template: "%s | skyB",
  },
  description:
    "Shop safety-checked products for babies and children in India. Interactive parent savings, developmental sizing recommendations, and transparent quality.",
  openGraph: {
    title: "skyB | Playful & Safe Kids' Essentials",
    description:
      "Shop safety-checked products for babies and children with interactive parent savings.",
    url: "https://skyb-ecommerce.vercel.app",
    siteName: "skyB",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "skyB Store Banner",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "skyB | Playful & Safe Kids' Essentials",
    description:
      "Shop safety-checked products for babies and children with interactive parent savings.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "32x32" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${quicksand.variable} ${nunitoSans.variable}`}>
      <body className="bg-surface font-body-md text-on-surface antialiased relative min-h-screen flex flex-col">
        <SkyBotProvider>
          {/* Unified responsive Header on every page */}
          <Navbar />

          {/* Main content with padding for sticky header & bottom nav */}
          <main className="w-full flex-1 pt-24 sm:pt-28 pb-16 md:pb-0 bg-surface">
            {children}
          </main>

          {/* Unified Footer */}
          <Footer />

          {/* Mobile Bottom Navigation (auto-hidden on sticky pages & admin) */}
          <BottomNav />

          {/* Global SkyBot negotiation drawer/sheet */}
          <SkyBotSheet />
        </SkyBotProvider>
      </body>
    </html>
  );
}
