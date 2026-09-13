"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, XCircle, CreditCard, ShieldCheck, Tag, Sparkles, ArrowLeft } from "lucide-react";
import { api } from "@/lib/api";

export default function CheckoutPage() {
  const [cart, setCart] = useState<any>(null);
  const [address, setAddress] = useState("Flat 402, Green Valley Apartments, Andheri West, Mumbai, MH - 400053");
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // Order & Payment state
  const [createdOrder, setCreatedOrder] = useState<any>(null);
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [paymentResult, setPaymentResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCart() {
      try {
        const data = await api.getCart();
        setCart(data);
      } catch (err: any) {
        if (err.status === 401) window.location.href = "/login";
      } finally {
        setLoading(false);
      }
    }
    loadCart();
  }, []);

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) return;
    setIsProcessing(true);
    setError(null);

    try {
      const order = await api.checkout(address);
      setCreatedOrder(order);
    } catch (err: any) {
      setError(err.message || "Failed to process checkout");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExecuteMockPay = async () => {
    if (!createdOrder) return;
    setIsProcessing(true);
    try {
      const result = await api.mockPay(createdOrder.id, simulateFailure);
      setPaymentResult(result);
    } catch (err: any) {
      setError(err.message || "Mock payment error");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return <div className="mx-auto max-w-3xl px-4 py-12 text-center text-slate-400">Preparing checkout...</div>;
  }

  // Final confirmation screen on payment result
  if (paymentResult) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center space-y-4">
        {paymentResult.payment_successful ? (
          <div className="rounded-3xl border border-emerald-200 bg-white p-8 shadow-xl space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-black text-slate-900">Order Placed Successfully!</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Order #{createdOrder.id} has been placed. Status: <span className="font-bold text-emerald-600">{paymentResult.status}</span>.
            </p>
            <div className="rounded-2xl bg-slate-50 p-4 text-left text-xs space-y-1 text-slate-600 border border-slate-100">
              <p><span className="font-bold">Total Paid:</span> ₹{createdOrder.total_amount.toFixed(2)}</p>
              {createdOrder.discount_applied > 0 && (
                <p className="text-emerald-600 font-semibold">
                  Smart Savings Saved: ₹{createdOrder.discount_applied.toFixed(2)} ({createdOrder.applied_coupon_code})
                </p>
              )}
              <p><span className="font-bold">Shipping to:</span> {createdOrder.delivery_address}</p>
            </div>
            <Link
              href="/orders"
              className="block w-full rounded-2xl bg-sky-500 py-3 text-xs font-bold text-white shadow-md shadow-sky-200 hover:bg-sky-600"
            >
              View My Orders
            </Link>
          </div>
        ) : (
          <div className="rounded-3xl border border-rose-200 bg-white p-8 shadow-xl space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
              <XCircle className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-black text-slate-900">Payment Simulation Failed</h2>
            <p className="text-xs text-slate-500 leading-relaxed">{paymentResult.message}</p>
            <p className="text-[11px] text-slate-400">Order status is now 'payment_failed'. Your cart items have been preserved.</p>
            <div className="flex gap-2">
              <button
                onClick={() => setPaymentResult(null)}
                className="flex-1 rounded-2xl bg-slate-900 py-2.5 text-xs font-bold text-white hover:bg-slate-800"
              >
                Retry Payment
              </button>
              <Link
                href="/cart"
                className="flex-1 rounded-2xl bg-slate-100 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-200"
              >
                Return to Cart
              </Link>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <Link href="/cart" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-sky-600">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Cart
      </Link>

      <h1 className="text-2xl font-black text-slate-900">Checkout & Mock Payment</h1>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Delivery Form */}
        <div className="lg:col-span-2 space-y-6">
          {!createdOrder ? (
            <form onSubmit={handleCreateOrder} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-slate-800">1. Delivery Address</h2>
              <div>
                <textarea
                  rows={3}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter full shipping address..."
                  required
                  className="w-full rounded-2xl border border-slate-300 p-3 text-xs focus:border-sky-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full rounded-2xl bg-sky-500 hover:bg-sky-600 text-white py-3 text-xs font-bold shadow-md shadow-sky-200 transition-colors"
              >
                {isProcessing ? "Reviewing Deals..." : "Proceed to Payment Gateway"}
              </button>
            </form>
          ) : (
            /* Mock Payment Gateway Component */
            <div className="rounded-3xl border-2 border-sky-300 bg-white p-6 shadow-md space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-sky-500" />
                  <h2 className="text-sm font-bold text-slate-800">2. SkyB Mock Payment Gateway</h2>
                </div>
                <span className="text-[10px] font-bold rounded-md bg-amber-100 text-amber-800 px-2 py-0.5">
                  Academic Demo Mode
                </span>
              </div>

              <p className="text-xs text-slate-500">
                Order #{createdOrder.id} is initialized with status <span className="font-semibold text-amber-600">{createdOrder.status}</span>.
              </p>

              {/* Simulation Toggle */}
              <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-3.5 space-y-2">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={simulateFailure}
                    onChange={(e) => setSimulateFailure(e.target.checked)}
                    className="h-4 w-4 rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                  />
                  <span>Simulate Payment Failure (Faculty Demo Control)</span>
                </label>
                <p className="text-[11px] text-slate-500 pl-6 leading-relaxed">
                  Check this box to demonstrate the failure path: the order flips to <code className="font-mono bg-white px-1 rounded">payment_failed</code> and cart items are preserved.
                </p>
              </div>

              <button
                onClick={handleExecuteMockPay}
                disabled={isProcessing}
                className={`w-full rounded-2xl py-3 text-xs font-bold text-white shadow-md transition-colors ${
                  simulateFailure
                    ? "bg-rose-500 hover:bg-rose-600 shadow-rose-200"
                    : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200"
                }`}
              >
                {isProcessing
                  ? "Processing Simulation..."
                  : simulateFailure
                  ? "Simulate Payment Failure"
                  : `Complete Mock Payment (₹${createdOrder.total_amount.toFixed(2)})`}
              </button>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm h-fit space-y-4">
          <h3 className="text-sm font-bold text-slate-800">Checkout Breakdown</h3>

          {createdOrder ? (
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Items Subtotal:</span>
                <span>₹{(createdOrder.total_amount + createdOrder.discount_applied).toFixed(2)}</span>
              </div>
              {createdOrder.discount_applied > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span className="flex items-center gap-1"><Tag className="h-3.5 w-3.5" /> Coupon Discount:</span>
                  <span>-₹{createdOrder.discount_applied.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t border-slate-100 pt-2 flex justify-between text-sm font-black text-slate-900">
                <span>Final Payable:</span>
                <span>₹{createdOrder.total_amount.toFixed(2)}</span>
              </div>
            </div>
          ) : (
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Cart Subtotal:</span>
                <span>₹{cart?.total_amount?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Smart Savings:</span>
                <span>Calculated on next step</span>
              </div>
              <div className="border-t border-slate-100 pt-2 flex justify-between text-sm font-black text-slate-900">
                <span>Estimated Total:</span>
                <span>₹{cart?.total_amount?.toFixed(2)}</span>
              </div>
            </div>
          )}

          <div className="rounded-2xl bg-sky-50 border border-sky-100 p-3 text-[11px] text-sky-800 space-y-1">
            <p className="font-bold flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5 text-sky-600" /> Academic Sandbox</p>
            <p className="text-[10px] text-sky-600 leading-relaxed">
              No real credit card is required. Payment is processed through the SkyB mock simulator.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
