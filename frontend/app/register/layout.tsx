import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Join SkyB for safety-checked kids' products, price bargaining, and order tracking.",
  alternates: {
    canonical: "/register",
  },
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
