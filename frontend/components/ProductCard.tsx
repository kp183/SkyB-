"use client";

import Link from "next/link";
import { useState } from "react";
import { Sparkles, ShoppingBag, ArrowRight } from "lucide-react";
import SafetyBadge from "./SafetyBadge";
import BargainChatModal from "./BargainChatModal";
import { api } from "@/lib/api";

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    description: string;
    price: number;
    min_price: number;
    age_group: string;
    size?: string | null;
    image_url?: string | null;
    safety_score?: "Good" | "Medium" | "Low" | null;
    safety_summary?: string | null;
    safety_tags?: string[] | null;
  };
  onCartUpdated?: () => void;
}

export default function ProductCard({ product, onCartUpdated }: ProductCardProps) {
  const [isBargainOpen, setIsBargainOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsAdding(true);
    setMessage(null);
    try {
      await api.addToCart(product.id, 1);
      setMessage("Added to Cart!");
      if (onCartUpdated) onCartUpdated();
      setTimeout(() => setMessage(null), 2000);
    } catch (err: any) {
      if (err.status === 401) {
        window.location.href = "/login";
      } else {
        setMessage(err.message || "Failed to add");
        setTimeout(() => setMessage(null), 3000);
      }
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <>
      <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm hover:shadow-md hover:border-sky-300 transition-all">
        {/* Product Image & Badges */}
        <Link href={`/product/${product.id}`} className="relative aspect-square w-full overflow-hidden bg-slate-100">
          <img
            src={product.image_url || "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=500&auto=format&fit=crop&q=60"}
            alt={product.name}
            className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
            <span className="rounded-md bg-white/90 px-2 py-0.5 text-[10px] font-bold text-slate-700 shadow-sm backdrop-blur">
              {product.age_group}
            </span>
            {product.size && (
              <span className="rounded-md bg-sky-500/90 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm backdrop-blur">
                Size: {product.size}
              </span>
            )}
          </div>
          <div className="absolute top-2.5 right-2.5">
            <SafetyBadge score={product.safety_score} compact />
          </div>
        </Link>

        {/* Details Content */}
        <div className="flex flex-1 flex-col p-4">
          <Link href={`/product/${product.id}`}>
            <h3 className="text-sm font-bold text-slate-800 line-clamp-1 group-hover:text-sky-600 transition-colors">
              {product.name}
            </h3>
          </Link>
          <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-base font-black text-slate-900">₹{product.price.toFixed(2)}</span>
              <span className="block text-[10px] text-emerald-600 font-semibold">Bargainable with AI</span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsBargainOpen(true)}
                className="flex items-center gap-1 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-2.5 py-1.5 text-xs font-bold text-white shadow-sm shadow-amber-200 hover:from-amber-500 hover:to-amber-600 transition-all"
                title="Negotiate price with AI"
              >
                <Sparkles className="h-3.5 w-3.5" /> Bargain
              </button>

              <button
                onClick={handleQuickAdd}
                disabled={isAdding}
                className="flex items-center justify-center rounded-xl bg-sky-50 text-sky-600 p-2 hover:bg-sky-500 hover:text-white transition-colors"
                title="Add to cart"
              >
                <ShoppingBag className="h-4 w-4" />
              </button>
            </div>
          </div>

          {message && (
            <p className="mt-2 text-center text-xs font-medium text-sky-600 animate-fade-in">
              {message}
            </p>
          )}
        </div>
      </div>

      {/* Bargain AI Modal */}
      {isBargainOpen && (
        <BargainChatModal
          product={product}
          onClose={() => setIsBargainOpen(false)}
          onAccepted={() => {
            setIsBargainOpen(false);
            if (onCartUpdated) onCartUpdated();
            window.location.href = "/cart";
          }}
        />
      )}
    </>
  );
}
