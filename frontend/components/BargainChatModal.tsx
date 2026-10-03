"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { api } from "@/lib/api";

interface Message {
  sender: "ai" | "user";
  text: string;
  price?: number;
  round?: number;
}

interface BargainModalProps {
  product: {
    id: number;
    name: string;
    price: number;
    image_url?: string | null;
  };
  onClose: () => void;
  onAccepted: () => void;
}

export default function BargainChatModal({ product, onClose, onAccepted }: BargainModalProps) {
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [offerInput, setOfferInput] = useState<string>("");
  const [currentRound, setCurrentRound] = useState<number>(0);
  const [latestCounter, setLatestCounter] = useState<number | null>(null);
  const [isFinalRound, setIsFinalRound] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize session on mount
  useEffect(() => {
    async function initSession() {
      setLoading(true);
      try {
        const res = await api.startBargain(product.id);
        setSessionId(res.session_id);
        setMessages([
          {
            sender: "ai",
            text: `Beep boop! 🌈 I'm SkyBot, your playful bargaining buddy! Listed price for '${product.name}' is ₹${product.price.toFixed(2)}. Make your pitch or offer below (max 3 rounds)!`,
          },
        ]);
      } catch (err: any) {
        if (err.status === 401) {
          setError("Please login to bargain and save agreed loot prices to your cart.");
        } else {
          setError(err.message || "Failed to start bargain session.");
        }
      } finally {
        setLoading(false);
      }
    }

    initSession();
  }, [product.id, product.name, product.price]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    const offerNum = parseFloat(offerInput);
    if (!offerNum || offerNum <= 0 || !sessionId) return;

    // Add customer offer to chat
    setMessages((prev) => [
      ...prev,
      { sender: "user", text: `I offer ₹${offerNum.toFixed(2)}!`, price: offerNum },
    ]);
    setOfferInput("");
    setLoading(true);
    setError(null);

    try {
      const res = await api.submitBargainOffer(sessionId, offerNum);
      setCurrentRound(res.round_number);
      setLatestCounter(res.counter_price);
      setIsFinalRound(res.is_final_round);

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: res.message,
          price: res.counter_price,
          round: res.round_number,
        },
      ]);
    } catch (err: any) {
      setError(err.message || "Failed to process offer");
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptDeal = async () => {
    if (!sessionId) return;
    setLoading(true);
    try {
      await api.acceptBargain(sessionId);
      onAccepted();
    } catch (err: any) {
      setError(err.message || "Failed to accept bargain deal");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="flex flex-col w-full max-w-md h-[560px] rounded-2xl bg-surface-container-lowest shadow-[0_12px_32px_rgba(0,102,138,0.2)] border-2 border-primary-container overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-primary-container text-on-primary-container shadow-[0_2px_0_#00668a]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-container-lowest text-primary shadow-[0_2px_0_#00668a]">
              <span className="material-symbols-outlined text-[20px]">smart_toy</span>
            </div>
            <div>
              <h3 className="font-headline-md text-headline-md font-bold text-on-primary-container">
                SkyBot Bargain Counter
              </h3>
              <p className="font-label-sm text-label-sm text-on-primary-container/80 font-medium">
                {currentRound > 0
                  ? `Round ${currentRound} of 3 (Max 3 rounds)`
                  : "Pitch an offer below the listed price"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container-lowest/40 hover:bg-surface-container-lowest/80 text-on-primary-container flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Product mini-preview */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-surface-container-high bg-surface-container-low">
          <div className="relative h-12 w-12 rounded-lg bg-surface-container-lowest p-1 flex items-center justify-center overflow-hidden shrink-0 shadow-[0_2px_0_#bdc8d1]">
            <Image
              src={product.image_url || "/stitch/rocket-shuttle.png"}
              alt={product.name || "Product bargain preview"}
              width={48}
              height={48}
              className="h-full w-full object-contain"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-headline-md text-headline-md text-on-surface truncate">{product.name}</p>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Listed Price: <span className="font-bold text-primary">₹{product.price.toFixed(2)}</span>
            </p>
          </div>
          {latestCounter !== null && (
            <div className="text-right">
              <span className="font-label-sm text-[10px] font-bold uppercase tracking-wider text-secondary">
                Bot Counter
              </span>
              <p className="font-headline-lg text-headline-lg font-bold text-secondary">
                ₹{latestCounter.toFixed(2)}
              </p>
            </div>
          )}
        </div>

        {/* Chat Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-surface-container-lowest/50">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 font-body-md text-body-md leading-relaxed ${
                  m.sender === "user"
                    ? "bg-secondary-fixed text-on-secondary-fixed shadow-[0_2px_0_#fe7488] rounded-tr-none"
                    : "bg-primary-fixed text-on-primary-fixed shadow-[0_2px_0_#7bd0ff] rounded-tl-none"
                }`}
              >
                {m.text}
                {m.round && (
                  <span className="block mt-1 font-label-sm text-[10px] opacity-80 font-bold uppercase">
                    Round {m.round} of 3
                  </span>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 font-body-sm text-body-sm text-on-surface-variant italic">
              <span className="material-symbols-outlined animate-spin text-[18px] text-primary">
                progress_activity
              </span>
              SkyBot is crunching your playful pitch...
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 rounded-xl bg-error-container p-3 text-on-error-container text-body-sm shadow-[0_2px_0_#ffdad6]">
              <span className="material-symbols-outlined text-[18px] text-error shrink-0">
                error
              </span>
              <span>{error}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Modal Action Bar */}
        <div className="p-4 border-t border-surface-container-high bg-surface-container-lowest">
          {latestCounter !== null && (
            <button
              onClick={handleAcceptDeal}
              disabled={loading}
              className="mb-3 w-full flex items-center justify-center gap-2 rounded-full bg-secondary-container text-on-secondary py-3 font-headline-md text-headline-md shadow-[0_4px_0_#730425] hover:brightness-105 active:translate-y-[2px] active:shadow-[0_1px_0_#730425] transition-all"
            >
              <span className="material-symbols-outlined text-[20px]">check_circle</span>
              <span>Accept Deal at ₹{latestCounter.toFixed(2)} &amp; Add to Cart</span>
            </button>
          )}

          {currentRound < 3 ? (
            <form onSubmit={handleSendOffer} className="relative flex items-center gap-2">
              <input
                type="number"
                step="0.01"
                placeholder="Enter counter offer (e.g. 520)..."
                value={offerInput}
                onChange={(e) => setOfferInput(e.target.value)}
                disabled={loading || !!error}
                className="w-full h-12 pl-4 pr-16 rounded-full bg-surface-container-low border border-surface-container-high text-on-surface font-body-md text-body-md focus:outline-none focus:border-primary shadow-[0_2px_0_#bdc8d1]"
              />
              <button
                type="submit"
                disabled={loading || !offerInput || !!error}
                className="absolute right-1 px-4 py-2 rounded-full bg-primary text-on-primary font-headline-md text-headline-md shadow-[0_3px_0_#004965] hover:bg-on-primary-container disabled:opacity-50 active:translate-y-[2px] active:shadow-[0_1px_0_#004965] transition-all flex items-center gap-1"
              >
                <span>Send</span>
                <span className="material-symbols-outlined text-[16px]">send</span>
              </button>
            </form>
          ) : (
            <p className="text-center font-body-sm text-body-sm text-on-surface-variant py-1 font-medium">
              Final round completed. Accept the current deal above to claim this discount!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
