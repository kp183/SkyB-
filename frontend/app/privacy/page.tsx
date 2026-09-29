import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | SkyB",
  description: "Privacy policy for SkyB, explaining our data collection practices and academic demo scope.",
};

export default function PrivacyPage() {
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
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Privacy Policy</h1>
            <p className="text-xs text-slate-500 mt-1">
              Last updated: September 2026 · SkyB Academic Field Project
            </p>
          </div>
        </div>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900">1. Overview & Academic Scope</h2>
          <p className="text-xs leading-relaxed text-slate-600">
            SkyB is an academic field demonstration project developed by students of T.Y. B.Sc. Computer Science.
            This platform operates in a simulated environment to showcase AI-assisted e-commerce capabilities.
            All monetary transactions and payment gateways are completely simulated (mock transactions only);
            no real financial credentials, debit/credit cards, or real payments are ever processed or accepted.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900">2. Information We Collect</h2>
          <p className="text-xs leading-relaxed text-slate-600">
            To provide demonstration functionality, the platform stores only the minimum necessary data:
          </p>
          <ul className="list-disc pl-5 text-xs leading-relaxed text-slate-600 space-y-1.5">
            <li><strong>Account Details:</strong> Name and email address provided during test user registration. Passwords are securely hashed with industry-standard bcrypt before database storage.</li>
            <li><strong>Order & Cart Records:</strong> Mock order histories, delivery addresses entered for mock checkout, and item selections (including bargained price agreements).</li>
            <li><strong>Child Profile Data (Optional):</strong> Birth date, height, and weight entered to power the developmental size and age progression engine.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900">3. Local Storage & Cookies</h2>
          <p className="text-xs leading-relaxed text-slate-600">
            SkyB uses browser <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">localStorage</code> exclusively for maintaining your authenticated user session (<code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">skyb_token</code> and <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">skyb_user</code>). We do not set any tracking cookies, third-party marketing beacons, or cross-site tracking scripts.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900">4. Artificial Intelligence & LLM Interactions</h2>
          <p className="text-xs leading-relaxed text-slate-600">
            When interacting with the AI Bargain Assistant or Safety Score generator, queries may be processed via natural language model APIs (e.g. Google Gemini) solely for conversational phrasing. All core business rules—including pricing bounds, minimum profit margins, and certification checks—are strictly executed and enforced via deterministic Python logic on our backend servers.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900">5. Contact</h2>
          <p className="text-xs leading-relaxed text-slate-600">
            For academic inquiries regarding the SkyB project, please refer to the project repository documentation.
          </p>
        </section>
      </div>
    </div>
  );
}
