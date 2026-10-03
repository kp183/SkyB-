"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useSkyBot } from "@/context/SkyBotContext";
import Icon from "@/components/Icon";
import Button from "@/components/ui/Button";

export const SkyBotSheet: React.FC = () => {
  const {
    isOpen,
    activeProduct,
    messages,
    counterPrice,
    savings,
    roundNumber,
    isFinalRound,
    isAccepted,
    isApplied,
    loading,
    error,
    closeSkyBot,
    sendOffer,
    applyDealToCart,
  } = useSkyBot();

  const [inputVal, setInputVal] = useState("");
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Esc key closes SkyBot panel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closeSkyBot();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeSkyBot]);

  // Auto-scroll chat stream
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!isOpen) return null;

  const handleSubmitOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(inputVal.replace(/[^\d.]/g, ""));
    if (isNaN(val) || val <= 0) return;
    setInputVal("");
    await sendOffer(val);
  };

  const handleChipOffer = async (amount: number) => {
    await sendOffer(amount);
  };

  // Quick suggestion chips based on activeProduct price
  const quickOffers = activeProduct
    ? [
        Math.round(activeProduct.price * 0.9),
        Math.round(activeProduct.price * 0.85),
        Math.round(activeProduct.price * 0.8),
      ]
    : [];

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Dimmed backdrop */}
      <div
        className="fixed inset-0 bg-inverse-surface/60 backdrop-blur-xs transition-opacity"
        onClick={closeSkyBot}
        aria-hidden="true"
      />

      {/* Desktop Right Slide-Over (sm and up) & Mobile Bottom Sheet */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="SkyBot Bargain AI"
        className="relative z-10 w-full sm:w-[420px] max-w-full bg-surface-container-lowest flex flex-col shadow-[-8px_0_30px_rgba(0,30,44,0.16)] sm:h-full h-[90vh] self-end sm:self-auto rounded-t-3xl sm:rounded-none overflow-hidden transition-transform duration-300 ease-out"
      >
        {/* Mobile Drag Handle */}
        <div className="sm:hidden pt-3 pb-1 flex justify-center w-full">
          <div className="w-12 h-1.5 rounded-full bg-outline-variant/60" />
        </div>

        {/* Tactile Header */}
        <div className="p-4 bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-between shadow-[0_2px_0_#f9bd22] shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-tertiary-container text-on-tertiary flex items-center justify-center shadow-[0_2px_0_#795900]">
                <Icon name="smart_toy" className="w-6 h-6" />
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-secondary-container ring-2 ring-tertiary-fixed animate-ping" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="font-headline-sm text-headline-sm font-bold">
                  SkyBot Bargain AI
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-tertiary text-on-tertiary font-label-sm text-[10px] font-extrabold uppercase">
                  Round {roundNumber}/3
                </span>
              </div>
              <p className="font-body-sm text-[12px] text-on-tertiary-fixed-variant">
                Smart pricing &amp; transparent parent haggling
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeSkyBot}
            aria-label="Close SkyBot"
            className="w-9 h-9 rounded-full bg-tertiary-fixed-dim/40 hover:bg-tertiary-fixed-dim text-on-tertiary-fixed flex items-center justify-center transition-colors cursor-pointer"
          >
            <Icon name="close" className="w-5 h-5" />
          </button>
        </div>

        {/* Pinned Preloaded Product Micro-Card */}
        {activeProduct && (
          <div className="px-4 py-3 bg-surface-container-low border-b border-surface-container shrink-0">
            <div className="p-3 rounded-xl bg-surface-container-lowest flex items-center gap-3 shadow-[0_3px_0_#c4e7ff]">
              <div className="w-14 h-14 rounded-lg bg-surface-container-low relative overflow-hidden shrink-0">
                {activeProduct.image_url ? (
                  <Image
                    src={activeProduct.image_url}
                    alt={activeProduct.name}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-primary">
                    <Icon name="package_2" className="w-6 h-6" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-[10px] text-primary font-bold uppercase tracking-wider">
                    Negotiating Live
                  </span>
                  {activeProduct.mrp && activeProduct.mrp > activeProduct.price && (
                    <span className="font-body-sm text-[12px] text-outline line-through">
                      ₹{Math.round(activeProduct.mrp)}
                    </span>
                  )}
                </div>
                <h3 className="font-label-md text-label-md text-on-surface font-bold truncate">
                  {activeProduct.name}
                </h3>
                <div className="flex items-baseline gap-2">
                  <span className="font-headline-sm text-headline-sm text-primary font-extrabold">
                    ₹{Math.round(activeProduct.price)}
                  </span>
                  <span className="font-label-sm text-[11px] text-outline">
                    Catalog Price
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Chat Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-surface-container-low/50">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-2 max-w-[90%] ${
                m.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-1 ${
                  m.sender === "user"
                    ? "bg-primary text-on-primary shadow-[0_2px_0_#004965]"
                    : "bg-tertiary-fixed text-tertiary shadow-[0_2px_0_#795900]"
                }`}
              >
                <Icon
                  name={m.sender === "user" ? "person" : "smart_toy"}
                  className="w-4 h-4"
                />
              </div>

              <div
                className={`p-3 rounded-2xl shadow-[0_2px_0_#bdc8d1] leading-relaxed text-sm ${
                  m.sender === "user"
                    ? "bg-primary text-on-primary rounded-tr-xs"
                    : "bg-surface-container-lowest text-on-surface rounded-tl-xs"
                }`}
              >
                <p className="font-body-sm text-body-sm">{m.text}</p>
                <span
                  className={`text-[10px] block mt-1 text-right ${
                    m.sender === "user" ? "text-primary-fixed" : "text-outline"
                  }`}
                >
                  {m.time}
                </span>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-on-surface-variant font-label-sm text-label-sm italic p-2">
              <span className="inline-block w-3.5 h-3.5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span>SkyBot is calculating pricing bounds...</span>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-xl bg-error-container text-on-error-container font-body-sm text-body-sm shadow-[0_2px_0_#ba1a1a]">
              {error}
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Counter Offer Callout Panel (shows backend values: Bargain price ₹X, you save ₹Y) */}
        {counterPrice !== null && (
          <div className="p-4 bg-tertiary-fixed border-t border-tertiary shadow-[0_4px_0_#f9bd22] shrink-0">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Icon name="auto_awesome" className="w-5 h-5 text-tertiary-container animate-pulse" />
                <span className="font-headline-sm text-label-lg font-bold text-on-tertiary-fixed">
                  Bargain price ₹{Math.round(counterPrice)}
                </span>
              </div>
              {savings && savings > 0 ? (
                <span className="px-2 py-0.5 rounded-full bg-tertiary-container text-on-tertiary font-label-sm text-label-sm font-extrabold">
                  You save ₹{savings}
                </span>
              ) : null}
            </div>

            <p className="font-body-sm text-[12px] text-on-tertiary-fixed-variant mb-3">
              {isFinalRound
                ? "Final round: this is the best server-approved price available."
                : "Backend verified price. Tap below to seal deal and apply to cart!"}
            </p>

            <button
              type="button"
              onClick={applyDealToCart}
              disabled={isApplied || loading}
              className={`w-full py-3 px-4 rounded-full font-label-lg text-label-lg font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                isApplied
                  ? "bg-primary-container text-on-primary-container shadow-[0_3px_0_#004965]"
                  : "btn-add-action"
              }`}
            >
              <Icon name={isApplied ? "check" : "shopping_cart"} className="w-5 h-5" />
              <span>
                {isApplied
                  ? "Added to Cart with Bargain Price!"
                  : `Apply to Cart • ₹${Math.round(counterPrice)}`}
              </span>
            </button>
          </div>
        )}

        {/* Quick Suggestion Chips */}
        {activeProduct && !isFinalRound && !isAccepted && (
          <div className="px-4 py-2 bg-surface-container-lowest border-t border-surface-container flex items-center gap-2 overflow-x-auto shrink-0">
            <span className="font-label-sm text-[11px] text-outline shrink-0 flex items-center gap-1">
              <Icon name="touch_app" className="w-3.5 h-3.5" /> Suggest:
            </span>
            {quickOffers.map((price) => (
              <button
                key={price}
                type="button"
                onClick={() => handleChipOffer(price)}
                className="px-3 py-1 rounded-full bg-surface-container text-on-surface font-label-sm text-label-sm hover:bg-surface-container-high shadow-[0_2px_0_#bdc8d1] active:translate-y-0.5 transition-all shrink-0 cursor-pointer"
              >
                ₹{price}
              </button>
            ))}
          </div>
        )}

        {/* Input Bar (Above keyboard on mobile with pb-safe) */}
        {activeProduct && !isFinalRound && !isAccepted ? (
          <form
            onSubmit={handleSubmitOffer}
            className="p-3 bg-surface-container-lowest border-t border-surface-container flex items-center gap-2 pb-safe shrink-0"
          >
            <div className="flex-1 relative flex items-center">
              <span className="absolute left-3 font-headline-sm text-headline-sm text-outline">
                ₹
              </span>
              <input
                type="number"
                min="1"
                step="1"
                placeholder="Enter your offer price in ₹..."
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                className="w-full h-11 pl-8 pr-4 rounded-full bg-surface-container-low border border-surface-container-high font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary shadow-[0_2px_0_#bdc8d1]"
                disabled={loading}
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={!inputVal || loading}
            >
              Offer
            </Button>
          </form>
        ) : (
          <div className="p-3 bg-surface-container-lowest border-t border-surface-container text-center pb-safe shrink-0">
            <p className="font-body-sm text-[12px] text-on-surface-variant">
              {isApplied
                ? "Deal applied to your cart! You can continue shopping or view cart."
                : isFinalRound
                ? "Negotiation closed for this session. Apply counter deal above!"
                : "Select any catalog product to start an interactive haggling session."}
            </p>
          </div>
        )}
      </aside>
    </div>
  );
};

export default SkyBotSheet;
