"use client";

import React, { use, useEffect, useState } from "react";
import { getAgeGroupBySlug, AgeGroupConfig } from "@/config/navigation";
import SectionHeader from "@/components/ui/SectionHeader";
import ProductCard from "@/components/ProductCard";
import Skeleton from "@/components/ui/Skeleton";
import EmptyState from "@/components/ui/EmptyState";
import { api } from "@/lib/api";

interface AgePageProps {
  params: Promise<{ slug: string }>;
}

export default function AgePage({ params }: AgePageProps) {
  const { slug } = use(params);
  const ageGroup: AgeGroupConfig | undefined = getAgeGroupBySlug(slug);

  const [products, setProducts] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const title = ageGroup?.label || `Age Milestone: ${slug}`;

  useEffect(() => {
    async function loadAgeProducts() {
      setLoading(true);
      try {
        const queryParams: any = {
          limit: 48,
          sort: "popular",
        };

        if (ageGroup) {
          queryParams.age_min_months = ageGroup.minMonths;
          queryParams.age_max_months = ageGroup.maxMonths;
        }

        const res = await api.getProductsWithMeta(queryParams);
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
        console.error("Failed to load age products", err);
        setProducts([]);
        setTotalCount(0);
      } finally {
        setLoading(false);
      }
    }

    loadAgeProducts();
  }, [slug, ageGroup]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <SectionHeader
        eyebrow="Developmental Milestone"
        eyebrowIcon="cake"
        title={title}
        subtitle={`Showing ${totalCount} items tailored for developmental stage (${ageGroup?.minMonths ?? 0}-${ageGroup?.maxMonths ?? 12} months).`}
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
            <span className="font-label-md text-label-md text-on-surface-variant font-bold" id="age-product-count-label">
              {totalCount} Products Available
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
            iconName="cake"
            title="No Stage Products Found"
            description="We couldn't find any products in this specific developmental age range."
            actionText="Explore All Categories"
            actionHref="/category/all"
          />
        </div>
      )}
    </div>
  );
}
