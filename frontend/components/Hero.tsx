import Image from "next/image";
import Link from "next/link";
import Icon from "@/components/Icon";

export default function Hero() {
  return (
    <section className="relative w-full rounded-2xl bg-gradient-to-br from-surface-container-lowest via-surface-container-low to-primary-fixed/30 p-6 md:p-10 lg:p-12 shadow-[0_12px_32px_rgba(56,189,248,0.18),0_6px_0_#38bdf8] overflow-hidden">
      {/* Decorative background accents */}
      <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-primary-container/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Hero Narrative */}
        <div className="lg:col-span-7 flex flex-col items-start gap-5">
          {/* Verified badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-container-lowest border border-surface-container-high text-on-surface font-label-md text-label-md shadow-[0_2px_0_#bdc8d1]">
            <Icon name="verified_user" className="w-4 h-4 text-primary" />
            <span className="font-bold text-primary">Certified Kids' Safety &amp; Non-Toxic Essentials</span>
          </div>

          {/* Bubbly Big Headline */}
          <h1 className="font-display-lg text-3xl sm:text-4xl lg:text-display-lg text-on-surface tracking-tight leading-tight font-extrabold">
            Play, Snuggle &amp; <br className="hidden sm:inline" />
            <span className="text-primary underline decoration-primary-container decoration-wavy decoration-4">
              Score Big
            </span>
            <span className="text-secondary-container"> Discounts!</span>
          </h1>

          {/* Subtitle */}
          <p className="font-body-lg text-body-md sm:text-body-lg text-on-surface-variant max-w-xl leading-relaxed">
            Everyday baby essentials, non-toxic feeding gear, and handcrafted toys. Negotiate prices directly with our interactive AI SkyBot for real savings!
          </p>

          {/* Candy CTAs */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
            <Link
              className="btn-bargain-action inline-flex items-center gap-2 sm:gap-3 px-5 sm:px-6 py-3 sm:py-3.5 rounded-full font-headline-md text-sm sm:text-headline-md cursor-pointer select-none"
              href="/deals"
            >
              <Icon name="smart_toy" className="w-5 h-5" />
              <span>Explore Deals &amp; Bot</span>
            </Link>
            <a
              className="btn-add-action inline-flex items-center gap-2 sm:gap-3 px-5 sm:px-6 py-3 sm:py-3.5 rounded-full font-headline-md text-sm sm:text-headline-md cursor-pointer select-none"
              href="#catalog"
            >
              <Icon name="backpack" className="w-5 h-5" />
              <span>Explore All Products</span>
            </a>
          </div>

          {/* Real Trust Badges Under CTA */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2 font-label-sm text-label-sm text-on-surface-variant">
            <div className="flex items-center gap-1.5">
              <Icon name="verified" className="w-4 h-4 text-primary" />
              <span>Tested Materials</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Icon name="favorite" className="w-4 h-4 text-secondary" />
              <span>Safety Verified</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Icon name="bolt" className="w-4 h-4 text-tertiary-container" />
              <span>Interactive Bargain Pricing</span>
            </div>
          </div>
        </div>

        {/* Right Hero 3D Toy Cloud Showcase */}
        <div className="lg:col-span-5 relative flex items-center justify-center">
          <div className="relative w-full aspect-square max-w-md bg-surface-container-lowest rounded-2xl p-4 shadow-[0_8px_0_#bdc8d1] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary-fixed/40 via-secondary-fixed/30 to-tertiary-fixed/40 rounded-2xl" />

            <Image
              src="/stitch/hero-toy-cloud.png"
              alt="Joyful baby wooden toys and organic cotton romper essentials"
              width={420}
              height={420}
              priority
              className="relative z-10 object-contain hover:scale-105 transition-transform duration-300 drop-shadow-md"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
