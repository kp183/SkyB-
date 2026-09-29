import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Orders",
  description: "Track your past and active SkyB orders, fulfillment status, and bargained receipts.",
};

export default function OrdersLayout({ children }: { children: React.ReactNode }) {
  return children;
}
