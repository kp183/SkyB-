"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

export default function CheckoutPage() {
  const [cart, setCart] = useState<any>(null);
  const [address, setAddress] = useState("");
  const [addressError, setAddressError] = useState<string | null>(null);
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
    if (!address.trim() || address.trim().length < 10) {
      setAddressError(
        "Please enter a complete delivery address (building, street, city, pincode, minimum 10 characters)."
      );
      return;
    }
    setAddressError(null);
    setIsProcessing(true);
    setError(null);

    try {
      const order = await api.checkout(address.trim());
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
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center font-body-md text-body-md text-on-surface-variant animate-pulse">
        Preparing your playground checkout...
      </div>
    );
  }

  // Final confirmation screen on payment result
  if (paymentResult) {
    return (
      <div className="mx-auto max-w-md px-4 py-12 text-center space-y-4">
        {paymentResult.payment_successful ? (
          <div className="rounded-2xl bg-surface-container-lowest p-8 shadow-[0_8px_0_#7bd0ff] space-y-4 border-2 border-primary-container">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-fixed text-primary shadow-[0_2px_0_#7bd0ff]">
              <span className="material-symbols-outlined text-[36px]">check_circle</span>
            </div>
            <h2 className="font-headline-xl text-headline-xl text-on-surface">
              Order Placed Successfully!
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              Order #{createdOrder.id} is locked with status:{" "}
              <strong className="text-primary">{paymentResult.status}</strong>.
            </p>
            <div className="rounded-xl bg-surface-container-low p-4 text-left font-body-sm text-body-sm space-y-1.5 text-on-surface border border-surface-container-high">
              <p>
                <span className="font-bold">Total Paid:</span> ₹
                {createdOrder.total_amount.toFixed(2)}
              </p>
              {createdOrder.discount_applied > 0 && (
                <p className="text-primary font-bold">
                  Coupon Applied: ₹{createdOrder.discount_applied.toFixed(2)} savings (
                  {createdOrder.applied_coupon_code})
                </p>
              )}
              <p>
                <span className="font-bold">Delivery Address:</span>{" "}
                {createdOrder.delivery_address}
              </p>
            </div>
            <Link
              href="/orders"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-secondary-container text-on-secondary py-3.5 font-headline-md text-headline-md shadow-[0_4px_0_#730425] hover:brightness-105 transition-all"
            >
              <span>View Order History</span>
              <span className="material-symbols-outlined text-[18px]">history</span>
            </Link>
          </div>
        ) : (
          <div className="rounded-2xl bg-surface-container-lowest p-8 shadow-[0_8px_0_#fe7488] space-y-4 border-2 border-secondary-container">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary-fixed text-secondary shadow-[0_2px_0_#fe7488]">
              <span className="material-symbols-outlined text-[36px]">cancel</span>
            </div>
            <h2 className="font-headline-xl text-headline-xl text-on-surface">
              Payment Simulation Failed
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              {paymentResult.message}
            </p>
            <p className="font-label-sm text-[11px] text-on-surface-variant">
              Status recorded as 'payment_failed'. Your cart items remain intact for another attempt.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setPaymentResult(null)}
                className="flex-1 rounded-full bg-primary text-on-primary py-3 font-headline-md text-headline-md shadow-[0_3px_0_#004965] hover:bg-on-primary-container cursor-pointer"
              >
                Retry Simulation
              </button>
              <Link
                href="/cart"
                className="flex-1 rounded-full bg-surface-container text-on-surface py-3 font-headline-md text-headline-md shadow-[0_2px_0_#bdc8d1] hover:bg-surface-container-high text-center"
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
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
      <Link
        href="/cart"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-low text-on-surface hover:bg-surface-container font-label-md text-label-md shadow-[0_2px_0_#bdc8d1] transition-all"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        <span>Back to Cart</span>
      </Link>

      <h1 className="font-headline-xl text-headline-xl text-on-surface flex items-center gap-2">
        <span className="material-symbols-outlined text-primary text-[32px]">
          shopping_cart_checkout
        </span>
        <span>Checkout &amp; Payment Sandbox</span>
      </h1>

      {error && (
        <div className="rounded-xl bg-error-container p-3.5 text-on-error-container font-body-sm text-body-sm shadow-[0_2px_0_#ffdad6] flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">error</span>
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Delivery Form */}
        <div className="lg:col-span-2 space-y-6">
          {!createdOrder ? (
            <form
              onSubmit={handleCreateOrder}
              className="rounded-2xl bg-surface-container-lowest p-4 sm:p-6 shadow-[0_8px_0_#bdc8d1] space-y-4"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-on-primary">
                  <span className="material-symbols-outlined text-[18px]">location_on</span>
                </div>
                <h2 className="font-headline-lg text-lg sm:text-headline-lg text-on-surface">
                  1. Delivery Address
                </h2>
              </div>
              <div>
                <textarea
                  rows={3}
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    if (addressError) setAddressError(null);
                  }}
                  placeholder="Enter full shipping address (flat/house, street, locality, city, pincode)..."
                  required
                  className={`w-full rounded-xl border p-3 font-body-md text-body-md text-on-surface focus:outline-none ${
                    addressError
                      ? "border-secondary bg-secondary-fixed/20"
                      : "border-surface-container-high focus:border-primary shadow-[0_2px_0_#bdc8d1]"
                  }`}
                />
                {addressError && (
                  <p className="mt-1 font-label-sm text-[11px] text-secondary font-bold">
                    {addressError}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full rounded-full bg-primary text-on-primary py-3.5 font-headline-md text-sm sm:text-headline-md shadow-[0_4px_0_#004965] hover:bg-on-primary-container active:translate-y-[2px] active:shadow-[0_1px_0_#004965] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{isProcessing ? "Processing..." : "Proceed to Payment Simulation"}</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </form>
          ) : (
            /* Mock Payment Gateway Component */
            <div className="rounded-2xl bg-surface-container-lowest p-4 sm:p-6 shadow-[0_8px_0_#c4e7ff] space-y-5 border-2 border-primary-container">
              <div className="flex items-center justify-between border-b border-surface-container-high pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-on-primary">
                    <span className="material-symbols-outlined text-[18px]">credit_card</span>
                  </div>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface">
                    2. Mock Payment Simulator
                  </h2>
                </div>
                <span className="font-label-sm text-[11px] font-bold rounded-full bg-primary-fixed text-on-primary-fixed px-3 py-1 shadow-[0_1px_0_#7bd0ff]">
                  Academic Sandbox
                </span>
              </div>

              <p className="font-body-md text-body-md text-on-surface-variant">
                Order #{createdOrder.id} is initialized with status:{" "}
                <strong className="text-secondary font-bold">{createdOrder.status}</strong>.
              </p>

              {/* Simulation Toggle */}
              <div className="rounded-xl border border-surface-container-high bg-surface-container-low p-4 space-y-2">
                <label className="flex items-center gap-2.5 font-headline-md text-headline-md text-on-surface cursor-pointer">
                  <input
                    type="checkbox"
                    checked={simulateFailure}
                    onChange={(e) => setSimulateFailure(e.target.checked)}
                    className="h-5 w-5 rounded-md text-secondary focus:ring-secondary accent-secondary cursor-pointer"
                  />
                  <span>Simulate Payment Failure (Evaluation Demo Control)</span>
                </label>
                <p className="font-body-sm text-body-sm text-on-surface-variant pl-7 leading-relaxed">
                  Check this box to test the payment rejection branch: the order transitions to{" "}
                  <code className="bg-surface-container-lowest px-1.5 py-0.5 rounded-full border border-surface-container-high font-bold">
                    payment_failed
                  </code>{" "}
                  and your cart remains untouched.
                </p>
              </div>

              <button
                onClick={handleExecuteMockPay}
                disabled={isProcessing}
                className={`w-full rounded-full py-3.5 font-headline-md text-headline-md text-white transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  simulateFailure
                    ? "bg-secondary shadow-[0_4px_0_#730425] hover:brightness-105"
                    : "bg-secondary-container text-on-secondary shadow-[0_4px_0_#730425] hover:brightness-105"
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {simulateFailure ? "error" : "check_circle"}
                </span>
                <span>
                  {isProcessing
                    ? "Simulating Transaction..."
                    : simulateFailure
                    ? "Simulate Payment Failure"
                    : `Confirm Mock Payment (₹${createdOrder.total_amount.toFixed(2)})`}
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="rounded-2xl bg-surface-container-lowest p-6 shadow-[0_8px_0_#ffdadc] h-fit space-y-4">
          <h3 className="font-headline-lg text-headline-lg text-on-surface">
            Payment Breakdown
          </h3>

          {createdOrder ? (
            <div className="space-y-2.5 font-body-sm text-body-sm">
              <div className="flex justify-between text-on-surface-variant">
                <span>Items Subtotal:</span>
                <span className="font-bold text-on-surface">
                  ₹{(createdOrder.total_amount + createdOrder.discount_applied).toFixed(2)}
                </span>
              </div>
              {createdOrder.discount_applied > 0 && (
                <div className="flex justify-between text-primary font-bold">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">sell</span>
                    Coupon Discount:
                  </span>
                  <span>-₹{createdOrder.discount_applied.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t border-surface-container-high pt-2 flex justify-between font-headline-xl text-headline-xl font-bold text-on-surface">
                <span>Final Payable:</span>
                <span className="text-primary">₹{createdOrder.total_amount.toFixed(2)}</span>
              </div>
            </div>
          ) : (
            <div className="space-y-2.5 font-body-sm text-body-sm">
              <div className="flex justify-between text-on-surface-variant">
                <span>Cart Subtotal:</span>
                <span className="font-bold text-on-surface">
                  ₹{cart?.total_amount?.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>Coupon Savings:</span>
                <span className="italic">Calculated on confirmation</span>
              </div>
              <div className="border-t border-surface-container-high pt-2 flex justify-between font-headline-xl text-headline-xl font-bold text-on-surface">
                <span>Estimated Total:</span>
                <span className="text-primary">₹{cart?.total_amount?.toFixed(2)}</span>
              </div>
            </div>
          )}

          <div className="rounded-xl bg-surface-container-low border border-surface-container-high p-4 text-[12px] text-on-surface-variant space-y-1">
            <p className="font-bold flex items-center gap-1.5 text-on-surface">
              <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
              Academic Evaluation Sandbox
            </p>
            <p className="text-[11px] leading-relaxed">
              No real credit card or bank credentials are required. Payments are handled via a simulated sandbox.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
