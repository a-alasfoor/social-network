"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Home as HomeIcon,
  Users2,
  MessageCircle,
  Bell,
  User,
  Bookmark,
  Sun,
  Moon,
  Menu,
  X,
  LogOut,
} from "lucide-react";

export default function HomePage() {
  const [theme, setTheme] = useState("light");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("theme") : null;
    const prefersDark =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(saved || (prefersDark ? "dark" : "light"));
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    try {
      localStorage.setItem("theme", theme);
    } catch {}
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const posts = useMemo(
    () => [
      {
        id: 1,
        author: {
          id: 1,
          name: "Alex Johnson",
          username: "alexj",
          avatar: "https://i.pravatar.cc/64?img=5",
        },
        time: "3mo ago",
        text:
          "Just finished my latest design project! So excited to share it with everyone. What do you think? #design #creativity",
        image:
          "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=2069&auto=format&fit=crop",
      },
      {
        id: 2,
        author: {
          id: 2,
          name: "Layla Ahmed",
          username: "layla",
          avatar: "https://i.pravatar.cc/64?img=21",
        },
        time: "2mo ago",
        text: "Prototype v2 shipped today 🚀",
        image:
          "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=2069&auto=format&fit=crop",
      },
    ],
    []
  );

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/60 bg-white/80 backdrop-blur dark:border-slate-700 dark:bg-slate-900/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
              aria-label="Toggle light/dark mode"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <span className="text-2xl font-extrabold tracking-tight text-blue-600 dark:text-blue-400">
              connect
            </span>
          </div>

          <nav className="hidden sm:flex items-center gap-8 text-slate-600 dark:text-slate-300">
            <Link className="flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400" href="/">
              <HomeIcon className="h-5 w-5" /> Home
            </Link>
            <Link className="flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400" href="/groups">
              <Users2 className="h-5 w-5" /> Groups
            </Link>
            <Link className="flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400" href="/messages">
              <MessageCircle className="h-5 w-5" /> Messages
            </Link>
            <Link
              className="relative flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400"
              href="/notifications"
            >
              <Bell className="h-5 w-5" /> Notifications
              <span className="absolute -right-3 -top-2 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-bold text-white">
                3
              </span>
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <img src="https://i.pravatar.cc/40?u=me" alt="me" className="h-8 w-8 rounded-full" />
            <button
              onClick={() => setMobileOpen(true)}
              className="sm:hidden inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white p-2 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <button
            aria-label="Close menu backdrop"
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm sm:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <aside
            className="fixed right-0 top-0 z-50 h-full w-72 bg-white p-4 shadow-xl dark:bg-slate-900 sm:hidden"
            role="dialog"
            aria-modal="true"
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="text-lg font-semibold">Menu</span>
              <button
                onClick={() => setMobileOpen(false)}
                className="rounded-xl border border-slate-200 p-2 dark:border-slate-700"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="grid gap-2">
              <MobileLink
                href="/"
                icon={<HomeIcon className="h-5 w-5" />}
                label="Home"
                onClick={() => setMobileOpen(false)}
              />
              <MobileLink
                href="/groups"
                icon={<Users2 className="h-5 w-5" />}
                label="Groups"
                onClick={() => setMobileOpen(false)}
              />
              <MobileLink
                href="/messages"
                icon={<MessageCircle className="h-5 w-5" />}
                label="Messages"
                onClick={() => setMobileOpen(false)}
              />
              <MobileLink
                href="/notifications"
                icon={<Bell className="h-5 w-5" />}
                label="Notifications"
                onClick={() => setMobileOpen(false)}
              />
              <div className="my-2 h-px bg-slate-200 dark:bg-slate-700" />
              <MobileLink
                href="/profile"
                icon={<User className="h-5 w-5" />}
                label="Profile"
                onClick={() => setMobileOpen(false)}
              />
              <MobileLink
                href="/saved"
                icon={<Bookmark className="h-5 w-5" />}
                label="Saved"
                onClick={() => setMobileOpen(false)}
              />

              {/* 🔥 removed People You May Know & Friend Requests links */}

              <button
                onClick={handleLogout}
                className="mt-3 flex items-center gap-3 rounded-xl border border-red-500 px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30"
              >
                <LogOut className="h-5 w-5" />
                <span className="font-medium">Logout</span>
              </button>
            </nav>
          </aside>
        </>
      )}

      {/* Body layout */}
      <main className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-6 md:px-6 lg:grid-cols-12">
        {/* Left sidebar */}
        <aside className="hidden lg:col-span-3 lg:block">
          <div className="sticky top-24 space-y-2">
            <SidebarLink href="/profile" icon={<User className="h-5 w-5" />} label="Profile" />
            <SidebarLink href="/saved" icon={<Bookmark className="h-5 w-5" />} label="Saved" />
            <button
              onClick={handleLogout}
              className="mt-2 flex w-full items-center gap-3 rounded-xl border border-red-500 px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </aside>

        {/* Feed – keep centered, same width (6 columns) */}
        <section className="lg:col-span-6">
          <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-center gap-3">
              <img src="https://i.pravatar.cc/40?u=me" className="h-10 w-10 rounded-full" alt="me" />
              <input
                placeholder="What's on your mind?"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900"
              />
            </div>
          </div>

          <div className="space-y-4">
            {posts.map((p) => (
              <article
                key={p.id}
                className="rounded-2xl border border-slate-200 bg-whiteshadow-sm dark:border-slate-700 dark:bg-slate-800"
              >
                <header className="px-4 py-3">
                  <Link
                    href={`/u/${p.author.username}`}
                    className="flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl -mx-2 px-2 py-1"
                  >
                    <img
                      src={p.author.avatar}
                      alt={p.author.name}
                      className="h-10 w-10 rounded-full"
                    />
                    <div>
                      <div className="font-semibold">{p.author.name}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        @{p.author.username} · {p.time}
                      </div>
                    </div>
                  </Link>
                </header>
                <div className="px-4 pb-3 text-sm leading-relaxed">{p.text}</div>
                {p.image && (
                  <div className="overflow-hidden rounded-b-2xl">
                    <img src={p.image} alt="post" className="max-h-[520px] w-full object-cover" />
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>

        {/* Right sidebar – keep for layout balance, but no Friend Requests / People You May Know */}
        <aside className="hidden lg:col-span-3 lg:block">
          <div className="sticky top-24">
            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <h3 className="mb-1 text-sm font-semibold tracking-wide text-slate-600 dark:text-slate-300">
                Sidebar
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                This space is reserved for future features (e.g. group suggestions, events…).
              </p>
            </section>
          </div>
        </aside>
      </main>
    </div>
  );
}

/* helpers */
function SidebarLink({ href = "#", icon, label }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-xl px-3 py-2 text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
    >
      <span>{icon}</span>
      <span className="font-medium">{label}</span>
    </Link>
  );
}

function MobileLink({ href, icon, label, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 rounded-xl border border-slate-200 px-3 py-2 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
    >
      <span>{icon}</span>
      <span className="font-medium">{label}</span>
    </Link>
  );
}
