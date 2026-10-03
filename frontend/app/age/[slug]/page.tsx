// TODO-PHASE-3: Age Landing & Auto-Progression Stage Page
"use client";

import React, { use } from "react";
import { getAgeGroupBySlug } from "@/config/navigation";
import EmptyState from "@/components/ui/EmptyState";
import SectionHeader from "@/components/ui/SectionHeader";

interface AgePageProps {
  params: Promise<{ slug: string }>;
}

export default function AgePage({ params }: AgePageProps) {
  const { slug } = use(params);
  const ageGroup = getAgeGroupBySlug(slug);
  const title = ageGroup?.label || `Age Milestone: ${slug}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <SectionHeader
        eyebrow="Developmental Milestone"
        eyebrowIcon="cake"
        title={title}
        subtitle="Calibrated clothing sizing and pediatric Montessori gear for this developmental stage."
        actionText="Back to Catalog"
        actionHref="/"
      />

      <div className="mt-8">
        <EmptyState
          iconName="cake"
          title={`${title} Milestone Hub`}
          description="Developmental milestones, auto-progression size transitions, and stage-specific bundles will be connected in Phase 3."
          actionText="Explore Home Catalog"
          actionHref="/"
          todoPhase={3}
        />
      </div>
    </div>
  );
}
