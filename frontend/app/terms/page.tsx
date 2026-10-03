import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms & Conditions | skyB",
  description: "Terms and conditions for the skyB academic demo e-commerce playground.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-low text-on-surface hover:bg-surface-container font-label-md text-label-md shadow-[0_2px_0_#bdc8d1] transition-all"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        <span>Back to Store</span>
      </Link>

      <div className="rounded-2xl bg-surface-container-lowest p-6 sm:p-10 shadow-[0_8px_0_#ffdadc] space-y-8 border border-surface-container-high">
        <div className="border-b border-surface-container-high pb-6 flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary-container text-on-secondary shadow-[0_2px_0_#730425] shrink-0">
            <span className="material-symbols-outlined text-[24px]">description</span>
          </div>
          <div>
            <h1 className="font-headline-xl text-headline-xl text-on-surface">Terms &amp; Conditions</h1>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
              Effective Date: September 2026 · skyB Academic Demonstration
            </p>
          </div>
        </div>

        <section className="space-y-2">
          <h2 className="font-headline-lg text-headline-lg text-on-surface">1. Acceptance of Terms</h2>
          <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
            By accessing or using the skyB web platform, you acknowledge that this is a student educational project for T.Y. B.Sc. Computer Science. All features, products, inventory counts, and price discounts exist for evaluation and demonstration purposes only.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-headline-lg text-headline-lg text-on-surface">2. Mock Transactions &amp; No Real Fulfillment</h2>
          <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
            All checkouts and payments executed on skyB are simulated via a mock payment gateway. No real credit card or bank credentials should ever be provided. No physical goods will be packaged, shipped, or delivered in real life.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-headline-lg text-headline-lg text-on-surface">3. AI Bargaining &amp; Pricing Rules</h2>
          <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
            The AI Bargain Assistant allows interactive price negotiation up to three rounds per product session. All negotiated discounts are bounded by backend deterministic rules with strict minimum price floors. Agreed bargained prices are valid for the active cart session and are exempt from stacking with general promotional coupon codes.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-headline-lg text-headline-lg text-on-surface">4. User Accounts &amp; Fair Use</h2>
          <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
            Users may register test accounts using synthetic or demo credentials. Rate limiting is enforced on authentication routes (maximum 10 requests per minute) to ensure platform stability and protect demo availability.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-headline-lg text-headline-lg text-on-surface">5. Intellectual Property &amp; Disclaimer</h2>
          <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
            Product names, illustrations, and mock brands are used under fair academic use for demonstrating user interface design and software engineering workflows. The software is provided "as is" without commercial warranty.
          </p>
        </section>
      </div>
    </div>
  );
}
