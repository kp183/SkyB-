"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import Icon from "@/components/Icon";
import CategoryDrawer from "@/components/CategoryDrawer";
import { useSkyBot } from "@/context/SkyBotContext";
import {
  CATEGORIES,
  AGE_GROUPS,
  PRICE_BANDS,
  COLLECTIONS,
  CategoryConfig,
} from "@/config/navigation";
import { api, getToken, getCurrentStoredUser, removeToken } from "@/lib/api";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { openSkyBot } = useSkyBot();

  // Mobile drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Auth & user state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Cart & Wishlist counters (real data from API, guests see 0/no count)
  const [cartCount, setCartCount] = useState<number>(0);
  const [cartSubtotal, setCartSubtotal] = useState<number>(0);
  const [wishlistCount, setWishlistCount] = useState<number>(0);

  // Pincode state (client-side only, 6 digits)
  const [pincode, setPincode] = useState("");
  const [isPincodeModalOpen, setIsPincodeModalOpen] = useState(false);
  const [pincodeInput, setPincodeInput] = useState("");
  const [pincodeError, setPincodeError] = useState("");

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState("all");

  // Mega-menu state
  const [activeMenuTab, setActiveMenuTab] = useState<string | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const megaMenuRef = useRef<HTMLDivElement>(null);

  // Sync auth & counts
  const loadUserData = useCallback(async () => {
    const token = getToken();
    if (token) {
      setIsLoggedIn(true);
      setUser(getCurrentStoredUser());

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
          setCartSubtotal(cartRes.total_amount || 0);
        } else {
          setCartCount(0);
          setCartSubtotal(0);
        }

        if (Array.isArray(wishRes)) {
          setWishlistCount(wishRes.length);
        } else {
          setWishlistCount(0);
        }
      } catch (err) {
        console.error("Failed to sync header counts", err);
      }
    } else {
      setIsLoggedIn(false);
      setUser(null);
      setCartCount(0);
      setCartSubtotal(0);
      setWishlistCount(0);
    }
  }, []);

  useEffect(() => {
    loadUserData();

    // Listen for custom events
    const handleCartUpdated = () => loadUserData();
    const handleWishlistUpdated = () => loadUserData();
    const handleAuthChange = () => loadUserData();

    window.addEventListener("cart-updated", handleCartUpdated);
    window.addEventListener("wishlist-updated", handleWishlistUpdated);
    window.addEventListener("auth-changed", handleAuthChange);

    // Load saved pincode
    const savedPin = localStorage.getItem("skyb_pincode");
    if (savedPin && /^\d{6}$/.test(savedPin)) {
      setPincode(savedPin);
    }

    return () => {
      window.removeEventListener("cart-updated", handleCartUpdated);
      window.removeEventListener("wishlist-updated", handleWishlistUpdated);
      window.removeEventListener("auth-changed", handleAuthChange);
    };
  }, [loadUserData]);

  // Route change closes mega-menu and drawer
  useEffect(() => {
    setActiveMenuTab(null);
    setIsDrawerOpen(false);
  }, [pathname]);

  // Keyboard accessibility: Escape key closes mega menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveMenuTab(null);
        setIsPincodeModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Hover intent handling (150ms delay)
  const handleMouseEnterTab = (tabSlug: string) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setActiveMenuTab(tabSlug);
    }, 150);
  };

  const handleMouseLeaveNav = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setActiveMenuTab(null);
    }, 150);
  };

  // Search submission submits to /category/all?q=<text>
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const params = new URLSearchParams();
    params.set("q", searchQuery.trim());
    if (searchCategory !== "all") {
      params.set("category_slug", searchCategory);
    }
    router.push(`/category/all?${params.toString()}`);
  };

  // Pincode validation & save (6 digits, client-side only)
  const handleSavePincode = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = pincodeInput.trim();
    if (!/^\d{6}$/.test(clean)) {
      setPincodeError("Please enter a valid 6-digit Indian PIN code.");
      return;
    }
    setPincode(clean);
    localStorage.setItem("skyb_pincode", clean);
    setIsPincodeModalOpen(false);
    setPincodeInput("");
    setPincodeError("");
  };

  // Require auth helper
  const handleAuthAction = (e: React.MouseEvent, targetPath: string) => {
    if (!isLoggedIn) {
      e.preventDefault();
      router.push(`/login?next=${encodeURIComponent(targetPath)}`);
    }
  };

  // Active category config for mega menu
  const activeCategory: CategoryConfig | undefined = CATEGORIES.find(
    (c) => c.slug === activeMenuTab
  );

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-40 bg-surface-container-lowest shadow-[0_4px_16px_rgba(0,30,44,0.06)]">
        <div className="w-full">
          {/* Top Bar (Desktop & Mobile) */}
          <div className="h-14 sm:h-16 w-full px-4 lg:px-8 flex items-center justify-between gap-3 bg-surface-container-lowest">
            {/* Left section: Hamburger (Mobile) + Logo + Pincode */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {/* Mobile Hamburger Drawer Trigger */}
              <button
                type="button"
                onClick={() => setIsDrawerOpen(true)}
                aria-label="Open Navigation Drawer"
                className="w-10 h-10 flex items-center justify-center rounded-full text-primary hover:bg-surface-container-high transition-colors lg:hidden active:scale-95 cursor-pointer"
              >
                <Icon name="menu" className="w-6 h-6" />
              </button>

              {/* Logo (Links to "/" everywhere) */}
              <Link
                href="/"
                className="flex items-center gap-2 group cursor-pointer focus:outline-none"
                id="brand-logo"
              >
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-[0_2px_0_#004965] group-hover:scale-105 transition-transform">
                  <Icon name="cloud" className="w-5 h-5 text-primary-container" />
                </div>
                <span className="font-headline-md text-headline-md font-bold text-primary tracking-tight">
                  skyB
                </span>
              </Link>

              {/* Pincode Deliver To (Desktop) */}
              <button
                type="button"
                onClick={() => {
                  setPincodeInput(pincode);
                  setPincodeError("");
                  setIsPincodeModalOpen(true);
                }}
                className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 bg-surface-container-low hover:bg-surface-container rounded-full text-left transition-colors cursor-pointer"
              >
                <Icon name="pin_drop" className="w-4 h-4 text-primary" />
                <div className="flex flex-col text-left leading-tight">
                  {pincode ? (
                    <>
                      <span className="font-label-sm text-[10px] text-on-surface-variant font-bold">
                        Deliver to: {pincode}
                      </span>
                      <span className="font-label-sm text-[10px] text-primary underline">
                        Edit
                      </span>
                    </>
                  ) : (
                    <span className="font-label-sm text-[11px] text-on-surface font-extrabold">
                      Enter pincode
                    </span>
                  )}
                </div>
              </button>
            </div>

            {/* Center section: Search Bar (Desktop) */}
            <div className="flex-1 max-w-2xl mx-2 hidden md:flex items-center">
              <form
                onSubmit={handleSearchSubmit}
                className="w-full flex items-center bg-surface-container-low rounded-full p-1 pl-4 shadow-[0_2px_0_#d8e3fb] focus-within:shadow-[0_2px_0_#00668a]"
              >
                <select
                  aria-label="Category Search Filter"
                  value={searchCategory}
                  onChange={(e) => setSearchCategory(e.target.value)}
                  className="bg-transparent text-on-surface-variant font-label-md text-[13px] outline-none cursor-pointer pr-2 border-r border-outline-variant/40"
                >
                  <option value="all">All Categories</option>
                  {CATEGORIES.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  placeholder="Search baby-safe clothes, toys, feeding... (e.g. wooden blocks)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent px-3 py-1 font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none"
                />

                <button
                  type="submit"
                  aria-label="Submit search"
                  className="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center shrink-0 shadow-[0_2px_0_#001e2c] active:translate-y-0.5 transition-all cursor-pointer"
                >
                  <Icon name="search" className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* Right section: Bargain Bot + Wishlist + Orders + Cart + User */}
            <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3 shrink-0">
              {/* SkyBot Bargain AI Trigger */}
              <button
                type="button"
                onClick={() => openSkyBot()}
                className="flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-full bg-tertiary-fixed text-on-tertiary-fixed shadow-[0_3px_0_#795900] active:translate-y-0.5 transition-all cursor-pointer select-none"
                id="header-bargain-bot-btn"
              >
                <Icon name="smart_toy" className="w-4 h-4 text-tertiary" />
                <span className="font-label-md text-label-md hidden lg:inline font-bold">
                  Bargain Bot
                </span>
                <span className="w-2 h-2 rounded-full bg-secondary-container animate-ping hidden lg:block" />
              </button>

              {/* Wishlist Button (Guests redirected to login) */}
              <Link
                href="/wishlist"
                onClick={(e) => handleAuthAction(e, "/wishlist")}
                aria-label="Wishlist"
                className="relative p-2 rounded-full hover:bg-surface-container transition-colors text-on-surface-variant hover:text-on-surface flex items-center justify-center"
              >
                <Icon name="favorite" className="w-5 h-5" />
                {isLoggedIn && wishlistCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-[9px] flex items-center justify-center font-bold">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Orders Link (Desktop, Guests redirected to login) */}
              <Link
                href="/orders"
                onClick={(e) => handleAuthAction(e, "/orders")}
                className="hidden lg:flex items-center gap-1 px-3 py-1.5 rounded-full hover:bg-surface-container transition-colors text-on-surface-variant hover:text-on-surface"
              >
                <Icon name="package_2" className="w-4 h-4" />
                <span className="font-label-md text-label-md font-bold">Orders</span>
              </Link>

              {/* Cart Button (Guests redirected to login) */}
              <Link
                href="/cart"
                onClick={(e) => handleAuthAction(e, "/cart")}
                aria-label="Shopping Cart"
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container hover:bg-surface-container-high transition-colors text-primary"
              >
                <div className="relative flex items-center justify-center">
                  <Icon name="shopping_bag" className="w-5 h-5 text-primary" />
                  {isLoggedIn && cartCount > 0 && (
                    <span className="absolute -top-1 -right-1.5 w-4 h-4 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-[9px] flex items-center justify-center font-extrabold">
                      {cartCount}
                    </span>
                  )}
                </div>
                <div className="hidden sm:flex flex-col text-left leading-none">
                  <span className="font-label-sm text-[10px] text-on-surface-variant">Cart</span>
                  <span className="font-label-md text-label-md font-extrabold text-on-surface">
                    {isLoggedIn && cartSubtotal > 0
                      ? `₹${Math.round(cartSubtotal).toLocaleString("en-IN")}`
                      : "Cart"}
                  </span>
                </div>
              </Link>

              {/* Account Dropdown / Link */}
              {isLoggedIn ? (
                <div className="flex items-center gap-2 pl-1">
                  <Link
                    href="/account/child"
                    className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-[0_2px_0_#004965]"
                    title="Account & Child Profile"
                  >
                    <Icon name="person" className="w-4 h-4" />
                  </Link>
                  <div className="hidden xl:flex flex-col text-left leading-tight">
                    <span className="font-label-sm text-[11px] text-on-surface font-bold truncate max-w-[100px]">
                      {user?.name || "Account"}
                    </span>
                    <Link
                      href="/account/child"
                      className="font-label-sm text-[10px] text-primary hover:underline font-semibold"
                    >
                      Child profile
                    </Link>
                  </div>
                </div>
              ) : (
                <Link
                  href={`/login?next=${encodeURIComponent(pathname || "/")}`}
                  className="px-3 py-1.5 rounded-full bg-primary-fixed text-primary font-label-md text-[13px] font-bold shadow-[0_2px_0_#87cff8] hover:bg-primary-fixed-dim"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>

          {/* Sub-Header Categories Navigation Bar (Desktop) */}
          <div
            className="h-11 w-full px-4 lg:px-8 bg-surface-container-low border-t border-surface-container/60 overflow-x-auto hidden md:flex items-center justify-between no-scrollbar relative"
            onMouseLeave={handleMouseLeaveNav}
          >
            <nav className="flex items-center gap-1 min-w-max py-0.5">
              {/* All Categories trigger */}
              <button
                type="button"
                onMouseEnter={() => handleMouseEnterTab("all")}
                onFocus={() => setActiveMenuTab("all")}
                onClick={() => router.push("/category/all")}
                className={`flex items-center gap-1 px-3 py-1 rounded-full font-label-md text-[13px] transition-all cursor-pointer ${
                  activeMenuTab === "all" || pathname === "/category/all"
                    ? "bg-primary text-on-primary font-bold shadow-[0_2px_0_#004965]"
                    : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
                }`}
              >
                <Icon name="widgets" className="w-4 h-4" />
                <span>All Categories</span>
                <Icon name="expand_more" className="w-3.5 h-3.5" />
              </button>

              {/* Department tabs */}
              {CATEGORIES.map((cat) => {
                const isActive = activeMenuTab === cat.slug || pathname.includes(cat.slug);
                return (
                  <button
                    key={cat.slug}
                    type="button"
                    onMouseEnter={() => handleMouseEnterTab(cat.slug)}
                    onFocus={() => setActiveMenuTab(cat.slug)}
                    onClick={() => router.push(`/category/${cat.slug}`)}
                    className={`px-3 py-1 rounded-full font-label-md text-[13px] transition-all cursor-pointer ${
                      isActive
                        ? "bg-primary text-on-primary font-bold shadow-[0_2px_0_#004965]"
                        : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
                    }`}
                  >
                    {cat.name}
                  </button>
                );
              })}

              {/* Top Deals virtual link */}
              <Link
                href="/deals"
                className="flex items-center gap-1 px-3 py-1 rounded-full text-on-secondary-container bg-secondary-fixed hover:bg-secondary-fixed-dim font-label-md text-[13px] font-bold transition-all ml-1 shadow-[0_2px_0_#ffb2b9]"
              >
                <Icon name="local_fire_department" className="w-4 h-4 text-secondary" />
                <span>Top Deals</span>
              </Link>
            </nav>
          </div>
        </div>

        {/* -------------------------------------------------------------
            DESKTOP MEGA-MENU (Opens on hover / focus, Esc closes, 150ms delay)
           ------------------------------------------------------------- */}
        {activeMenuTab && (
          <div
            id="desktop-megamenu"
            role="region"
            aria-label="Department Mega Menu"
            ref={megaMenuRef}
            onMouseEnter={() => {
              if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
            }}
            onMouseLeave={handleMouseLeaveNav}
            className="absolute top-full left-0 w-full bg-surface-container-lowest border-t-2 border-primary-container shadow-[0_16px_32px_rgba(0,30,44,0.14)] z-50 animate-in fade-in-50 duration-150"
          >
            <div className="max-w-7xl mx-auto px-8 py-6">
              <div className="grid grid-cols-12 gap-8">
                {/* Column 1: Subcategories / Department listing (5 cols) */}
                <div className="col-span-5 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-surface-container">
                    <h3 className="font-headline-sm text-headline-sm text-primary font-bold">
                      {activeCategory ? activeCategory.name : "Departments & Aisles"}
                    </h3>
                    <Link
                      href={activeCategory ? `/category/${activeCategory.slug}` : "/category/all"}
                      className="font-label-sm text-[12px] text-primary hover:underline font-bold"
                    >
                      View All
                    </Link>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {activeCategory ? (
                      activeCategory.subcategories.map((sub) => (
                        <Link
                          key={sub}
                          href={`/category/${activeCategory.slug}?subcategory=${encodeURIComponent(
                            sub
                          )}`}
                          className="px-2.5 py-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-low font-body-sm text-[13px] transition-colors flex items-center justify-between group"
                        >
                          <span>{sub}</span>
                          <Icon
                            name="chevron_right"
                            className="w-3.5 h-3.5 text-outline opacity-0 group-hover:opacity-100 transition-opacity"
                          />
                        </Link>
                      ))
                    ) : (
                      CATEGORIES.map((c) => (
                        <Link
                          key={c.slug}
                          href={`/category/${c.slug}`}
                          className="px-2.5 py-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-low font-label-md text-[13px] font-bold transition-colors flex items-center justify-between group"
                        >
                          <span>{c.name}</span>
                          <Icon
                            name="chevron_right"
                            className="w-3.5 h-3.5 text-outline opacity-0 group-hover:opacity-100"
                          />
                        </Link>
                      ))
                    )}
                  </div>
                </div>

                {/* Column 2: Shop by Age (4 cols) */}
                <div className="col-span-4 space-y-3 border-l border-surface-container pl-6">
                  <div className="pb-2 border-b border-surface-container">
                    <h3 className="font-headline-sm text-headline-sm text-primary font-bold flex items-center gap-1.5">
                      <Icon name="cake" className="w-4 h-4 text-tertiary-container" />
                      <span>Shop by Age</span>
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {AGE_GROUPS.map((ag) => (
                      <Link
                        key={ag.slug}
                        href={`/age/${ag.slug}`}
                        className="p-2 rounded-xl bg-surface-container-low hover:bg-surface-container hover:text-primary font-label-sm text-[12px] font-bold transition-all shadow-[0_2px_0_#dee8ff] active:translate-y-0.5 flex items-center gap-1.5"
                      >
                        <span className="w-2 h-2 rounded-full bg-primary" />
                        <span className="truncate">{ag.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Column 3: Shop by Price & Collections (3 cols) */}
                <div className="col-span-3 space-y-4 border-l border-surface-container pl-6">
                  {/* Shop by Price */}
                  <div>
                    <h4 className="font-label-md text-label-md text-on-surface font-extrabold mb-2">
                      Shop by Price
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {PRICE_BANDS.map((pb) => {
                        const targetCat = activeCategory ? activeCategory.slug : "all";
                        return (
                          <Link
                            key={pb.maxPrice}
                            href={`/category/${targetCat}?max_price=${pb.maxPrice}`}
                            className="px-2.5 py-1 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-label-sm text-[11px] font-bold shadow-[0_1px_0_#bdc8d1]"
                          >
                            {pb.label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>

                  {/* Collections */}
                  <div className="space-y-2 pt-2 border-t border-surface-container">
                    <h4 className="font-label-md text-label-md text-on-surface font-extrabold">
                      Curated Collections
                    </h4>
                    <div className="space-y-1.5">
                      {COLLECTIONS.map((col) => (
                        <Link
                          key={col.slug}
                          href={col.href}
                          className="flex items-center gap-2 p-2 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors shadow-[0_2px_0_#dee8ff]"
                        >
                          <div className="w-7 h-7 rounded-full bg-primary-fixed flex items-center justify-center text-primary">
                            <Icon name={col.icon} className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <div className="font-label-sm text-[12px] font-bold text-on-surface">
                              {col.label}
                            </div>
                            <div className="font-body-sm text-[10px] text-outline">
                              {col.description}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Category Drawer */}
      <CategoryDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

      {/* Client-side Pincode Modal */}
      {isPincodeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-inverse-surface/60 backdrop-blur-xs"
            onClick={() => setIsPincodeModalOpen(false)}
          />
          <div className="relative z-10 w-full max-w-sm rounded-xl bg-surface-container-lowest p-6 shadow-[0_8px_24px_rgba(0,30,44,0.16)] border-2 border-primary-container">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Icon name="pin_drop" className="w-5 h-5 text-primary" />
                <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                  Delivery Location
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsPincodeModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-surface-container text-outline flex items-center justify-center cursor-pointer"
              >
                <Icon name="close" className="w-4 h-4" />
              </button>
            </div>

            <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">
              Enter your 6-digit PIN code to check shipping rates and availability.
            </p>

            <form onSubmit={handleSavePincode} className="space-y-3">
              <input
                type="text"
                maxLength={6}
                placeholder="Enter 6-digit PIN"
                value={pincodeInput}
                onChange={(e) => {
                  setPincodeInput(e.target.value.replace(/\D/g, ""));
                  setPincodeError("");
                }}
                className="w-full h-11 px-4 rounded-full bg-surface-container-low border border-surface-container-high font-headline-sm text-headline-sm text-on-surface tracking-widest text-center focus:outline-none focus:border-primary shadow-[0_2px_0_#bdc8d1]"
                autoFocus
              />

              {pincodeError && (
                <p className="font-label-sm text-[12px] text-error font-bold text-center">
                  {pincodeError}
                </p>
              )}

              <p className="font-label-sm text-[11px] text-primary text-center font-bold">
                Standard delivery in 3-5 business days
              </p>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsPincodeModalOpen(false)}
                  className="flex-1 py-2.5 rounded-full bg-surface-container text-on-surface font-label-md text-label-md font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-full btn-primary-action font-label-md text-label-md font-bold cursor-pointer"
                >
                  Save PIN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
