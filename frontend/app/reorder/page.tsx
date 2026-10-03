// TODO-PHASE-4: Quick Re-Order Pantry & Smart Subscription Prediction
"use client";

import React from "react";
import EmptyState from "@/components/ui/EmptyState";
import SectionHeader from "@/components/ui/SectionHeader";

export default function ReorderPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <SectionHeader
        eyebrow="Parent Pantry"
        eyebrowIcon="sync_alt"
        title="Quick Re-Order Pantry"
        subtitle="One-tap replenishment for diapers, wipes, formula, and daily baby care staples."
        actionText="Back to Home"
        actionHref="/"
      />

      <div className="mt-8">
        <EmptyState
          iconName="sync_alt"
          title="Quick Re-Order Pantry"
          description="Predictive reordering for recurring baby essentials based on family consumption habits will be implemented in Phase 4."
          actionText="Browse Diapering & Care"
          actionHref="/category/diapering"
          todoPhase={4}
        />
      </div>
    </div>
  );
}
