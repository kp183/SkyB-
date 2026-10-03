"use client";

import { useEffect, useState } from "react";
import Hero from "@/components/Hero";
import PerksBar from "@/components/PerksBar";
import ProductCard from "@/components/ProductCard";
import Testimonials from "@/components/Testimonials";
import Icon from "@/components/Icon";
import { api } from "@/lib/api";

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedAge, setSelectedAge] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

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

  const handleStageSelect = (stage: string) => {
    if (stage === "0-1") setSelectedAge("0-12m");
    else if (stage === "1-3") setSelectedAge("1-3y");
    else if (stage === "4-7") setSelectedAge("4-7y");
    else if (stage === "8-12") setSelectedAge("8-12y");
    else setSelectedAge("");
  };

  return (
    <div className="flex flex-col gap-12 sm:gap-16">
      {/* Hero Section */}
      <Hero />

      {/* Perks Bar */}
      <PerksBar />

      {/* Curated Drops & Product Catalog Section */}
      <section id="catalog" className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="font-label-sm text-label-sm text-primary font-bold uppercase tracking-wider">
              Curated Drops &amp; Loot Chests
            </div>
            <h2 className="font-headline-xl text-headline-xl text-on-surface">
              Featured Play Gear
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Handcrafted wooden toys, certified soft fabrics, and milestone essentials.
            </p>
          </div>

          {/* Search Input */}
          <form onSubmit={handleSearch} className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Search gear, toys, rompers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-11 pl-10 pr-4 rounded-full bg-surface-container-lowest border border-surface-container-high font-body-sm text-body-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary shadow-[0_2px_0_#bdc8d1]"
            />
            <Icon name="search" className="absolute left-3 top-3 w-5 h-5 text-on-surface-variant pointer-events-none" />
          </form>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full font-label-md text-label-md shrink-0 transition-all cursor-pointer ${
              selectedCategory === null
                ? "bg-primary text-on-primary shadow-[0_3px_0_#004965]"
                : "bg-surface-container-low text-on-surface hover:bg-surface-container shadow-[0_2px_0_#bdc8d1]"
            }`}
          >
            All Play Loot
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id === selectedCategory ? null : cat.id)}
              className={`px-4 py-2 rounded-full font-label-md text-label-md shrink-0 transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-primary text-on-primary shadow-[0_3px_0_#004965]"
                  : "bg-surface-container-low text-on-surface hover:bg-surface-container shadow-[0_2px_0_#bdc8d1]"
              }`}
            >
              {cat.name}
            </button>
          ))}

          {selectedAge && (
            <button
              onClick={() => setSelectedAge("")}
              className="px-3 py-1.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm shadow-[0_2px_0_#fe7488] flex items-center gap-1 shrink-0 ml-auto cursor-pointer"
            >
              <span>Age: {selectedAge}</span>
              <Icon name="close" className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Product Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="h-80 rounded-xl bg-surface-container-low animate-pulse shadow-[0_6px_0_#bdc8d1] p-4 flex flex-col justify-between"
              >
                <div className="w-full aspect-square rounded-lg bg-surface-container-high/60" />
                <div className="space-y-2 pt-3">
                  <div className="h-4 bg-surface-container-high/70 rounded-full w-3/4" />
                  <div className="h-4 bg-surface-container-high/50 rounded-full w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((p, idx) => (
              <ProductCard
                key={p.id}
                product={p}
                index={idx}
                onCartUpdated={loadData}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-surface-container-lowest rounded-xl shadow-[0_6px_0_#bdc8d1] p-8 flex flex-col items-center gap-3">
            <Icon name="sentiment_dissatisfied" className="w-12 h-12 text-primary" />
            <p className="font-headline-md text-headline-md text-on-surface">
              No products found matching your quest.
            </p>
            <button
              onClick={() => {
                setSelectedCategory(null);
                setSelectedAge("");
                setSearchTerm("");
              }}
              className="mt-2 px-5 py-2.5 rounded-full bg-primary text-on-primary font-headline-md text-headline-md shadow-[0_3px_0_#004965] hover:bg-on-primary-container transition-all cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* Community Testimonials Wall */}
      <Testimonials />
    </div>
  );
}
