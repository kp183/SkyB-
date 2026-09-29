import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Secure Checkout",
  description: "Review order details, developmental sizes, and complete mock payment with SkyB.",
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
