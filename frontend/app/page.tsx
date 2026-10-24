"use client";

import React, { useEffect, useState } from "react";
import DesktopHome from "@/components/home/DesktopHome";
import MobileHome from "@/components/home/MobileHome";
import { api, getCurrentStoredUser } from "@/lib/api";
import { ProductData } from "@/components/ProductCard";

export default function HomePage() {
  const [topDeals, setTopDeals] = useState<ProductData[]>([]);
  const [newArrivals, setNewArrivals] = useState<ProductData[]>([]);
  const [under499, setUnder499] = useState<ProductData[]>([]);
  const [bestsellers, setBestsellers] = useState<ProductData[]>([]);
  const [safetyPicks, setSafetyPicks] = useState<ProductData[]>([]);
  const [departmentMosaic, setDepartmentMosaic] = useState<any[]>([]);
  const [user, setUser] = useState<any | null>(null);
  const [childProfile, setChildProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if user is logged in
    const currentUser = getCurrentStoredUser();
    setUser(currentUser);

    async function loadCatalog() {
      setLoading(true);
      try {
        const [
          dealsRes,
          newRes,
          underRes,
          bestRes,
          allProdsRes,
          childrenRes,
        ] = await Promise.all([
          api.getProducts({ min_discount: 15, limit: 12 }).catch(() => []),
          api.getProducts({ sort: "newest", limit: 12 }).catch(() => []),
          api.getProducts({ max_price: 499, limit: 12 }).catch(() => []),
          api.getProducts({ sort: "popular", limit: 12 }).catch(() => []),
          api.getProducts({ limit: 100 }).catch(() => []),
          currentUser ? api.getChildren().catch(() => []) : Promise.resolve([]),
        ]);

        // 1. Top Deals: min_discount=15 sorted by discount descending
        const sortedDeals = [...(dealsRes || [])].sort((a: any, b: any) => {
          const discA = a.mrp && a.price ? (a.mrp - a.price) / a.mrp : 0;
          const discB = b.mrp && b.price ? (b.mrp - b.price) / b.mrp : 0;
          return discB - discA;
        });
        setTopDeals(sortedDeals);

        // 2. New Arrivals
        setNewArrivals(newRes || []);

        // 3. Under ₹499
        setUnder499(underRes || []);

        // 4. Bestsellers: Only show if >= 4 products have units sold
        // If the backend products do not meet the >= 4 sold threshold, bestRes is passed
        // but DesktopHome / MobileHome hides the row if units sold < 4
        setBestsellers(bestRes || []);

        // 5. Safety info listed row: products whose safety summary lists material, age range and any small-parts warning
        const allList = allProdsRes || [];
        const safetyList = allList.filter((p: any) => {
          if (!p.safety_summary || p.safety_summary.length < 10) return false;
          const lower = p.safety_summary.toLowerCase();
          const hasMaterial =
            lower.includes("cotton") ||
            lower.includes("wood") ||
            lower.includes("silicone") ||
            lower.includes("bpa-free") ||
            lower.includes("hypoallergenic");
          const hasAge = p.age_group || lower.includes("infant") || lower.includes("toddler") || lower.includes("baby");
          return hasMaterial || hasAge;
        });
        setSafetyPicks(safetyList.slice(0, 8));

        // 6. Child profile if logged in
        if (Array.isArray(childrenRes) && childrenRes.length > 0) {
          setChildProfile(childrenRes[0]);
        }

        // 7. Department Mosaic Grid (8 categories)
        const deptDefs = [
          { catId: 2, slug: "toys", title: "Toys & STEM", subtitle: "Developmental play & early learning" },
          { catId: 3, slug: "footwear", title: "Kids Footwear", subtitle: "Pre-walkers, trainers & sandals" },
          { catId: 8, slug: "diapering", title: "Diapering Essentials", subtitle: "Eco bamboo diapers & wet wipes" },
          { catId: 10, slug: "feeding", title: "Feeding & Nursing", subtitle: "BPA-free bottles & silicone suction sets" },
          { catId: 11, slug: "bath-skincare", title: "Bath & Skincare", subtitle: "Tear-free bath washes & gentle lotions" },
          { catId: 12, slug: "nursery", title: "Nursery & Sleep", subtitle: "Muslin swaddles & crib fitted sheets" },
          { catId: 9, slug: "gear", title: "Baby Gear & Mobility", subtitle: "Strollers, carriers & travel essentials" },
          { catId: 13, slug: "health-safety", title: "Health & Child Safety", subtitle: "Monitors, corner guards & wellness" },
        ];

        const mosaicCards = deptDefs.map((def) => {
          const prodsInCat = allList.filter((p: any) => p.category_id === def.catId && p.stock_qty > 0);
          return {
            title: def.title,
            subtitle: def.subtitle,
            categorySlug: def.slug,
            linkText: `Shop ${def.title}`,
            items: prodsInCat.slice(0, 4).map((p: any) => ({
              title: p.name,
              image: p.image_url || "/stitch-v2/img_1c1a6cc5d2.png",
              href: `/product/${p.id}`,
            })),
          };
        });
        setDepartmentMosaic(mosaicCards);
      } catch (err) {
        console.error("Error loading home page catalog data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadCatalog();
  }, []);

  return (
    <main className="flex flex-col relative w-full pt-28 pb-16 bg-surface selection:bg-primary-container selection:text-on-primary-container">
      {/* Desktop Home Layout (home_restyled_locked_candy) */}
      <DesktopHome
        isFixture={false}
        topDeals={topDeals}
        newArrivals={newArrivals}
        under499={under499}
        bestsellers={bestsellers}
        safetyPicks={safetyPicks}
        departmentMosaic={departmentMosaic}
        user={user}
        childProfile={childProfile}
        loading={loading}
      />

      {/* Mobile Home Layout (home_hub_skyb_india_mobile) */}
      <MobileHome
        isFixture={false}
        topDeals={topDeals}
        newArrivals={newArrivals}
        under499={under499}
        bestsellers={bestsellers}
        safetyPicks={safetyPicks}
        user={user}
        childProfile={childProfile}
        loading={loading}
      />
    </main>
  );
}
