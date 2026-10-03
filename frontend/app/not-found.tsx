import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="relative mb-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-container text-on-primary shadow-[0_4px_0_#00668a]">
          <span className="material-symbols-outlined text-[40px]">explore_off</span>
        </div>
        <span className="absolute -bottom-1 -right-2 rounded-full bg-secondary-fixed text-on-secondary-fixed px-3 py-1 font-headline-md text-headline-md shadow-[0_2px_0_#fe7488]">
          404
        </span>
      </div>

      <h1 className="font-headline-xl text-headline-xl text-on-surface">
        Lost in the Playground?
      </h1>
      <p className="mt-2 max-w-md font-body-md text-body-md text-on-surface-variant leading-relaxed">
        The toy, romper, or loot chest you are seeking isn't here or has bounced away!
      </p>

      <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
        <Link
          href="/"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-primary text-on-primary px-6 py-3 font-headline-md text-headline-md shadow-[0_4px_0_#004965] hover:bg-on-primary-container transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Back to Catalog</span>
        </Link>
        <Link
          href="/cart"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-surface-container text-on-surface px-6 py-3 font-headline-md text-headline-md shadow-[0_2px_0_#bdc8d1] hover:bg-surface-container-high transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
          <span>View Loot Cart</span>
        </Link>
      </div>
    </div>
  );
}
