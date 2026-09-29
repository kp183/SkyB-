"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Trash2, ArrowLeft, ShieldCheck, Tag } from "lucide-react";
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
  const [imageUrl, setImageUrl] = useState("https://images.unsplash.com/photo-1522771930-78848d9293e8?w=500");

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
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <Link href="/admin/dashboard" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-sky-600">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Admin Dashboard
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Manage Catalog & Bargain Floors</h1>
          <p className="text-xs text-slate-500">Configure listed prices and strict min_price boundaries for AI Bargaining</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white px-4 py-2.5 text-xs font-bold shadow-md shadow-sky-200 transition-colors"
        >
          <Plus className="h-4 w-4" /> Add Product
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-400">Loading catalog...</div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="p-4">Product</th>
                <th className="p-4">Age / Size</th>
                <th className="p-4">Listed Price</th>
                <th className="p-4">Bargain Floor (Min)</th>
                <th className="p-4">Stock</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50">
                  <td className="p-4 flex items-center gap-3">
                    <Image
                      src={p.image_url || "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=200"}
                      alt={p.name || "Product image"}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-bold text-slate-800">{p.name}</p>
                      <p className="text-[10px] text-slate-400 truncate max-w-xs">{p.description}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="font-medium text-slate-700">{p.age_group}</span>
                    {p.size && <span className="block text-[10px] text-slate-400">Size: {p.size}</span>}
                  </td>
                  <td className="p-4 font-black text-slate-900">₹{p.price.toFixed(2)}</td>
                  <td className="p-4">
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      ₹{p.min_price.toFixed(2)}
                    </span>
                  </td>
                  <td className="p-4 font-semibold text-slate-700">{p.stock_qty}</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <h2 className="text-base font-black text-slate-900">Add New Product</h2>
            {formError && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-2.5 text-xs font-semibold text-rose-700">
                {formError}
              </div>
            )}
            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700">Product Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="mt-1 w-full rounded-xl border border-slate-300 p-2 text-xs focus:border-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="mt-1 w-full rounded-xl border border-slate-300 p-2 text-xs focus:border-sky-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700">Age Group</label>
                  <input
                    type="text"
                    value={ageGroup}
                    onChange={(e) => setAgeGroup(e.target.value)}
                    required
                    placeholder="e.g. 0-3m, 1-2y"
                    className="mt-1 w-full rounded-xl border border-slate-300 p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">Size (Optional)</label>
                  <input
                    type="text"
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    placeholder="e.g. 0-3M, S, M"
                    className="mt-1 w-full rounded-xl border border-slate-300 p-2 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700">Price (₹)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    required
                    className="mt-1 w-full rounded-xl border border-slate-300 p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">Min Floor (₹)</label>
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(Number(e.target.value))}
                    required
                    className="mt-1 w-full rounded-xl border border-slate-300 p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">Stock Qty</label>
                  <input
                    type="number"
                    value={stockQty}
                    onChange={(e) => setStockQty(Number(e.target.value))}
                    required
                    className="mt-1 w-full rounded-xl border border-slate-300 p-2 text-xs"
                  />
                </div>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 rounded-xl bg-slate-100 py-2 font-bold text-slate-600 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-sky-500 py-2 font-bold text-white hover:bg-sky-600"
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
