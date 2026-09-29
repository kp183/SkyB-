"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Lock, Mail } from "lucide-react";
import { api } from "@/lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("parent@skyb.com");
  const [password, setPassword] = useState("Parent@123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const errs: { [key: string]: string } = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      errs.email = "Please enter a valid email address.";
    }
    if (!password) {
      errs.password = "Password is required.";
    }
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setError(null);
    try {
      await api.login(email.trim(), password);
      window.location.href = "/";
    } catch (err: any) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-400 to-indigo-500 text-white shadow-md shadow-sky-200">
            <Sparkles className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-black text-slate-900">Welcome Back</h1>
          <p className="text-xs text-slate-500">Sign in to access your safe shopping cart and bargain history</p>
        </div>

        {error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: "" });
                }}
                required
                className={`w-full rounded-2xl border py-2.5 pl-10 pr-4 text-xs focus:outline-none ${
                  fieldErrors.email ? "border-rose-400 focus:border-rose-500 bg-rose-50/20" : "border-slate-300 focus:border-sky-500"
                }`}
              />
              <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            </div>
            {fieldErrors.email && (
              <p className="mt-1 text-[11px] font-semibold text-rose-600">{fieldErrors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: "" });
                }}
                required
                className={`w-full rounded-2xl border py-2.5 pl-10 pr-4 text-xs focus:outline-none ${
                  fieldErrors.password ? "border-rose-400 focus:border-rose-500 bg-rose-50/20" : "border-slate-300 focus:border-sky-500"
                }`}
              />
              <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            </div>
            {fieldErrors.password && (
              <p className="mt-1 text-[11px] font-semibold text-rose-600">{fieldErrors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white py-3 text-xs font-bold shadow-md shadow-sky-200 transition-colors"
          >
            {loading ? "Signing in..." : "Sign In"} <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="rounded-2xl bg-slate-50 p-3 text-[11px] text-slate-500 space-y-1 border border-slate-100">
          <p className="font-bold text-slate-700">Demo Accounts Seeded:</p>
          <p>Customer: <code className="text-sky-600">parent@skyb.com</code> / <code className="text-sky-600">Parent@123</code></p>
          <p>Admin: <code className="text-amber-600">admin@skyb.com</code> / <code className="text-amber-600">Admin@123</code></p>
        </div>

        <p className="text-center text-xs text-slate-500">
          Don't have an account?{" "}
          <Link href="/register" className="font-bold text-sky-600 hover:underline">
            Register now
          </Link>
        </p>
      </div>
    </div>
  );
}
