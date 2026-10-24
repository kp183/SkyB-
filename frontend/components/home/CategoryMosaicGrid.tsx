"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import Icon from "@/components/Icon";
import { FIXTURE_DATA } from "./fixtureData";

interface MosaicTile {
  title: string;
  image: string;
  href: string;
}

interface DepartmentCardData {
  title: string;
  subtitle: string;
  categorySlug: string;
  linkText: string;
  items: MosaicTile[];
}

interface CategoryMosaicGridProps {
  isFixture?: boolean;
  realData?: DepartmentCardData[];
}

export const CategoryMosaicGrid: React.FC<CategoryMosaicGridProps> = ({
  isFixture = false,
  realData = [],
}) => {
  // If fixture mode, format from FIXTURE_DATA
  const cards: DepartmentCardData[] = isFixture || realData.length === 0
    ? (FIXTURE_DATA.departments as unknown as any[]).map((dept: any) => {
        // Map data-path to slug
        let slug: string = dept.linkPath || "toys";
        if (slug.includes("-") && slug !== "bath-skincare" && slug !== "health-safety") {
          slug = slug.split("-")[0];
        }

        return {
          title: dept.title,
          subtitle: dept.subtitle,
          categorySlug: slug,
          linkText: dept.linkText || `Shop ${dept.title}`,
          items: (dept.items || []).map((it: any) => ({
            title: it.title,
            image: it.img,
            href: `/category/${slug}`,
          })),
        };
      })
    : realData;

  return (
    <section data-section="categories" className="w-full px-4 lg:px-margin-desktop py-6">
      <div className="mb-5 flex flex-col sm:flex-row items-baseline justify-between gap-1">
        <div>
          <h2 className="font-headline-md text-headline-md font-bold text-on-surface">
            Curated Baby &amp; Kids Department Stores
          </h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Tap inside any category quadrant for direct verified essentials
          </p>
        </div>
        <span className="font-label-sm text-label-sm text-primary font-bold">
          Pan-India express dispatch
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((card, cardIdx) => (
          <div
            key={card.categorySlug || cardIdx}
            className="p-4 rounded-xl bg-surface-container-lowest shadow-[0_4px_0_#d8e3fb] flex flex-col justify-between"
          >
            <div>
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                {card.title}
              </h3>
              <p className="font-body-sm text-[12px] text-on-surface-variant mb-3">
                {card.subtitle}
              </p>
              <div className="grid grid-cols-2 gap-2 mb-3">
                {card.items.slice(0, 4).map((item, itemIdx) => (
                  <Link
                    key={itemIdx}
                    href={item.href}
                    className="group flex flex-col bg-surface-container-low p-2 rounded-xl text-center"
                  >
                    <div className="relative w-full h-24 rounded-lg overflow-hidden mb-1.5 bg-surface-container">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="(max-width: 640px) 45vw, (max-width: 1024px) 22vw, 12vw"
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <span className="font-label-sm text-label-sm font-bold text-on-surface truncate">
                      {item.title}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
            <Link
              href={`/category/${card.categorySlug}`}
              className="font-label-md text-label-md text-primary font-bold hover:underline flex items-center gap-1 pt-1"
            >
              <span>{card.linkText}</span>
              <Icon name="chevron_right" className="text-[16px]" />
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategoryMosaicGrid;
