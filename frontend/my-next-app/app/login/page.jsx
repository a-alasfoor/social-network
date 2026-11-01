"use client";

import { useState } from "react";
import Link from "next/link";
import AuthShell from "@/components/AuthShell";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [form,  setForm] = useState({ email: "", password: "" });

  async function onSubmit() {
    e.preventDefault();
    setLoading(true);
    try {
      // TODO: Replace with your real API call
      // await fetch("/api/login", { method: "POST", body: JSON.stringify(form) });
      console.log("Login payload:", form);
      alert("Logged in (demo). Wire this to your backend when ready.");
    } catch (err) {
      console.error(err);
      alert("Login failed (demo).");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      cta={
        <>
          Don’t have an account?{" "}
          <Link href="/register" className="text-[#1877f2] font-medium hover:underline">
            Create one
          </Link>
        </>
      }
    >
      <div className="grid md:grid-cols-2 gap-10 items-center">
        <div className="hidden md:block">
          <h1 className="text-4xl font-bold text-gray-900 leading-tight">Welcome back 👋</h1>
          <p className="mt-3 text-gray-600">
            Jump back into your feed, chats, groups, and events.
          </p>
          <ul className="mt-6 space-y-3 text-gray-700">
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#1877f2]" />
              Real-time messages & notifications
            </li>
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#1877f2]" />
              Follow friends & join groups
            </li>
          </ul>
        </div>

        <div className="w-full">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <h2 className="text-xl font-semibold text-gray-900">Log in</h2>

            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  required
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-[#1877f2]"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  required
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-[#1877f2]"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" className="rounded border-gray-300" />
                  <span className="text-gray-600">Remember me</span>
                </label>
                <button type="button" className="text-[#1877f2] hover:underline">
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-[#1877f2] px-4 py-2.5 font-semibold text-white hover:brightness-95 disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>

              <div className="relative my-2 text-center text-xs text-gray-500">
                <span className="bg-white px-2 relative z-10">or</span>
                <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-gray-200" />
              </div>

              <button
                type="button"
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 font-medium text-gray-700 hover:bg-gray-50"
              >
                Continue with Google
              </button>
            </form>
          </div>
        </div>
      </div>
    </AuthShell>
  );
}
