"use client";

import { useState } from "react";
import Link from "next/link";
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
    console.log("=== HANDLE LOGIN INVOKED ===", email, password);
    if (!validate()) {
      console.log("Validation failed", fieldErrors);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      console.log("Calling api.login...");
      const res = await api.login(email.trim(), password);
      console.log("api.login returned:", res);
      const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
      const nextParam = params?.get("next");
      const target = nextParam && nextParam.startsWith("/") && !nextParam.startsWith("//") ? nextParam : "/";
      console.log("Navigating to target:", target);
      window.location.href = target;
    } catch (err: any) {
      console.error("Login catch error:", err);
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <div className="rounded-2xl bg-surface-container-lowest p-8 shadow-[0_8px_0_#c4e7ff] space-y-6 border border-surface-container-high">
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-container text-on-primary shadow-[0_3px_0_#00668a]">
            <span className="material-symbols-outlined text-[28px]">lock</span>
          </div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface">
            Sign In to skyB
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Sign in to view your loot cart, orders, and bargained deals
          </p>
        </div>

        {error && (
          <div className="rounded-xl bg-error-container p-3 text-on-error-container font-body-sm text-body-sm text-center shadow-[0_2px_0_#ffdad6] flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block font-label-md text-label-md text-on-surface mb-1 font-bold">
              Email Address
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: "" });
                }}
                required
                className={`w-full h-12 rounded-full border pl-11 pr-4 font-body-md text-body-md text-on-surface focus:outline-none bg-surface-container-low ${
                  fieldErrors.email
                    ? "border-secondary bg-secondary-fixed/20"
                    : "border-surface-container-high focus:border-primary shadow-[0_2px_0_#bdc8d1]"
                }`}
              />
              <span className="material-symbols-outlined absolute left-3.5 top-3 text-[20px] text-on-surface-variant pointer-events-none">
                mail
              </span>
            </div>
            {fieldErrors.email && (
              <p className="mt-1 font-label-sm text-[11px] font-bold text-secondary">
                {fieldErrors.email}
              </p>
            )}
          </div>

          <div>
            <label className="block font-label-md text-label-md text-on-surface mb-1 font-bold">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: "" });
                }}
                required
                className={`w-full h-12 rounded-full border pl-11 pr-4 font-body-md text-body-md text-on-surface focus:outline-none bg-surface-container-low ${
                  fieldErrors.password
                    ? "border-secondary bg-secondary-fixed/20"
                    : "border-surface-container-high focus:border-primary shadow-[0_2px_0_#bdc8d1]"
                }`}
              />
              <span className="material-symbols-outlined absolute left-3.5 top-3 text-[20px] text-on-surface-variant pointer-events-none">
                key
              </span>
            </div>
            {fieldErrors.password && (
              <p className="mt-1 font-label-sm text-[11px] font-bold text-secondary">
                {fieldErrors.password}
              </p>
            )}
          </div>

          <button
            id="login-submit-btn"
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-full bg-primary text-on-primary py-3.5 font-headline-md text-headline-md shadow-[0_4px_0_#004965] hover:bg-on-primary-container active:translate-y-[2px] active:shadow-[0_1px_0_#004965] transition-all cursor-pointer"
          >
            <span>{loading ? "Signing in..." : "Sign In to Playground"}</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </form>

        <div className="rounded-xl bg-surface-container-low p-4 font-body-sm text-[12px] text-on-surface-variant space-y-1.5 border border-surface-container-high shadow-[0_2px_0_#bdc8d1]">
          <p className="font-bold text-on-surface flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary text-[18px]">badge</span>
            Demo Evaluation Credentials:
          </p>
          <p>
            Customer: <code className="text-primary font-bold">parent@skyb.com</code> /{" "}
            <code className="text-primary font-bold">Parent@123</code>
          </p>
          <p>
            Admin: <code className="text-secondary font-bold">admin@skyb.com</code> /{" "}
            <code className="text-secondary font-bold">Admin@123</code>
          </p>
        </div>

        <p className="text-center font-body-sm text-body-sm text-on-surface-variant">
          Don't have an account?{" "}
          <Link href="/register" className="font-bold text-primary hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
