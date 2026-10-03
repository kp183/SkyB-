"use client";

import { useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!name.trim() || name.trim().length < 2) {
      errs.name = "Please enter your full name (at least 2 characters).";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      errs.email = "Please enter a valid email address.";
    }
    if (!password || password.length < 6) {
      errs.password = "Password must be at least 6 characters long.";
    }
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setError(null);
    try {
      await api.register(name.trim(), email.trim(), password);
      window.location.href = "/";
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <div className="rounded-2xl bg-surface-container-lowest p-8 shadow-[0_8px_0_#ffdadc] space-y-6 border border-surface-container-high">
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-secondary-container text-on-secondary shadow-[0_3px_0_#730425]">
            <span className="material-symbols-outlined text-[28px]">person_add</span>
          </div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface">
            Create an Account
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Join skyB to unlock bargained deals, order tracking, and age auto-progression
          </p>
        </div>

        {error && (
          <div className="rounded-xl bg-error-container p-3 text-on-error-container font-body-sm text-body-sm text-center shadow-[0_2px_0_#ffdad6] flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block font-label-md text-label-md text-on-surface mb-1 font-bold">
              Parent or Guardian Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (fieldErrors.name) setFieldErrors({ ...fieldErrors, name: "" });
                }}
                required
                placeholder="e.g. Priya Sharma"
                className={`w-full h-12 rounded-full border pl-11 pr-4 font-body-md text-body-md text-on-surface focus:outline-none bg-surface-container-low ${
                  fieldErrors.name
                    ? "border-secondary bg-secondary-fixed/20"
                    : "border-surface-container-high focus:border-primary shadow-[0_2px_0_#bdc8d1]"
                }`}
              />
              <span className="material-symbols-outlined absolute left-3.5 top-3 text-[20px] text-on-surface-variant pointer-events-none">
                person
              </span>
            </div>
            {fieldErrors.name && (
              <p className="mt-1 font-label-sm text-[11px] font-bold text-secondary">
                {fieldErrors.name}
              </p>
            )}
          </div>

          <div>
            <label className="block font-label-md text-label-md text-on-surface mb-1 font-bold">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: "" });
                }}
                required
                placeholder="you@example.com"
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
              Password (6+ characters)
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: "" });
                }}
                required
                placeholder="••••••••"
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
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-full bg-secondary-container text-on-secondary py-3.5 font-headline-md text-headline-md shadow-[0_4px_0_#730425] hover:brightness-105 active:translate-y-[2px] active:shadow-[0_1px_0_#730425] transition-all cursor-pointer"
          >
            <span>{loading ? "Creating Explorer Account..." : "Create Account"}</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </form>

        <p className="text-center font-body-sm text-body-sm text-on-surface-variant">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-secondary hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
