// TODO-PHASE-3: Child Profile & Developmental Size Tracker
"use client";

import React from "react";
import EmptyState from "@/components/ui/EmptyState";
import SectionHeader from "@/components/ui/SectionHeader";

export default function ChildProfilePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <SectionHeader
        eyebrow="Family Settings"
        eyebrowIcon="child_care"
        title="Child Profile & Sizing"
        subtitle="Manage your child's age, growth milestones, and personalized size auto-progression."
        actionText="Back to Home"
        actionHref="/"
      />

      <div className="mt-8">
        <EmptyState
          iconName="child_care"
          title="Child Profile & Growth Tracker"
          description="Track your child's age in months and receive automated recommendations for clothing sizes and developmental toy stages (Phase 3)."
          actionText="Return to Catalog"
          actionHref="/"
          todoPhase={3}
        />
      </div>
    </div>
  );
}
