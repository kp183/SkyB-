"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Clock, RefreshCw } from "lucide-react";
import { api } from "@/lib/api";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [loading, setLoading] = useState(true);

  async function loadOrders() {
    setLoading(true);
    try {
      const data = await api.getAdminOrders(statusFilter || undefined);
      setOrders(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, [statusFilter]);

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      loadOrders();
    } catch (err: any) {
      alert(err.message || "Failed to update status");
    }
  };

  const statuses = [
    "pending_payment",
    "placed",
    "confirmed",
    "shipped",
    "delivered",
    "payment_failed",
    "cancelled",
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <Link href="/admin/dashboard" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-sky-600">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Admin Dashboard
      </Link>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Manage Customer Orders</h1>
          <p className="text-xs text-slate-500">Track and update order fulfillment lifecycle states</p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700"
          >
            <option value="">All Statuses</option>
            {statuses.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <button
            onClick={loadOrders}
            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600"
            title="Refresh"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-400">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-xs text-slate-500">
          No orders found matching this filter.
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="p-4">Order ID</th>
                <th className="p-4">Date</th>
                <th className="p-4">Customer ID</th>
                <th className="p-4">Total</th>
                <th className="p-4">Discount</th>
                <th className="p-4">Delivery Address</th>
                <th className="p-4 text-right">Fulfillment Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-slate-50/50">
                  <td className="p-4 font-black text-slate-900">#{o.id}</td>
                  <td className="p-4 text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {new Date(o.created_at).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="p-4 font-semibold text-slate-700">User #{o.user_id}</td>
                  <td className="p-4 font-black text-slate-900">₹{o.total_amount.toFixed(2)}</td>
                  <td className="p-4">
                    {o.discount_applied > 0 ? (
                      <span className="text-emerald-600 font-bold">
                        -₹{o.discount_applied.toFixed(2)} ({o.applied_coupon_code})
                      </span>
                    ) : (
                      <span className="text-slate-400">₹0</span>
                    )}
                  </td>
                  <td className="p-4 text-slate-600 max-w-xs truncate">{o.delivery_address}</td>
                  <td className="p-4 text-right">
                    <select
                      value={o.status}
                      onChange={(e) => handleStatusChange(o.id, e.target.value)}
                      className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs font-bold text-slate-800"
                    >
                      {statuses.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
