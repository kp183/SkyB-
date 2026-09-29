import Link from "next/link";
import { Sparkles, ArrowLeft, ShoppingBag } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="relative mb-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-sky-400 to-indigo-500 text-white shadow-xl shadow-sky-200">
          <Sparkles className="h-10 w-10 animate-pulse" />
        </div>
        <span className="absolute -bottom-2 -right-2 rounded-full bg-amber-400 px-2 py-0.5 text-xs font-black text-amber-950 shadow-sm">
          404
        </span>
      </div>

      <h1 className="text-3xl font-black text-slate-900 tracking-tight sm:text-4xl">
        Page Not Found
      </h1>
      <p className="mt-3 max-w-md text-sm text-slate-600 leading-relaxed">
        Oops! Looks like this page wandered off to play. The toy, category, or page you’re looking for doesn’t exist or has moved.
      </p>

      <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
        <Link
          href="/"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-5 py-3 text-xs font-bold text-white shadow-md shadow-sky-200 hover:bg-sky-700 transition-all"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Catalog
        </Link>
        <Link
          href="/cart"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition-all"
        >
          <ShoppingBag className="h-4 w-4 text-slate-400" /> View My Cart
        </Link>
      </div>
    </div>
  );
}
