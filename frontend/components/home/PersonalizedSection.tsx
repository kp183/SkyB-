"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import Icon from "@/components/Icon";
import { useSkyBot } from "@/context/SkyBotContext";

interface PersonalizedSectionProps {
  isFixture?: boolean;
  user?: { first_name?: string; full_name?: string } | null;
  childProfile?: { name: string; age_months?: number; birth_date?: string } | null;
  recentlyViewed?: any[];
  buyAgainItems?: any[];
  growsWithItems?: any[];
}

export const PersonalizedSection: React.FC<PersonalizedSectionProps> = ({
  isFixture = false,
  user = null,
  childProfile = null,
  recentlyViewed = [],
  buyAgainItems = [],
  growsWithItems = [],
}) => {
  const { openSkyBot } = useSkyBot();

  // If not in fixture mode, only show for authenticated users who actually have data
  const hasRealData =
    Boolean(user) &&
    (Boolean(childProfile) ||
      recentlyViewed.length > 0 ||
      buyAgainItems.length > 0 ||
      growsWithItems.length > 0);

  if (!isFixture && !hasRealData) {
    return null;
  }

  // Display names
  const parentName = isFixture
    ? "Ananya"
    : user?.first_name || user?.full_name?.split(" ")[0] || "Parent";
  const childName = isFixture
    ? "Aarav"
    : childProfile?.name || "Your Child";
  const childAgeLabel = isFixture
    ? "18 Months"
    : childProfile?.age_months
    ? `${childProfile.age_months} Months`
    : "Milestone";
  const parentInitial = parentName.charAt(0).toUpperCase() || "P";

  return (
    <>
      {/* DESKTOP PERSONALIZED SECTION (home_restyled_locked_candy Section 8) */}
      <section
        data-section="personalized"
        className="w-full px-4 lg:px-margin-desktop py-6 bg-surface-container-low rounded-xl my-4 hidden md:block"
      >
        {/* Header with User Profile Context */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-headline-sm text-headline-sm font-bold shadow-[0_2px_0_#001e2c]">
              {parentInitial}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-headline-md text-headline-md font-bold text-on-surface">
                  {parentName}&apos;s Milestone Hub
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-[11px] font-extrabold">
                  {childName} • {childAgeLabel}
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Personalized replenishment, recent views, and next stage transitions
              </p>
            </div>
          </div>
          <Link
            href="/profile"
            className="px-4 py-2 rounded-full bg-surface-container-lowest text-primary font-label-md text-label-md font-bold shadow-[0_2px_0_#d8e3fb] hover:bg-surface-container transition-all flex items-center gap-1.5"
            data-path="child-profiles"
          >
            <Icon name="tune" className="text-[18px]" />
            <span>Update {childName}&apos;s Sizes &amp; Preferences</span>
          </Link>
        </div>

        {/* 3 Personalized Bento Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 1. Recently Viewed */}
          <div className="p-4 rounded-xl bg-surface-container-lowest shadow-[0_4px_0_#d8e3fb] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-headline-sm text-headline-sm font-bold text-on-surface flex items-center gap-1.5">
                  <Icon name="history" className="text-primary text-[20px]" />
                  <span>Recently Viewed</span>
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">3 items</span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-2 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors">
                  <div className="relative w-14 h-14 rounded-lg bg-surface-container overflow-hidden shrink-0">
                    <Image
                      src="/stitch-v2/img_833c91acce.png"
                      alt="Beechwood arch stacking puzzle set natural wood."
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-label-md text-label-md font-bold text-on-surface truncate">
                      Beechwood Arch Stacker
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="font-label-md text-label-md font-bold text-primary">₹599</span>
                      <span className="font-body-sm text-[12px] text-outline line-through">₹899</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    aria-label="Bargain"
                    className="w-9 h-9 rounded-full bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center shrink-0 shadow-[0_2px_0_#795900] cursor-pointer"
                    onClick={() => openSkyBot({ id: 1, name: "Beechwood Arch Stacker", price: 599 })}
                  >
                    <Icon name="smart_toy" className="text-[18px]" />
                  </button>
                </div>

                <div className="flex items-center gap-3 p-2 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors">
                  <div className="relative w-14 h-14 rounded-lg bg-surface-container overflow-hidden shrink-0">
                    <Image
                      src="/stitch-v2/img_54ea3379b8.png"
                      alt="Printed soft cotton kimono romper in soft amber."
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-label-md text-label-md font-bold text-on-surface truncate">
                      Printed Cotton Kimono Romper
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="font-label-md text-label-md font-bold text-primary">₹399</span>
                      <span className="font-body-sm text-[12px] text-outline line-through">₹599</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    aria-label="Bargain"
                    className="w-9 h-9 rounded-full bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center shrink-0 shadow-[0_2px_0_#795900] cursor-pointer"
                    onClick={() => openSkyBot({ id: 2, name: "Printed Cotton Kimono Romper", price: 399 })}
                  >
                    <Icon name="smart_toy" className="text-[18px]" />
                  </button>
                </div>

                <div className="flex items-center gap-3 p-2 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors">
                  <div className="relative w-14 h-14 rounded-lg bg-surface-container overflow-hidden shrink-0">
                    <Image
                      src="/stitch-v2/img_94e360cca7.png"
                      alt="Spill proof silicone toddler training sippy cup with dual handle."
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-label-md text-label-md font-bold text-on-surface truncate">
                      Spill-Proof Sippy Cup
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="font-label-md text-label-md font-bold text-primary">₹249</span>
                      <span className="font-body-sm text-[12px] text-outline line-through">₹399</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    aria-label="Bargain"
                    className="w-9 h-9 rounded-full bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center shrink-0 shadow-[0_2px_0_#795900] cursor-pointer"
                    onClick={() => openSkyBot({ id: 3, name: "Spill-Proof Sippy Cup", price: 249 })}
                  >
                    <Icon name="smart_toy" className="text-[18px]" />
                  </button>
                </div>
              </div>
            </div>
            <Link
              href="/catalog"
              className="font-label-md text-label-md text-primary font-bold hover:underline pt-3 flex items-center gap-1"
              data-path="recent-views"
            >
              <span>Full Browse History</span>
              <Icon name="chevron_right" className="text-[16px]" />
            </Link>
          </div>

          {/* 2. Buy Again (Quick Re-Order Pantry) */}
          <div className="p-4 rounded-xl bg-surface-container-lowest shadow-[0_4px_0_#d8e3fb] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-headline-sm text-headline-sm font-bold text-on-surface flex items-center gap-1.5">
                  <Icon name="repeat" className="text-secondary text-[20px]" />
                  <span>Buy Again (Pantry)</span>
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">Re-Order</span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-2 rounded-xl bg-surface-container-low">
                  <div className="relative w-14 h-14 rounded-lg bg-surface-container overflow-hidden shrink-0">
                    <Image
                      src="/stitch-v2/img_e61cf0100f.png"
                      alt="Biodegradable baby wipes pack for reorder."
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-label-md text-label-md font-bold text-on-surface truncate">
                      Eco Bamboo Wipes (3x80s)
                    </p>
                    <p className="font-label-sm text-[11px] text-on-surface-variant">Last ordered 18 days ago</p>
                    <span className="font-label-md text-label-md font-bold text-on-surface">₹489</span>
                  </div>
                  <button
                    type="button"
                    className="px-3 py-1.5 rounded-full bg-primary text-on-primary font-label-sm text-[12px] font-bold shadow-[0_2px_0_#001e2c] active:translate-y-0.5 cursor-pointer"
                  >
                    Re-Order
                  </button>
                </div>

                <div className="flex items-center gap-3 p-2 rounded-xl bg-surface-container-low">
                  <div className="relative w-14 h-14 rounded-lg bg-surface-container overflow-hidden shrink-0">
                    <Image
                      src="/stitch-v2/img_b6c68bba30.png"
                      alt="Natural cotton mild baby towels pack."
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-label-md text-label-md font-bold text-on-surface truncate">
                      Mild Cotton Face Towels
                    </p>
                    <p className="font-label-sm text-[11px] text-on-surface-variant">Last ordered 1 month ago</p>
                    <span className="font-label-md text-label-md font-bold text-on-surface">₹229</span>
                  </div>
                  <button
                    type="button"
                    className="px-3 py-1.5 rounded-full bg-primary text-on-primary font-label-sm text-[12px] font-bold shadow-[0_2px_0_#001e2c] active:translate-y-0.5 cursor-pointer"
                  >
                    Re-Order
                  </button>
                </div>

                <div className="flex items-center gap-3 p-2 rounded-xl bg-surface-container-low">
                  <div className="relative w-14 h-14 rounded-lg bg-surface-container overflow-hidden shrink-0">
                    <Image
                      src="/stitch-v2/img_3e28bb67e1.png"
                      alt="Organic soft baby mittens non scratch pack."
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-label-md text-label-md font-bold text-on-surface truncate">
                      Organic Scratch Mittens
                    </p>
                    <p className="font-label-sm text-[11px] text-on-surface-variant">Last ordered 2 months ago</p>
                    <span className="font-label-md text-label-md font-bold text-on-surface">₹199</span>
                  </div>
                  <button
                    type="button"
                    className="px-3 py-1.5 rounded-full bg-primary text-on-primary font-label-sm text-[12px] font-bold shadow-[0_2px_0_#001e2c] active:translate-y-0.5 cursor-pointer"
                  >
                    Re-Order
                  </button>
                </div>
              </div>
            </div>
            <Link
              href="/catalog"
              className="font-label-md text-label-md text-primary font-bold hover:underline pt-3 flex items-center gap-1"
              data-path="reorder"
            >
              <span>Open Quick Re-Order Pantry</span>
              <Icon name="chevron_right" className="text-[16px]" />
            </Link>
          </div>

          {/* 3. Grows With Them (Next-Size Suggestions) */}
          <div className="p-4 rounded-xl bg-surface-container-lowest shadow-[0_4px_0_#d8e3fb] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-headline-sm text-headline-sm font-bold text-on-surface flex items-center gap-1.5">
                  <Icon name="trending_up" className="text-tertiary text-[20px]" />
                  <span>Grows With {childName} (Next Size)</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-[11px] font-bold">
                  2 - 3 Yrs Prep
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-2 rounded-xl bg-surface-container-low">
                  <div className="relative w-14 h-14 rounded-lg bg-surface-container overflow-hidden shrink-0">
                    <Image
                      src="/stitch-v2/img_a46123c72b.png"
                      alt="Toddler wooden peg puzzle board animal shapes 2 years plus."
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-label-md text-label-md font-bold text-on-surface truncate">
                      Toddler Activity Puzzles
                    </p>
                    <p className="font-label-sm text-[11px] text-tertiary font-bold">Motor dexterity ready</p>
                    <span className="font-label-md text-label-md font-bold text-on-surface">₹449</span>
                  </div>
                  <button
                    type="button"
                    className="px-3 py-1.5 rounded-full bg-surface-container-high text-primary font-label-sm text-[12px] font-bold hover:bg-surface-container transition-colors cursor-pointer"
                    onClick={() => openSkyBot({ id: 4, name: "Toddler Activity Puzzles", price: 449 })}
                  >
                    View
                  </button>
                </div>

                <div className="flex items-center gap-3 p-2 rounded-xl bg-surface-container-low">
                  <div className="relative w-14 h-14 rounded-lg bg-surface-container overflow-hidden shrink-0">
                    <Image
                      src="/stitch-v2/img_b659a4d4fb.png"
                      alt="Toddler breathable rubber sole anti skid grip shoe."
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-label-md text-label-md font-bold text-on-surface truncate">
                      2Y High-Traction Grip Shoes
                    </p>
                    <p className="font-label-sm text-[11px] text-tertiary font-bold">Next Foot Size (EU 22)</p>
                    <span className="font-label-md text-label-md font-bold text-on-surface">₹599</span>
                  </div>
                  <button
                    type="button"
                    className="px-3 py-1.5 rounded-full bg-surface-container-high text-primary font-label-sm text-[12px] font-bold hover:bg-surface-container transition-colors cursor-pointer"
                    onClick={() => openSkyBot({ id: 5, name: "2Y Grip Shoes", price: 599 })}
                  >
                    View
                  </button>
                </div>

                <div className="flex items-center gap-3 p-2 rounded-xl bg-surface-container-low">
                  <div className="relative w-14 h-14 rounded-lg bg-surface-container overflow-hidden shrink-0">
                    <Image
                      src="/stitch-v2/img_f0c100324d.png"
                      alt="Soft silicone 360 degree toddler training toothbrush."
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-label-md text-label-md font-bold text-on-surface truncate">
                      Toddler Training Toothbrush
                    </p>
                    <p className="font-label-sm text-[11px] text-tertiary font-bold">Oral hygiene milestone</p>
                    <span className="font-label-md text-label-md font-bold text-on-surface">₹219</span>
                  </div>
                  <button
                    type="button"
                    className="px-3 py-1.5 rounded-full bg-surface-container-high text-primary font-label-sm text-[12px] font-bold hover:bg-surface-container transition-colors cursor-pointer"
                    onClick={() => openSkyBot({ id: 6, name: "Toddler Training Toothbrush", price: 219 })}
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
            <Link
              href="/age/2-4-years"
              className="font-label-md text-label-md text-primary font-bold hover:underline pt-3 flex items-center gap-1"
              data-path="age-2-4y"
            >
              <span>Explore 2 - 3 Years Collection</span>
              <Icon name="chevron_right" className="text-[16px]" />
            </Link>
          </div>
        </div>
      </section>

      {/* MOBILE PERSONALIZED SECTION (home_hub_skyb_india_mobile Section 6) */}
      <section data-section="personalized-mobile" className="w-full mt-6 block md:hidden">
        {/* Header with baby badge */}
        <div className="px-space-md flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center shadow-[0_2px_0_#87cff8]">
              <Icon name="face_2" className="text-primary text-[22px]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  For {childName}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-[11px] font-bold">
                  {childAgeLabel}
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Recommended for Toddler Milestone</p>
            </div>
          </div>
          <Link
            href="/profile"
            aria-label={`Edit ${childName}'s profile`}
            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-primary"
            data-path="user-profile"
          >
            <Icon name="tune" className="text-[18px]" />
          </Link>
        </div>

        {/* Buy Again / Quick Consumables Re-Order */}
        <div className="px-space-md mb-4">
          <div className="bg-surface-container-low rounded-2xl p-3 shadow-[0_3px_0_#d8e3fb]">
            <div className="flex items-center justify-between mb-2">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-bold flex items-center gap-1">
                <Icon name="restart_alt" className="text-[16px] text-primary" />
                <span>Buy Again / {childName}&apos;s Essentials</span>
              </span>
              <span className="font-label-sm text-[11px] text-primary font-bold">Frequently Bought</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {/* Item 1 */}
              <div className="bg-surface-container-lowest rounded-xl p-2.5 flex flex-col justify-between shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="relative w-11 h-11 rounded-lg bg-surface-container overflow-hidden shrink-0">
                    <Image
                      src="/stitch-v2/img_0021b3c1cf.png"
                      alt="Pure plant based bamboo wet wipes bundle on white backdrop."
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="font-label-sm text-[12px] font-bold text-on-surface truncate">Bamboo Wipes (3x)</p>
                    <p className="font-body-sm text-[11px] text-on-surface-variant">₹399</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="mt-2 w-full py-1 rounded-full bg-primary-fixed text-primary font-label-sm text-[11px] font-bold shadow-[0_2px_0_#87cff8] active:translate-y-[1px] active:shadow-none flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Icon name="add" className="text-[13px]" />
                  <span>Reorder</span>
                </button>
              </div>

              {/* Item 2 */}
              <div className="bg-surface-container-lowest rounded-xl p-2.5 flex flex-col justify-between shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="relative w-11 h-11 rounded-lg bg-surface-container overflow-hidden shrink-0">
                    <Image
                      src="/stitch-v2/img_990e35a0f5.png"
                      alt="Pack of organic cotton baby bibs in earthy neutral tones."
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="font-label-sm text-[12px] font-bold text-on-surface truncate">Absorbent Bandana</p>
                    <p className="font-body-sm text-[11px] text-on-surface-variant">₹249</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="mt-2 w-full py-1 rounded-full bg-primary-fixed text-primary font-label-sm text-[11px] font-bold shadow-[0_2px_0_#87cff8] active:translate-y-[1px] active:shadow-none flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Icon name="add" className="text-[13px]" />
                  <span>Reorder</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Grows With Child Suggestions Carousel */}
        <div className="px-space-md mb-2 flex items-center justify-between">
          <span className="font-label-md text-label-md text-on-surface font-bold flex items-center gap-1.5">
            <Icon name="trending_up" className="text-secondary text-[18px]" />
            <span>Grows With {childName} (Next Stage: 18-24M)</span>
          </span>
          <span className="font-body-sm text-body-sm text-outline">Swipe →</span>
        </div>
        <div className="flex gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory px-space-md py-1">
          {/* Stage Item 1 */}
          <div className="snap-start shrink-0 w-[200px] rounded-2xl bg-surface-container-lowest p-3 shadow-[0_3px_0_#e7eeff] flex flex-col justify-between">
            <div className="relative w-full h-28 rounded-xl bg-surface-container overflow-hidden mb-2">
              <Image
                src="/stitch-v2/img_8e3b4d007b.png"
                alt="Balance trike bicycle without pedals for 18-24 months toddlers in soft blue and wood finish."
                fill
                className="object-cover"
              />
            </div>
            <div>
              <span className="font-label-sm text-[10px] text-secondary font-bold uppercase tracking-wider">
                Gross Motor Skills
              </span>
              <h4 className="font-label-md text-label-md text-on-surface font-bold line-clamp-1">
                Indoor Mini Balance Trike
              </h4>
              <p className="font-headline-sm text-[16px] font-bold text-primary mt-1">₹1,899</p>
            </div>
            <button
              type="button"
              className="mt-2 w-full py-1.5 rounded-full bg-surface-container text-primary font-label-sm text-label-sm font-bold flex items-center justify-center gap-1 hover:bg-surface-container-high transition-colors cursor-pointer"
            >
              <span>Explore</span>
            </button>
          </div>

          {/* Stage Item 2 */}
          <div className="snap-start shrink-0 w-[200px] rounded-2xl bg-surface-container-lowest p-3 shadow-[0_3px_0_#e7eeff] flex flex-col justify-between">
            <div className="relative w-full h-28 rounded-xl bg-surface-container overflow-hidden mb-2">
              <Image
                src="/stitch-v2/img_a26592558e.png"
                alt="Ergonomic transition trainer cup with soft silicone spout and sturdy toddler handles in cheerful pastel mint color."
                fill
                className="object-cover"
              />
            </div>
            <div>
              <span className="font-label-sm text-[10px] text-primary font-bold uppercase tracking-wider">
                Self Feeding
              </span>
              <h4 className="font-label-md text-label-md text-on-surface font-bold line-clamp-1">
                360° Miracle Trainer Cup
              </h4>
              <p className="font-headline-sm text-[16px] font-bold text-primary mt-1">₹499</p>
            </div>
            <button
              type="button"
              className="mt-2 w-full py-1.5 rounded-full bg-surface-container text-primary font-label-sm text-label-sm font-bold flex items-center justify-center gap-1 hover:bg-surface-container-high transition-colors cursor-pointer"
            >
              <span>Explore</span>
            </button>
          </div>

          {/* Stage Item 3 */}
          <div className="snap-start shrink-0 w-[200px] rounded-2xl bg-surface-container-lowest p-3 shadow-[0_3px_0_#e7eeff] flex flex-col justify-between">
            <div className="relative w-full h-28 rounded-xl bg-surface-container overflow-hidden mb-2">
              <Image
                src="/stitch-v2/img_d4be3a5669.png"
                alt="Set of interactive tactile toddler board books featuring Indian animal sounds and textured touch-and-feel patches."
                fill
                className="object-cover"
              />
            </div>
            <div>
              <span className="font-label-sm text-[10px] text-tertiary-container font-bold uppercase tracking-wider">
                Early Speech
              </span>
              <h4 className="font-label-md text-label-md text-on-surface font-bold line-clamp-1">
                First Words &amp; Sounds Books
              </h4>
              <p className="font-headline-sm text-[16px] font-bold text-primary mt-1">₹650</p>
            </div>
            <button
              type="button"
              className="mt-2 w-full py-1.5 rounded-full bg-surface-container text-primary font-label-sm text-label-sm font-bold flex items-center justify-center gap-1 hover:bg-surface-container-high transition-colors cursor-pointer"
            >
              <span>Explore</span>
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default PersonalizedSection;
