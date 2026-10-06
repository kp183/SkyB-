"use client";

import React, { use, useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { getCategoryBySlug, CategoryConfig, resolveCategoryIdsFromList } from "@/config/navigation";
import SectionHeader from "@/components/ui/SectionHeader";
import ProductCard from "@/components/ProductCard";
import Skeleton from "@/components/ui/Skeleton";
import EmptyState from "@/components/ui/EmptyState";
import { api } from "@/lib/api";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

let inMemoryCategoriesCache: Array<{ id: number; name: string }> | null = null;

function CategoryContent({ slug }: { slug: string }) {
  const searchParams = useSearchParams();
  const category: CategoryConfig | undefined = getCategoryBySlug(slug);

  const [products, setProducts] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [categoryNotFound, setCategoryNotFound] = useState(false);

  const subcategory = searchParams.get("subcategory") || undefined;
  const maxPrice = searchParams.get("max_price") ? Number(searchParams.get("max_price")) : undefined;
  const minPrice = searchParams.get("min_price") ? Number(searchParams.get("min_price")) : undefined;
  const sort = searchParams.get("sort") || "popular";
  const q = searchParams.get("q") || undefined;

  const title = slug === "all" ? "All Products & Aisles" : category?.name || `Category: ${slug}`;

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      setCategoryNotFound(false);
      try {
        const queryParams: any = {
          limit: 48,
          sort,
        };

        if (slug !== "all") {
          // If slug is not recognized in navigation config
          if (!category) {
            setCategoryNotFound(true);
            setProducts([]);
            setTotalCount(0);
            return;
          }

          // Fetch categories at runtime if not cached in memory
          if (!inMemoryCategoriesCache) {
            try {
              inMemoryCategoriesCache = await api.getCategories();
            } catch (catErr) {
              console.error("Failed to fetch runtime categories:", catErr);
            }
          }

          const resolvedIds = resolveCategoryIdsFromList(
            slug,
            inMemoryCategoriesCache || []
          );

          // If no mapped DB categories exist in runtime DB, show EmptyState, never wrong products
          if (resolvedIds.length === 0) {
            setCategoryNotFound(true);
            setProducts([]);
            setTotalCount(0);
            return;
          }

          queryParams.category_ids = resolvedIds.join(",");
          if (category.genderFilter) {
            queryParams.gender = category.genderFilter;
          }
        }

        if (subcategory) queryParams.subcategory = subcategory;
        if (maxPrice !== undefined) queryParams.max_price = maxPrice;
        if (minPrice !== undefined) queryParams.min_price = minPrice;
        if (q) queryParams.q = q;

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
        console.error("Failed to load category products", err);
        setProducts([]);
        setTotalCount(0);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [slug, category, subcategory, maxPrice, minPrice, sort, q]);

  const subtitle = maxPrice
    ? `Showing ${totalCount} items under ₹${maxPrice}`
    : `Explore ${totalCount} certified baby-safe items in this collection.`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <SectionHeader
        eyebrow="Department Collection"
        eyebrowIcon="category"
        title={title}
        subtitle={subtitle}
        actionText="Back to Home"
        actionHref="/"
      />

      {loading ? (
        <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} variant="card" />
          ))}
        </div>
      ) : categoryNotFound ? (
        <div className="mt-8">
          <EmptyState
            iconName="category"
            title="Category Not Found"
            description={`We couldn't find the category "${slug}" in our catalog.`}
            actionText="Explore All Categories"
            actionHref="/category/all"
          />
        </div>
      ) : products.length > 0 ? (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <span className="font-label-md text-label-md text-on-surface-variant font-bold" id="product-count-label">
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
            iconName="search_off"
            title="No Products Found"
            description="We couldn't find any products matching your selected criteria."
            actionText="Clear Filters"
            actionHref={`/category/${slug}`}
          />
        </div>
      )}
    </div>
  );
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = use(params);

  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Skeleton variant="card" />
        </div>
      }
    >
      <CategoryContent slug={slug} />
    </Suspense>
  );
}
