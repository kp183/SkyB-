"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { api } from "@/lib/api";

export default function WishlistPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [movingId, setMovingId] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function loadWishlist() {
    setLoading(true);
    try {
      const data = await api.getWishlist();
      setItems(data || []);
    } catch (err: any) {
      if (err.status === 401) {
        window.location.href = "/login";
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadWishlist();
  }, []);

  const handleRemove = async (itemId: number) => {
    try {
      await api.deleteWishlistItem(itemId);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("wishlist-updated"));
      }
      loadWishlist();
    } catch (err: any) {
      alert(err.message || "Failed to remove item");
    }
  };

  const handleMoveToCart = async (item: any) => {
    setMovingId(item.id);
    setMessage(null);
    try {
      await api.addToCart(item.product_id, 1);
      await api.deleteWishlistItem(item.id);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("wishlist-updated"));
        window.dispatchEvent(new Event("cart-updated"));
      }
      setMessage(`Moved "${item.product_name}" to your Cart!`);
      loadWishlist();
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      if (err.status === 401) {
        window.location.href = "/login";
      } else {
        setMessage(err.message || "Failed to move to cart");
      }
    } finally {
      setMovingId(null);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center font-body-md text-body-md text-on-surface-variant animate-pulse">
        Retrieving your saved wishlist treasures...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-headline-xl text-headline-xl text-on-surface flex items-center gap-2.5">
          <span className="material-symbols-outlined text-secondary text-[32px]">favorite</span>
          <span>My Wishlist ({items.length})</span>
        </h1>
        <Link
          href="/"
          className="font-label-md text-label-md text-primary font-bold hover:underline flex items-center gap-1"
        >
          <span>Continue Shopping</span>
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </Link>
      </div>

      {message && (
        <div className="rounded-xl bg-primary-fixed p-3 text-on-primary-fixed font-body-sm text-body-sm text-center shadow-[0_2px_0_#7bd0ff]">
          {message}
        </div>
      )}

      {items.length === 0 ? (
        <div className="rounded-2xl bg-surface-container-lowest p-12 text-center space-y-4 shadow-[0_8px_0_#ffdadc]">
          <div className="w-16 h-16 rounded-full bg-secondary-fixed text-secondary flex items-center justify-center mx-auto shadow-[0_2px_0_#fe7488]">
            <span className="material-symbols-outlined text-[36px]">favorite_border</span>
          </div>
          <p className="font-headline-lg text-headline-lg text-on-surface">
            Your wishlist is empty!
          </p>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-sm mx-auto">
            Heart items in the catalog to save them for later or watch for price drops.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-primary text-on-primary px-6 py-3 font-headline-md text-headline-md shadow-[0_4px_0_#004965] hover:bg-on-primary-container transition-all"
          >
            <span>Explore Playground Catalog</span>
            <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {items.map((item, idx) => {
            const shadowColor = idx % 2 === 0 ? "#ffdadc" : "#c4e7ff";
            return (
              <div
                key={item.id}
                className="rounded-2xl bg-surface-container-lowest p-5 flex flex-col justify-between space-y-4 transition-all hover:translate-y-[-2px]"
                style={{ boxShadow: `0 8px 0 ${shadowColor}` }}
              >
                <div className="space-y-3">
                  <div className="relative w-full aspect-square rounded-xl bg-surface-container-low p-4 flex items-center justify-center overflow-hidden">
                    <Image
                      src={item.product_image || "/stitch/rocket-shuttle.png"}
                      alt={item.product_name || "Wishlist item"}
                      width={180}
                      height={180}
                      className="h-full w-full object-contain"
                    />
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-surface-container-lowest/90 text-secondary hover:bg-secondary hover:text-white flex items-center justify-center shadow-[0_2px_0_#bdc8d1] transition-colors cursor-pointer"
                      title="Remove from wishlist"
                    >
                      <span className="material-symbols-outlined text-[18px]">close</span>
                    </button>
                  </div>

                  <div>
                    <Link href={`/product/${item.product_id}`}>
                      <h3 className="font-headline-md text-headline-md text-on-surface hover:text-primary transition-colors line-clamp-1">
                        {item.product_name}
                      </h3>
                    </Link>
                    <p className="font-headline-lg text-headline-lg font-bold text-primary mt-1">
                      ₹{item.current_price?.toFixed(2)}
                    </p>
                    {item.watch_price && (
                      <p className="font-label-sm text-[11px] text-tertiary font-bold mt-0.5">
                        🎯 Price Watch: ₹{item.watch_price.toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-surface-container-high">
                  <button
                    onClick={() => handleMoveToCart(item)}
                    disabled={movingId === item.id}
                    className="w-full flex items-center justify-center gap-1.5 rounded-full bg-secondary-container text-on-secondary py-2.5 font-headline-md text-headline-md shadow-[0_3px_0_#730425] hover:brightness-105 active:translate-y-[2px] active:shadow-[0_1px_0_#730425] transition-all cursor-pointer disabled:opacity-60"
                  >
                    <span className="material-symbols-outlined text-[18px]">shopping_cart</span>
                    <span>{movingId === item.id ? "Moving..." : "Move to Cart"}</span>
                  </button>
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="w-full text-center font-label-sm text-[11px] text-on-surface-variant hover:text-secondary transition-colors"
                  >
                    Remove from saved items
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
