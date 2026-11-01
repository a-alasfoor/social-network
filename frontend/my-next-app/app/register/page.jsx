"use client";

import { useState } from "react";
import Link from "next/link";
import AuthShell from "@/components/AuthShell";
import Image from "next/image";


export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    dob: "",
    nickname: "",
    about: "",
    // avatar: File (optional)
  });

  function onAvatarChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm((f) => ({ ...f, avatar: file }));
    const url = URL.createObjectURL(file);
    setAvatarPreview(url);
  }

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => v && data.append(k, v));
      // TODO: replace with your real API call
      // await fetch("/api/register", { method: "POST", body: data });
      console.log("Register payload (FormData):", [...data.entries()]);
      alert("Registered (demo). Wire this to your backend when ready.");
    } catch (err) {
      console.error(err);
      alert("Registration failed (demo).");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      cta={
        <>
          Already have an account?{" "}
          <Link href="/login" className="text-[#1877f2] font-medium hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        <h1 className="text-xl font-semibold text-gray-900">Create your account</h1>
        <p className="mt-1 text-sm text-gray-600">
          Fields marked as optional can be skipped now and filled later in your profile.
        </p>

        <form onSubmit={onSubmit} className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Names */}
          <div>
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              required
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-[#1877f2] outline-none"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              placeholder="Alex"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              required
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-[#1877f2] outline-none"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              placeholder="Johnson"
            />
          </div>

          {/* Email / Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              required
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-[#1877f2] outline-none"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              required
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-[#1877f2] outline-none"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
            />
          </div>

          {/* Date of birth */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
            <input
              type="date"
              required
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-[#1877f2] outline-none"
              value={form.dob}
              onChange={(e) => setForm({ ...form, dob: e.target.value })}
            />
          </div>

          {/* Nickname (optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nickname <span className="text-gray-400">(optional)</span>
            </label>
            <input
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-[#1877f2] outline-none"
              value={form.nickname}
              onChange={(e) => setForm({ ...form, nickname: e.target.value })}
              placeholder="alexj"
            />
          </div>

          {/* Avatar (optional) */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Avatar/Image <span className="text-gray-400">(optional)</span>
            </label>
            <div className="mt-1 flex items-center gap-4">
              <label className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">
                <input type="file" accept="image/*" onChange={onAvatarChange} className="hidden" />
                Upload image
              </label>
              {avatarPreview ? (
  <Image
    src={avatarPreview}
    alt="Avatar"
    width={48}
    height={48}
    unoptimized
    className="h-12 w-12 rounded-full object-cover border"
  />
) : (
  <div className="h-12 w-12 rounded-full bg-gray-100 border flex items-center justify-center text-gray-400">
    ?
  </div>
)}
            </div>
          </div>

          {/* About (optional) */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              About Me <span className="text-gray-400">(optional)</span>
            </label>
            <textarea
              rows={4}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-[#1877f2] outline-none"
              value={form.about}
              onChange={(e) => setForm({ ...form, about: e.target.value })}
              placeholder="Tell people a little about yourself…"
            />
          </div>

          {/* Actions */}
          <div className="md:col-span-2 flex flex-col gap-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[#1877f2] px-4 py-2.5 font-semibold text-white hover:brightness-95 disabled:opacity-60"
            >
              {loading ? "Creating account…" : "Create account"}
            </button>
            <p className="text-center text-sm text-gray-600">
              By continuing, you agree to our Terms & Privacy Policy.
            </p>
          </div>
        </form>
      </div>
    </AuthShell>
  );
}
