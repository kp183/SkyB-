import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shopping Cart",
  description: "View and manage items in your SkyB kids shopping cart, with real-time AI bargained deals.",
  alternates: {
    canonical: "/cart",
  },
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children;
}
