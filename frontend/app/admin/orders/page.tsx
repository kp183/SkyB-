"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
      <Link
        href="/admin/dashboard"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-low text-on-surface hover:bg-surface-container font-label-md text-label-md shadow-[0_2px_0_#bdc8d1] transition-all"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        <span>Back to Admin Dashboard</span>
      </Link>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface">
            Customer Orders &amp; Fulfillment
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Track and advance order states through the verification pipeline
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-full border border-surface-container-high bg-surface-container-lowest px-4 py-2 font-label-md text-label-md font-bold text-on-surface shadow-[0_2px_0_#bdc8d1] focus:outline-none focus:border-primary"
          >
            <option value="">All Statuses</option>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s.replace("_", " ").toUpperCase()}
              </option>
            ))}
          </select>

          <button
            onClick={loadOrders}
            className="w-10 h-10 rounded-full border border-surface-container-high bg-surface-container-lowest hover:bg-surface-container text-on-surface flex items-center justify-center shadow-[0_2px_0_#bdc8d1] transition-colors cursor-pointer"
            title="Refresh order list"
          >
            <span className="material-symbols-outlined text-[20px]">refresh</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center font-body-md text-body-md text-on-surface-variant animate-pulse">
          Loading orders...
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-2xl bg-surface-container-lowest p-12 text-center font-body-md text-body-md text-on-surface-variant shadow-[0_6px_0_#bdc8d1]">
          No orders found matching this filter.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl bg-surface-container-lowest shadow-[0_8px_0_#bdc8d1] border border-surface-container-high">
          <table className="w-full text-left font-body-sm text-body-sm">
            <thead className="border-b border-surface-container-high bg-surface-container-low font-label-sm text-label-sm font-bold uppercase tracking-wider text-on-surface-variant">
              <tr>
                <th className="p-4">Order ID</th>
                <th className="p-4">Date</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Total</th>
                <th className="p-4">Discount</th>
                <th className="p-4">Delivery Address</th>
                <th className="p-4 text-right">Fulfillment Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-high">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="p-4 font-bold text-on-surface">#{o.id}</td>
                  <td className="p-4 text-on-surface-variant">
                    {new Date(o.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-4 font-medium text-on-surface">User #{o.user_id}</td>
                  <td className="p-4 font-bold text-primary text-base">₹{o.total_amount.toFixed(2)}</td>
                  <td className="p-4">
                    {o.discount_applied > 0 ? (
                      <span className="text-secondary font-bold">
                        -₹{o.discount_applied.toFixed(2)} ({o.applied_coupon_code})
                      </span>
                    ) : (
                      <span className="text-on-surface-variant/50">₹0</span>
                    )}
                  </td>
                  <td className="p-4 text-on-surface-variant max-w-xs truncate">
                    {o.delivery_address}
                  </td>
                  <td className="p-4 text-right">
                    <select
                      value={o.status}
                      onChange={(e) => handleStatusChange(o.id, e.target.value)}
                      className="rounded-full border border-surface-container-high bg-surface-container px-3 py-1 font-label-sm text-label-sm font-bold text-on-surface focus:outline-none focus:border-primary cursor-pointer"
                    >
                      {statuses.map((st) => (
                        <option key={st} value={st}>
                          {st.replace("_", " ")}
                        </option>
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
