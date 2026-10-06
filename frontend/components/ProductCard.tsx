"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useSkyBot } from "@/context/SkyBotContext";
import { api, getToken } from "@/lib/api";
import Icon from "@/components/Icon";
import PriceBlock from "@/components/ui/PriceBlock";
import RatingStars from "@/components/ui/RatingStars";

const ROTATING_CARD_SHADOWS = [
  "card-shadow-blue",
  "card-shadow-pink",
  "card-shadow-yellow",
];

export interface ProductData {
  id: number;
  name: string;
  description?: string;
  category_id?: number;
  subcategory?: string | null;
  gender?: string | null;
  price: number;
  mrp?: number | null;
  min_price?: number;
  stock?: number;
  age_group?: string;
  age_min_months?: number | null;
  age_max_months?: number | null;
  image_url?: string | null;
  safety_score?: "Good" | "Medium" | "Low" | string | null;
  safety_summary?: string | null;
  rating?: number | null;
  review_count?: number | null;
}

interface ProductCardProps {
  product: ProductData;
  index?: number;
  onCartUpdated?: () => void;
}

function subcategoryToSlug(sub?: string | null): string {
  if (!sub) return "general";
  return sub
    .toLowerCase()
    .replace(/&/g, "")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export function getProductFallbackImage(categoryId?: number, index: number = 0): string {
  return "/catalog/general.svg";
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  index = 0,
  onCartUpdated,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { openSkyBot } = useSkyBot();

  const [isAdding, setIsAdding] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addFeedback, setAddFeedback] = useState<string | null>(null);

  // Rotating chunky shadow
  const shadowClass =
    ROTATING_CARD_SHADOWS[index % ROTATING_CARD_SHADOWS.length];

  // Image source resolution with subcategory fallback
  const subcategorySlug = subcategoryToSlug(product.subcategory);
  const fallbackSvg = `/catalog/${subcategorySlug}.svg`;
  const [imgSrc, setImgSrc] = useState<string>(
    product.image_url && product.image_url.trim().length > 0
      ? product.image_url
      : fallbackSvg
  );

  const requireAuthRedirect = (): boolean => {
    const token = getToken();
    if (!token) {
      router.push(`/login?next=${encodeURIComponent(pathname || "/")}`);
      return false;
    }
    return true;
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!requireAuthRedirect()) return;

    setIsAdding(true);
    setAddFeedback(null);
    try {
      await api.addToCart(product.id, 1);
      setAddFeedback("Added!");
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("cart-updated"));
      }
      onCartUpdated?.();
      setTimeout(() => setAddFeedback(null), 1800);
    } catch (err: any) {
      setAddFeedback("Failed");
      setTimeout(() => setAddFeedback(null), 2000);
    } finally {
      setIsAdding(false);
    }
  };

  const handleBargainClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!requireAuthRedirect()) return;

    openSkyBot(product);
  };

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!requireAuthRedirect()) return;

    try {
      if (!isWishlisted) {
        await api.addToWishlist(product.id);
        setIsWishlisted(true);
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("wishlist-updated"));
        }
      } else {
        try {
          const wishItems = await api.getWishlist();
          const found = Array.isArray(wishItems)
            ? wishItems.find((w: any) => w.product_id === product.id || w.product?.id === product.id)
            : null;
          if (found) {
            await api.deleteWishlistItem(found.id);
          }
        } catch (e) {
          // ignore
        }
        setIsWishlisted(false);
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("wishlist-updated"));
        }
      }
    } catch (err) {
      console.error("Wishlist update failed", err);
    }
  };

  return (
    <article
      className={`product-card group relative rounded-xl bg-surface-container-lowest border border-surface-container p-3 sm:p-4 flex flex-col justify-between transition-transform duration-200 hover:-translate-y-1 ${shadowClass}`}
    >
      <div>
        {/* Card Media Container */}
        <div className="relative w-full aspect-square rounded-xl bg-surface-container-low overflow-hidden mb-3">
          <Link href={`/product/${product.id}`} className="block w-full h-full">
            <Image
              src={imgSrc}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              onError={() => setImgSrc(fallbackSvg)}
            />
          </Link>

          {/* Top badges overlay */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 items-start pointer-events-none">
            {product.stock !== undefined && product.stock <= 0 && (
              <span className="px-2 py-0.5 rounded-full bg-error text-on-error font-label-sm text-[10px] font-bold shadow-[0_1px_0_#93000a]">
                Out of Stock
              </span>
            )}
            {product.age_group && (
              <span className="px-2 py-0.5 rounded-full bg-surface-container-lowest/90 backdrop-blur text-primary font-label-sm text-[10px] font-extrabold shadow-[0_1px_0_#bdc8d1]">
                {product.age_group}
              </span>
            )}
          </div>

          {/* Wishlist Heart Button */}
          <button
            type="button"
            onClick={handleWishlistToggle}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-surface-container-lowest/90 backdrop-blur hover:bg-surface-container text-on-surface-variant flex items-center justify-center shadow-[0_2px_0_#bdc8d1] active:scale-90 transition-all cursor-pointer"
          >
            <Icon
              name="favorite"
              className={`w-4 h-4 transition-colors ${
                isWishlisted ? "text-secondary fill-current" : "text-outline"
              }`}
            />
          </button>
        </div>

        {/* Rating row: fixed-height slot so cards keep identical height */}
        <div className="mb-1.5">
          <RatingStars
            rating={product.rating}
            reviewCount={product.review_count}
            reserveSlot={true}
          />
        </div>

        {/* Product Title */}
        <Link href={`/product/${product.id}`} className="block group-hover:text-primary transition-colors">
          <h3 className="font-label-lg text-label-lg font-bold text-on-surface leading-snug line-clamp-2 min-h-[44px]">
            {product.name}
          </h3>
        </Link>

        {/* Subcategory / Microcopy */}
        {product.subcategory && (
          <p className="font-body-sm text-[12px] text-on-surface-variant mt-1 truncate">
            {product.subcategory}
          </p>
        )}
      </div>

      {/* Pricing and Action Buttons */}
      <div className="pt-3 border-t border-surface-container-low mt-2 space-y-3">
        <PriceBlock price={product.price} mrp={product.mrp} size="md" />

        <div className="grid grid-cols-2 gap-2">
          {/* Bargain Button (golden #e1a800, shadow #795900) */}
          <button
            type="button"
            onClick={handleBargainClick}
            className="btn-bargain-action px-2 py-2 rounded-full font-label-sm text-[12px] font-bold flex items-center justify-center gap-1 cursor-pointer select-none"
          >
            <Icon name="smart_toy" className="w-4 h-4" />
            <span>Bargain</span>
          </button>

          {/* Add to Cart Button (coral #fe7488, shadow #730425) */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isAdding || (product.stock !== undefined && product.stock <= 0)}
            className="btn-add-action px-2 py-2 rounded-full font-label-sm text-[12px] font-bold flex items-center justify-center gap-1 cursor-pointer select-none"
          >
            {isAdding ? (
              <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Icon name="shopping_bag" className="w-4 h-4" />
                <span>{addFeedback || "Add"}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
