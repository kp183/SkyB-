"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
        return "bg-primary-fixed text-on-primary-fixed shadow-[0_1px_0_#7bd0ff]";
      case "pending_payment":
        return "bg-tertiary-fixed text-on-tertiary-fixed shadow-[0_1px_0_#f9bd22]";
      case "payment_failed":
      case "cancelled":
        return "bg-secondary-fixed text-on-secondary-fixed shadow-[0_1px_0_#fe7488]";
      default:
        return "bg-surface-container text-on-surface";
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center font-body-md text-body-md text-on-surface-variant animate-pulse">
        Retrieving your quest delivery history...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-low text-on-surface hover:bg-surface-container font-label-md text-label-md shadow-[0_2px_0_#bdc8d1] transition-all"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        <span>Back to Store</span>
      </Link>

      <h1 className="font-headline-xl text-headline-xl text-on-surface flex items-center gap-2.5">
        <span className="material-symbols-outlined text-primary text-[32px]">inventory_2</span>
        <span>Order &amp; Loot History</span>
      </h1>

      {orders.length === 0 ? (
        <div className="rounded-2xl bg-surface-container-lowest p-12 text-center space-y-4 shadow-[0_8px_0_#bdc8d1]">
          <div className="w-16 h-16 rounded-full bg-surface-container-low flex items-center justify-center mx-auto text-primary">
            <span className="material-symbols-outlined text-[36px]">receipt_long</span>
          </div>
          <p className="font-headline-lg text-headline-lg text-on-surface">No orders placed yet!</p>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-sm mx-auto">
            Your delivery history is waiting for your first adventure loot.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-primary text-on-primary px-6 py-3 font-headline-md text-headline-md shadow-[0_4px_0_#004965] hover:bg-on-primary-container transition-all"
          >
            <span>Explore Playground</span>
            <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, idx) => {
            const shadowColor = idx % 2 === 0 ? "#c4e7ff" : "#ffdadc";
            return (
              <div
                key={order.id}
                className="rounded-2xl bg-surface-container-lowest p-6 space-y-4 transition-all"
                style={{ boxShadow: `0 8px 0 ${shadowColor}` }}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-surface-container-high pb-3">
                  <div>
                    <h3 className="font-headline-lg text-headline-lg text-on-surface">
                      Order #{order.id}
                    </h3>
                    <p className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1 mt-0.5">
                      <span className="material-symbols-outlined text-[16px]">schedule</span>
                      <span>{new Date(order.created_at).toLocaleString()}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full px-3 py-1 font-label-sm text-label-sm font-bold uppercase tracking-wider ${getStatusBadge(
                        order.status
                      )}`}
                    >
                      {order.status.replace("_", " ")}
                    </span>
                    <span className="font-headline-xl text-headline-xl font-bold text-primary">
                      ₹{order.total_amount.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Items in order */}
                <div className="space-y-2">
                  {order.items?.map((item: any) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between font-body-md text-body-md py-1"
                    >
                      <span className="text-on-surface font-medium">
                        {item.product_name} × {item.quantity}{" "}
                        {item.size_at_purchase ? `(Size: ${item.size_at_purchase})` : ""}
                      </span>
                      <span className="font-bold text-on-surface">
                        ₹{item.subtotal.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-surface-container-high pt-3 font-label-sm text-[11px] text-on-surface-variant flex flex-col sm:flex-row justify-between gap-1">
                  <span>Shipping to: {order.delivery_address}</span>
                  {order.discount_applied > 0 && (
                    <span className="text-primary font-bold">
                      Saved: ₹{order.discount_applied.toFixed(2)} with coupon {order.applied_coupon_code}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
