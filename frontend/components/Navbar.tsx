"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ShoppingBag, Heart, User, Sparkles, LogOut, ShieldAlert } from "lucide-react";
import { getCurrentStoredUser, removeToken } from "@/lib/api";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setUser(getCurrentStoredUser());
  }, []);

  const handleLogout = () => {
    removeToken();
    setUser(null);
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-sky-100 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-400 to-indigo-500 text-white shadow-md shadow-sky-200 transition-transform group-hover:scale-105">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <span className="text-2xl font-black tracking-tight text-slate-800">Sky<span className="text-sky-500">B</span></span>
            <span className="block text-[10px] font-semibold uppercase tracking-widest text-sky-600">Smart Kids Store</span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <Link href="/" className="hover:text-sky-600 transition-colors">Catalog</Link>
          <Link href="/orders" className="hover:text-sky-600 transition-colors">Orders</Link>
          {user?.role === "admin" && (
            <Link href="/admin/dashboard" className="flex items-center gap-1.5 text-amber-600 font-semibold hover:text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
              <ShieldAlert className="h-4 w-4" /> Admin Portal
            </Link>
          )}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <Link
            href="/cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 hover:bg-sky-50 hover:text-sky-600 transition-colors"
            title="Cart"
          >
            <ShoppingBag className="h-5 w-5" />
          </Link>

          {user ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:block text-right">
                <p className="text-xs font-bold text-slate-800">{user.name}</p>
                <p className="text-[10px] text-slate-500">{user.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-sky-200 hover:bg-sky-600 transition-colors"
            >
              <User className="h-4 w-4" /> Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
