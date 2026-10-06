"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import SafetyBadge from "@/components/SafetyBadge";
import BargainChatModal from "@/components/BargainChatModal";
import { getProductFallbackImage } from "@/components/ProductCard";
import Icon from "@/components/Icon";
import { useSkyBot } from "@/context/SkyBotContext";
import { api } from "@/lib/api";

export default function ProductDetailPage() {
  const params = useParams();
  const id = Number(params.id);
  const { openSkyBot } = useSkyBot();

  const [product, setProduct] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [bundles, setBundles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isBargainOpen, setIsBargainOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [addMessage, setAddMessage] = useState<string | null>(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistMsg, setWishlistMsg] = useState<string | null>(null);

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
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("cart-updated"));
      }
      setTimeout(() => setAddMessage(null), 2500);
    } catch (err: any) {
      if (err.status === 401) {
        window.location.href = "/login?next=" + encodeURIComponent(`/product/${product.id}`);
      } else {
        setAddMessage(err.message || "Failed to add to cart");
      }
    } finally {
      setIsAdding(false);
    }
  };

  const handleToggleWishlist = async () => {
    try {
      if (isWishlisted) {
        setIsWishlisted(false);
        setWishlistMsg("Removed from wishlist");
      } else {
        await api.addToWishlist(product.id);
        setIsWishlisted(true);
        setWishlistMsg("Saved to Wishlist!");
      }
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("wishlist-updated"));
      }
      setTimeout(() => setWishlistMsg(null), 2000);
    } catch (err: any) {
      if (err.status === 401) {
        window.location.href = "/login?next=" + encodeURIComponent(`/product/${product.id}`);
      } else {
        setWishlistMsg(err.message || "Could not save to wishlist");
        setTimeout(() => setWishlistMsg(null), 2500);
      }
    }
  };

  // Resolve product image with category fallback
  const fallbackImg = getProductFallbackImage(product?.category_id, 0);
  const initialImg =
    product?.image_url && product.image_url.trim().length > 0
      ? product.image_url
      : fallbackImg;
  const [imageSrc, setImageSrc] = useState(initialImg);

  useEffect(() => {
    if (product) {
      const fb = getProductFallbackImage(product.category_id, 0);
      setImageSrc(
        product.image_url && product.image_url.trim().length > 0
          ? product.image_url
          : fb
      );
    }
  }, [product]);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 animate-pulse min-h-[750px]">
        <div className="h-6 w-32 bg-surface-container-high rounded-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="aspect-square w-full rounded-2xl bg-surface-container-low" />
          <div className="space-y-4">
            <div className="h-10 w-3/4 bg-surface-container-low rounded-full" />
            <div className="h-8 w-1/3 bg-surface-container-low rounded-full" />
            <div className="h-28 w-full bg-surface-container-low rounded-xl" />
            <div className="h-12 w-full bg-surface-container-low rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 text-center bg-surface-container-lowest rounded-2xl shadow-[0_8px_0_#bdc8d1]">
        <p className="font-headline-md text-headline-md text-on-surface">Product not found.</p>
        <Link
          href="/"
          className="mt-4 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-primary text-on-primary font-headline-md text-headline-md shadow-[0_3px_0_#004965]"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Back to Catalog</span>
        </Link>
      </div>
    );
  }

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / reviews.length
        ).toFixed(1)
      : null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8 space-y-8 pb-28 sm:pb-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-low text-on-surface hover:bg-surface-container font-label-md text-label-md shadow-[0_2px_0_#bdc8d1] transition-all"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        <span>Back to Play Catalog</span>
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Product Image */}
        <div className="relative overflow-hidden rounded-2xl bg-surface-container-low p-6 shadow-[0_8px_0_#c4e7ff] flex items-center justify-center aspect-square">
          <Image
            src={imageSrc}
            alt={product.name || "Product image"}
            width={400}
            height={400}
            className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
            onError={() => setImageSrc(fallbackImg)}
            priority
          />
          <button
            onClick={handleToggleWishlist}
            className={`absolute top-4 right-4 w-10 h-10 rounded-full bg-surface-container-lowest flex items-center justify-center shadow-[0_2px_0_#bdc8d1] transition-colors cursor-pointer ${
              isWishlisted ? "text-secondary font-bold" : "text-on-surface-variant hover:text-secondary"
            }`}
            title="Save to Wishlist"
          >
            <span className="material-symbols-outlined text-[20px]">
              {isWishlisted ? "favorite" : "favorite_border"}
            </span>
          </button>
        </div>

        {/* Product Info */}
        <div className="space-y-5 bg-surface-container-lowest p-6 rounded-2xl shadow-[0_8px_0_#ffdadc]">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="rounded-full bg-primary-fixed text-on-primary-fixed px-3 py-1 font-label-sm text-label-sm font-bold shadow-[0_2px_0_#7bd0ff]">
                👶 Age: {product.age_group}
              </span>
              {product.size && (
                <span className="rounded-full bg-secondary-fixed text-on-secondary-fixed px-3 py-1 font-label-sm text-label-sm font-bold shadow-[0_2px_0_#fe7488]">
                  📏 Size: {product.size}
                </span>
              )}
              <span className="rounded-full bg-surface-container text-on-surface px-3 py-1 font-label-sm text-label-sm font-bold">
                📦 {product.stock_qty} in stock
              </span>
            </div>

            <h1 className="font-headline-xl text-headline-xl text-on-surface leading-tight">
              {product.name}
            </h1>
            <div className="mt-3 flex items-baseline gap-3">
              <span className="font-display-lg text-headline-xl text-primary font-bold">
                ₹{product.price.toFixed(2)}
              </span>
              <span className="font-body-md text-body-md text-on-surface-variant line-through">
                ₹{(product.price * 1.25).toFixed(2)}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-container font-label-sm text-label-sm font-bold shadow-[0_1px_0_#fe7488]">
                Save 20%
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="border-t border-surface-container-high pt-4">
            <h3 className="font-label-sm text-label-sm font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
              Product Story &amp; Details
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Safety-First Badge */}
          <SafetyBadge
            score={product.safety_score}
            summary={product.safety_summary}
            tags={product.safety_tags}
          />

          {/* Action CTAs (Desktop / Tablet) */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                if (openSkyBot) {
                  openSkyBot(product);
                } else {
                  setIsBargainOpen(true);
                }
              }}
              className="flex-1 flex items-center justify-center gap-2 rounded-full btn-bargain-action py-3.5 px-4 font-headline-md text-headline-md font-bold cursor-pointer transition-all"
            >
              <Icon name="smart_toy" className="w-5 h-5" />
              <span>Bargain with Bot</span>
            </button>

            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className="flex-1 flex items-center justify-center gap-2 rounded-full btn-add-action py-3.5 px-4 font-headline-md text-headline-md font-bold cursor-pointer transition-all disabled:opacity-50"
            >
              <Icon name="shopping_cart" className="w-5 h-5" />
              <span>{isAdding ? "Adding..." : "Add to Cart"}</span>
            </button>
          </div>

          {addMessage && (
            <p className="text-center font-label-md text-label-md text-primary font-bold animate-pulse">
              {addMessage}
            </p>
          )}
          {wishlistMsg && (
            <p className="text-center font-label-sm text-label-sm text-secondary font-bold">
              {wishlistMsg}
            </p>
          )}
        </div>
      </div>

      {/* Real Reviews Section */}
      <div className="border-t border-surface-container-high pt-8 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-headline-lg text-headline-lg text-on-surface">
            Customer Reviews ({reviews.length})
          </h2>
          {averageRating && (
            <div className="flex items-center gap-1 text-tertiary font-bold font-headline-md text-headline-md">
              <span>⭐</span>
              <span>{averageRating} / 5</span>
            </div>
          )}
        </div>

        {reviews.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="rounded-2xl bg-surface-container-lowest p-5 shadow-[0_4px_0_#bdc8d1] space-y-2.5 flex flex-col justify-between"
              >
                <div>
                  <div className="text-tertiary text-sm">
                    {"⭐".repeat(Math.min(rev.rating || 5, 5))}
                  </div>
                  <p className="mt-2 font-body-md text-body-md text-on-surface-variant italic leading-relaxed">
                    &ldquo;{rev.comment}&rdquo;
                  </p>
                </div>
                <div className="flex items-center gap-2 pt-2 border-t border-surface-container-high">
                  <span className="material-symbols-outlined text-primary text-[18px]">
                    verified
                  </span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant font-bold">
                    Verified Customer Purchase
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="font-body-md text-body-md text-on-surface-variant">
            No customer reviews yet for this product.
          </p>
        )}
      </div>

      {/* Sticky Mobile Action Bar (Hidden on sm screens, visible on mobile 390px) */}
      <div
        id="product-sticky-action-bar"
        className="fixed bottom-0 left-0 w-full z-40 bg-surface-container-lowest/95 backdrop-blur-md p-3 pb-safe border-t border-surface-container flex items-center gap-3 sm:hidden shadow-[0_-4px_16px_rgba(0,30,44,0.08)]"
      >
        {/* Wishlist Heart Button */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          aria-label="Save to Wishlist"
          id="sticky-btn-wishlist"
          className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border transition-all cursor-pointer ${
            isWishlisted
              ? "bg-secondary text-white border-secondary shadow-[0_2px_0_#730425]"
              : "bg-surface-container-low text-on-surface-variant border-surface-container-high hover:text-secondary shadow-[0_2px_0_#bdc8d1]"
          }`}
        >
          <Icon name={isWishlisted ? "favorite" : "favorite_border"} className="w-6 h-6" />
        </button>

        {/* Bargain Button */}
        <button
          type="button"
          onClick={() => {
            if (openSkyBot) {
              openSkyBot(product);
            } else {
              setIsBargainOpen(true);
            }
          }}
          id="sticky-btn-bargain"
          className="flex-1 h-12 flex items-center justify-center gap-1.5 rounded-full btn-bargain-action font-headline-sm text-headline-sm font-bold cursor-pointer"
        >
          <Icon name="smart_toy" className="w-5 h-5" />
          <span>Bargain</span>
        </button>

        {/* Add to Cart Button */}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isAdding}
          id="sticky-btn-add-cart"
          className="flex-1 h-12 flex items-center justify-center gap-1.5 rounded-full btn-add-action font-headline-sm text-headline-sm font-bold cursor-pointer disabled:opacity-50"
        >
          <Icon name="shopping_cart" className="w-5 h-5" />
          <span>{isAdding ? "Adding..." : "Add to Cart"}</span>
        </button>
      </div>
    </div>
  );
}
