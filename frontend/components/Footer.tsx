import Link from "next/link";
import { Sparkles, ShieldCheck, HeartHandshake, Zap } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 text-slate-600">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: About */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-500 text-white">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="text-xl font-bold text-slate-800">SkyB</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-500">
              AI-assisted shopping for kids and babies. Safe materials, smart developmental sizing, and real-time bargaining.
            </p>
          </div>

          {/* Col 2: Features */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">AI Features</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> Safety-First Badges</li>
              <li className="flex items-center gap-1.5"><Zap className="h-3.5 w-3.5 text-amber-500" /> Bargain Assistant</li>
              <li className="flex items-center gap-1.5"><HeartHandshake className="h-3.5 w-3.5 text-sky-500" /> Smart Savings Agent</li>
            </ul>
          </div>

          {/* Col 3: Academic Project */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">Field Project</h4>
            <p className="text-xs text-slate-500">
              T.Y. B.Sc. Computer Science Field Project.<br />
              Academic demo version with mock payment gateway.
            </p>
          </div>

          {/* Col 4: Team */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">Team</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Bhavika Mandora · Yadnesh Channa · Kunal Ghanchi · Goswami Sheetalgiri
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2026 SkyB Project. Built for Academic Demonstration.</p>
          <div className="flex items-center gap-6 text-slate-500">
            <Link href="/privacy" className="hover:text-sky-600 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-sky-600 transition-colors">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
