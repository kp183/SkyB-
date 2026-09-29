import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product Inventory Management",
};

export default function AdminProductsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
