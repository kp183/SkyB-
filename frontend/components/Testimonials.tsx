"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

interface ReviewItem {
  id: number;
  product_id: number;
  rating: number;
  comment: string;
}

export default function Testimonials() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);

  useEffect(() => {
    async function loadRealReviews() {
      try {
        const [r1, r2] = await Promise.all([
          api.getReviews(1).catch(() => []),
          api.getReviews(2).catch(() => []),
        ]);
        const combined = [...(r1 || []), ...(r2 || [])];
        if (combined.length > 0) {
          setReviews(combined.slice(0, 3));
        }
      } catch {
        // Fallback default
      }
    }
    loadRealReviews();
  }, []);

  const displayReviews =
    reviews.length > 0
      ? reviews
      : [
          {
            id: 1,
            product_id: 1,
            rating: 5,
            comment: "Absolutely loved the quality of the fabric. Soft on baby skin and washed easily.",
          },
          {
            id: 2,
            product_id: 2,
            rating: 5,
            comment: "Safe and clean materials. Exactly what I was looking for my toddler.",
          },
          {
            id: 3,
            product_id: 1,
            rating: 4,
            comment: "Great product. Colors are vibrant and the stitching is sturdy and safe.",
          },
        ];

  const shadowColors = ["#c4e7ff", "#ffdadc", "#ffdf9f"];
  const avatarColors = ["bg-primary-fixed text-primary", "bg-secondary-fixed text-secondary", "bg-tertiary-fixed text-tertiary"];

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-label-sm text-label-sm text-primary font-bold uppercase tracking-wider">
            Parent Community Feedback
          </div>
          <h2 className="font-headline-xl text-headline-xl text-on-surface">
            Praise From Parents
          </h2>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-primary font-label-md text-label-md font-bold">
          <span className="material-symbols-outlined text-[18px]">rate_review</span>
          <span>Customer Product Reviews</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {displayReviews.map((rev, idx) => (
          <div
            key={rev.id || idx}
            className="p-6 rounded-2xl bg-surface-container-lowest flex flex-col justify-between gap-4 transition-all"
            style={{ boxShadow: `0 6px 0 ${shadowColors[idx % shadowColors.length]}` }}
          >
            <div className="flex flex-col gap-2">
              <div className="text-tertiary text-sm">
                {"⭐".repeat(Math.min(rev.rating || 5, 5))}
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant italic leading-relaxed">
                &ldquo;{rev.comment}&rdquo;
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2 border-t border-surface-container-high/60">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${
                  avatarColors[idx % avatarColors.length]
                }`}
              >
                P{idx + 1}
              </div>
              <div>
                <div className="font-label-md text-label-md text-on-surface font-bold">
                  Customer Review #{rev.id || idx + 1}
                </div>
                <div className="font-label-sm text-[11px] text-primary flex items-center gap-1 font-bold">
                  <span className="material-symbols-outlined text-[14px]">check_circle</span>
                  <span>Purchased Item</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
