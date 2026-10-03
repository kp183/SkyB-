import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Wishlist | skyB",
  description: "View and manage your saved kids products and watch for price drops on skyB.",
};

export default function WishlistLayout({ children }: { children: React.ReactNode }) {
  return children;
}
