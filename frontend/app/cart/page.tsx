"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center font-body-md text-body-md text-on-surface-variant animate-pulse">
        Gathering your treasure loot cart...
      </div>
    );
  }

  const items = cart?.items || [];

  return (
    <div className="mx-auto max-w-5xl px-3 sm:px-6 lg:px-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-headline-xl text-xl sm:text-headline-xl text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-[28px] sm:text-[32px] text-primary">
            shopping_bag
          </span>
          <span>Shopping Cart ({items.length})</span>
        </h1>
        <Link
          href="/"
          className="font-label-md text-xs sm:text-label-md text-primary font-bold hover:underline flex items-center gap-1"
        >
          <span>Continue Shopping</span>
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl bg-surface-container-lowest p-8 sm:p-12 text-center space-y-4 shadow-[0_8px_0_#bdc8d1]">
          <div className="w-16 h-16 rounded-full bg-surface-container-low flex items-center justify-center mx-auto text-primary">
            <span className="material-symbols-outlined text-[36px]">production_quantity_limits</span>
          </div>
          <p className="font-headline-lg text-headline-lg text-on-surface">Your loot chest is empty!</p>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-md mx-auto">
            Explore safe wooden toys, cozy swaddles, or haggle for secret discounts at the SkyBot Bargain Arcade.
          </p>
          <Link
            href="/"
            className="mt-2 inline-flex items-center gap-2 rounded-full bg-primary text-on-primary px-6 py-3 font-headline-md text-headline-md shadow-[0_4px_0_#004965] hover:bg-on-primary-container transition-all"
          >
            <span>Explore Playground Catalog</span>
            <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Cart Item List */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item: any, idx: number) => {
              const shadowColor = idx % 2 === 0 ? "#c4e7ff" : "#ffdadc";
              return (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 rounded-2xl bg-surface-container-lowest p-4 shadow-[0_6px_0_#bdc8d1] transition-all"
                  style={{ boxShadow: `0 6px 0 ${shadowColor}` }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-xl bg-surface-container-low p-2 flex items-center justify-center shrink-0">
                      <Image
                        src={item.product_image || "/stitch/rocket-shuttle.png"}
                        alt={item.product_name || "Cart item"}
                        width={70}
                        height={70}
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-headline-md text-base sm:text-headline-md text-on-surface truncate">
                        {item.product_name}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className="font-headline-lg text-lg sm:text-headline-lg font-bold text-primary">
                          ₹{item.agreed_price.toFixed(2)}
                        </span>
                        {item.is_bargained && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed px-2 py-0.5 font-label-sm text-[10px] sm:text-xs font-bold shadow-[0_1px_0_#f9bd22]">
                            <span className="material-symbols-outlined text-[12px] sm:text-[14px]">smart_toy</span>
                            <span>Bargained</span>
                          </span>
                        )}
                      </div>
                      {item.is_bargained && (
                        <p className="font-label-sm text-[10px] sm:text-[11px] text-on-surface-variant mt-0.5">
                          Original ₹{item.original_price.toFixed(2)} · Excluded from coupons to lock bottom floor price
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Quantity & Delete Controls - responsive wrap for 390px mobile */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-surface-container-high/60">
                    <div className="flex items-center rounded-full bg-surface-container px-2 py-1 shadow-[0_2px_0_#bdc8d1]">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 rounded-full flex items-center justify-center text-on-surface font-bold hover:bg-surface-container-high transition-colors cursor-pointer text-sm"
                      >
                        -
                      </button>
                      <span className="px-3 font-headline-md text-sm sm:text-headline-md text-on-surface">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 rounded-full flex items-center justify-center text-on-surface font-bold hover:bg-surface-container-high transition-colors cursor-pointer text-sm"
                      >
                        +
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-headline-md text-sm font-bold text-on-surface sm:hidden">
                        ₹{(item.agreed_price * item.quantity).toFixed(2)}
                      </span>
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="w-8 h-8 rounded-full bg-surface-container-low text-secondary hover:bg-secondary-container hover:text-on-secondary flex items-center justify-center transition-colors cursor-pointer shrink-0"
                        title="Remove item"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cart Summary */}
          <div className="rounded-2xl bg-surface-container-lowest p-6 shadow-[0_8px_0_#c4e7ff] h-fit space-y-4">
            <h2 className="font-headline-lg text-lg sm:text-headline-lg text-on-surface">
              Order Summary
            </h2>

            <div className="space-y-2.5 font-body-sm text-xs sm:text-body-sm border-b border-surface-container-high pb-4">
              <div className="flex justify-between text-on-surface-variant">
                <span>Non-Bargained Subtotal:</span>
                <span className="font-bold text-on-surface">
                  ₹{cart.non_bargained_subtotal?.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>Bargained Subtotal:</span>
                <span className="font-bold text-on-surface">
                  ₹{cart.bargained_subtotal?.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>Express Delivery:</span>
                <span className="font-bold text-primary">FREE</span>
              </div>
            </div>

            <div className="flex justify-between font-headline-xl text-xl sm:text-headline-xl font-bold text-on-surface">
              <span>Total:</span>
              <span className="text-primary">₹{cart.total_amount?.toFixed(2)}</span>
            </div>

            <Link
              href="/checkout"
              className="w-full flex items-center justify-center gap-2 rounded-full bg-secondary-container text-on-secondary py-3.5 font-headline-md text-sm sm:text-headline-md shadow-[0_4px_0_#730425] hover:brightness-105 active:translate-y-[2px] active:shadow-[0_1px_0_#730425] transition-all"
            >
              <span>Proceed to Checkout</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>

            <p className="text-center font-label-sm text-[11px] text-on-surface-variant leading-relaxed">
              Available store coupons automatically apply at checkout to non-bargained items only.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
