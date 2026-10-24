"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import Icon from "@/components/Icon";

interface NewbornChecklistBannerProps {
  isFixture?: boolean;
}

export const NewbornChecklistBanner: React.FC<NewbornChecklistBannerProps> = ({ isFixture = false }) => {
  return (
    <>
      {/* DESKTOP BANNER (home_restyled_locked_candy Section 10) */}
      <section data-section="newborn-checklist" className="w-full px-4 lg:px-margin-desktop py-6 hidden md:block">
        <div className="relative w-full rounded-xl overflow-hidden shadow-[0_6px_0_#d8e3fb] bg-gradient-to-r from-surface-container-high via-primary-fixed to-surface-bright p-6 sm:p-10 lg:p-12">
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-lowest text-primary shadow-[0_2px_0_#d8e3fb]">
                <Icon name="checklist" className="text-[18px]" />
                <span className="font-label-sm text-label-sm uppercase tracking-wider font-extrabold">
                  Parenting Made Calm
                </span>
              </div>
              <h2 className="font-headline-lg lg:font-display-lg text-headline-lg lg:text-display-lg text-on-surface font-extrabold tracking-tight">
                Expecting or Prepping for Baby? Explore the Comprehensive New Born Checklist
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Zero panic shopping. Every medical and comfort requirement organized by seasoned Indian paediatricians and experienced parents.
              </p>
              {/* Checkpoints Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-surface-container-lowest/80 backdrop-blur shadow-[0_2px_0_#d8e3fb]">
                  <Icon name="medical_services" className="text-secondary text-[22px]" />
                  <div className="leading-tight">
                    <p className="font-label-md text-label-md font-bold text-on-surface">Hospital Bag</p>
                    <p className="font-label-sm text-[11px] text-on-surface-variant">Labor to homecoming</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-surface-container-lowest/80 backdrop-blur shadow-[0_2px_0_#d8e3fb]">
                  <Icon name="bed" className="text-primary text-[22px]" />
                  <div className="leading-tight">
                    <p className="font-label-md text-label-md font-bold text-on-surface">0-3M Nursery</p>
                    <p className="font-label-sm text-[11px] text-on-surface-variant">Cot, swaddle, sheets</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-surface-container-lowest/80 backdrop-blur shadow-[0_2px_0_#d8e3fb]">
                  <Icon name="soap" className="text-tertiary text-[22px]" />
                  <div className="leading-tight">
                    <p className="font-label-md text-label-md font-bold text-on-surface">First Bath Kit</p>
                    <p className="font-label-sm text-[11px] text-on-surface-variant">Gentle oils &amp; sponge</p>
                  </div>
                </div>
              </div>
              <div className="pt-3">
                <Link
                  href="/newborn-checklist"
                  className="px-7 py-3.5 rounded-full bg-primary text-on-primary font-label-lg text-label-lg font-bold shadow-[0_4px_0_#001e2c] active:translate-y-1 active:shadow-[0_1px_0_#001e2c] transition-all inline-flex items-center gap-2"
                  data-path="newborn-checklist"
                >
                  <span>View New Born Checklist &amp; Bundles</span>
                  <Icon name="arrow_forward" className="text-[20px]" />
                </Link>
              </div>
            </div>
            <div className="w-full lg:w-4/12 flex justify-center">
              <div className="relative w-full max-w-sm h-72 rounded-xl overflow-hidden shadow-[0_8px_0_#d8e3fb] bg-surface-container-lowest">
                <Image
                  src="/stitch-v2/img_f0a0294b84.png"
                  alt="Charming hospital delivery bag packed with pastel baby bodysuits, organic swaddle blankets, mild wipes, and wooden rattle in a serene airy nursery."
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-lg bg-surface-container-lowest/95 backdrop-blur flex items-center justify-between">
                  <span className="font-label-sm text-label-sm font-bold text-on-surface">
                    Starter Bundles from ₹1,299
                  </span>
                  <Icon name="local_mall" className="text-primary text-[20px]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MOBILE BANNER (home_hub_skyb_india_mobile Section 10) */}
      <section data-section="newborn-checklist-mobile" className="w-full px-space-md mt-6 block md:hidden">
        <div className="rounded-2xl bg-gradient-to-r from-secondary-fixed/50 via-surface-container-high to-primary-fixed/40 p-space-md shadow-[0_4px_0_#bfc8ce] flex items-center justify-between gap-3 relative overflow-hidden">
          <div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary text-on-secondary font-label-sm text-[10px] font-bold mb-1">
              <Icon name="checklist" className="text-[12px]" />
              <span>Essential Guide</span>
            </span>
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold leading-tight">
              Expecting Soon?
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
              Explore Hospital Bag &amp; 0-3M Checklist
            </p>
            <Link
              href="/newborn-checklist"
              className="inline-flex items-center gap-1 mt-2.5 px-3 py-1.5 rounded-full bg-surface-container-lowest text-primary font-label-sm text-label-sm shadow-[0_2px_0_#bfc8ce] active:translate-y-[1px] active:shadow-none font-bold"
            >
              <span>Explore Checklist</span>
              <Icon name="arrow_forward" className="text-[15px]" />
            </Link>
          </div>
          <div className="relative w-20 h-20 rounded-2xl bg-surface-container-lowest/80 p-1.5 shadow-sm shrink-0 flex items-center justify-center overflow-hidden">
            <Image
              src="/stitch-v2/img_5626f622c6.png"
              alt="Neatly packed diaper bag with organic newborn clothes, diapers, swaddle blanket and baby care bottles ready for the maternity hospital trip."
              fill
              className="object-cover rounded-xl"
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default NewbornChecklistBanner;
