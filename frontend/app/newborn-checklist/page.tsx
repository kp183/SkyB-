// TODO-PHASE-3: Newborn Preparation Checklist & Curated Hospital Bag Bundles
"use client";

import React from "react";
import EmptyState from "@/components/ui/EmptyState";
import SectionHeader from "@/components/ui/SectionHeader";

export default function NewbornChecklistPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <SectionHeader
        eyebrow="Parenting Made Calm"
        eyebrowIcon="checklist"
        title="New Born Checklist & Bundles"
        subtitle="Zero panic shopping. Every medical and comfort requirement organized by seasoned Indian pediatricians."
        actionText="Back to Home"
        actionHref="/"
      />

      <div className="mt-8">
        <EmptyState
          iconName="checklist"
          title="New Born Checklist Hub"
          description="Interactive checklist categories (Hospital Bag, 0-3M Nursery, First Bath Kit) with one-click bundle adding will arrive in Phase 3."
          actionText="Browse Baby Care Essentials"
          actionHref="/category/bath-skincare"
          todoPhase={3}
        />
      </div>
    </div>
  );
}
