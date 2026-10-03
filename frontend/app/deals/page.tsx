// TODO-PHASE-2: Top Deals & Curated Combo Packs Page
"use client";

import React from "react";
import EmptyState from "@/components/ui/EmptyState";
import SectionHeader from "@/components/ui/SectionHeader";

export default function DealsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <SectionHeader
        eyebrow="Special Savings"
        eyebrowIcon="local_fire_department"
        title="Top Deals & Curated Offers"
        subtitle="Transparent discounts on baby staples and combo packs (15%+ off catalog prices)."
        actionText="Back to Catalog"
        actionHref="/"
      />

      <div className="mt-8">
        <EmptyState
          iconName="local_fire_department"
          title="Top Deals & Combo Packs"
          description="Curated high-discount items (≥15% off) and value bundle offers will be featured in Phase 2."
          actionText="Browse Home Catalog"
          actionHref="/"
          todoPhase={2}
        />
      </div>
    </div>
  );
}
