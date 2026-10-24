"use client";

import React, { useRef } from "react";
import Link from "next/link";
import Icon from "@/components/Icon";
import ProductCard, { ProductData } from "@/components/ProductCard";

interface ProductRowProps {
  id: string;
  dataSection: string;
  icon: string;
  iconBg?: string;
  title: string;
  subtitle: string;
  tagText?: string;
  tagClass?: string;
  viewAllHref?: string;
  products: ProductData[];
  isGrid?: boolean;
  loading?: boolean;
  isFixture?: boolean;
  fixtureCards?: any[];
}

export const ProductRow: React.FC<ProductRowProps> = ({
  id,
  dataSection,
  icon,
  iconBg = "bg-primary-fixed text-primary",
  title,
  subtitle,
  tagText,
  tagClass = "bg-primary text-on-primary",
  viewAllHref,
  products = [],
  isGrid = false,
  loading = false,
  isFixture = false,
  fixtureCards = [],
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (offset: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  // If not fixture and no products while not loading, hide row
  if (!isFixture && !loading && products.length === 0) {
    return null;
  }

  return (
    <section data-section={dataSection} className="w-full px-4 lg:px-margin-desktop py-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-[0_2px_0_#d8e3fb] ${iconBg}`}
          >
            <Icon name={icon} className="text-[22px]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-headline-md text-headline-md font-bold text-on-surface">
                {title}
              </h2>
              {tagText && (
                <span
                  className={`px-2.5 py-0.5 rounded-full font-label-sm text-[11px] font-bold ${tagClass}`}
                >
                  {tagText}
                </span>
              )}
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              {subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="font-label-md text-label-md text-primary font-bold hover:underline hidden sm:flex items-center gap-0.5 mr-2"
            >
              <span>See all</span>
              <Icon name="chevron_right" className="text-[16px]" />
            </Link>
          )}
          {!isGrid && (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                aria-label={`Scroll ${title} Left`}
                className="w-10 h-10 rounded-full bg-surface-container-lowest text-primary shadow-[0_3px_0_#d8e3fb] hover:bg-surface-container flex items-center justify-center transition-all cursor-pointer"
                onClick={() => handleScroll(-320)}
              >
                <Icon name="arrow_back" className="text-[20px]" />
              </button>
              <button
                type="button"
                aria-label={`Scroll ${title} Right`}
                className="w-10 h-10 rounded-full bg-surface-container-lowest text-primary shadow-[0_3px_0_#d8e3fb] hover:bg-surface-container flex items-center justify-center transition-all cursor-pointer"
                onClick={() => handleScroll(320)}
              >
                <Icon name="arrow_forward" className="text-[20px]" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Skeletons when loading */}
      {loading ? (
        <div className="flex gap-4 overflow-hidden py-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="min-w-[280px] h-[360px] rounded-xl bg-surface-container-low animate-pulse p-4"
            />
          ))}
        </div>
      ) : isGrid ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {isFixture && fixtureCards.length > 0
            ? fixtureCards.map((card, idx) => (
                <article
                  key={idx}
                  className="product-card group relative rounded-xl bg-surface-container-lowest border border-surface-container p-3 sm:p-4 flex flex-col justify-between transition-transform duration-200 hover:-translate-y-1 shadow-[0_4px_0_#d8e3fb]"
                >
                  <div>
                    <div className="relative w-full aspect-square rounded-xl bg-surface-container-low overflow-hidden mb-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={card.img}
                        alt={card.title}
                        className="w-full h-full object-cover"
                      />
                      {card.badge && (
                        <span className="absolute top-2 left-2 bg-primary text-on-primary font-label-sm text-[11px] px-2.5 py-1 rounded-full font-bold shadow-[0_2px_0_#001e2c]">
                          {card.badge}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 mb-1">
                      <Icon name="star" className="text-tertiary-fixed-dim text-[16px]" />
                      <span className="font-label-sm text-label-sm font-extrabold text-on-surface">
                        {card.rating || "4.8"}
                      </span>
                      {card.spec && (
                        <span className="text-outline text-[12px] truncate">
                          {card.spec}
                        </span>
                      )}
                    </div>
                    <h3 className="font-label-lg text-label-lg font-bold text-on-surface leading-snug line-clamp-2 min-h-[44px]">
                      {card.title}
                    </h3>
                    {card.desc && (
                      <p className="font-body-sm text-[12px] text-on-surface-variant mt-1 line-clamp-1">
                        {card.desc}
                      </p>
                    )}
                  </div>
                  <div className="pt-3 border-t border-surface-container-low mt-2 space-y-3">
                    <div className="flex items-baseline gap-2">
                      <span className="font-headline-sm text-headline-sm font-bold text-on-surface">
                        {card.price ? (String(card.price).startsWith("₹") ? card.price : `₹${card.price}`) : "₹499"}
                      </span>
                      {card.mrp && (
                        <span className="font-body-sm text-body-sm text-outline line-through">
                          {String(card.mrp).startsWith("₹") ? card.mrp : `₹${card.mrp}`}
                        </span>
                      )}
                      {card.discount && (
                        <span className="font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-bold">
                          {card.discount}
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        className="btn-bargain-action px-2 py-2 rounded-full font-label-sm text-[12px] font-bold flex items-center justify-center gap-1 cursor-pointer select-none"
                      >
                        <Icon name="smart_toy" className="w-4 h-4" />
                        <span>Bargain</span>
                      </button>
                      <button
                        type="button"
                        className="btn-add-action px-2 py-2 rounded-full font-label-sm text-[12px] font-bold flex items-center justify-center gap-1 cursor-pointer select-none"
                      >
                        <Icon name="shopping_bag" className="w-4 h-4" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                </article>
              ))
            : products.map((prod, idx) => (
                <ProductCard key={prod.id} product={prod} index={idx} />
              ))}
        </div>
      ) : (
        <div
          ref={scrollRef}
          id={id}
          className="flex gap-4 overflow-x-auto no-scrollbar py-2 scroll-smooth"
        >
          {isFixture && fixtureCards.length > 0
            ? fixtureCards.map((card, idx) => {
                const shadowClasses = ["card-shadow-blue", "card-shadow-pink", "card-shadow-yellow"];
                const shadow = shadowClasses[idx % shadowClasses.length];
                return (
                  <div
                    key={idx}
                    className={`min-w-[280px] max-w-[280px] p-3 rounded-xl bg-surface-container-lowest shadow-[0_4px_0_#d8e3fb] flex flex-col justify-between shrink-0 ${shadow}`}
                  >
                    <div>
                      <div className="relative w-full h-44 rounded-lg overflow-hidden bg-surface-container mb-2.5">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={card.img}
                          alt={card.title}
                          className="w-full h-full object-cover"
                        />
                        {card.badge && (
                          <span className="absolute top-2 left-2 bg-primary text-on-primary font-label-sm text-[11px] px-2.5 py-0.5 rounded-full font-bold">
                            {card.badge}
                          </span>
                        )}
                        <button
                          type="button"
                          aria-label="Add to wishlist"
                          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-surface-container-lowest/90 text-on-surface-variant hover:text-secondary flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <Icon name="favorite" className="text-[18px]" />
                        </button>
                      </div>
                      <div className="flex items-center gap-1 mb-1">
                        <Icon name="star" className="text-tertiary-fixed-dim text-[16px]" />
                        <span className="font-label-sm text-label-sm font-extrabold text-on-surface">
                          {card.rating || "4.8"}
                        </span>
                        {card.spec && (
                          <span className="text-outline text-[12px] truncate">
                            {card.spec}
                          </span>
                        )}
                      </div>
                      <h4 className="font-label-lg text-label-lg font-bold text-on-surface line-clamp-2 leading-snug">
                        {card.title}
                      </h4>
                    </div>
                    <div className="pt-3">
                      <div className="flex items-baseline gap-2 mb-3">
                        <span className="font-headline-sm text-headline-sm font-bold text-on-surface">
                          {card.price ? (String(card.price).startsWith("₹") ? card.price : `₹${card.price}`) : "₹499"}
                        </span>
                        {card.mrp && (
                          <span className="font-body-sm text-body-sm text-outline line-through">
                            {String(card.mrp).startsWith("₹") ? card.mrp : `₹${card.mrp}`}
                          </span>
                        )}
                        {card.discount && (
                          <span className="font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-bold">
                            {card.discount}
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          className="btn-bargain-action px-2 py-2 rounded-full font-label-sm text-[12px] font-bold flex items-center justify-center gap-1 cursor-pointer select-none"
                        >
                          <Icon name="smart_toy" className="text-[16px]" />
                          <span>Bargain</span>
                        </button>
                        <button
                          type="button"
                          className="btn-add-action px-2 py-2 rounded-full font-label-sm text-[12px] font-bold flex items-center justify-center gap-1 cursor-pointer select-none"
                        >
                          <Icon name="shopping_bag" className="text-[16px]" />
                          <span>Add</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            : products.map((prod, idx) => (
                <div key={prod.id} className="min-w-[280px] max-w-[280px] shrink-0">
                  <ProductCard product={prod} index={idx} />
                </div>
              ))}
        </div>
      )}
    </section>
  );
};

export default ProductRow;
