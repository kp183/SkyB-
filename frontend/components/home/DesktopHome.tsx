"use client";

import React from "react";
import HeroCarousel from "./HeroCarousel";
import AgeStrip from "./AgeStrip";
import CategoryMosaicGrid from "./CategoryMosaicGrid";
import ProductRow from "./ProductRow";
import SkyBotPromoTile from "./SkyBotPromoTile";
import PersonalizedSection from "./PersonalizedSection";
import NewbornChecklistBanner from "./NewbornChecklistBanner";
import PerksRow from "./PerksRow";
import { FIXTURE_DATA } from "./fixtureData";
import { ProductData } from "@/components/ProductCard";

export interface DesktopHomeProps {
  isFixture?: boolean;
  topDeals?: ProductData[];
  newArrivals?: ProductData[];
  under499?: ProductData[];
  bestsellers?: ProductData[];
  safetyPicks?: ProductData[];
  departmentMosaic?: any[];
  user?: any;
  childProfile?: any;
  recentlyViewed?: any[];
  buyAgainItems?: any[];
  growsWithItems?: any[];
  loading?: boolean;
}

export const DesktopHome: React.FC<DesktopHomeProps> = ({
  isFixture = false,
  topDeals = [],
  newArrivals = [],
  under499 = [],
  bestsellers = [],
  safetyPicks = [],
  departmentMosaic = [],
  user = null,
  childProfile = null,
  recentlyViewed = [],
  buyAgainItems = [],
  growsWithItems = [],
  loading = false,
}) => {
  return (
    <div className="hidden md:flex flex-col w-full">
      {/* 1. HERO CAROUSEL */}
      <HeroCarousel isFixture={isFixture} />

      {/* 2. SHOP BY AGE STRIP */}
      <AgeStrip isFixture={isFixture} childProfile={childProfile} />

      {/* 3. SHOP BY CATEGORY MOSAIC GRID */}
      <CategoryMosaicGrid isFixture={isFixture} realData={departmentMosaic} />

      {/* 4. HORIZONTAL PRODUCT ROW 1: BESTSELLERS (Hidden if < 4 sold in real mode) */}
      {(isFixture || bestsellers.length >= 4) && (
        <ProductRow
          id="bestsellers-strip"
          dataSection="bestsellers"
          icon="hotel_class"
          iconBg="bg-primary-fixed text-primary"
          title="Bestselling Family Essentials"
          subtitle="Top-rated daily baby gear based on actual parent checkouts"
          tagText="Parent Choice"
          tagClass="bg-primary text-on-primary font-label-sm text-[11px] font-extrabold"
          viewAllHref="/catalog?sort=popular"
          products={bestsellers}
          isFixture={isFixture}
          fixtureCards={FIXTURE_DATA.bestsellers as any}
          loading={loading}
        />
      )}

      {/* 5. HORIZONTAL PRODUCT ROW 2: TOP DEALS */}
      <ProductRow
        id="deals-strip"
        dataSection="top-deals"
        icon="bolt"
        iconBg="bg-secondary-fixed text-secondary"
        title="Top Deals"
        subtitle="Time-limited savings with instant SkyBot negotiation discounts"
        tagText="15%+ OFF"
        tagClass="bg-secondary text-on-secondary font-label-sm text-[11px] font-extrabold"
        viewAllHref="/deals"
        products={topDeals}
        isFixture={isFixture}
        fixtureCards={FIXTURE_DATA.dealsOfDay as any}
        loading={loading}
      />

      {/* 6. COMPACT SKYBOT PROMO TILE */}
      <SkyBotPromoTile isFixture={isFixture} />

      {/* 7. HORIZONTAL PRODUCT ROW 3: UNDER ₹499 STORE */}
      <ProductRow
        id="under499-strip"
        dataSection="under-499"
        icon="currency_rupee"
        iconBg="bg-primary text-on-primary font-headline-sm font-bold"
        title="Under ₹499 Pocket-Friendly Store"
        subtitle="Daily replenishables, small sensory toys, and essentials under ₹499"
        tagText="Pocket Value"
        tagClass="bg-primary-fixed text-primary font-label-sm text-[11px] font-extrabold"
        viewAllHref="/deals?max_price=499"
        products={under499}
        isFixture={isFixture}
        fixtureCards={FIXTURE_DATA.under499 as any}
        loading={loading}
      />

      {/* 8. PERSONALIZED SECTION FOR LOGGED-IN USERS WITH DATA */}
      <PersonalizedSection
        isFixture={isFixture}
        user={user}
        childProfile={childProfile}
        recentlyViewed={recentlyViewed}
        buyAgainItems={buyAgainItems}
        growsWithItems={growsWithItems}
      />

      {/* 9. SAFETY-FIRST PICKS (Strict Compliance Badges) */}
      <ProductRow
        id="safety-grid"
        dataSection="safety-picks"
        icon="verified_user"
        iconBg="bg-primary-fixed text-primary"
        title="Safety-First Certified Picks"
        subtitle="Every item complies with Bureau of Indian Standards (BIS) & international testing"
        tagText="BIS Compliant"
        tagClass="bg-primary text-on-primary font-label-sm text-[11px] font-extrabold"
        viewAllHref="/catalog"
        isGrid={true}
        products={safetyPicks}
        isFixture={isFixture}
        fixtureCards={FIXTURE_DATA.safetyCards as any}
        loading={loading}
      />

      {/* 10. NEW BORN CHECKLIST BANNER */}
      <NewbornChecklistBanner isFixture={isFixture} />

      {/* 11. TRUST MARQUEE & ASSURANCE BAR */}
      <PerksRow isFixture={isFixture} />
    </div>
  );
};

export default DesktopHome;
