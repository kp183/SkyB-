"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DollarSign, ShoppingBag, Users, AlertTriangle, Package, ArrowRight, ShieldCheck } from "lucide-react";
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
    return <div className="mx-auto max-w-6xl px-4 py-12 text-center text-slate-400">Loading admin portal...</div>;
  }

  if (error) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center space-y-4">
        <div className="rounded-3xl border border-rose-200 bg-white p-8 shadow-xl space-y-3">
          <p className="text-sm font-bold text-rose-600">{error}</p>
          <Link
            href="/login"
            className="inline-block rounded-2xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-slate-800"
          >
            Sign in as Admin
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-amber-100 text-amber-800 px-2 py-0.5 text-xs font-bold uppercase tracking-wider">
              Admin Portal
            </span>
            <span className="text-xs text-slate-400">P0 Demonstration Ready</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1">Store Performance & Operations</h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="rounded-2xl bg-white border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-sm"
          >
            Manage Products
          </Link>
          <Link
            href="/admin/orders"
            className="rounded-2xl bg-sky-500 px-4 py-2 text-xs font-bold text-white hover:bg-sky-600 shadow-sm shadow-sky-200"
          >
            Manage Orders
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase">Total Revenue</span>
            <DollarSign className="h-5 w-5 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-slate-900">₹{stats?.total_revenue?.toFixed(2)}</p>
          <p className="text-[10px] text-slate-400">Confirmed & Placed Orders</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase">Total Orders</span>
            <ShoppingBag className="h-5 w-5 text-sky-500" />
          </div>
          <p className="text-2xl font-black text-slate-900">{stats?.total_orders}</p>
          <p className="text-[10px] text-slate-400">Across all statuses</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase">Low Stock Alerts</span>
            <AlertTriangle className="h-5 w-5 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-slate-900">{stats?.low_stock_count}</p>
          <p className="text-[10px] text-amber-600 font-semibold">Stock ≤ 5 units</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase">Customers</span>
            <Users className="h-5 w-5 text-indigo-500" />
          </div>
          <p className="text-2xl font-black text-slate-900">{stats?.total_customers}</p>
          <p className="text-[10px] text-slate-400">Registered Parents</p>
        </div>
      </div>

      {/* Low Stock Items Table */}
      {stats?.low_stock_items?.length > 0 && (
        <div className="rounded-3xl border border-amber-200 bg-amber-50/40 p-6 space-y-3">
          <h2 className="text-sm font-bold text-amber-900 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600" /> Inventory Replenishment Alert
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {stats.low_stock_items.map((item: any) => (
              <div key={item.id} className="rounded-2xl border border-amber-200 bg-white p-3 text-xs flex justify-between items-center">
                <span className="font-bold text-slate-800 truncate">{item.name}</span>
                <span className="font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
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
