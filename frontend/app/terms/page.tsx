import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms & Conditions | SkyB",
  description: "Terms and conditions for the SkyB academic demo e-commerce platform.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-600 hover:text-sky-700 transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Store
      </Link>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm space-y-8">
        <div className="border-b border-slate-100 pb-6 flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 shrink-0">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Terms & Conditions</h1>
            <p className="text-xs text-slate-500 mt-1">
              Effective Date: September 2026 · SkyB Academic Demonstration
            </p>
          </div>
        </div>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900">1. Acceptance of Terms</h2>
          <p className="text-xs leading-relaxed text-slate-600">
            By accessing or using the SkyB web platform, you acknowledge that this is a student educational project for T.Y. B.Sc. Computer Science. All features, products, inventory counts, and price discounts exist for evaluation and demonstration purposes only.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900">2. Mock Transactions & No Real Fulfillment</h2>
          <p className="text-xs leading-relaxed text-slate-600">
            All checkouts and payments executed on SkyB are simulated via a mock payment gateway. No real credit card or bank credentials should ever be provided. No physical goods will be packaged, shipped, or delivered in real life.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900">3. AI Bargaining & Pricing Rules</h2>
          <p className="text-xs leading-relaxed text-slate-600">
            The AI Bargain Assistant allows interactive price negotiation up to three rounds per product session. All negotiated discounts are bounded by backend deterministic rules (strict minimum profit floors). Agreed bargained prices are valid for the active cart session and are exempt from stacking with general promotional coupon codes.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900">4. User Accounts & Fair Use</h2>
          <p className="text-xs leading-relaxed text-slate-600">
            Users may register test accounts using synthetic or demo credentials. Rate limiting is enforced on authentication routes (maximum 10 requests per minute) to ensure platform stability and protect demo availability.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900">5. Intellectual Property & Disclaimer</h2>
          <p className="text-xs leading-relaxed text-slate-600">
            Product names, illustrations, and mock brands are used under fair academic use for demonstrating user interface design and software engineering workflows. The software is provided "as is" without commercial warranty.
          </p>
        </section>
      </div>
    </div>
  );
}
