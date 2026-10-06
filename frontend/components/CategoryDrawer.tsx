"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Icon from "@/components/Icon";
import {
  CATEGORIES,
  AGE_GROUPS,
  COLLECTIONS,
} from "@/config/navigation";
import { api, getToken, getCurrentStoredUser, removeToken } from "@/lib/api";
import { useSkyBot } from "@/context/SkyBotContext";

interface CategoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CategoryDrawer: React.FC<CategoryDrawerProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { openSkyBot } = useSkyBot();
  const [openAccordion, setOpenAccordion] = useState<string | null>("toys");
  const [user, setUser] = useState<any>(null);
  const [childrenList, setChildrenList] = useState<any[]>([]);

  useEffect(() => {
    const u = getCurrentStoredUser();
    setUser(u);
    if (u && getToken()) {
      api.getChildren().then((kids: any) => {
        if (Array.isArray(kids)) setChildrenList(kids);
      }).catch(() => setChildrenList([]));
    } else {
      setChildrenList([]);
    }
  }, [isOpen]);

  const formatAge = (birthDateStr: string) => {
    if (!birthDateStr) return "";
    const birth = new Date(birthDateStr);
    const now = new Date();
    let months = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
    if (months < 0) months = 0;
    const years = Math.floor(months / 12);
    if (years >= 1) return `${years}y`;
    return `${months}m`;
  };

  // Close drawer on actual route change
  const prevPathRef = useRef(pathname);
  useEffect(() => {
    if (prevPathRef.current !== pathname) {
      prevPathRef.current = pathname;
      onClose();
    }
  }, [pathname, onClose]);

  // Close drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const toggleAccordion = (slug: string) => {
    setOpenAccordion(openAccordion === slug ? null : slug);
  };

  const handleSignOut = () => {
    removeToken();
    setUser(null);
    setChildrenList([]);
    onClose();
    router.push("/login");
  };

  const primaryChild = childrenList.length > 0 ? childrenList[0] : null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-inverse-surface/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer content */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Category Navigation"
        className="relative z-10 w-[86%] max-w-[360px] h-full bg-surface-container-lowest flex flex-col shadow-[8px_0_24px_rgba(0,30,44,0.15)] overflow-hidden animate-in slide-in-from-left duration-300"
      >
        {/* Top Tactile Header */}
        <div className="p-4 bg-surface-container-low flex flex-col gap-3 shadow-sm border-b border-surface-container shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-primary-fixed flex items-center justify-center text-primary shadow-[0_3px_0_#87cff8]">
                <Icon name="category" className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-headline-sm text-headline-sm text-primary tracking-tight font-bold">
                  Categories
                </h2>
                <span className="font-label-sm text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-bold">
                  Quick Browse
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close Navigation Drawer"
              className="w-9 h-9 rounded-full bg-surface-container-highest text-on-surface flex items-center justify-center shadow-[0_2px_0_#bfc8ce] active:translate-y-0.5 transition-all cursor-pointer"
            >
              <Icon name="close" className="w-5 h-5" />
            </button>
          </div>

          {/* Stitch-style Welcome block when logged in / Guest card when guest */}
          {user ? (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-lowest shadow-[0_3px_0_#c4e7ff]">
              <div className="relative shrink-0">
                <div className="w-11 h-11 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary shadow-[0_2px_0_#ffb2b9]">
                  <Icon name="face_3" className="w-6 h-6" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-secondary-container rounded-full ring-2 ring-surface-container-lowest flex items-center justify-center">
                  <Icon name="star" className="w-2.5 h-2.5 text-on-secondary" />
                </span>
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center gap-1">
                  <span className="font-label-sm text-[11px] text-outline">Welcome back</span>
                  <Icon name="waving_hand" className="w-3.5 h-3.5 text-tertiary" />
                </div>
                <h3 className="font-headline-sm text-[15px] font-bold text-on-surface truncate">
                  Hi, {user.name ? user.name.split(" ")[0] : "Parent"}
                </h3>
              </div>
              {primaryChild && (
                <Link
                  href="/account/child"
                  className="px-3 py-1.5 rounded-full bg-primary text-on-primary font-label-sm text-label-sm flex items-center gap-1 shadow-[0_3px_0_#004c68] active:translate-y-0.5 shrink-0"
                >
                  <Icon name="child_care" className="w-3.5 h-3.5" />
                  <span>{primaryChild.name} ({formatAge(primaryChild.birth_date)})</span>
                </Link>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-lowest shadow-[0_3px_0_#c4e7ff]">
              <div className="flex flex-col">
                <span className="font-headline-sm text-label-md font-bold text-on-surface">
                  Welcome to skyB!
                </span>
                <span className="font-body-sm text-[11px] text-on-surface-variant">
                  Sign in to save items &amp; cart
                </span>
              </div>
              <Link
                href={`/login?next=${encodeURIComponent(pathname || "/")}`}
                className="px-3.5 py-1.5 rounded-full bg-primary text-on-primary font-label-sm text-label-sm font-bold shadow-[0_2px_0_#004965] active:translate-y-0.5"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>

        {/* Scrollable Drawer Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 overscroll-contain">
          {/* Bargain Finder Banner (Guest redirects to login) */}
          <div className="p-3.5 rounded-xl bg-surface-container-low flex items-center justify-between shadow-[0_3px_0_#c4e7ff]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-secondary-container text-on-secondary flex items-center justify-center shadow-[0_2px_0_#730425]">
                <Icon name="smart_toy" className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-label-md text-label-md text-on-surface font-bold">
                  Bargain Finder
                </span>
                <span className="font-body-sm text-[11px] text-outline">
                  Transparent parent savings
                </span>
              </div>
            </div>
            <button
              type="button"
              id="drawer-bargain-btn"
              onClick={() => {
                onClose();
                if (!user) {
                  router.push(`/login?next=${encodeURIComponent(pathname || "/")}`);
                  return;
                }
                openSkyBot();
              }}
              className="px-3 py-1.5 rounded-full btn-bargain-action font-label-sm text-label-sm font-bold cursor-pointer"
            >
              Bargain
            </button>
          </div>

          {/* 1. Shop by Category (Accordions) */}
          <section className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <h3 className="font-headline-sm text-[16px] text-primary font-bold flex items-center gap-1.5">
                <Icon name="category" className="w-4 h-4" />
                <span>Shop by Category</span>
              </h3>
              <Link
                href="/category/all"
                className="font-label-sm text-[11px] text-outline hover:text-primary font-bold"
              >
                View All
              </Link>
            </div>

            <div className="space-y-2">
              {CATEGORIES.map((cat) => {
                const isOpenAccord = openAccordion === cat.slug;
                return (
                  <div
                    key={cat.slug}
                    className="rounded-xl bg-surface-container-lowest shadow-[0_3px_0_#dee8ff] overflow-hidden border border-surface-container-low"
                  >
                    <button
                      type="button"
                      onClick={() => toggleAccordion(cat.slug)}
                      className="w-full px-3.5 py-2.5 flex items-center justify-between text-left cursor-pointer hover:bg-surface-container-low/50"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-surface-container-high text-primary flex items-center justify-center">
                          <Icon name={cat.icon} className="w-4 h-4" />
                        </div>
                        <span className="font-label-md text-label-md text-on-surface font-bold">
                          {cat.name}
                        </span>
                      </div>
                      <Icon
                        name="expand_more"
                        className={`w-5 h-5 text-outline transition-transform duration-200 ${
                          isOpenAccord ? "rotate-180 text-primary" : ""
                        }`}
                      />
                    </button>

                    {isOpenAccord && (
                      <div className="px-3 pb-3 pt-1 flex flex-col gap-1.5 bg-surface-container-low/30 border-t border-surface-container-low">
                        <Link
                          href={`/category/${cat.slug}`}
                          className="px-3 py-1.5 rounded-full bg-primary-fixed/40 text-primary font-label-sm text-[12px] font-bold flex items-center justify-between"
                        >
                          <span>Explore All {cat.name}</span>
                          <Icon name="arrow_forward" className="w-3.5 h-3.5" />
                        </Link>
                        {cat.subcategories.map((sub) => (
                          <Link
                            key={sub}
                            href={`/category/${cat.slug}?subcategory=${encodeURIComponent(sub)}`}
                            className="px-3 py-1.5 rounded-full hover:bg-surface-container-low text-on-surface-variant hover:text-on-surface font-body-sm text-[13px] flex items-center justify-between"
                          >
                            <span>{sub}</span>
                            <Icon name="chevron_right" className="w-3.5 h-3.5 text-outline" />
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* 2. Shop by Age */}
          <section className="space-y-2">
            <h3 className="font-headline-sm text-[16px] text-primary font-bold flex items-center gap-1.5 px-1">
              <Icon name="cake" className="w-4 h-4" />
              <span>Shop by Age</span>
            </h3>
            <div className="grid grid-cols-4 gap-1.5">
              {AGE_GROUPS.map((age) => (
                <Link
                  key={age.slug}
                  href={`/age/${age.slug}`}
                  className="py-2 px-1 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface font-label-sm text-[11px] font-bold text-center shadow-[0_2px_0_#dee8ff] active:translate-y-0.5 truncate"
                >
                  {age.shortLabel}
                </Link>
              ))}
            </div>
          </section>

          {/* 3. Featured Collections */}
          <section className="space-y-2">
            <h3 className="font-headline-sm text-[16px] text-primary font-bold flex items-center gap-1.5 px-1">
              <Icon name="collections_bookmark" className="w-4 h-4" />
              <span>Featured Collections</span>
            </h3>
            <div className="flex flex-col gap-2">
              {COLLECTIONS.map((col) => (
                <Link
                  key={col.slug}
                  href={col.href}
                  className="p-3 rounded-xl bg-surface-container-lowest flex items-center justify-between shadow-[0_3px_0_#dee8ff] hover:bg-surface-container-low"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-primary-fixed text-primary flex items-center justify-center">
                      <Icon name={col.icon} className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-label-md text-label-md font-bold text-on-surface">
                        {col.label}
                      </h4>
                      <p className="font-body-sm text-[11px] text-outline">
                        {col.description}
                      </p>
                    </div>
                  </div>
                  <Icon name="chevron_right" className="w-4 h-4 text-outline" />
                </Link>
              ))}
            </div>
          </section>

          {/* Trust Badges */}
          <div className="p-3 rounded-xl bg-surface-container-low flex items-center justify-around gap-2 text-center shadow-[0_2px_0_#dee8ff]">
            <div className="flex flex-col items-center">
              <Icon name="shield" className="w-5 h-5 text-primary" />
              <span className="font-label-sm text-[10px] text-on-surface mt-0.5 font-bold">
                Safety Specs
              </span>
            </div>
            <div className="w-px h-6 bg-outline-variant" />
            <div className="flex flex-col items-center">
              <Icon name="local_shipping" className="w-5 h-5 text-primary" />
              <span className="font-label-sm text-[10px] text-on-surface mt-0.5 font-bold">
                Pan-India Delivery
              </span>
            </div>
            <div className="w-px h-6 bg-outline-variant" />
            <div className="flex flex-col items-center">
              <Icon name="support_agent" className="w-5 h-5 text-primary" />
              <span className="font-label-sm text-[10px] text-on-surface mt-0.5 font-bold">
                Parent Support
              </span>
            </div>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 bg-surface-container-low border-t border-surface-container flex items-center justify-between shrink-0">
          {user ? (
            <button
              type="button"
              onClick={handleSignOut}
              className="px-3.5 py-2 rounded-full bg-surface-container-lowest text-error font-label-sm text-label-sm font-bold flex items-center gap-1.5 shadow-[0_2px_0_#dee8ff] active:translate-y-0.5 cursor-pointer"
            >
              <Icon name="logout" className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          ) : (
            <Link
              href={`/login?next=${encodeURIComponent(pathname || "/")}`}
              className="px-3.5 py-2 rounded-full bg-primary text-on-primary font-label-sm text-label-sm font-bold flex items-center gap-1.5 shadow-[0_2px_0_#004965] active:translate-y-0.5"
            >
              <Icon name="person" className="w-4 h-4" />
              <span>Sign In / Register</span>
            </Link>
          )}

          <Link
            href="/terms#faq"
            className="px-3.5 py-2 rounded-full bg-surface-container-lowest text-on-surface font-label-sm text-label-sm font-bold flex items-center gap-1 shadow-[0_2px_0_#dee8ff]"
          >
            <Icon name="help_center" className="w-4 h-4 text-primary" />
            <span>FAQ &amp; Policy</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CategoryDrawer;
