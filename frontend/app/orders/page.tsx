"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, Clock, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";
import { api } from "@/lib/api";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      try {
        const data = await api.getOrders();
        setOrders(data || []);
      } catch (err: any) {
        if (err.status === 401) window.location.href = "/login";
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "placed":
      case "confirmed":
      case "delivered":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "pending_payment":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "payment_failed":
      case "cancelled":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  if (loading) {
    return <div className="mx-auto max-w-4xl px-4 py-12 text-center text-slate-400">Loading your orders...</div>;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-sky-600">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Store
      </Link>

      <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
        <Package className="h-6 w-6 text-sky-500" /> My Orders & History
      </h1>

      {orders.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center space-y-3">
          <p className="text-sm font-bold text-slate-700">No orders placed yet</p>
          <Link href="/" className="inline-block rounded-2xl bg-sky-500 px-5 py-2 text-xs font-bold text-white">
            Shop Catalog
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm font-black text-slate-900">Order #{order.id}</h3>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                    <Clock className="h-3 w-3" /> {new Date(order.created_at).toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`rounded-full px-3 py-1 text-xs font-bold border uppercase tracking-wider ${getStatusBadge(order.status)}`}>
                    {order.status.replace("_", " ")}
                  </span>
                  <span className="text-base font-black text-slate-900">₹{order.total_amount.toFixed(2)}</span>
                </div>
              </div>

              {/* Items in order */}
              <div className="space-y-2">
                {order.items?.map((item: any) => (
                  <div key={item.id} className="flex items-center justify-between text-xs py-1">
                    <span className="text-slate-700 font-medium">
                      {item.product_name} × {item.quantity} {item.size_at_purchase ? `(Size: ${item.size_at_purchase})` : ""}
                    </span>
                    <span className="font-semibold text-slate-900">₹{item.subtotal.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-100 pt-3 text-[11px] text-slate-500 flex justify-between">
                <span>Shipping to: {order.delivery_address}</span>
                {order.discount_applied > 0 && (
                  <span className="text-emerald-600 font-semibold">
                    Saved: ₹{order.discount_applied.toFixed(2)} with coupon {order.applied_coupon_code}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
