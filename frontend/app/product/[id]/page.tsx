"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, ShoppingBag, ArrowLeft, Star, Package, Check, ShieldCheck } from "lucide-react";
import SafetyBadge from "@/components/SafetyBadge";
import BargainChatModal from "@/components/BargainChatModal";
import { api } from "@/lib/api";

export default function ProductDetailPage() {
  const params = useParams();
  const id = Number(params.id);

  const [product, setProduct] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [bundles, setBundles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isBargainOpen, setIsBargainOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [addMessage, setAddMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    async function loadProduct() {
      setLoading(true);
      try {
        const [prod, revs, bnds] = await Promise.all([
          api.getProduct(id),
          api.getReviews(id).catch(() => []),
          api.getBundleSuggestions(id).catch(() => []),
        ]);
        setProduct(prod);
        setReviews(revs || []);
        setBundles(bnds || []);
      } catch (err) {
        console.error("Failed to load product details", err);
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id]);

  const handleAddToCart = async () => {
    setIsAdding(true);
    setAddMessage(null);
    try {
      await api.addToCart(product.id, 1);
      setAddMessage("Added to your Cart!");
      setTimeout(() => setAddMessage(null), 2500);
    } catch (err: any) {
      if (err.status === 401) {
        window.location.href = "/login";
      } else {
        setAddMessage(err.message || "Failed to add to cart");
      }
    } finally {
      setIsAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12 text-center text-slate-400">
        Loading product details...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12 text-center">
        <p className="text-sm font-semibold text-slate-700">Product not found.</p>
        <Link href="/" className="mt-4 inline-block text-xs font-bold text-sky-600 hover:underline">
          ← Back to Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-sky-600">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Catalog
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Product Image */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-2 shadow-sm aspect-square">
          <Image
            src={product.image_url || "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=800"}
            alt={product.name || "SkyB kids product detail"}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover rounded-2xl p-2"
            priority
          />
        </div>

        {/* Product Info */}
        <div className="space-y-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="rounded-md bg-sky-50 text-sky-700 px-2 py-0.5 text-xs font-bold border border-sky-200">
                Age: {product.age_group}
              </span>
              {product.size && (
                <span className="rounded-md bg-amber-50 text-amber-700 px-2 py-0.5 text-xs font-bold border border-amber-200">
                  Size: {product.size}
                </span>
              )}
              <span className="rounded-md bg-slate-100 text-slate-600 px-2 py-0.5 text-xs font-semibold">
                Stock: {product.stock_qty} in stock
              </span>
            </div>

            <h1 className="text-2xl font-black text-slate-900 leading-snug">{product.name}</h1>
            <p className="mt-2 text-2xl font-black text-slate-900">₹{product.price.toFixed(2)}</p>
          </div>

          {/* Description */}
          <div className="border-t border-slate-100 pt-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Product Description</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{product.description}</p>
          </div>

          {/* AI Safety-First Badge */}
          <SafetyBadge
            score={product.safety_score}
            summary={product.safety_summary}
            tags={product.safety_tags}
          />

          {/* Action CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setIsBargainOpen(true)}
              className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white py-3 px-4 text-xs font-bold shadow-md shadow-amber-200 transition-all"
            >
              <Sparkles className="h-4 w-4" /> Bargain with AI
            </button>

            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white py-3 px-4 text-xs font-bold shadow-md shadow-sky-200 transition-all"
            >
              <ShoppingBag className="h-4 w-4" /> Add to Cart
            </button>
          </div>

          {addMessage && (
            <p className="text-center text-xs font-bold text-sky-600 animate-fade-in">{addMessage}</p>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="border-t border-slate-200 pt-8 space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Customer Reviews & Ratings</h2>
        {reviews.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {reviews.map((rev) => (
              <div key={rev.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-2">
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-slate-600 italic">"{rev.comment}"</p>
                <p className="text-[10px] font-semibold text-slate-400">Verified Parent Purchaser</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400">No reviews yet.</p>
        )}
      </div>

      {/* Bargain Modal */}
      {isBargainOpen && (
        <BargainChatModal
          product={product}
          onClose={() => setIsBargainOpen(false)}
          onAccepted={() => {
            setIsBargainOpen(false);
            window.location.href = "/cart";
          }}
        />
      )}
    </div>
  );
}
