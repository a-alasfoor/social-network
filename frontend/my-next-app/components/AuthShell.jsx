"use client";

import Link from "next/link";

export default function AuthShell({ children, cta }) {
  return (
    <div className="min-h-screen bg-[#edf2f7]">
      {/* Top bar */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-gray-200">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <Link href="/" className="text-2xl font-extrabold tracking-tight text-[#1877f2]">
            connect
          </Link>
          <div className="text-sm text-gray-600">{cta}</div>
        </div>
      </header>

      {/* Content container */}
      <main className="mx-auto max-w-6xl px-4 py-12">
        {children}
      </main>
    </div>
  );
}
