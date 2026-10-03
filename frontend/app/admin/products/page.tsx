"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { api } from "@/lib/api";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState(1);
  const [ageGroup, setAgeGroup] = useState("0-3m");
  const [size, setSize] = useState("0-3M");
  const [price, setPrice] = useState(799);
  const [minPrice, setMinPrice] = useState(550);
  const [maxPrice, setMaxPrice] = useState(799);
  const [stockQty, setStockQty] = useState(20);
  const [imageUrl, setImageUrl] = useState("/stitch/rocket-shuttle.png");

  async function loadProducts() {
    setLoading(true);
    try {
      const prods = await api.getProducts();
      setProducts(prods || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  const [formError, setFormError] = useState<string | null>(null);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || name.trim().length < 3) {
      setFormError("Product name must be at least 3 characters.");
      return;
    }
    if (price <= 0) {
      setFormError("Price must be greater than 0.");
      return;
    }
    if (minPrice <= 0) {
      setFormError("Minimum bargain floor price must be greater than 0.");
      return;
    }
    if (minPrice > price) {
      setFormError("Minimum bargain price cannot exceed the original price.");
      return;
    }
    if (stockQty < 0) {
      setFormError("Stock quantity cannot be negative.");
      return;
    }

    setFormError(null);
    try {
      await api.createProduct({
        name: name.trim(),
        description: description.trim(),
        category_id: categoryId,
        age_group: ageGroup.trim(),
        size: size ? size.trim() : null,
        price,
        min_price: minPrice,
        max_price: maxPrice,
        stock_qty: stockQty,
        image_url: imageUrl,
        safety_tags: ["Child Safe", "Non-Toxic"],
      });
      setShowAddModal(false);
      setName("");
      setDescription("");
      loadProducts();
    } catch (err: any) {
      setFormError(err.message || "Failed to create product");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await api.deleteProduct(id);
      loadProducts();
    } catch (err: any) {
      alert(err.message || "Failed to delete");
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
      <Link
        href="/admin/dashboard"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-low text-on-surface hover:bg-surface-container font-label-md text-label-md shadow-[0_2px_0_#bdc8d1] transition-all"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        <span>Back to Admin Dashboard</span>
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface">
            Catalog &amp; Bargain Floor Boundaries
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Set catalog offerings and strict minimum price thresholds protected from bot negotiation
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 rounded-full bg-primary text-on-primary px-5 py-2.5 font-headline-md text-headline-md shadow-[0_3px_0_#004965] hover:bg-on-primary-container transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Add Product</span>
        </button>
      </div>

      {loading ? (
        <div className="py-16 text-center font-body-md text-body-md text-on-surface-variant animate-pulse">
          Loading catalog...
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl bg-surface-container-lowest shadow-[0_8px_0_#bdc8d1] border border-surface-container-high">
          <table className="w-full text-left font-body-sm text-body-sm">
            <thead className="border-b border-surface-container-high bg-surface-container-low font-label-sm text-label-sm font-bold uppercase tracking-wider text-on-surface-variant">
              <tr>
                <th className="p-4">Product</th>
                <th className="p-4">Age / Size</th>
                <th className="p-4">Listed Price</th>
                <th className="p-4">Bargain Floor (Min)</th>
                <th className="p-4">Stock</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-high">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="p-4 flex items-center gap-3">
                    <div className="h-12 w-12 rounded-lg bg-surface-container-low p-1 flex items-center justify-center shrink-0">
                      <Image
                        src={p.image_url || "/stitch/rocket-shuttle.png"}
                        alt={p.name || "Product image"}
                        width={44}
                        height={44}
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <div>
                      <p className="font-headline-md text-headline-md text-on-surface">{p.name}</p>
                      <p className="font-label-sm text-[11px] text-on-surface-variant truncate max-w-xs">
                        {p.description}
                      </p>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="font-bold text-on-surface">{p.age_group}</span>
                    {p.size && (
                      <span className="block font-label-sm text-[11px] text-on-surface-variant">
                        Size: {p.size}
                      </span>
                    )}
                  </td>
                  <td className="p-4 font-bold text-primary text-base">₹{p.price.toFixed(2)}</td>
                  <td className="p-4">
                    <span className="font-bold text-secondary bg-secondary-fixed px-2.5 py-0.5 rounded-full text-xs shadow-[0_1px_0_#fe7488]">
                      ₹{p.min_price.toFixed(2)}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-on-surface">{p.stock_qty}</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="p-2 text-secondary hover:bg-secondary-fixed/50 rounded-full transition-colors cursor-pointer"
                      title="Delete product"
                    >
                      <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-surface-container-lowest p-6 shadow-[0_12px_32px_rgba(0,102,138,0.2)] border-2 border-primary-container space-y-4">
            <h2 className="font-headline-xl text-headline-xl text-on-surface">
              Add New Play Product
            </h2>
            {formError && (
              <div className="rounded-xl bg-error-container p-2.5 text-on-error-container text-body-sm shadow-[0_2px_0_#ffdad6] flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">error</span>
                <span>{formError}</span>
              </div>
            )}
            <form onSubmit={handleCreateProduct} className="space-y-3 font-body-sm text-body-sm">
              <div>
                <label className="font-bold text-on-surface">Product Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="mt-1 w-full rounded-full border border-surface-container-high px-4 py-2 focus:border-primary focus:outline-none bg-surface-container-low shadow-[0_2px_0_#bdc8d1]"
                />
              </div>

              <div>
                <label className="font-bold text-on-surface">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="mt-1 w-full rounded-xl border border-surface-container-high p-3 focus:border-primary focus:outline-none bg-surface-container-low shadow-[0_2px_0_#bdc8d1]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-on-surface">Age Group</label>
                  <input
                    type="text"
                    value={ageGroup}
                    onChange={(e) => setAgeGroup(e.target.value)}
                    required
                    placeholder="e.g. 0-3m, 1-2y"
                    className="mt-1 w-full rounded-full border border-surface-container-high px-4 py-2 focus:border-primary focus:outline-none bg-surface-container-low shadow-[0_2px_0_#bdc8d1]"
                  />
                </div>
                <div>
                  <label className="font-bold text-on-surface">Size (Optional)</label>
                  <input
                    type="text"
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    placeholder="e.g. 0-3M, S, M"
                    className="mt-1 w-full rounded-full border border-surface-container-high px-4 py-2 focus:border-primary focus:outline-none bg-surface-container-low shadow-[0_2px_0_#bdc8d1]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-on-surface">Price (₹)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    required
                    className="mt-1 w-full rounded-full border border-surface-container-high px-3 py-2 focus:border-primary focus:outline-none bg-surface-container-low shadow-[0_2px_0_#bdc8d1]"
                  />
                </div>
                <div>
                  <label className="font-bold text-on-surface">Min Floor (₹)</label>
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(Number(e.target.value))}
                    required
                    className="mt-1 w-full rounded-full border border-surface-container-high px-3 py-2 focus:border-primary focus:outline-none bg-surface-container-low shadow-[0_2px_0_#bdc8d1]"
                  />
                </div>
                <div>
                  <label className="font-bold text-on-surface">Stock Qty</label>
                  <input
                    type="number"
                    value={stockQty}
                    onChange={(e) => setStockQty(Number(e.target.value))}
                    required
                    className="mt-1 w-full rounded-full border border-surface-container-high px-3 py-2 focus:border-primary focus:outline-none bg-surface-container-low shadow-[0_2px_0_#bdc8d1]"
                  />
                </div>
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 rounded-full bg-surface-container py-2.5 font-headline-md text-headline-md text-on-surface hover:bg-surface-container-high transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-full bg-primary text-on-primary py-2.5 font-headline-md text-headline-md shadow-[0_3px_0_#004965] hover:bg-on-primary-container transition-all"
                >
                  Create Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
