"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useSkyBot } from "@/context/SkyBotContext";
import Icon from "@/components/Icon";

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
  const panelRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  // Focus trap, trigger restoration, and Escape listener
  useEffect(() => {
    if (isOpen) {
      triggerRef.current = (document.activeElement as HTMLElement) || null;
      const timer = setTimeout(() => {
        const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusables && focusables.length > 0) {
          focusables[0].focus();
        }
      }, 50);

      return () => {
        clearTimeout(timer);
        if (triggerRef.current && typeof triggerRef.current.focus === "function") {
          triggerRef.current.focus();
        }
      };
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") {
        closeSkyBot();
        return;
      }
      if (e.key === "Tab" && panelRef.current) {
        const focusables = Array.from(
          panelRef.current.querySelectorAll<HTMLElement>(
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
          )
        ).filter((el) => el.offsetParent !== null || el.offsetWidth > 0);

        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first || !panelRef.current.contains(document.activeElement)) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last || !panelRef.current.contains(document.activeElement)) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeSkyBot]);

  // Auto-scroll chat stream
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  if (!isOpen) return null;

  const handleSubmitOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNum = inputVal.replace(/[^\d.]/g, "");
    const val = parseFloat(cleanNum);
    if (isNaN(val) || val <= 0) return;
    setInputVal("");
    await sendOffer(val);
  };

  const handleChipOffer = async (amount: number) => {
    await sendOffer(amount);
  };

  // Quick suggestion chips based on activeProduct listed price (90%, 85%, 80%)
  const quickOffers = activeProduct
    ? [
        Math.round(activeProduct.price * 0.9),
        Math.round(activeProduct.price * 0.85),
        Math.round(activeProduct.price * 0.8),
      ]
    : [];

  const extraOffPercent =
    activeProduct && counterPrice !== null && counterPrice < activeProduct.price
      ? Math.round(((activeProduct.price - counterPrice) / activeProduct.price) * 100)
      : null;

  const discountPercent =
    activeProduct && activeProduct.mrp && activeProduct.mrp > activeProduct.price
      ? Math.round(((activeProduct.mrp - activeProduct.price) / activeProduct.mrp) * 100)
      : 0;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Dimmed backdrop */}
      <div
        className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={closeSkyBot}
        aria-hidden="true"
      />

      {/* Negotiator Sheet (Desktop 420px right dock; Mobile 90vh bottom sheet) */}
      <aside
        id="skybot-panel"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="SkyBot AI Negotiator"
        className="relative z-10 w-full sm:w-[420px] max-w-full bg-surface-bright flex flex-col shadow-[-8px_0_30px_rgba(0,0,0,0.12)] sm:h-full h-[90vh] self-end sm:self-auto rounded-t-xl sm:rounded-none overflow-hidden transition-transform duration-300 ease-out"
      >
        {/* Drag Handle & Sheet Header */}
        <div className="pt-3 pb-2 px-4 flex flex-col items-center shrink-0 bg-surface-bright border-b border-surface-container">
          <div className="w-12 h-1.5 rounded-full bg-outline-variant/60 mb-2 sm:hidden" />
          <div className="w-full flex items-center justify-between">
            {/* Bot Identity & Online Status */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-11 h-11 rounded-full bg-primary-fixed flex items-center justify-center text-primary shadow-[0_3px_0_#004d69]">
                  <Icon name="smart_toy" className="w-6 h-6" />
                </div>
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-green-500 ring-2 ring-surface-bright flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                    SkyBot AI
                  </h2>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-[11px] font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-tertiary-container animate-pulse" /> Bargain
                  </span>
                </div>
                <p className="font-body-sm text-[12px] text-on-surface-variant">
                  Instant Indian Rupee Negotiator
                </p>
              </div>
            </div>

            {/* Close / Minimize Button */}
            <button
              id="skybot-close-btn"
              type="button"
              onClick={closeSkyBot}
              aria-label="Dismiss negotiation"
              className="w-10 h-10 rounded-full bg-surface-container-high text-on-surface flex items-center justify-center shadow-[0_3px_0_#bfc8ce] active:translate-y-[2px] transition-all cursor-pointer"
            >
              <Icon name="close" className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Pinned Product Micro-Card */}
        {activeProduct && (
          <div className="px-4 py-2 shrink-0 bg-surface-bright">
            <div className="bg-surface-container-lowest p-3 rounded-lg flex items-center gap-3 shadow-[0_4px_0_#d8e3fb]">
              <div className="w-16 h-16 rounded-xl bg-surface-container overflow-hidden shrink-0 relative">
                {activeProduct.image_url ? (
                  <Image
                    src={activeProduct.image_url}
                    alt={activeProduct.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-primary">
                    <Icon name="package_2" className="w-6 h-6" />
                  </div>
                )}
                {discountPercent > 0 && (
                  <div className="absolute top-1 left-1 bg-secondary-container text-on-secondary-container px-1 py-0.5 rounded-full font-label-sm text-[9px] leading-tight font-bold">
                    Sale
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <span className="bg-primary-fixed text-on-primary-fixed font-label-sm text-[10px] px-2 py-0.5 rounded-full truncate font-bold">
                    Active Bargain Session
                  </span>
                  {activeProduct.mrp && activeProduct.mrp > activeProduct.price && (
                    <span className="font-label-sm text-[11px] text-outline line-through">
                      ₹{Math.round(activeProduct.mrp)}
                    </span>
                  )}
                </div>
                <h3 className="font-headline-sm text-body-md text-on-surface font-semibold truncate">
                  {activeProduct.name}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="font-headline-sm text-headline-sm text-primary font-bold">
                    ₹{Math.round(activeProduct.price)}
                  </span>
                  {discountPercent > 0 && (
                    <span className="font-body-sm text-body-sm text-secondary font-bold">
                      {discountPercent}% OFF
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Negotiation Chat Stream */}
        <div
          id="chat-stream"
          className="px-4 py-3 flex-1 flex flex-col gap-3 overflow-y-auto"
        >
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-2 max-w-[88%] ${
                m.sender === "user" ? "self-end flex-row-reverse" : "self-start"
              }`}
            >
              {/* Bubble Avatar */}
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-1 ${
                  m.sender === "user"
                    ? "bg-primary text-on-primary shadow-[0_2px_0_#004c68]"
                    : "bg-primary-fixed text-primary shadow-[0_2px_0_#87cff8]"
                }`}
              >
                <Icon
                  name={m.sender === "user" ? "person" : "smart_toy"}
                  className="w-4 h-4"
                />
              </div>

              {/* Bubble Card */}
              <div
                className={`p-3 rounded-2xl flex flex-col gap-1 ${
                  m.sender === "user"
                    ? "bg-primary text-on-primary rounded-tr-xs shadow-[0_3px_0_#004c68]"
                    : "bg-surface-container-lowest text-on-surface rounded-tl-xs shadow-[0_3px_0_#d8e3fb]"
                }`}
              >
                <p
                  className="font-body-sm text-body-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: m.text }}
                />
                <span
                  className={`font-label-sm text-[10px] self-end ${
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

        {/* Pinned Bot Counter-Offer Callout Box */}
        {counterPrice !== null && (
          <div className="px-4 py-2 shrink-0 bg-surface-bright">
            <div className="bg-tertiary-fixed text-on-tertiary-fixed rounded-xl p-3 shadow-[0_4px_0_#f9bd26] flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Icon
                    name="auto_awesome"
                    className="w-5 h-5 text-tertiary-container animate-bounce"
                  />
                  <span className="font-headline-sm text-label-lg font-bold">
                    SkyBot Deal: ₹{Math.round(counterPrice)}
                  </span>
                </div>
                {extraOffPercent !== null && extraOffPercent > 0 && (
                  <span className="px-2 py-0.5 bg-tertiary-container text-on-tertiary-container rounded-full font-label-sm text-label-sm font-bold">
                    {extraOffPercent}% Extra OFF
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between text-body-sm font-body-sm text-on-tertiary-fixed-variant">
                <span>
                  Round {roundNumber}/3 {isFinalRound ? "• Final offer" : ""}
                </span>
                {savings && savings > 0 && (
                  <span className="font-bold text-on-tertiary-fixed">
                    You save ₹{savings}
                  </span>
                )}
              </div>

              {/* Big Chunky Primary Pill Button */}
              <button
                id="skybot-apply-to-cart-btn"
                type="button"
                onClick={applyDealToCart}
                disabled={isApplied || loading}
                className={`w-full mt-1 py-3 px-4 rounded-full font-label-lg text-label-lg flex items-center justify-center gap-2 cursor-pointer transition-all active:translate-y-[2px] ${
                  isApplied
                    ? "bg-primary-container text-on-primary-container shadow-[0_3px_0_#004965]"
                    : "bg-[#fe7488] text-white shadow-[0_3px_0_#730425] sm:shadow-[0_5px_0_#730425]"
                }`}
              >
                <Icon name={isApplied ? "check" : "shopping_cart"} className="w-5 h-5" />
                <span className="font-bold">
                  {isApplied
                    ? "Applied to Cart with Deal!"
                    : `Apply to Cart • ₹${Math.round(counterPrice)}`}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Quick Negotiation Chips: "Tap:" */}
        {activeProduct && !isFinalRound && !isAccepted && (
          <div className="px-4 py-2 flex items-center gap-2 overflow-x-auto shrink-0 bg-surface-bright border-t border-surface-container">
            <span className="font-label-sm text-label-sm text-on-surface-variant shrink-0 flex items-center gap-1 font-bold">
              <Icon name="touch_app" className="w-4 h-4" /> Tap:
            </span>

            {quickOffers.map((price) => (
              <button
                key={price}
                type="button"
                onClick={() => handleChipOffer(price)}
                className="px-3.5 py-1.5 rounded-full bg-surface-container-high text-on-surface font-label-md text-label-md shadow-[0_3px_0_#bfc8ce] active:translate-y-[2px] transition-all shrink-0 cursor-pointer"
              >
                ₹{price}
              </button>
            ))}

            {/* Accept Counter Chip only when counterPrice is returned from backend */}
            {counterPrice !== null && (
              <button
                type="button"
                onClick={() => handleChipOffer(counterPrice)}
                className="px-3.5 py-1.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-md text-label-md shadow-[0_3px_0_#87cff8] active:translate-y-[2px] transition-all shrink-0 font-bold cursor-pointer"
              >
                Accept ₹{Math.round(counterPrice)}
              </button>
            )}
          </div>
        )}

        {/* Bottom Bargain Input Field */}
        <div className="px-4 pt-2 pb-4 pb-safe shrink-0 bg-surface-bright border-t border-surface-container">
          {activeProduct && !isFinalRound && !isAccepted ? (
            <form
              onSubmit={handleSubmitOffer}
              className="relative flex items-center gap-2"
            >
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-primary">
                  <Icon name="currency_rupee" className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Enter counter offer (e.g. ₹520)..."
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low text-on-surface font-body-md text-body-md rounded-full focus:outline-none focus:bg-surface-container-lowest shadow-[0_3px_0_#d8e3fb] placeholder:text-outline/70 transition-colors"
                />
              </div>

              {/* Round Send Button */}
              <button
                id="skybot-submit-offer-btn"
                type="submit"
                disabled={!inputVal.trim() || loading}
                aria-label="Send counter offer"
                className="w-11 h-11 rounded-full bg-[#00668a] text-white flex items-center justify-center shadow-[0_4px_0_#001e2c] active:translate-y-[2px] transition-all shrink-0 disabled:opacity-50 cursor-pointer"
              >
                <Icon name="arrow_upward" className="w-5 h-5 text-white" />
              </button>
            </form>
          ) : (
            <div className="text-center py-1">
              <p className="font-body-sm text-[12px] text-on-surface-variant">
                {isApplied
                  ? "Deal applied to your cart! You can continue shopping or view cart."
                  : isFinalRound
                  ? "Negotiation closed for this session. Apply counter deal above!"
                  : "Select any catalog product to start an interactive haggling session."}
              </p>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
};

export default SkyBotSheet;
