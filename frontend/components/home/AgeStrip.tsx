"use client";

import React from "react";
import Link from "next/link";
import Icon from "@/components/Icon";

interface AgeStripProps {
  isFixture?: boolean;
  childProfile?: { name: string; birth_date?: string } | null;
}

export const AgeStrip: React.FC<AgeStripProps> = ({ isFixture = false, childProfile = null }) => {
  // If user has child profile, determine if child is in 1-2 Y milestone (or similar)
  let toddlerSubtext = "Toddler Steps";
  if (isFixture) {
    toddlerSubtext = "Aarav's Age!";
  } else if (childProfile?.name) {
    toddlerSubtext = `${childProfile.name}'s Age!`;
  }

  const agePills = [
    {
      name: "New Born",
      sub: "0 - 30 Days",
      icon: "crib",
      href: "/age/new-born",
      bg: "bg-primary-fixed text-primary shadow-[0_2px_0_#87cff8]",
    },
    {
      name: "0-6 M",
      sub: "Sensory Discovery",
      icon: "child_care",
      href: "/age/0-3-months",
      bg: "bg-secondary-fixed text-secondary shadow-[0_2px_0_#ffb2b9]",
    },
    {
      name: "6-12 M",
      sub: "First Crawls & Solids",
      icon: "toys",
      href: "/age/6-9-months",
      bg: "bg-tertiary-fixed text-tertiary shadow-[0_2px_0_#f9bd26]",
    },
    {
      name: "1-2 Y",
      sub: toddlerSubtext,
      icon: "directions_walk",
      href: "/age/12-18-months",
      bg: "bg-surface-container-high text-primary shadow-[0_2px_0_#bfc8ce]",
    },
    {
      name: "2-4 Y",
      sub: "Preschool Play",
      icon: "pest_control_rodent",
      href: "/age/2-4-years",
      bg: "bg-primary-fixed text-primary shadow-[0_2px_0_#87cff8]",
    },
    {
      name: "4-6 Y",
      sub: "STEM & Activity",
      icon: "school",
      href: "/age/4-6-years",
      bg: "bg-secondary-fixed text-secondary shadow-[0_2px_0_#ffb2b9]",
    },
    {
      name: "6-8 Y",
      sub: "Active Outdoor",
      icon: "sports_soccer",
      href: "/age/6-8-years",
      bg: "bg-tertiary-fixed text-tertiary shadow-[0_2px_0_#f9bd26]",
    },
    {
      name: "8+ Y",
      sub: "Tween Learning",
      icon: "psychology",
      href: "/age/8-plus-years",
      bg: "bg-surface-container-high text-primary shadow-[0_2px_0_#bfc8ce]",
    },
  ];

  return (
    <section data-section="age" className="w-full px-4 lg:px-margin-desktop py-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-headline-md text-headline-md font-bold text-on-surface">
            Shop by Age &amp; Milestones
          </h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Carefully pre-sorted by developmental readiness &amp; standard Indian baby sizing
          </p>
        </div>
        <Link
          href="/age/new-born"
          className="font-label-md text-label-md text-primary font-bold hover:underline hidden sm:flex items-center gap-1"
          data-path="age-all"
        >
          <span>All Age Guides</span>
          <Icon name="chevron_right" className="text-[16px]" />
        </Link>
      </div>

      {/* Milestone Pills Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {agePills.map((pill) => (
          <Link
            key={pill.name}
            href={pill.href}
            className="group flex flex-col items-center justify-center p-3 rounded-xl bg-surface-container-lowest shadow-[0_4px_0_#d8e3fb] hover:shadow-[0_6px_0_#cfdaf2] hover:-translate-y-0.5 active:translate-y-1 active:shadow-[0_1px_0_#cfdaf2] transition-all text-center"
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform mb-2 ${pill.bg}`}
            >
              <Icon name={pill.icon} className="text-[24px]" />
            </div>
            <span className="font-label-md text-label-md font-bold text-on-surface">
              {pill.name}
            </span>
            <span className="font-label-sm text-[11px] text-on-surface-variant truncate max-w-full px-1">
              {pill.sub}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default AgeStrip;
