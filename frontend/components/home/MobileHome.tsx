"use client";

import React from "react";
import Link from "next/link";
import Icon from "@/components/Icon";
import { useSkyBot } from "@/context/SkyBotContext";
import { ProductData } from "@/components/ProductCard";

export const MobileHero: React.FC = () => {
  return (
<section data-section="hero-mobile" className="w-full pt-2">
<div className="relative w-full">
<div className="flex gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory px-space-md scroll-smooth" id="hero-track">

<div className="snap-center shrink-0 w-[88vw] max-w-[340px] rounded-2xl bg-gradient-to-br from-primary-fixed via-surface-container to-surface-container-high p-space-md shadow-[0_4px_0_#bfc8ce] flex flex-col justify-between relative overflow-hidden">
<div className="absolute -right-4 -bottom-6 w-36 h-36 rounded-full bg-secondary-fixed/40 pointer-events-none"></div>
<div className="relative z-10">
<span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary text-on-secondary font-label-sm text-label-sm shadow-[0_2px_0_#720525] mb-2">
<span className="material-symbols-outlined text-[13px]">auto_awesome</span> Spring '25
            </span>
<h2 className="font-headline-lg-mobile text-headline-lg-mobile text-primary leading-tight font-bold pr-12">
              New Arrivals for Playful Explorers
            </h2>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
              Pure organic cotton &amp; sensory toys crafted for little hands.
            </p>
</div>
<div className="relative z-10 flex items-center justify-between mt-4">
<a className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-primary text-on-primary font-label-md text-label-md shadow-[0_4px_0_#001e2c] active:translate-y-[2px] active:shadow-[0_1px_0_#001e2c] transition-all" data-path="product-listing" href="#">
<span>Shop New Drops</span>
<span className="material-symbols-outlined text-[16px]">arrow_forward</span>
</a>
<div className="w-16 h-16 rounded-xl bg-surface-container-lowest/80 p-1 flex items-center justify-center shadow-sm">
<img className="w-full h-full object-cover rounded-lg" data-alt="Vibrant pastel stacking toy rings and organic cotton plush cloud rattle set against a soft light lilac backdrop with natural gentle morning sunlight, premium Indian baby toy styling, soft rounded edges." src="/stitch-v2/img_822765eea1.png"/>
</div>
</div>
</div>

<div className="snap-center shrink-0 w-[88vw] max-w-[340px] rounded-2xl bg-gradient-to-br from-tertiary-fixed via-surface-container-low to-surface-container p-space-md shadow-[0_4px_0_#bfc8ce] flex flex-col justify-between relative overflow-hidden">
<div className="absolute -right-4 -bottom-6 w-36 h-36 rounded-full bg-tertiary-fixed-dim/30 pointer-events-none"></div>
<div className="relative z-10">
<span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-tertiary text-on-tertiary font-label-sm text-label-sm shadow-[0_2px_0_#261a00] mb-2">
<span className="material-symbols-outlined text-[13px]">bolt</span> Monsoon Care
            </span>
<h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface leading-tight font-bold pr-12">
              Super Dry Bamboo Diapers &amp; Wipes
            </h2>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
              Zero rash guarantee • 100% biodegradable.
            </p>
</div>
<div className="relative z-10 flex items-center justify-between mt-4">
<a className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-tertiary-container text-on-tertiary-container font-label-md text-label-md shadow-[0_4px_0_#261a00] active:translate-y-[2px] active:shadow-[0_1px_0_#261a00] transition-all" data-path="product-listing" href="#">
<span>Grab 30% Off</span>
<span className="material-symbols-outlined text-[16px]">chevron_right</span>
</a>
<div className="w-16 h-16 rounded-xl bg-surface-container-lowest/80 p-1 flex items-center justify-center shadow-sm">
<img className="w-full h-full object-cover rounded-lg" data-alt="Eco-friendly bamboo baby diaper pack with cute cloud prints resting alongside natural herbal wipe dispenser on a warm wooden nursery shelf." src="/stitch-v2/img_46bcc0f7c4.png"/>
</div>
</div>
</div>
</div>

<div className="flex items-center justify-center gap-1.5 mt-2.5">
<span className="w-5 h-2 rounded-full bg-primary transition-all"></span>
<span className="w-2 h-2 rounded-full bg-surface-container-highest transition-all"></span>
</div>
</div>
</section>
  );
};

export const MobileAge: React.FC = () => {
  return (
<section data-section="age-mobile" className="w-full mt-4">
<div className="flex items-center justify-between px-space-md mb-2">
<div>
<h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Shop by Age</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant">Milestone-tailored picks</p>
</div>
<a className="font-label-md text-label-md text-primary flex items-center gap-0.5" data-path="category-browser" href="#">
<span>View all</span>
<span className="material-symbols-outlined text-[16px]">chevron_right</span>
</a>
</div>
<div className="flex gap-2.5 overflow-x-auto no-scrollbar px-space-md py-1">

<a className="shrink-0 flex items-center gap-2 px-3 py-2 rounded-2xl bg-surface-container-low text-on-surface shadow-[0_3px_0_#d8e3fb] active:translate-y-[1px] active:shadow-[0_1px_0_#d8e3fb] transition-all" href="#">
<div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-primary">
<span className="material-symbols-outlined text-[18px]">child_care</span>
</div>
<div className="flex flex-col">
<span className="font-label-sm text-label-sm font-bold leading-tight">Newborn</span>
<span className="font-body-sm text-[11px] text-on-surface-variant">0-3M</span>
</div>
</a>

<a className="shrink-0 flex items-center gap-2 px-3 py-2 rounded-2xl bg-surface-container-low text-on-surface shadow-[0_3px_0_#d8e3fb] active:translate-y-[1px] active:shadow-[0_1px_0_#d8e3fb] transition-all" href="#">
<div className="w-8 h-8 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary">
<span className="material-symbols-outlined text-[18px]">toys</span>
</div>
<div className="flex flex-col">
<span className="font-label-sm text-label-sm font-bold leading-tight">Infants</span>
<span className="font-body-sm text-[11px] text-on-surface-variant">3-12M</span>
</div>
</a>

<a className="shrink-0 flex items-center gap-2 px-3 py-2 rounded-2xl bg-primary-fixed text-primary font-bold shadow-[0_3px_0_#87cff8] active:translate-y-[1px] active:shadow-[0_1px_0_#87cff8] transition-all" href="#">
<div className="w-8 h-8 rounded-full bg-surface-container-lowest flex items-center justify-center text-primary">
<span className="material-symbols-outlined text-[18px]">directions_walk</span>
</div>
<div className="flex flex-col">
<span className="font-label-sm text-label-sm font-bold leading-tight">Toddlers</span>
<span className="font-body-sm text-[11px] text-on-primary-fixed-variant font-semibold">1-3Y</span>
</div>
</a>

<a className="shrink-0 flex items-center gap-2 px-3 py-2 rounded-2xl bg-surface-container-low text-on-surface shadow-[0_3px_0_#d8e3fb] active:translate-y-[1px] active:shadow-[0_1px_0_#d8e3fb] transition-all" href="#">
<div className="w-8 h-8 rounded-full bg-tertiary-fixed flex items-center justify-center text-tertiary">
<span className="material-symbols-outlined text-[18px]">sports_esports</span>
</div>
<div className="flex flex-col">
<span className="font-label-sm text-label-sm font-bold leading-tight">Explorers</span>
<span className="font-body-sm text-[11px] text-on-surface-variant">3-6Y</span>
</div>
</a>

<a className="shrink-0 flex items-center gap-2 px-3 py-2 rounded-2xl bg-surface-container-low text-on-surface shadow-[0_3px_0_#d8e3fb] active:translate-y-[1px] active:shadow-[0_1px_0_#d8e3fb] transition-all" href="#">
<div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-primary">
<span className="material-symbols-outlined text-[18px]">school</span>
</div>
<div className="flex flex-col">
<span className="font-label-sm text-label-sm font-bold leading-tight">Growing</span>
<span className="font-body-sm text-[11px] text-on-surface-variant">6-8Y</span>
</div>
</a>

<a className="shrink-0 flex items-center gap-2 px-3 py-2 rounded-2xl bg-surface-container-low text-on-surface shadow-[0_3px_0_#d8e3fb] active:translate-y-[1px] active:shadow-[0_1px_0_#d8e3fb] transition-all" href="#">
<div className="w-8 h-8 rounded-full bg-secondary-fixed-dim flex items-center justify-center text-secondary">
<span className="material-symbols-outlined text-[18px]">skateboarding</span>
</div>
<div className="flex flex-col">
<span className="font-label-sm text-label-sm font-bold leading-tight">Big Kids</span>
<span className="font-body-sm text-[11px] text-on-surface-variant">8+Y</span>
</div>
</a>
</div>
</section>
  );
};

export const MobileDeals: React.FC = () => {
  return (
<section data-section="deals-mobile" className="w-full mt-6">
<div className="flex items-center justify-between px-space-md mb-2.5">
<div className="flex items-center gap-2">
<span className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center">
<span className="material-symbols-outlined text-[20px]">local_fire_department</span>
</span>
<div>
<h3 className="font-headline-sm text-headline-sm text-on-surface font-bold leading-tight">Deals of the Day</h3>
<div className="flex items-center gap-1.5 mt-0.5">
<span className="font-label-sm text-[11px] px-2 py-0.5 rounded-full bg-error-container text-error font-bold flex items-center gap-1">
<span className="material-symbols-outlined text-[12px]">schedule</span> Ends in 06h:42m
            </span>
</div>
</div>
</div>
<a className="font-label-md text-label-md text-secondary font-bold" data-path="deals" href="#">See all</a>
</div>

<div className="flex gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory px-space-md py-1">

<div className="snap-start shrink-0 w-[240px] rounded-2xl bg-surface-container-lowest p-3 shadow-[0_4px_0_#e7eeff] flex flex-col justify-between">
<div className="relative w-full h-36 rounded-xl bg-surface-container overflow-hidden mb-2">
<img className="w-full h-full object-cover" data-alt="Silicone baby weaning set in soft pastel sage green, including suction bowl, adjustable bib, silicone cup, and baby-safe spoon neatly laid out on crisp clean surface." src="/stitch-v2/img_a4acb5e68b.png"/>
<span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-primary-fixed text-primary font-label-sm text-[10px] font-bold shadow-sm">
            BPA-Free
          </span>
<button aria-label="Add to wishlist" className="absolute top-2 right-2 w-7 h-7 rounded-full bg-surface-container-lowest/90 text-secondary flex items-center justify-center shadow-sm active:scale-90 transition-transform">
<span className="material-symbols-outlined text-[16px]">favorite_border</span>
</button>
</div>
<div>
<div className="flex items-center gap-1 mb-1">
<span className="material-symbols-outlined text-[14px] text-tertiary-fixed-dim" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
<span className="font-label-sm text-[11px] font-bold text-on-surface">4.8</span>
<span className="font-body-sm text-[11px] text-outline">(342)</span>
</div>
<h4 className="font-label-md text-label-md text-on-surface font-semibold line-clamp-2 leading-tight min-h-[36px]">
            Silicone Suction Feeding Set • Non-Slip Bib + Spoon
          </h4>
<div className="flex items-baseline gap-2 mt-1.5">
<span className="font-headline-sm text-headline-sm font-bold text-primary">₹449</span>
<span className="font-body-sm text-body-sm line-through text-outline">₹699</span>
<span className="font-label-sm text-label-sm text-secondary font-bold">36% off</span>
</div>
</div>
<div className="flex items-center gap-1.5 mt-3">
<button className="flex-1 py-1.5 px-2 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm shadow-[0_2px_0_#c49b14] flex items-center justify-center gap-1 active:translate-y-[1px] active:shadow-none" >
<span className="material-symbols-outlined text-[14px]">smart_toy</span>
<span>Bargain</span>
</button>
<button aria-label="Add to cart" className="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-[0_3px_0_#001e2c] active:translate-y-[1px] active:shadow-[0_1px_0_#001e2c]">
<span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
</button>
</div>
</div>

<div className="snap-start shrink-0 w-[240px] rounded-2xl bg-surface-container-lowest p-3 shadow-[0_4px_0_#e7eeff] flex flex-col justify-between">
<div className="relative w-full h-36 rounded-xl bg-surface-container overflow-hidden mb-2">
<img className="w-full h-full object-cover" data-alt="Set of 3 pastel organic cotton baby rompers with nickel-free snaps, cute zoo animal doodle print, laid flat with a wooden teething ring on a clean light nursery background." src="/stitch-v2/img_5689748072.png"/>
<span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-secondary-fixed text-secondary font-label-sm text-[10px] font-bold shadow-sm">
            100% Cotton
          </span>
<button aria-label="Add to wishlist" className="absolute top-2 right-2 w-7 h-7 rounded-full bg-surface-container-lowest/90 text-secondary flex items-center justify-center shadow-sm active:scale-90 transition-transform">
<span className="material-symbols-outlined text-[16px]">favorite_border</span>
</button>
</div>
<div>
<div className="flex items-center gap-1 mb-1">
<span className="material-symbols-outlined text-[14px] text-tertiary-fixed-dim" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
<span className="font-label-sm text-[11px] font-bold text-on-surface">4.9</span>
<span className="font-body-sm text-[11px] text-outline">(512)</span>
</div>
<h4 className="font-label-md text-label-md text-on-surface font-semibold line-clamp-2 leading-tight min-h-[36px]">
            Organic Cotton Snap Onesies (Pack of 3)
          </h4>
<div className="flex items-baseline gap-2 mt-1.5">
<span className="font-headline-sm text-headline-sm font-bold text-primary">₹599</span>
<span className="font-body-sm text-body-sm line-through text-outline">₹999</span>
<span className="font-label-sm text-label-sm text-secondary font-bold">40% off</span>
</div>
</div>
<div className="flex items-center gap-1.5 mt-3">
<button className="flex-1 py-1.5 px-2 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm shadow-[0_2px_0_#c49b14] flex items-center justify-center gap-1 active:translate-y-[1px] active:shadow-none" >
<span className="material-symbols-outlined text-[14px]">smart_toy</span>
<span>Bargain</span>
</button>
<button aria-label="Add to cart" className="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-[0_3px_0_#001e2c] active:translate-y-[1px] active:shadow-[0_1px_0_#001e2c]">
<span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
</button>
</div>
</div>

<div className="snap-start shrink-0 w-[240px] rounded-2xl bg-surface-container-lowest p-3 shadow-[0_4px_0_#e7eeff] flex flex-col justify-between">
<div className="relative w-full h-36 rounded-xl bg-surface-container overflow-hidden mb-2">
<img className="w-full h-full object-cover" data-alt="Chunky natural wooden animal puzzle with rounded chunky pegs for toddler motor skills development, displayed with gentle shadows on a sky-blue playmat." src="/stitch-v2/img_cc583f8a98.png"/>
<span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-tertiary-fixed text-tertiary font-label-sm text-[10px] font-bold shadow-sm">
            BIS Certified
          </span>
<button aria-label="Add to wishlist" className="absolute top-2 right-2 w-7 h-7 rounded-full bg-surface-container-lowest/90 text-secondary flex items-center justify-center shadow-sm active:scale-90 transition-transform">
<span className="material-symbols-outlined text-[16px]">favorite_border</span>
</button>
</div>
<div>
<div className="flex items-center gap-1 mb-1">
<span className="material-symbols-outlined text-[14px] text-tertiary-fixed-dim" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
<span className="font-label-sm text-[11px] font-bold text-on-surface">4.7</span>
<span className="font-body-sm text-[11px] text-outline">(189)</span>
</div>
<h4 className="font-label-md text-label-md text-on-surface font-semibold line-clamp-2 leading-tight min-h-[36px]">
            Montessori Chunky Wooden Safari Peg Puzzle
          </h4>
<div className="flex items-baseline gap-2 mt-1.5">
<span className="font-headline-sm text-headline-sm font-bold text-primary">₹389</span>
<span className="font-body-sm text-body-sm line-through text-outline">₹549</span>
<span className="font-label-sm text-label-sm text-secondary font-bold">29% off</span>
</div>
</div>
<div className="flex items-center gap-1.5 mt-3">
<button className="flex-1 py-1.5 px-2 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm shadow-[0_2px_0_#c49b14] flex items-center justify-center gap-1 active:translate-y-[1px] active:shadow-none" >
<span className="material-symbols-outlined text-[14px]">smart_toy</span>
<span>Bargain</span>
</button>
<button aria-label="Add to cart" className="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-[0_3px_0_#001e2c] active:translate-y-[1px] active:shadow-[0_1px_0_#001e2c]">
<span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
</button>
</div>
</div>
</div>
</section>
  );
};

export const MobileCategories: React.FC = () => {
  return (
<section data-section="categories-mobile" className="w-full px-space-md mt-6">
<div className="flex items-center justify-between mb-3">
<div>
<h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Shop by Category</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant">Carefully curated essentials</p>
</div>
<a className="font-label-md text-label-md text-primary font-bold" data-path="category-browser" href="#">See 14+</a>
</div>
<div className="grid grid-cols-2 gap-3">

<a className="p-3 rounded-2xl bg-surface-container-lowest shadow-[0_4px_0_#d8e3fb] active:translate-y-[2px] active:shadow-[0_1px_0_#d8e3fb] transition-all flex flex-col justify-between" data-path="category-browser" href="#">
<div>
<h4 className="font-headline-sm text-[16px] text-on-surface font-bold leading-snug">Toys &amp; STEM</h4>
<p className="font-body-sm text-[11px] text-primary font-bold mb-2 flex items-center gap-0.5">
            Shop now <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
</p>
</div>
<div className="grid grid-cols-2 gap-1.5 aspect-square rounded-xl overflow-hidden bg-surface-container p-1">
<img className="w-full h-full object-cover rounded-lg" data-alt="Colorful wooden building blocks for toddlers on white studio backdrop." src="/stitch-v2/img_e0b0192802.png"/>
<img className="w-full h-full object-cover rounded-lg" data-alt="Silicone teething rattle ball in pastel colors, safe BPA free." src="/stitch-v2/img_912a9ddb52.png"/>
<img className="w-full h-full object-cover rounded-lg" data-alt="Mini sensory push popper toy for motor skill learning in kids." src="/stitch-v2/img_57d41f7c44.png"/>
<img className="w-full h-full object-cover rounded-lg" data-alt="Chunky plastic toy car with rounded safety edges in sky blue." src="/stitch-v2/img_07e970c038.png"/>
</div>
</a>

<a className="p-3 rounded-2xl bg-surface-container-lowest shadow-[0_4px_0_#d8e3fb] active:translate-y-[2px] active:shadow-[0_1px_0_#d8e3fb] transition-all flex flex-col justify-between" data-path="category-browser" href="#">
<div>
<h4 className="font-headline-sm text-[16px] text-on-surface font-bold leading-snug">Footwear</h4>
<p className="font-body-sm text-[11px] text-primary font-bold mb-2 flex items-center gap-0.5">
            Shop now <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
</p>
</div>
<div className="grid grid-cols-2 gap-1.5 aspect-square rounded-xl overflow-hidden bg-surface-container p-1">
<img className="w-full h-full object-cover rounded-lg" data-alt="Soft fleece lined infant pre-walker booties in cream white." src="/stitch-v2/img_6aab851bbe.png"/>
<img className="w-full h-full object-cover rounded-lg" data-alt="Toddler breathable slip-on mesh shoes with non-slip flexible sole." src="/stitch-v2/img_b5c259511b.png"/>
<img className="w-full h-full object-cover rounded-lg" data-alt="Anti-skid grip ankle socks for babies in cute animal designs." src="/stitch-v2/img_3d46a9217e.png"/>
<img className="w-full h-full object-cover rounded-lg" data-alt="Soft rubber water sandals for toddlers in coral pink." src="/stitch-v2/img_513e74b58d.png"/>
</div>
</a>

<a className="p-3 rounded-2xl bg-surface-container-lowest shadow-[0_4px_0_#d8e3fb] active:translate-y-[2px] active:shadow-[0_1px_0_#d8e3fb] transition-all flex flex-col justify-between" data-path="category-browser" href="#">
<div>
<h4 className="font-headline-sm text-[16px] text-on-surface font-bold leading-snug">Diapering</h4>
<p className="font-body-sm text-[11px] text-primary font-bold mb-2 flex items-center gap-0.5">
            Shop now <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
</p>
</div>
<div className="grid grid-cols-2 gap-1.5 aspect-square rounded-xl overflow-hidden bg-surface-container p-1">
<img className="w-full h-full object-cover rounded-lg" data-alt="Eco-friendly bamboo disposable diaper tape pack on white background." src="/stitch-v2/img_6a14be5ced.png"/>
<img className="w-full h-full object-cover rounded-lg" data-alt="99 percent pure water baby wipes flip-top pack." src="/stitch-v2/img_ee6b84f3eb.png"/>
<img className="w-full h-full object-cover rounded-lg" data-alt="Zinc oxide soothing diaper rash cream tube for gentle baby skin." src="/stitch-v2/img_8973fde4cf.png"/>
<img className="w-full h-full object-cover rounded-lg" data-alt="Reusable waterproof cloth diaper with snaps in modern pastel print." src="/stitch-v2/img_7c7e4f0b56.png"/>
</div>
</a>

<a className="p-3 rounded-2xl bg-surface-container-lowest shadow-[0_4px_0_#d8e3fb] active:translate-y-[2px] active:shadow-[0_1px_0_#d8e3fb] transition-all flex flex-col justify-between" data-path="category-browser" href="#">
<div>
<h4 className="font-headline-sm text-[16px] text-on-surface font-bold leading-snug">Feeding</h4>
<p className="font-body-sm text-[11px] text-primary font-bold mb-2 flex items-center gap-0.5">
            Shop now <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
</p>
</div>
<div className="grid grid-cols-2 gap-1.5 aspect-square rounded-xl overflow-hidden bg-surface-container p-1">
<img className="w-full h-full object-cover rounded-lg" data-alt="Anti-colic glass baby feeding bottle with ergonomic handles." src="/stitch-v2/img_163b962847.png"/>
<img className="w-full h-full object-cover rounded-lg" data-alt="Silicone baby weaning fruit feeder pacifier in mint green." src="/stitch-v2/img_f6e9e97827.png"/>
<img className="w-full h-full object-cover rounded-lg" data-alt="Stainless steel insulated toddler straw sippy cup with straw cleaner." src="/stitch-v2/img_f4084c3973.png"/>
<img className="w-full h-full object-cover rounded-lg" data-alt="Catch-all deep pocket silicone baby bib in butter yellow." src="/stitch-v2/img_af2c2fea9c.png"/>
</div>
</a>

<a className="p-3 rounded-2xl bg-surface-container-lowest shadow-[0_4px_0_#d8e3fb] active:translate-y-[2px] active:shadow-[0_1px_0_#d8e3fb] transition-all flex flex-col justify-between" data-path="category-browser" href="#">
<div>
<h4 className="font-headline-sm text-[16px] text-on-surface font-bold leading-snug">Bath &amp; Care</h4>
<p className="font-body-sm text-[11px] text-primary font-bold mb-2 flex items-center gap-0.5">
            Shop now <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
</p>
</div>
<div className="grid grid-cols-2 gap-1.5 aspect-square rounded-xl overflow-hidden bg-surface-container p-1">
<img className="w-full h-full object-cover rounded-lg" data-alt="Tear-free ayurvedic baby body wash and shampoo bottle with pump dispenser." src="/stitch-v2/img_1c5003d4a8.png"/>
<img className="w-full h-full object-cover rounded-lg" data-alt="Organic virgin coconut baby massage oil bottle on wooden surface." src="/stitch-v2/img_334ce127a5.png"/>
<img className="w-full h-full object-cover rounded-lg" data-alt="Ultra plush hooded baby bath towel with bear ears in cream color." src="/stitch-v2/img_fbbed1a078.png"/>
<img className="w-full h-full object-cover rounded-lg" data-alt="Natural konjac baby bath sponge soft and damp." src="/stitch-v2/img_fdae562452.png"/>
</div>
</a>

<a className="p-3 rounded-2xl bg-surface-container-lowest shadow-[0_4px_0_#d8e3fb] active:translate-y-[2px] active:shadow-[0_1px_0_#d8e3fb] transition-all flex flex-col justify-between" data-path="category-browser" href="#">
<div>
<h4 className="font-headline-sm text-[16px] text-on-surface font-bold leading-snug">Nursery &amp; Sleep</h4>
<p className="font-body-sm text-[11px] text-primary font-bold mb-2 flex items-center gap-0.5">
            Shop now <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
</p>
</div>
<div className="grid grid-cols-2 gap-1.5 aspect-square rounded-xl overflow-hidden bg-surface-container p-1">
<img className="w-full h-full object-cover rounded-lg" data-alt="Breathable organic muslin swaddle blanket with subtle star constellations print." src="/stitch-v2/img_c1723a2f7b.png"/>
<img className="w-full h-full object-cover rounded-lg" data-alt="Cute portable rechargeable silicone warm night lamp in happy cloud shape." src="/stitch-v2/img_1cf123a143.png"/>
<img className="w-full h-full object-cover rounded-lg" data-alt="Cotton fitted crib mattress sheet in gender-neutral sky blue stripe." src="/stitch-v2/img_a184739141.png"/>
<img className="w-full h-full object-cover rounded-lg" data-alt="Baby white noise sound machine with soft nightlight glow." src="/stitch-v2/img_dcb67d257f.png"/>
</div>
</a>
</div>
</section>
  );
};

export const MobileSkyBot: React.FC = () => {
  return (
<section data-section="skybot-promo-mobile" className="w-full px-space-md mt-6">
<div className="rounded-2xl bg-gradient-to-r from-tertiary-fixed via-tertiary-fixed-dim/70 to-surface-container-high p-space-md shadow-[0_4px_0_#c49b14] flex items-center justify-between gap-3 relative overflow-hidden">
<div className="flex items-center gap-3">
<div className="w-12 h-12 rounded-2xl bg-surface-container-lowest text-tertiary flex items-center justify-center shadow-md shrink-0">
<span className="material-symbols-outlined text-[28px]">smart_toy</span>
</div>
<div>
<div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-tertiary text-on-tertiary font-label-sm text-[10px] font-bold mb-0.5">
            AI Assistant
          </div>
<h4 className="font-headline-sm text-[17px] text-on-surface font-bold leading-tight">
            Want to negotiate custom deals?
          </h4>
<p className="font-body-sm text-[12px] text-on-surface-variant leading-tight mt-0.5">
            Bargain with SkyBot for baby bundle savings!
          </p>
</div>
</div>
<button className="shrink-0 px-3.5 py-2 rounded-full bg-primary text-on-primary font-label-sm text-label-sm shadow-[0_3px_0_#001e2c] active:translate-y-[2px] active:shadow-none transition-all flex items-center gap-1" >
<span>Chat</span>
<span className="material-symbols-outlined text-[15px]">send</span>
</button>
</div>
</section>
  );
};

export const MobilePersonalized: React.FC = () => {
  return (
<section data-section="personalized-mobile" className="w-full mt-6">

<div className="px-space-md flex items-center justify-between mb-3">
<div className="flex items-center gap-2">
<div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center shadow-[0_2px_0_#87cff8]">
<span className="material-symbols-outlined text-primary text-[22px]">face_2</span>
</div>
<div>
<div className="flex items-center gap-1.5">
<h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">For Aarav</h3>
<span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-[11px] font-bold">
              18 Months
            </span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant">Recommended for Toddler Milestone</p>
</div>
</div>
<a aria-label="Edit Aarav's profile" className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-primary" data-path="user-profile" href="#">
<span className="material-symbols-outlined text-[18px]">tune</span>
</a>
</div>

<div className="px-space-md mb-4">
<div className="bg-surface-container-low rounded-2xl p-3 shadow-[0_3px_0_#d8e3fb]">
<div className="flex items-center justify-between mb-2">
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-bold flex items-center gap-1">
<span className="material-symbols-outlined text-[16px] text-primary">restart_alt</span> Buy Again / Aarav's Essentials
          </span>
<span className="font-label-sm text-[11px] text-primary font-bold">Frequently Bought</span>
</div>
<div className="grid grid-cols-2 gap-2">

<div className="bg-surface-container-lowest rounded-xl p-2.5 flex flex-col justify-between shadow-sm">
<div className="flex items-center gap-2">
<div className="w-11 h-11 rounded-lg bg-surface-container overflow-hidden shrink-0">
<img className="w-full h-full object-cover" data-alt="Pure plant based bamboo wet wipes bundle on white backdrop." src="/stitch-v2/img_0021b3c1cf.png"/>
</div>
<div className="min-w-0">
<p className="font-label-sm text-[12px] font-bold text-on-surface truncate">Bamboo Wipes (3x)</p>
<p className="font-body-sm text-[11px] text-on-surface-variant">₹399</p>
</div>
</div>
<button className="mt-2 w-full py-1 rounded-full bg-primary-fixed text-primary font-label-sm text-[11px] font-bold shadow-[0_2px_0_#87cff8] active:translate-y-[1px] active:shadow-none flex items-center justify-center gap-1">
<span className="material-symbols-outlined text-[13px]">add</span> Reorder
            </button>
</div>

<div className="bg-surface-container-lowest rounded-xl p-2.5 flex flex-col justify-between shadow-sm">
<div className="flex items-center gap-2">
<div className="w-11 h-11 rounded-lg bg-surface-container overflow-hidden shrink-0">
<img className="w-full h-full object-cover" data-alt="Pack of organic cotton baby bibs in earthy neutral tones." src="/stitch-v2/img_990e35a0f5.png"/>
</div>
<div className="min-w-0">
<p className="font-label-sm text-[12px] font-bold text-on-surface truncate">Absorbent Bandana</p>
<p className="font-body-sm text-[11px] text-on-surface-variant">₹249</p>
</div>
</div>
<button className="mt-2 w-full py-1 rounded-full bg-primary-fixed text-primary font-label-sm text-[11px] font-bold shadow-[0_2px_0_#87cff8] active:translate-y-[1px] active:shadow-none flex items-center justify-center gap-1">
<span className="material-symbols-outlined text-[13px]">add</span> Reorder
            </button>
</div>
</div>
</div>
</div>

<div className="px-space-md mb-2 flex items-center justify-between">
<span className="font-label-md text-label-md text-on-surface font-bold flex items-center gap-1.5">
<span className="material-symbols-outlined text-secondary text-[18px]">trending_up</span> Grows With Aarav (Next Stage: 18-24M)
      </span>
<span className="font-body-sm text-body-sm text-outline">Swipe →</span>
</div>
<div className="flex gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory px-space-md py-1">

<div className="snap-start shrink-0 w-[200px] rounded-2xl bg-surface-container-lowest p-3 shadow-[0_3px_0_#e7eeff] flex flex-col justify-between">
<div className="w-full h-28 rounded-xl bg-surface-container overflow-hidden mb-2">
<img className="w-full h-full object-cover" data-alt="Balance trike bicycle without pedals for 18-24 months toddlers in soft blue and wood finish." src="/stitch-v2/img_8e3b4d007b.png"/>
</div>
<div>
<span className="font-label-sm text-[10px] text-secondary font-bold uppercase tracking-wider">Gross Motor Skills</span>
<h4 className="font-label-md text-label-md text-on-surface font-bold line-clamp-1">Indoor Mini Balance Trike</h4>
<p className="font-headline-sm text-[16px] font-bold text-primary mt-1">₹1,899</p>
</div>
<button className="mt-2 w-full py-1.5 rounded-full bg-surface-container text-primary font-label-sm text-label-sm font-bold flex items-center justify-center gap-1 hover:bg-surface-container-high transition-colors">
<span>Explore</span>
</button>
</div>

<div className="snap-start shrink-0 w-[200px] rounded-2xl bg-surface-container-lowest p-3 shadow-[0_3px_0_#e7eeff] flex flex-col justify-between">
<div className="w-full h-28 rounded-xl bg-surface-container overflow-hidden mb-2">
<img className="w-full h-full object-cover" data-alt="Ergonomic transition trainer cup with soft silicone spout and sturdy toddler handles in cheerful pastel mint color." src="/stitch-v2/img_a26592558e.png"/>
</div>
<div>
<span className="font-label-sm text-[10px] text-primary font-bold uppercase tracking-wider">Self Feeding</span>
<h4 className="font-label-md text-label-md text-on-surface font-bold line-clamp-1">360° Miracle Trainer Cup</h4>
<p className="font-headline-sm text-[16px] font-bold text-primary mt-1">₹499</p>
</div>
<button className="mt-2 w-full py-1.5 rounded-full bg-surface-container text-primary font-label-sm text-label-sm font-bold flex items-center justify-center gap-1 hover:bg-surface-container-high transition-colors">
<span>Explore</span>
</button>
</div>

<div className="snap-start shrink-0 w-[200px] rounded-2xl bg-surface-container-lowest p-3 shadow-[0_3px_0_#e7eeff] flex flex-col justify-between">
<div className="w-full h-28 rounded-xl bg-surface-container overflow-hidden mb-2">
<img className="w-full h-full object-cover" data-alt="Set of interactive tactile toddler board books featuring Indian animal sounds and textured touch-and-feel patches." src="/stitch-v2/img_d4be3a5669.png"/>
</div>
<div>
<span className="font-label-sm text-[10px] text-tertiary-container font-bold uppercase tracking-wider">Early Speech</span>
<h4 className="font-label-md text-label-md text-on-surface font-bold line-clamp-1">First Words &amp; Sounds Books</h4>
<p className="font-headline-sm text-[16px] font-bold text-primary mt-1">₹650</p>
</div>
<button className="mt-2 w-full py-1.5 rounded-full bg-surface-container text-primary font-label-sm text-label-sm font-bold flex items-center justify-center gap-1 hover:bg-surface-container-high transition-colors">
<span>Explore</span>
</button>
</div>
</div>
</section>
  );
};

export const MobileBestsellers: React.FC = () => {
  return (
<section data-section="bestsellers-mobile" className="w-full mt-6">
<div className="flex items-center justify-between px-space-md mb-2.5">
<div>
<h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">skyB Bestsellers</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant">Loved by 45,000+ happy parents</p>
</div>
<a className="font-label-md text-label-md text-primary font-bold" data-path="bestsellers" href="#">See all</a>
</div>
<div className="flex gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory px-space-md py-1">

<div className="snap-start shrink-0 w-[210px] rounded-2xl bg-surface-container-lowest p-3 shadow-[0_4px_0_#e7eeff] flex flex-col justify-between">
<div className="relative w-full h-32 rounded-xl bg-surface-container overflow-hidden mb-2">
<img className="w-full h-full object-cover" data-alt="Ultra soft baby sleepsuit in pastel clouds motif with two-way zipper and foldover mitten cuffs laid on pure white muslin." src="/stitch-v2/img_994a92a807.png"/>
<span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-primary text-on-primary font-label-sm text-[10px] font-bold shadow-sm">
            #1 Best
          </span>
</div>
<div>
<h4 className="font-label-md text-label-md text-on-surface font-semibold line-clamp-1">Two-Way Zip Sleepsuit</h4>
<p className="font-body-sm text-[12px] text-on-surface-variant">100% GOTS Cotton</p>
<div className="flex items-baseline gap-2 mt-1">
<span className="font-headline-sm text-headline-sm font-bold text-primary">₹599</span>
<span className="font-body-sm text-body-sm line-through text-outline">₹899</span>
</div>
</div>
<button className="mt-3 w-full py-1.5 rounded-full bg-primary text-on-primary font-label-sm text-label-sm shadow-[0_3px_0_#001e2c] active:translate-y-[1px] active:shadow-none flex items-center justify-center gap-1.5">
<span className="material-symbols-outlined text-[15px]">shopping_bag</span> Add to Cart
        </button>
</div>

<div className="snap-start shrink-0 w-[210px] rounded-2xl bg-surface-container-lowest p-3 shadow-[0_4px_0_#e7eeff] flex flex-col justify-between">
<div className="relative w-full h-32 rounded-xl bg-surface-container overflow-hidden mb-2">
<img className="w-full h-full object-cover" data-alt="Duo pack waterproof food-grade silicone baby bibs with deep crumb catchers in soft terracotta and sage green colors." src="/stitch-v2/img_7d654c2536.png"/>
<span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-secondary text-on-secondary font-label-sm text-[10px] font-bold shadow-sm">
            Top Rated
          </span>
</div>
<div>
<h4 className="font-label-md text-label-md text-on-surface font-semibold line-clamp-1">Silicone Bib Duo Set</h4>
<p className="font-body-sm text-[12px] text-on-surface-variant">Dishwasher Safe • BPA Free</p>
<div className="flex items-baseline gap-2 mt-1">
<span className="font-headline-sm text-headline-sm font-bold text-primary">₹329</span>
<span className="font-body-sm text-body-sm line-through text-outline">₹499</span>
</div>
</div>
<button className="mt-3 w-full py-1.5 rounded-full bg-primary text-on-primary font-label-sm text-label-sm shadow-[0_3px_0_#001e2c] active:translate-y-[1px] active:shadow-none flex items-center justify-center gap-1.5">
<span className="material-symbols-outlined text-[15px]">shopping_bag</span> Add to Cart
        </button>
</div>

<div className="snap-start shrink-0 w-[210px] rounded-2xl bg-surface-container-lowest p-3 shadow-[0_4px_0_#e7eeff] flex flex-col justify-between">
<div className="relative w-full h-32 rounded-xl bg-surface-container overflow-hidden mb-2">
<img className="w-full h-full object-cover" data-alt="Pack of four colorful toddler anti-slip non-skid socks with honeycomb silicone soles, arranged cleanly on light blue surface." src="/stitch-v2/img_a09d06a465.png"/>
<span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-tertiary-container text-on-tertiary-container font-label-sm text-[10px] font-bold shadow-sm">
            Value Pack
          </span>
</div>
<div>
<h4 className="font-label-md text-label-md text-on-surface font-semibold line-clamp-1">Gripper Socks (Pack of 4)</h4>
<p className="font-body-sm text-[12px] text-on-surface-variant">Extra Stretch Anti-Skid</p>
<div className="flex items-baseline gap-2 mt-1">
<span className="font-headline-sm text-headline-sm font-bold text-primary">₹249</span>
<span className="font-body-sm text-body-sm line-through text-outline">₹399</span>
</div>
</div>
<button className="mt-3 w-full py-1.5 rounded-full bg-primary text-on-primary font-label-sm text-label-sm shadow-[0_3px_0_#001e2c] active:translate-y-[1px] active:shadow-none flex items-center justify-center gap-1.5">
<span className="material-symbols-outlined text-[15px]">shopping_bag</span> Add to Cart
        </button>
</div>
</div>
</section>
  );
};

export const MobileUnder499: React.FC = () => {
  return (
<section data-section="under-499-mobile" className="w-full px-space-md mt-6">
<div className="bg-gradient-to-br from-surface-container via-surface-container-low to-primary-fixed/30 rounded-2xl p-space-md shadow-[0_4px_0_#bfc8ce]">
<div className="flex items-center justify-between mb-3">
<div className="flex items-center gap-2">
<div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-headline-sm text-headline-sm font-bold shadow-sm">
            ₹
          </div>
<div>
<h3 className="font-headline-sm text-headline-sm text-on-surface font-bold leading-tight">Under ₹499 Corner</h3>
<p className="font-body-sm text-[12px] text-on-surface-variant">Pocket-friendly daily essentials</p>
</div>
</div>
<a className="font-label-sm text-label-sm text-primary font-bold" href="#">View all</a>
</div>
<div className="grid grid-cols-3 gap-2">

<a className="bg-surface-container-lowest rounded-xl p-2 text-center shadow-sm flex flex-col items-center" href="#">
<div className="w-16 h-16 rounded-lg bg-surface-container overflow-hidden mb-1.5">
<img className="w-full h-full object-cover" data-alt="Natural beechwood teether ring with silicone beads in soft pastel mint and white." src="/stitch-v2/img_913db33465.png"/>
</div>
<span className="font-label-sm text-[11px] font-bold text-on-surface truncate w-full">Wood Teether</span>
<span className="font-headline-sm text-[13px] font-bold text-primary mt-0.5">₹199</span>
</a>

<a className="bg-surface-container-lowest rounded-xl p-2 text-center shadow-sm flex flex-col items-center" href="#">
<div className="w-16 h-16 rounded-lg bg-surface-container overflow-hidden mb-1.5">
<img className="w-full h-full object-cover" data-alt="Muslin burp cloth pack 3 pieces in gender neutral stars print." src="/stitch-v2/img_4e8653f4ba.png"/>
</div>
<span className="font-label-sm text-[11px] font-bold text-on-surface truncate w-full">Burp Cloths</span>
<span className="font-headline-sm text-[13px] font-bold text-primary mt-0.5">₹299</span>
</a>

<a className="bg-surface-container-lowest rounded-xl p-2 text-center shadow-sm flex flex-col items-center" href="#">
<div className="w-16 h-16 rounded-lg bg-surface-container overflow-hidden mb-1.5">
<img className="w-full h-full object-cover" data-alt="Bath squeeze soft animal floating toys BPA free set of 4." src="/stitch-v2/img_2ac42df991.png"/>
</div>
<span className="font-label-sm text-[11px] font-bold text-on-surface truncate w-full">Bath Squirtees</span>
<span className="font-headline-sm text-[13px] font-bold text-primary mt-0.5">₹349</span>
</a>
</div>
</div>
</section>
  );
};

export const MobileSafety: React.FC = () => {
  return (
<section data-section="safety-picks-mobile" className="w-full px-space-md mt-6">
<div className="flex items-center justify-between mb-3">
<div className="flex items-center gap-2">
<span className="w-8 h-8 rounded-full bg-surface-container text-primary flex items-center justify-center">
<span className="material-symbols-outlined text-[20px]">verified_user</span>
</span>
<div>
<h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Safety-First Certified</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant">Lab-tested • BIS India compliant</p>
</div>
</div>
<a className="font-label-sm text-label-sm text-primary font-bold" href="#">Certificates</a>
</div>
<div className="grid grid-cols-2 gap-3">

<div className="bg-surface-container-lowest rounded-2xl p-3 shadow-[0_4px_0_#e7eeff] flex flex-col justify-between">
<div className="w-full h-28 rounded-xl bg-surface-container overflow-hidden mb-2 relative">
<img className="w-full h-full object-cover" data-alt="Safe rounded edge organic wooden rocking horse toy with certified BIS compliance mark label in soft natural playroom setting." src="/stitch-v2/img_9ccc17f408.png"/>
<span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-primary text-on-primary font-label-sm text-[10px] font-bold">
            BIS Safe Toys
          </span>
</div>
<h4 className="font-label-md text-label-md text-on-surface font-bold line-clamp-1">Natural Wood Rocker</h4>
<p className="font-body-sm text-[12px] text-on-surface-variant">Lead &amp; Phthalate Free</p>
<div className="flex items-center justify-between mt-2 pt-2 bg-surface-container-low rounded-xl px-2 py-1">
<span className="font-headline-sm text-[15px] font-bold text-primary">₹2,499</span>
<span className="font-label-sm text-[10px] text-tertiary-container font-bold flex items-center">
<span className="material-symbols-outlined text-[13px]">shield</span> 100% Safe
          </span>
</div>
</div>

<div className="bg-surface-container-lowest rounded-2xl p-3 shadow-[0_4px_0_#e7eeff] flex flex-col justify-between">
<div className="w-full h-28 rounded-xl bg-surface-container overflow-hidden mb-2 relative">
<img className="w-full h-full object-cover" data-alt="Medical-grade silicone manual breast pump with soft suction cushion and ergonomic handle on clean light marble." src="/stitch-v2/img_1429d93484.png"/>
<span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-secondary text-on-secondary font-label-sm text-[10px] font-bold">
            FDA Approved
          </span>
</div>
<h4 className="font-label-md text-label-md text-on-surface font-bold line-clamp-1">Comfort Silicone Pump</h4>
<p className="font-body-sm text-[12px] text-on-surface-variant">100% Food-Grade Silicone</p>
<div className="flex items-center justify-between mt-2 pt-2 bg-surface-container-low rounded-xl px-2 py-1">
<span className="font-headline-sm text-[15px] font-bold text-primary">₹899</span>
<span className="font-label-sm text-[10px] text-tertiary-container font-bold flex items-center">
<span className="material-symbols-outlined text-[13px]">shield</span> 100% Safe
          </span>
</div>
</div>
</div>
</section>
  );
};

export const MobileNewborn: React.FC = () => {
  return (
<section data-section="newborn-checklist-mobile" className="w-full px-space-md mt-6">
<div className="rounded-2xl bg-gradient-to-r from-secondary-fixed/50 via-surface-container-high to-primary-fixed/40 p-space-md shadow-[0_4px_0_#bfc8ce] flex items-center justify-between gap-3 relative overflow-hidden">
<div>
<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary text-on-secondary font-label-sm text-[10px] font-bold mb-1">
<span className="material-symbols-outlined text-[12px]">checklist</span> Essential Guide
        </span>
<h3 className="font-headline-sm text-headline-sm text-on-surface font-bold leading-tight">
          Expecting Soon?
        </h3>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
          Explore Hospital Bag &amp; 0-3M Checklist
        </p>
<a className="inline-flex items-center gap-1 mt-2.5 px-3 py-1.5 rounded-full bg-surface-container-lowest text-primary font-label-sm text-label-sm shadow-[0_2px_0_#bfc8ce] active:translate-y-[1px] active:shadow-none font-bold" href="#">
<span>Download Free PDF</span>
<span className="material-symbols-outlined text-[15px]">arrow_forward</span>
</a>
</div>
<div className="w-20 h-20 rounded-2xl bg-surface-container-lowest/80 p-1.5 shadow-sm shrink-0 flex items-center justify-center">
<img className="w-full h-full object-cover rounded-xl" data-alt="Neatly packed diaper bag with organic newborn clothes, diapers, swaddle blanket and baby care bottles ready for the maternity hospital trip." src="/stitch-v2/img_5626f622c6.png"/>
</div>
</div>
</section>
  );
};

export interface MobileHomeProps {
  isFixture?: boolean;
  topDeals?: ProductData[];
  newArrivals?: ProductData[];
  under499?: ProductData[];
  bestsellers?: ProductData[];
  safetyPicks?: ProductData[];
  user?: any;
  childProfile?: any;
  loading?: boolean;
}

export const MobileHome: React.FC<MobileHomeProps> = ({
  isFixture = false,
  topDeals = [],
  newArrivals = [],
  under499 = [],
  bestsellers = [],
  safetyPicks = [],
  user = null,
  childProfile = null,
  loading = false,
}) => {
  const showBestsellers = isFixture || bestsellers.length >= 4;
  const showPersonalized = isFixture || (Boolean(user) && Boolean(childProfile));

  return (
    <div className="flex md:hidden flex-col w-full pb-8 overflow-hidden">
      <MobileHero />
      <MobileAge />
      <MobileDeals />
      <MobileCategories />
      <MobileSkyBot />
      {showPersonalized && <MobilePersonalized />}
      {showBestsellers && <MobileBestsellers />}
      <MobileUnder499 />
      <MobileSafety />
      <MobileNewborn />
    </div>
  );
};

export default MobileHome;
