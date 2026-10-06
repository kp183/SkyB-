"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Icon from "@/components/Icon";
import CategoryDrawer from "@/components/CategoryDrawer";
import { api, getToken } from "@/lib/api";

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  const [isCategoryDrawerOpen, setIsCategoryDrawerOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  // Sync auth & counts
  const syncCounts = useCallback(async () => {
    const token = getToken();
    if (token) {
      setIsLoggedIn(true);
      try {
        const [cartRes, wishRes] = await Promise.all([
          api.getCart().catch(() => null),
          api.getWishlist().catch(() => null),
        ]);
        if (cartRes && cartRes.items) {
          const totalQty = cartRes.items.reduce(
            (acc: number, item: any) => acc + (item.quantity || 1),
            0
          );
          setCartCount(totalQty);
        } else {
          setCartCount(0);
        }
        if (Array.isArray(wishRes)) {
          setWishlistCount(wishRes.length);
        } else {
          setWishlistCount(0);
        }
      } catch (err) {
        console.error("Failed to sync bottom nav counts", err);
      }
    } else {
      setIsLoggedIn(false);
      setCartCount(0);
      setWishlistCount(0);
    }
  }, []);

  useEffect(() => {
    syncCounts();
    const handleCartUpdated = () => syncCounts();
    const handleWishlistUpdated = () => syncCounts();
    const handleAuthChange = () => syncCounts();

    window.addEventListener("cart-updated", handleCartUpdated);
    window.addEventListener("wishlist-updated", handleWishlistUpdated);
    window.addEventListener("auth-changed", handleAuthChange);

    return () => {
      window.removeEventListener("cart-updated", handleCartUpdated);
      window.removeEventListener("wishlist-updated", handleWishlistUpdated);
      window.removeEventListener("auth-changed", handleAuthChange);
    };
  }, [syncCounts]);

  // Check if page should hide the bottom nav:
  // - Admin pages: /admin*
  // - Pages with sticky action bars: /product/*, /cart, /checkout, /reorder, /newborn-checklist
  const isHidden =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/product/") ||
    pathname === "/cart" ||
    pathname === "/checkout" ||
    pathname === "/reorder" ||
    pathname === "/newborn-checklist";

  if (isHidden) {
    return null;
  }

  const handleProtectedTab = (e: React.MouseEvent, dest: string) => {
    if (!isLoggedIn) {
      e.preventDefault();
      router.push(`/login?next=${encodeURIComponent(dest)}`);
    }
  };

  return (
    <>
      <nav
        aria-label="Mobile Navigation"
        className="fixed bottom-0 left-0 w-full z-40 pb-safe bg-surface-container-lowest/95 backdrop-blur-xl shadow-[0_-4px_16px_rgba(0,30,44,0.08)] border-t border-surface-container md:hidden"
      >
        <div className="flex justify-around items-center h-16 px-1">
          {/* 1. Home */}
          <Link
            href="/"
            className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full py-1 transition-all active:scale-95 ${
              pathname === "/"
                ? "text-primary font-bold"
                : "text-on-surface-variant hover:text-primary"
            }`}
          >
            <Icon name="home" className="w-6 h-6" />
            <span className="font-label-sm text-[11px] tracking-tight">Home</span>
          </Link>

          {/* 2. Categories (Opens Drawer) */}
          <button
            type="button"
            onClick={() => setIsCategoryDrawerOpen(true)}
            className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full py-1 transition-all active:scale-95 cursor-pointer ${
              pathname.startsWith("/category") || pathname.startsWith("/age")
                ? "text-primary font-bold"
                : "text-on-surface-variant hover:text-primary"
            }`}
          >
            <Icon name="grid_view" className="w-6 h-6" />
            <span className="font-label-sm text-[11px] tracking-tight">Categories</span>
          </button>

          {/* 3. Wishlist */}
          <Link
            href="/wishlist"
            onClick={(e) => handleProtectedTab(e, "/wishlist")}
            className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full py-1 transition-all active:scale-95 relative ${
              pathname === "/wishlist"
                ? "text-primary font-bold"
                : "text-on-surface-variant hover:text-primary"
            }`}
          >
            <div className="relative">
              <Icon name="favorite" className="w-6 h-6" />
              {isLoggedIn && wishlistCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-secondary text-on-secondary rounded-full font-label-sm text-[9px] w-4 h-4 flex items-center justify-center font-bold">
                  {wishlistCount}
                </span>
              )}
            </div>
            <span className="font-label-sm text-[11px] tracking-tight">Wishlist</span>
          </Link>

          {/* 4. Cart */}
          <Link
            href="/cart"
            onClick={(e) => handleProtectedTab(e, "/cart")}
            className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full py-1 transition-all active:scale-95 relative ${
              pathname === "/cart"
                ? "text-primary font-bold"
                : "text-on-surface-variant hover:text-primary"
            }`}
          >
            <div className="relative">
              <Icon name="shopping_cart" className="w-6 h-6" />
              {isLoggedIn && cartCount > 0 && (
                <span id="bottom-cart-count-badge" className="absolute -top-1 -right-2 bg-secondary text-on-secondary rounded-full font-label-sm text-[9px] w-4 h-4 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="font-label-sm text-[11px] tracking-tight">Cart</span>
          </Link>

          {/* 5. Account */}
          <Link
            href="/account/child"
            onClick={(e) => handleProtectedTab(e, "/account/child")}
            className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full py-1 transition-all active:scale-95 ${
              pathname.startsWith("/account")
                ? "text-primary font-bold"
                : "text-on-surface-variant hover:text-primary"
            }`}
          >
            <Icon name="account_circle" className="w-6 h-6" />
            <span className="font-label-sm text-[11px] tracking-tight">Account</span>
          </Link>
        </div>
      </nav>

      {/* Drawer instance for bottom nav category button */}
      <CategoryDrawer
        isOpen={isCategoryDrawerOpen}
        onClose={() => setIsCategoryDrawerOpen(false)}
      />
    </>
  );
}
