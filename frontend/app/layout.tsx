import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://skyb-ecommerce.vercel.app"),
  title: {
    default: "SkyB — AI-Powered Kids' E-Commerce",
    template: "%s | SkyB",
  },
  description: "AI-assisted shopping for kids and babies. Safe materials, smart developmental sizing, and real-time interactive bargaining.",
  openGraph: {
    title: "SkyB — Smart Kids Store",
    description: "AI-assisted shopping for kids and babies with Safety-First Badges and real-time bargaining.",
    url: "https://skyb-ecommerce.vercel.app",
    siteName: "SkyB",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "SkyB Smart Kids Store Banner",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SkyB — Smart Kids Store",
    description: "AI-assisted shopping for kids and babies with Safety-First Badges and real-time bargaining.",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased font-sans">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
