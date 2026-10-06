"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await api.getAdminDashboard();
        setStats(data);
      } catch (err: any) {
        if (err.status === 403 || err.status === 401) {
          setError("Admin access required. Please login with an administrator account.");
        } else {
          setError(err.message || "Failed to load dashboard stats");
        }
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 text-center font-body-md text-body-md text-on-surface-variant animate-pulse">
        Loading skyB administrative operations...
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center space-y-4">
        <div className="rounded-2xl bg-surface-container-lowest p-8 shadow-[0_8px_0_#fe7488] space-y-4 border border-secondary-container">
          <div className="w-12 h-12 rounded-full bg-secondary-fixed text-secondary flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-[24px]">lock</span>
          </div>
          <p className="font-headline-md text-headline-md text-secondary">{error}</p>
          <Link
            href="/login"
            className="inline-block rounded-full bg-primary text-on-primary px-6 py-2.5 font-headline-md text-headline-md shadow-[0_3px_0_#004965] hover:bg-on-primary-container"
          >
            Sign in as Admin
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-surface-container-high pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-tertiary-fixed text-on-tertiary-fixed px-3 py-0.5 font-label-sm text-label-sm font-bold shadow-[0_1px_0_#f9bd22]">
              Admin Operations
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              Academic Demonstration
            </span>
          </div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface mt-1">
            Store Performance &amp; Operations
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="rounded-full bg-surface-container-lowest border border-surface-container-high px-4 py-2 font-label-md text-label-md text-on-surface hover:bg-surface-container shadow-[0_2px_0_#bdc8d1] flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[18px]">inventory_2</span>
            <span>Manage Products</span>
          </Link>
          <Link
            href="/admin/orders"
            className="rounded-full bg-primary text-on-primary px-4 py-2 font-label-md text-label-md shadow-[0_3px_0_#004965] hover:bg-on-primary-container flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[18px]">receipt_long</span>
            <span>Manage Orders</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="rounded-2xl bg-surface-container-lowest p-6 shadow-[0_6px_0_#c4e7ff] space-y-2 border border-surface-container-high">
          <div className="flex items-center justify-between text-primary">
            <span className="font-label-sm text-label-sm font-bold uppercase tracking-wider text-on-surface-variant">
              Total Revenue
            </span>
            <span className="material-symbols-outlined text-[24px]">payments</span>
          </div>
          <p className="font-headline-xl text-headline-xl text-primary font-bold">
            ₹{stats?.total_revenue?.toFixed(2)}
          </p>
          <p className="font-label-sm text-[11px] text-on-surface-variant">
            Confirmed &amp; Placed Orders
          </p>
        </div>

        <div className="rounded-2xl bg-surface-container-lowest p-6 shadow-[0_6px_0_#ffdadc] space-y-2 border border-surface-container-high">
          <div className="flex items-center justify-between text-secondary">
            <span className="font-label-sm text-label-sm font-bold uppercase tracking-wider text-on-surface-variant">
              Total Orders
            </span>
            <span className="material-symbols-outlined text-[24px]">shopping_bag</span>
          </div>
          <p className="font-headline-xl text-headline-xl text-on-surface font-bold">
            {stats?.total_orders}
          </p>
          <p className="font-label-sm text-[11px] text-on-surface-variant">
            Across all lifecycle states
          </p>
        </div>

        <div className="rounded-2xl bg-surface-container-lowest p-6 shadow-[0_6px_0_#ffdf9f] space-y-2 border border-surface-container-high">
          <div className="flex items-center justify-between text-tertiary">
            <span className="font-label-sm text-label-sm font-bold uppercase tracking-wider text-on-surface-variant">
              Low Stock Alerts
            </span>
            <span className="material-symbols-outlined text-[24px]">warning</span>
          </div>
          <p className="font-headline-xl text-headline-xl text-on-surface font-bold">
            {stats?.low_stock_count}
          </p>
          <p className="font-label-sm text-[11px] text-tertiary font-bold">
            Stock ≤ 5 units remaining
          </p>
        </div>

        <div className="rounded-2xl bg-surface-container-lowest p-6 shadow-[0_6px_0_#bdc8d1] space-y-2 border border-surface-container-high">
          <div className="flex items-center justify-between text-primary">
            <span className="font-label-sm text-label-sm font-bold uppercase tracking-wider text-on-surface-variant">
              Registered Parents
            </span>
            <span className="material-symbols-outlined text-[24px]">group</span>
          </div>
          <p className="font-headline-xl text-headline-xl text-on-surface font-bold">
            {stats?.total_customers}
          </p>
          <p className="font-label-sm text-[11px] text-on-surface-variant">
            Customer Accounts
          </p>
        </div>
      </div>

      {/* Low Stock Items Alert Box */}
      {stats?.low_stock_items?.length > 0 && (
        <div className="rounded-2xl bg-tertiary-fixed p-6 space-y-3 shadow-[0_6px_0_#f9bd22] border border-tertiary">
          <h2 className="font-headline-md text-headline-md text-on-tertiary-fixed flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">warning</span>
            <span>Inventory Replenishment Alert</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {stats.low_stock_items.map((item: any) => (
              <div
                key={item.id}
                className="rounded-xl bg-surface-container-lowest p-3 font-body-sm text-body-sm flex justify-between items-center shadow-sm"
              >
                <span className="font-bold text-on-surface truncate">{item.name}</span>
                <span className="font-bold text-secondary bg-secondary-fixed px-2.5 py-0.5 rounded-full text-[11px]">
                  {item.stock_qty} left
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
