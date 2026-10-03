"use client";

import React from "react";
import Link from "next/link";
import Icon from "@/components/Icon";

export default function Footer() {
  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="w-full bg-surface-container-low mt-16 border-t border-surface-container pb-20 md:pb-0">
      {/* Back to top row */}
      <div className="w-full bg-surface-container py-3 text-center">
        <button
          type="button"
          onClick={scrollToTop}
          className="font-label-md text-label-md text-primary hover:underline inline-flex items-center justify-center gap-1 cursor-pointer"
        >
          <Icon name="arrow_upward" className="w-4 h-4" />
          <span>Back to Top</span>
        </button>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Shop */}
          <div className="space-y-3">
            <h3 className="font-headline-sm text-headline-sm font-bold text-primary">
              Shop
            </h3>
            <ul className="space-y-2">
              <li className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface">
                <Link href="/category/boys-fashion">Boys Fashion</Link>
              </li>
              <li className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface">
                <Link href="/category/girls-fashion">Girls Fashion</Link>
              </li>
              <li className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface">
                <Link href="/category/toys">Educational Toys &amp; Puzzles</Link>
              </li>
              <li className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface">
                <Link href="/category/diapering">Diapering &amp; Wipes</Link>
              </li>
              <li className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface">
                <Link href="/category/feeding">Feeding Bottles &amp; Nursing</Link>
              </li>
              <li className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface">
                <Link href="/deals">Top Daily Deals (₹)</Link>
              </li>
            </ul>
          </div>

          {/* Help & Support */}
          <div className="space-y-3">
            <h3 className="font-headline-sm text-headline-sm font-bold text-primary">
              Help &amp; Support
            </h3>
            <ul className="space-y-2">
              <li className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface">
                <Link href="/orders">Track Order</Link>
              </li>
              <li className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface">
                <Link href="/terms">Returns &amp; Exchanges</Link>
              </li>
              <li className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface">
                <Link href="/terms">Shipping Rates &amp; Delivery</Link>
              </li>
              <li className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface">
                <Link href="/terms">Help Center &amp; FAQs</Link>
              </li>
            </ul>
          </div>

          {/* My Account */}
          <div className="space-y-3">
            <h3 className="font-headline-sm text-headline-sm font-bold text-primary">
              My Account
            </h3>
            <ul className="space-y-2">
              <li className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface">
                <Link href="/orders">My Orders &amp; Invoices</Link>
              </li>
              <li className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface">
                <Link href="/wishlist">Saved Wishlist</Link>
              </li>
              <li className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface">
                <Link href="/reorder">Quick Re-Order Pantry</Link>
              </li>
              <li className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface">
                <Link href="/account/child">Child Profile &amp; Size Reminder</Link>
              </li>
            </ul>
          </div>

          {/* About skyB */}
          <div className="space-y-3">
            <h3 className="font-headline-sm text-headline-sm font-bold text-primary">
              About skyB
            </h3>
            <ul className="space-y-2">
              <li className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface">
                <Link href="/privacy">Safety Standards &amp; Promise</Link>
              </li>
              <li className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface">
                <Link href="/terms">Academic Project Info</Link>
              </li>
              <li className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface">
                <Link href="/privacy">Privacy Policy</Link>
              </li>
              <li className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface">
                <Link href="/terms">Terms of Service</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-surface-container flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            © 2025 skyB, academic project (T.Y. B.Sc. CS). All prices listed in Indian Rupees (₹).
          </p>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-surface-container font-label-sm text-label-sm text-primary font-bold">
              Safety Info On Every Product
            </span>
            <span className="px-2.5 py-1 rounded-full bg-surface-container font-label-sm text-label-sm text-primary font-bold">
              ₹ INR Currency
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
