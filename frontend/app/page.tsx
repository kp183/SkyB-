"use client";

import { useEffect, useState } from "react";
import { Sparkles, ShieldCheck, Tag, Search, Filter } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { api } from "@/lib/api";

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedAge, setSelectedAge] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const ageGroups = ["0-3m", "3-6m", "6-12m", "1-2y", "2-3y", "3-5y", "6-8y", "9-12y"];

  async function loadData() {
    setLoading(true);
    try {
      const [prods, cats] = await Promise.all([
        api.getProducts({
          category: selectedCategory || undefined,
          age_group: selectedAge || undefined,
          search: searchTerm || undefined,
        }),
        api.getCategories(),
      ]);
      setProducts(prods || []);
      setCategories(cats || []);
    } catch (err) {
      console.error("Failed to load catalog data", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [selectedCategory, selectedAge]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadData();
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-sky-400 via-sky-500 to-indigo-600 p-8 sm:p-12 text-white shadow-xl shadow-sky-100">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-amber-300" /> AI-Assisted Kids' Shopping
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
            Safe, Verified & Negotiable Kids' Products
          </h1>
          <p className="text-sm sm:text-base text-sky-100 leading-relaxed">
            Every product is verified with Safety Badges, fitted with Auto-Sizing recommendations, and eligible for live AI bargaining within admin floors.
          </p>

          <div className="pt-2 flex flex-wrap gap-4 text-xs font-medium text-sky-100">
            <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-emerald-300" /> 100% Non-Toxic & BPA-Free checks</span>
            <span className="flex items-center gap-1.5"><Sparkles className="h-4 w-4 text-amber-300" /> Live AI Bargain Assistant</span>
            <span className="flex items-center gap-1.5"><Tag className="h-4 w-4 text-white" /> Smart Savings Auto-Coupons</span>
          </div>
        </div>
      </section>

      {/* Search & Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="Search toys, rompers, shoes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs focus:border-sky-500 focus:outline-none shadow-sm"
            />
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          </form>

          {/* Age Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            <span className="text-xs font-semibold text-slate-400 mr-1 shrink-0 flex items-center gap-1">
              <Filter className="h-3 w-3" /> Age:
            </span>
            <button
              onClick={() => setSelectedAge("")}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold shrink-0 transition-colors ${
                selectedAge === "" ? "bg-slate-900 text-white" : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              All
            </button>
            {ageGroups.map((age) => (
              <button
                key={age}
                onClick={() => setSelectedAge(age === selectedAge ? "" : age)}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold shrink-0 transition-colors ${
                  selectedAge === age ? "bg-sky-500 text-white" : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {age}
              </button>
            ))}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`rounded-xl px-4 py-2 text-xs font-bold shrink-0 transition-all ${
              selectedCategory === null
                ? "bg-sky-500 text-white shadow-sm shadow-sky-200"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id === selectedCategory ? null : cat.id)}
              className={`rounded-xl px-4 py-2 text-xs font-bold shrink-0 transition-all ${
                selectedCategory === cat.id
                  ? "bg-sky-500 text-white shadow-sm shadow-sky-200"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Catalog Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">
            Featured Products {products.length > 0 && `(${products.length})`}
          </h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-72 rounded-2xl bg-slate-200/60 animate-pulse" />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 p-8">
            <p className="text-sm font-semibold text-slate-600">No products found matching your filters.</p>
            <button
              onClick={() => {
                setSelectedCategory(null);
                setSelectedAge("");
                setSearchTerm("");
              }}
              className="mt-3 rounded-xl bg-sky-50 px-4 py-2 text-xs font-bold text-sky-600 hover:bg-sky-100"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
