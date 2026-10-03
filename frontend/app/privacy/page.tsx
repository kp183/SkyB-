import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | skyB",
  description: "Privacy policy for skyB playground, explaining our data collection practices and academic demo scope.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-low text-on-surface hover:bg-surface-container font-label-md text-label-md shadow-[0_2px_0_#bdc8d1] transition-all"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        <span>Back to Store</span>
      </Link>

      <div className="rounded-2xl bg-surface-container-lowest p-6 sm:p-10 shadow-[0_8px_0_#c4e7ff] space-y-8 border border-surface-container-high">
        <div className="border-b border-surface-container-high pb-6 flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-container text-on-primary shadow-[0_2px_0_#00668a] shrink-0">
            <span className="material-symbols-outlined text-[24px]">verified_user</span>
          </div>
          <div>
            <h1 className="font-headline-xl text-headline-xl text-on-surface">Privacy Policy</h1>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
              Last updated: September 2026 · skyB Academic Field Project
            </p>
          </div>
        </div>

        <section className="space-y-2">
          <h2 className="font-headline-lg text-headline-lg text-on-surface">1. Overview &amp; Academic Scope</h2>
          <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
            skyB is an academic field demonstration project developed by students of T.Y. B.Sc. Computer Science.
            This platform operates in a simulated environment to showcase AI-assisted e-commerce capabilities.
            All monetary transactions and payment gateways are completely simulated (mock transactions only);
            no real financial credentials, debit/credit cards, or real payments are ever processed or accepted.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-headline-lg text-headline-lg text-on-surface">2. Information We Collect</h2>
          <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
            To provide demonstration functionality, the platform stores only the minimum necessary data:
          </p>
          <ul className="list-disc pl-5 font-body-md text-body-md text-on-surface-variant space-y-1.5">
            <li><strong>Account Details:</strong> Name and email address provided during test user registration. Passwords are securely hashed with industry-standard bcrypt before database storage.</li>
            <li><strong>Order &amp; Cart Records:</strong> Mock order histories, delivery addresses entered for mock checkout, and item selections (including bargained price agreements).</li>
            <li><strong>Child Profile Data (Optional):</strong> Birth date, height, and weight entered to power the developmental size and age progression engine.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-headline-lg text-headline-lg text-on-surface">3. Local Storage &amp; Cookies</h2>
          <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
            skyB uses browser <code className="bg-surface-container-low px-2 py-0.5 rounded-full text-primary font-bold">localStorage</code> exclusively for maintaining your authenticated user session (<code className="bg-surface-container-low px-2 py-0.5 rounded-full text-primary font-bold">skyb_token</code> and <code className="bg-surface-container-low px-2 py-0.5 rounded-full text-primary font-bold">skyb_user</code>). We do not set any tracking cookies, third-party marketing beacons, or cross-site tracking scripts.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-headline-lg text-headline-lg text-on-surface">4. Artificial Intelligence &amp; LLM Interactions</h2>
          <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
            When interacting with the AI Bargain Assistant or Safety Score generator, queries may be processed via natural language model APIs (such as Google Gemini) solely for conversational phrasing. All core business rules (including pricing bounds, minimum price floors, and certification checks) are strictly executed and enforced via deterministic Python logic on our backend servers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-headline-lg text-headline-lg text-on-surface">5. Contact</h2>
          <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
            For academic inquiries regarding the skyB project, please refer to the project repository documentation.
          </p>
        </section>
      </div>
    </div>
  );
}
