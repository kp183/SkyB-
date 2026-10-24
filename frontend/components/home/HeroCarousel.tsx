"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import Icon from "@/components/Icon";

interface HeroCarouselProps {
  isFixture?: boolean;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ isFixture = false }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 3;
  const touchStartX = useRef<number | null>(null);

  // Auto-advance slides every 6 seconds unless in fixture mode
  useEffect(() => {
    if (isFixture) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 6000);
    return () => clearInterval(timer);
  }, [isFixture]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % totalSlides);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 40) nextSlide();
    else if (diff < -40) prevSlide();
    touchStartX.current = null;
  };

  return (
    <section data-section="hero" className="w-full px-4 lg:px-margin-desktop py-4">
      <div
        className="relative w-full rounded-xl overflow-hidden shadow-[0_6px_0_#d8e3fb] bg-surface-container-low"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Carousel Slider Container */}
        <div
          className="flex w-full transition-transform duration-500 ease-out"
          id="hero-slides-wrapper"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {/* Slide 1: New Arrivals */}
          <div className="min-w-full flex flex-col lg:flex-row items-center justify-between p-6 sm:p-10 lg:p-14 bg-gradient-to-br from-primary-fixed via-surface-container-low to-surface-bright relative hero-banner-custom">
            <div className="flex-1 max-w-xl space-y-4 z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-lowest text-primary shadow-[0_2px_0_#d8e3fb]">
                <Icon name="temp_preferences_custom" className="text-[18px]" />
                <span className="font-label-sm text-label-sm uppercase tracking-wider font-extrabold">
                  {isFixture ? "Fresh Milestone Drops" : "New Arrivals Showcase"}
                </span>
              </div>
              <h1 className="font-headline-lg lg:font-display-lg text-headline-lg lg:text-display-lg text-on-surface font-extrabold tracking-tight">
                New Arrivals for{" "}
                <span className="text-primary underline decoration-primary-fixed-dim decoration-4 underline-offset-4">
                  Playful Explorers
                </span>
              </h1>
              <p className="font-body-md text-body-md text-on-surface-variant">
                {isFixture
                  ? "Thoughtfully curated organic cotton staples, chemical-free wooden Montessori sets, and ergonomic nursery must-haves calibrated for modern Indian homes."
                  : "Thoughtfully curated play sets, comfortable cotton essentials, and nursery must-haves calibrated for modern Indian homes."}
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/deals?tab=new"
                  className="px-6 py-3 rounded-full bg-primary text-on-primary font-label-md text-label-md font-bold shadow-[0_4px_0_#001e2c] active:translate-y-1 active:shadow-[0_1px_0_#001e2c] transition-all flex items-center gap-2"
                  data-path="new-arrivals"
                >
                  <span>Explore New In</span>
                  <Icon name="arrow_forward" className="text-[18px]" />
                </Link>
                {isFixture ? (
                  <Link
                    href="/category/clothing"
                    className="px-5 py-3 rounded-full bg-surface-container-lowest text-primary font-label-md text-label-md font-bold shadow-[0_3px_0_#d8e3fb] hover:bg-surface-container transition-all"
                    data-path="spring-drops"
                  >
                    Browse Spring Drops
                  </Link>
                ) : (
                  <Link
                    href="/category/toys"
                    className="px-5 py-3 rounded-full bg-surface-container-lowest text-primary font-label-md text-label-md font-bold shadow-[0_3px_0_#d8e3fb] hover:bg-surface-container transition-all"
                    data-path="all-toys"
                  >
                    Explore Toys &amp; Games
                  </Link>
                )}
              </div>
            </div>
            <div className="relative w-full lg:w-5/12 mt-8 lg:mt-0 flex items-center justify-center">
              <div className="relative w-full max-w-md h-64 sm:h-80 rounded-xl overflow-hidden shadow-[0_8px_0_#d8e3fb] bg-surface-container-lowest">
                <Image
                  src="/stitch-v2/img_1c1a6cc5d2.png"
                  alt="Joyful child playing with educational wooden toys"
                  fill
                  priority
                  className="w-full h-full object-cover"
                  sizes="(max-width: 1024px) 100vw, 42vw"
                />
                <div className="absolute bottom-3 left-3 bg-surface-container-lowest/95 backdrop-blur px-3 py-1.5 rounded-full flex items-center gap-2 shadow-[0_2px_0_#d8e3fb]">
                  <Icon name="verified" className="text-primary text-[18px]" />
                  <span className="font-label-sm text-label-sm text-on-surface font-bold">
                    Safety info on every product
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Slide 2: Shop By Age */}
          <div className="min-w-full flex flex-col lg:flex-row items-center justify-between p-6 sm:p-10 lg:p-14 bg-gradient-to-br from-surface-container-highest via-surface-container-low to-tertiary-fixed relative">
            <div className="flex-1 max-w-xl space-y-4 z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed shadow-[0_2px_0_#795900]">
                <Icon name="child_care" className="text-[18px]" />
                <span className="font-label-sm text-label-sm uppercase tracking-wider font-extrabold">
                  Developmental Stages
                </span>
              </div>
              <h2 className="font-headline-lg lg:font-display-lg text-headline-lg lg:text-display-lg text-on-surface font-extrabold tracking-tight">
                Shop by Age:{" "}
                <span className="text-tertiary underline decoration-tertiary-fixed-dim decoration-4 underline-offset-4">
                  Calibrated Milestones
                </span>
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                {isFixture
                  ? "From delicate umbilical cords and first crawlers to curious school beginners (0–8+ years), every stage receives vetted gear, safe materials, and verified sizes."
                  : "From newborns and first crawlers to curious school beginners (0–8+ years), every stage receives curated gear, safe materials, and standard sizes."}
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/age/6-9-months"
                  className="px-6 py-3 rounded-full bg-tertiary text-on-tertiary font-label-md text-label-md font-bold shadow-[0_4px_0_#261a00] active:translate-y-1 active:shadow-[0_1px_0_#261a00] transition-all flex items-center gap-2"
                  data-path="age-landing"
                >
                  <span>Find Your Child&apos;s Fit</span>
                  <Icon name="verified_user" className="text-[18px]" />
                </Link>
                <span className="px-4 py-2.5 rounded-full bg-surface-container-lowest text-on-surface-variant font-label-sm text-label-sm">
                  0M to 8+ Years Categorized
                </span>
              </div>
            </div>
            <div className="relative w-full lg:w-5/12 mt-8 lg:mt-0 flex items-center justify-center">
              <div className="relative w-full max-w-md h-64 sm:h-80 rounded-xl overflow-hidden shadow-[0_8px_0_#d8e3fb] bg-surface-container-lowest">
                <Image
                  src="/stitch-v2/img_e1498c7b0b.png"
                  alt="Milestone growth stages arrangement with developmental toys"
                  fill
                  className="w-full h-full object-cover"
                  sizes="(max-width: 1024px) 100vw, 42vw"
                />
                <div className="absolute top-3 right-3 bg-secondary text-on-secondary px-3 py-1 rounded-full font-label-sm text-label-sm font-bold shadow-[0_2px_0_#720525]">
                  Milestone Matched
                </div>
              </div>
            </div>
          </div>

          {/* Slide 3: Deals of the Day / Top Deals */}
          <div className="min-w-full flex flex-col lg:flex-row items-center justify-between p-6 sm:p-10 lg:p-14 bg-gradient-to-br from-secondary-fixed via-surface-container to-surface-bright relative">
            <div className="flex-1 max-w-xl space-y-4 z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-on-secondary shadow-[0_2px_0_#720525]">
                <Icon name="bolt" className="text-[18px]" />
                <span className="font-label-sm text-label-sm uppercase tracking-wider font-extrabold">
                  {isFixture ? "Flash Savings in ₹ INR" : "Special Savings in ₹ INR"}
                </span>
              </div>
              <h2 className="font-headline-lg lg:font-display-lg text-headline-lg lg:text-display-lg text-on-surface font-extrabold tracking-tight">
                {isFixture ? "Deals of the Day: " : "Top Deals: "}
                <span className="text-secondary underline decoration-secondary-fixed-dim decoration-4 underline-offset-4">
                  {isFixture ? "Save up to 45%" : "Curated Catalog Offers"}
                </span>
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                {isFixture
                  ? "Everyday family replenishment essentials at direct parent-friendly prices. No hidden charges, verified brand warranties, and instant bot negotiation ready."
                  : "Everyday family replenishment essentials at direct parent-friendly prices. No hidden charges and instant bot negotiation ready."}
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/deals"
                  className="px-6 py-3 rounded-full bg-secondary text-on-secondary font-label-md text-label-md font-bold shadow-[0_4px_0_#720525] active:translate-y-1 active:shadow-[0_1px_0_#720525] transition-all flex items-center gap-2"
                  data-path="deals"
                >
                  <span>{isFixture ? "Grab Lightning Deals" : "Explore Top Deals"}</span>
                  <Icon name="local_mall" className="text-[18px]" />
                </Link>
                {isFixture ? (
                  <>
                    <div className="px-3 py-2 rounded-full bg-surface-container-lowest text-secondary font-label-sm text-label-sm font-bold flex items-center gap-1 shadow-[0_2px_0_#d8e3fb]">
                      <Icon name="timer" className="text-[16px]" />
                      <span>Ends Midnight</span>
                    </div>
                    <span className="px-3 py-2 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-bold">
                      Flat 45% Off Consumables
                    </span>
                  </>
                ) : (
                  <div className="px-4 py-2.5 rounded-full bg-surface-container-lowest text-secondary font-label-sm text-label-sm font-extrabold flex items-center gap-1.5 shadow-[0_2px_0_#d8e3fb]">
                    <Icon name="savings" className="text-[16px]" />
                    <span>15%+ Catalog Savings</span>
                  </div>
                )}
              </div>
            </div>
            <div className="relative w-full lg:w-5/12 mt-8 lg:mt-0 flex items-center justify-center">
              <div className="relative w-full max-w-md h-64 sm:h-80 rounded-xl overflow-hidden shadow-[0_8px_0_#d8e3fb] bg-surface-container-lowest">
                <Image
                  src="/stitch-v2/img_03f1eef913.png"
                  alt="Daily care essentials flatlay"
                  fill
                  className="w-full h-full object-cover"
                  sizes="(max-width: 1024px) 100vw, 42vw"
                />
                <div className="absolute bottom-3 right-3 bg-primary text-on-primary px-3 py-1 rounded-full font-label-sm text-label-sm font-bold">
                  {isFixture ? "100% Non-Toxic" : "Top Catalog Savings"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Nav Arrows (Desktop) */}
        <button
          type="button"
          aria-label="Previous Slide"
          className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-surface-container-lowest/90 hover:bg-surface-container-lowest text-primary shadow-[0_3px_0_#d8e3fb] flex items-center justify-center active:translate-y-px transition-all cursor-pointer"
          onClick={prevSlide}
        >
          <Icon name="arrow_back" className="text-[24px]" />
        </button>
        <button
          type="button"
          aria-label="Next Slide"
          className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-surface-container-lowest/90 hover:bg-surface-container-lowest text-primary shadow-[0_3px_0_#d8e3fb] flex items-center justify-center active:translate-y-px transition-all cursor-pointer"
          onClick={nextSlide}
        >
          <Icon name="arrow_forward" className="text-[24px]" />
        </button>

        {/* Dots Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-surface-container-lowest/80 backdrop-blur px-3 py-1.5 rounded-full shadow-[0_2px_0_#d8e3fb]">
          {[0, 1, 2].map((idx) => (
            <button
              key={idx}
              type="button"
              aria-label={`Slide ${idx + 1}`}
              className={
                currentSlide === idx
                  ? "w-8 h-3 rounded-full bg-primary transition-all duration-300 shadow-[0_2px_0_#001e2c]"
                  : "w-3 h-3 rounded-full bg-surface-variant hover:bg-outline-variant transition-all duration-300"
              }
              onClick={() => setCurrentSlide(idx)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroCarousel;
