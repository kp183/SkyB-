// TODO-PHASE-3: Order Tracking & Live Dispatch Status Page
"use client";

import React, { use } from "react";
import EmptyState from "@/components/ui/EmptyState";
import SectionHeader from "@/components/ui/SectionHeader";

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = use(params);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <SectionHeader
        eyebrow="Order Tracker"
        eyebrowIcon="local_shipping"
        title={`Track Order #${id}`}
        subtitle="Live delivery milestone tracking and invoice details."
        actionText="Back to Orders"
        actionHref="/orders"
      />

      <div className="mt-8">
        <EmptyState
          iconName="local_shipping"
          title={`Order #${id} Progress`}
          description="Detailed tracking checkpoints (Placed → Confirmed → Shipped → Delivered) and mock courier maps will be featured in Phase 3."
          actionText="View All Orders"
          actionHref="/orders"
          todoPhase={3}
        />
      </div>
    </div>
  );
}
