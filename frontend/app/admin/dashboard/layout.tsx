import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard Overview",
};

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
