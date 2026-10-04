"use client";

import React, { useEffect, useState } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import ProductCard from "@/components/ProductCard";
import Skeleton from "@/components/ui/Skeleton";
import EmptyState from "@/components/ui/EmptyState";
import { api } from "@/lib/api";

export default function DealsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDeals() {
      setLoading(true);
      try {
        const res = await api.getProductsWithMeta({
          min_discount: 15.0,
          sort: "discount",
          limit: 48,
        });
        if (res && res.data) {
          setProducts(res.data);
          setTotalCount(res.meta?.total ?? res.data.length);
        } else if (Array.isArray(res)) {
          setProducts(res);
          setTotalCount(res.length);
        } else {
          setProducts([]);
          setTotalCount(0);
        }
      } catch (err) {
        console.error("Failed to load deals", err);
        setProducts([]);
        setTotalCount(0);
      } finally {
        setLoading(false);
      }
    }

    loadDeals();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <SectionHeader
        eyebrow="Special Savings"
        eyebrowIcon="local_fire_department"
        title="Top Deals & Curated Offers"
        subtitle={`Featuring ${totalCount} baby staples and Montessori gear discounted 15% to 35% off MRP.`}
        actionText="Back to Home"
        actionHref="/"
      />

      {loading ? (
        <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} variant="card" />
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <span className="font-label-md text-label-md text-on-surface-variant font-bold" id="deals-count-label">
              {totalCount} Deals Available
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((p, idx) => (
              <ProductCard key={p.id} product={p} index={idx} />
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-8">
          <EmptyState
            iconName="local_fire_department"
            title="No Deals Available"
            description="No items currently meet the 15%+ discount threshold."
            actionText="Browse Home Catalog"
            actionHref="/"
          />
        </div>
      )}
    </div>
  );
}
