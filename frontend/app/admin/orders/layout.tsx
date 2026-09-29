import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Fulfillment Management",
};

export default function AdminOrdersLayout({ children }: { children: React.ReactNode }) {
  return children;
}
