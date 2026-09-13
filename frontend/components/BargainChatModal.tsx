"use client";

import { useEffect, useState, useRef } from "react";
import { X, Sparkles, Send, CheckCircle2, AlertCircle } from "lucide-react";
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
            text: `Hi there! I'm SkyB's Bargain Assistant. The listed price for '${product.name}' is ₹${product.price.toFixed(2)}. What price would you like to offer? (Max 3 rounds!)`,
          },
        ]);
      } catch (err: any) {
        if (err.status === 401) {
          setError("Please login to bargain and save agreed prices to your cart.");
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
      { sender: "user", text: `I offer ₹${offerNum.toFixed(2)}`, price: offerNum },
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="flex flex-col w-full max-w-md h-[550px] rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-sky-500 to-indigo-600 text-white">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/20 backdrop-blur">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Bargain Assistant</h3>
              <p className="text-[10px] text-sky-100">
                {currentRound > 0 ? `Round ${currentRound} of 3` : "Ready to negotiate"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Product mini-preview */}
        <div className="flex items-center gap-3 px-4 py-2 border-b border-slate-100 bg-slate-50">
          <img
            src={product.image_url || "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=200"}
            alt={product.name}
            className="h-10 w-10 rounded-lg object-cover"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-800 truncate">{product.name}</p>
            <p className="text-xs text-slate-500">Original Price: <span className="font-semibold text-slate-700">₹{product.price.toFixed(2)}</span></p>
          </div>
          {latestCounter !== null && (
            <div className="text-right">
              <span className="text-[10px] font-semibold uppercase text-emerald-600">Current Counter</span>
              <p className="text-sm font-black text-emerald-700">₹{latestCounter.toFixed(2)}</p>
            </div>
          )}
        </div>

        {/* Chat Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed ${
                  m.sender === "user"
                    ? "bg-sky-500 text-white rounded-br-none shadow-sm"
                    : "bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-sm"
                }`}
              >
                {m.text}
                {m.round && (
                  <span className="block mt-1 text-[9px] text-slate-400 font-semibold">
                    Round {m.round} / 3
                  </span>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-slate-400 italic">
              <Sparkles className="h-3 w-3 animate-spin text-amber-500" /> Assistant is thinking...
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 p-2 text-xs text-rose-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Modal Action Bar */}
        <div className="p-3 border-t border-slate-200 bg-white">
          {latestCounter !== null && (
            <button
              onClick={handleAcceptDeal}
              disabled={loading}
              className="mb-2.5 w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white py-2 text-xs font-bold shadow-md shadow-emerald-200 transition-colors"
            >
              <CheckCircle2 className="h-4 w-4" /> Accept Deal at ₹{latestCounter.toFixed(2)} & Add to Cart
            </button>
          )}

          {currentRound < 3 ? (
            <form onSubmit={handleSendOffer} className="flex gap-2">
              <input
                type="number"
                step="0.01"
                placeholder="Enter counter offer (e.g. 550)..."
                value={offerInput}
                onChange={(e) => setOfferInput(e.target.value)}
                disabled={loading || !!error}
                className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-sky-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={loading || !offerInput || !!error}
                className="flex items-center justify-center rounded-xl bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white px-3.5 py-2 transition-colors"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          ) : (
            <p className="text-center text-xs font-semibold text-slate-500">
              Maximum 3 negotiation rounds reached. Please accept the final offer or close.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
