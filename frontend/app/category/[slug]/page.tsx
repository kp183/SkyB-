// TODO-PHASE-2: Full Category Listing page with multi-facet filters & sorting
"use client";

import React, { use } from "react";
import { getCategoryBySlug } from "@/config/navigation";
import EmptyState from "@/components/ui/EmptyState";
import SectionHeader from "@/components/ui/SectionHeader";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = use(params);
  const category = getCategoryBySlug(slug);
  const title = slug === "all" ? "All Products & Aisles" : category?.name || `Category: ${slug}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <SectionHeader
        eyebrow="Department Collection"
        eyebrowIcon="category"
        title={title}
        subtitle="Explore certified, baby-safe essentials and kid toys curated for Indian parents."
        actionText="Back to Catalog"
        actionHref="/"
      />

      <div className="mt-8">
        <EmptyState
          iconName="category"
          title={`${title} Showcase`}
          description="The complete category catalog grid with faceted sidebar filters, subcategory tabs, and sorting will be fully connected in Phase 2."
          actionText="Explore Home Catalog"
          actionHref="/"
          todoPhase={2}
        />
      </div>
    </div>
  );
}
