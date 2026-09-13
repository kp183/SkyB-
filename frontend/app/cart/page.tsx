"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Trash2, ShoppingBag, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import { api } from "@/lib/api";

export default function CartPage() {
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  async function loadCart() {
    setLoading(true);
    try {
      const data = await api.getCart();
      setCart(data);
    } catch (err: any) {
      if (err.status === 401) {
        window.location.href = "/login";
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCart();
  }, []);

  const handleUpdateQuantity = async (itemId: number, newQty: number) => {
    if (newQty < 1) return;
    try {
      await api.updateCartItem(itemId, newQty);
      loadCart();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemove = async (itemId: number) => {
    try {
      await api.deleteCartItem(itemId);
      loadCart();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="mx-auto max-w-4xl px-4 py-12 text-center text-slate-400">Loading your cart...</div>;
  }

  const items = cart?.items || [];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          <ShoppingBag className="h-6 w-6 text-sky-500" /> Shopping Cart
        </h1>
        <Link href="/" className="text-xs font-semibold text-sky-600 hover:underline">
          Continue Shopping →
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center space-y-3 shadow-sm">
          <ShoppingBag className="mx-auto h-12 w-12 text-slate-300" />
          <p className="text-sm font-bold text-slate-700">Your cart is currently empty</p>
          <p className="text-xs text-slate-400">Browse our safe kids' products and try bargaining with AI!</p>
          <Link
            href="/"
            className="mt-2 inline-block rounded-2xl bg-sky-500 px-5 py-2.5 text-xs font-bold text-white shadow-sm shadow-sky-200 hover:bg-sky-600"
          >
            Explore Catalog
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Item List */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item: any) => (
              <div
                key={item.id}
                className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <img
                  src={item.product_image || "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=200"}
                  alt={item.product_name}
                  className="h-20 w-20 rounded-xl object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-slate-800 truncate">{item.product_name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-black text-slate-900">₹{item.agreed_price.toFixed(2)}</span>
                    {item.is_bargained && (
                      <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 border border-amber-200">
                        <Sparkles className="h-3 w-3 text-amber-500" /> AI Bargained Deal
                      </span>
                    )}
                  </div>
                  {item.is_bargained && (
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      (Original ₹{item.original_price.toFixed(2)} · Excluded from checkout coupons to protect minimum floor)
                    </p>
                  )}
                </div>

                {/* Quantity & Delete */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50">
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                      className="px-2.5 py-1 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-l-xl"
                    >
                      -
                    </button>
                    <span className="px-2 text-xs font-semibold text-slate-800">{item.quantity}</span>
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                      className="px-2.5 py-1 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-r-xl"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => handleRemove(item.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm h-fit space-y-4">
            <h2 className="text-base font-bold text-slate-900">Order Summary</h2>

            <div className="space-y-2 text-xs border-b border-slate-100 pb-4">
              <div className="flex justify-between text-slate-600">
                <span>Non-Bargained Subtotal:</span>
                <span className="font-semibold text-slate-800">₹{cart.non_bargained_subtotal?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Bargained Subtotal:</span>
                <span className="font-semibold text-slate-800">₹{cart.bargained_subtotal?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Estimated Delivery:</span>
                <span className="font-semibold text-emerald-600">FREE</span>
              </div>
            </div>

            <div className="flex justify-between text-base font-black text-slate-900">
              <span>Total Amount:</span>
              <span>₹{cart.total_amount?.toFixed(2)}</span>
            </div>

            <Link
              href="/checkout"
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white py-3 text-xs font-bold shadow-md shadow-sky-200 transition-colors"
            >
              Proceed to Checkout <ArrowRight className="h-4 w-4" />
            </Link>

            <p className="text-center text-[10px] text-slate-400">
              Coupons from Smart Savings Agent are applied at checkout to non-bargained items.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
