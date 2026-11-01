"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Home as HomeIcon,
  Users2,
  MessageCircle,
  Bell,
  User as UserIcon,
  Bookmark,
  Sun,
  Moon,
  Menu,
  X,
  Users,
  UserPlus,
  LogOut,
  MapPin,
  Link as LinkIcon,
  Calendar,
  Globe2,
  Lock,
  Mail,
} from "lucide-react";

function formatDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function ProfilePage() {
  const [theme, setTheme] = useState("light");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("posts"); // "posts" | "followers" | "following"
  const [isPrivate, setIsPrivate] = useState(false);

  // theme hydrate
  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("theme") : null;
    const prefersDark =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(saved || (prefersDark ? "dark" : "light"));
  }, []);

  // theme apply
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

  // logout placeholder
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  // mock current user data
  const currentUser = useMemo(
    () => ({
      id: 1,
      fullName: "Alex Johnson",
      username: "alexj",
      email: "alex@example.com",
      avatar: "https://i.pravatar.cc/128?img=5",
      bio: "Product designer & front-end enthusiast. Building delightful interfaces.",
      location: "Lisbon, Portugal",
      website: "https://alex.design",
      joinedAt: "2023-03-15T00:00:00.000Z",
      followersCount: 128,
      followingCount: 92,
      postsCount: 34,
    }),
    []
  );

  const userPosts = useMemo(
    () => [
      {
        id: 1,
        createdAt: "2025-11-10T10:00:00.000Z",
        text: "Just shipped a new dashboard design ✨ Feedback is welcome!",
        image:
          "https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=1600&auto=format&fit=crop",
      },
      {
        id: 2,
        createdAt: "2025-11-05T09:30:00.000Z",
        text: "Exploring microinteractions to improve onboarding flows.",
        image:
          "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1600&auto=format&fit=crop",
      },
    ],
    []
  );

  const followers = useMemo(
    () => [
      {
        id: 10,
        name: "Sarah Johnson",
        username: "sarahj",
        avatar: "https://i.pravatar.cc/64?img=12",
        mutualCount: 5,
      },
      {
        id: 11,
        name: "Michael Chen",
        username: "mchen",
        avatar: "https://i.pravatar.cc/64?img=32",
        mutualCount: 2,
      },
    ],
    []
  );

  const following = useMemo(
    () => [
      {
        id: 20,
        name: "Emma Wilson",
        username: "emmaw",
        avatar: "https://i.pravatar.cc/64?img=8",
        mutualCount: 8,
      },
      {
        id: 21,
        name: "James Rodriguez",
        username: "jamesr",
        avatar: "https://i.pravatar.cc/64?img=15",
        mutualCount: 3,
      },
    ],
    []
  );

  const handlePrivacyToggle = () => {
    setIsPrivate((prev) => !prev);
  };

  return (
    <div className="min-h-screen">
      {/* HEADER (same as home page) */}
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
            <Link className="flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400" href="/friends">
              <Users2 className="h-5 w-5" /> Friends
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

      {/* MOBILE MENU (same as home, with Profile link) */}
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
              <MobileLink href="/" icon={<HomeIcon className="h-5 w-5" />} label="Home" onClick={() => setMobileOpen(false)} />
              <MobileLink href="/friends" icon={<Users2 className="h-5 w-5" />} label="Friends" onClick={() => setMobileOpen(false)} />
              <MobileLink href="/messages" icon={<MessageCircle className="h-5 w-5" />} label="Messages" onClick={() => setMobileOpen(false)} />
              <MobileLink
                href="/notifications"
                icon={<Bell className="h-5 w-5" />}
                label="Notifications"
                onClick={() => setMobileOpen(false)}
              />
              <div className="my-2 h-px bg-slate-200 dark:bg-slate-700" />
              <MobileLink href="/profile" icon={<UserIcon className="h-5 w-5" />} label="Profile" onClick={() => setMobileOpen(false)} />
              <MobileLink href="/saved" icon={<Bookmark className="h-5 w-5" />} label="Saved" onClick={() => setMobileOpen(false)} />
              <MobileLink href="/people" icon={<Users className="h-5 w-5" />} label="People You May Know" onClick={() => setMobileOpen(false)} />
              <MobileLink href="/requests" icon={<UserPlus className="h-5 w-5" />} label="Friend Requests" onClick={() => setMobileOpen(false)} />
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

      {/* PROFILE CONTENT */}
      <main className="mx-auto max-w-5xl px-4 py-6 text-slate-900 dark:text-slate-50 md:px-6">
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* LEFT: USER INFO */}
          <aside className="w-full lg:w-72">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <div className="flex items-center gap-4">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.fullName}
                  className="h-20 w-20 rounded-full object-cover"
                />
                <div className="min-w-0">
                  <h1 className="truncate text-xl font-bold">{currentUser.fullName}</h1>
                  <p className="truncate text-sm text-slate-500 dark:text-slate-400">
                    @{currentUser.username}
                  </p>
                </div>
              </div>

              <p className="mt-4 text-sm text-slate-700 dark:text-slate-200">
                {currentUser.bio}
              </p>

              <div className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                {currentUser.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{currentUser.location}</span>
                  </div>
                )}
                {currentUser.website && (
                  <div className="flex items-center gap-2">
                    <LinkIcon className="h-4 w-4" />
                    <a
                      href={currentUser.website}
                      target="_blank"
                      rel="noreferrer"
                      className="truncate text-blue-600 hover:underline dark:text-blue-400"
                    >
                      {currentUser.website}
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span className="truncate">{currentUser.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {formatDate(currentUser.joinedAt)}</span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  {isPrivate ? (
                    <>
                      <Lock className="h-4 w-4" />
                      <span>Private profile</span>
                    </>
                  ) : (
                    <>
                      <Globe2 className="h-4 w-4" />
                      <span>Public profile</span>
                    </>
                  )}
                </div>
                <button
                  onClick={handlePrivacyToggle}
                  className="inline-flex items-center rounded-full border border-slate-300 bg-white px-3 py-1 text-[11px] font-semibold hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700"
                >
                  {isPrivate ? "Make public" : "Make private"}
                </button>
              </div>

              <div className="mt-4 flex items-center justify-between text-center text-sm">
                <StatBlock label="Posts" value={currentUser.postsCount} />
                <StatBlock label="Followers" value={currentUser.followersCount} />
                <StatBlock label="Following" value={currentUser.followingCount} />
              </div>
            </section>
          </aside>

          {/* RIGHT: TABS + CONTENT */}
          <section className="flex-1 space-y-4">
            {/* TABS: POSTS / FOLLOWERS / FOLLOWING */}
            <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <div className="grid grid-cols-3 gap-1 text-xs font-medium sm:text-sm">
                <ProfileTab
                  icon={<UserIcon className="h-4 w-4" />}
                  label="Posts"
                  active={activeTab === "posts"}
                  onClick={() => setActiveTab("posts")}
                />
                <ProfileTab
                  icon={<Users className="h-4 w-4" />}
                  label="Followers"
                  active={activeTab === "followers"}
                  onClick={() => setActiveTab("followers")}
                />
                <ProfileTab
                  icon={<Users className="h-4 w-4" />}
                  label="Following"
                  active={activeTab === "following"}
                  onClick={() => setActiveTab("following")}
                />
              </div>
            </div>

            {/* POSTS TAB */}
            {activeTab === "posts" && (
              <div className="space-y-4">
                {userPosts.length === 0 && (
                  <EmptyState
                    title="No posts yet"
                    subtitle="Start sharing updates to see them appear here."
                  />
                )}
                {userPosts.map((post) => (
                  <article
                    key={post.id}
                    className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800"
                  >
                    <header className="flex items-center gap-3 px-4 py-3">
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.fullName}
                        className="h-10 w-10 rounded-full"
                      />
                      <div>
                        <div className="font-semibold">{currentUser.fullName}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          @{currentUser.username} · {formatDate(post.createdAt)}
                        </div>
                      </div>
                    </header>
                    <div className="px-4 pb-3 text-sm leading-relaxed">
                      {post.text}
                    </div>
                    {post.image && (
                      <div className="overflow-hidden rounded-b-2xl">
                        <img
                          src={post.image}
                          alt="Post"
                          className="max-h-[480px] w-full object-cover"
                        />
                      </div>
                    )}
                  </article>
                ))}
              </div>
            )}

            {/* FOLLOWERS TAB */}
            {activeTab === "followers" && (
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                {followers.length === 0 && (
                  <EmptyState
                    title="No followers yet"
                    subtitle="Followers will appear in this list."
                  />
                )}
                <ul className="space-y-3">
                  {followers.map((u) => (
                    <li
                      key={u.id}
                      className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-900"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="h-9 w-9 rounded-full"
                        />
                        <div>
                          <div className="text-sm font-semibold">{u.name}</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            @{u.username} · {u.mutualCount} mutual
                          </div>
                        </div>
                      </div>
                      <button className="rounded-full border border-slate-300 px-3 py-1 text-xs font-medium hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-700">
                        View
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* FOLLOWING TAB */}
            {activeTab === "following" && (
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                {following.length === 0 && (
                  <EmptyState
                    title="Not following anyone"
                    subtitle="Accounts followed will appear here."
                  />
                )}
                <ul className="space-y-3">
                  {following.map((u) => (
                    <li
                      key={u.id}
                      className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-900"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="h-9 w-9 rounded-full"
                        />
                        <div>
                          <div className="text-sm font-semibold">{u.name}</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            @{u.username} · {u.mutualCount} mutual
                          </div>
                        </div>
                      </div>
                      <button className="rounded-full border border-slate-300 px-3 py-1 text-xs font-medium hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-700">
                        View
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

/* helpers */

function StatBlock({ label, value }) {
  return (
    <div className="flex flex-col">
      <span className="text-sm font-semibold">{value}</span>
      <span className="text-xs text-slate-500 dark:text-slate-400">{label}</span>
    </div>
  );
}

function ProfileTab({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-1 rounded-xl px-2 py-2 transition ${
        active
          ? "bg-blue-600 text-white"
          : "bg-transparent text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
      }`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

function EmptyState({ title, subtitle }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
      <p className="font-semibold text-slate-700 dark:text-slate-200">{title}</p>
      <p className="mt-1 text-xs">{subtitle}</p>
    </div>
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
