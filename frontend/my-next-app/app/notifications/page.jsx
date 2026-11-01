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
  UserPlus,
  Lock,
  Calendar,
  Heart,
  MessageCircle as CommentIcon,
  LogOut,
} from "lucide-react";

export default function NotificationsPage() {
  const [theme, setTheme] = useState("light");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [filter, setFilter] = useState("all"); // "all" | "unread"

  // THEME
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

//   // ---------------- NOTIFICATIONS MOCK DATA ----------------
//   const initialNotifications = useMemo(
//   () => [
//     {
//       id: 1,
//       type: "follow_request",
//       read: false,
//       status: "pending",
//       createdAt: "2m ago",
//       actor: "Sarah Johnson",
//       avatar: "https://i.pravatar.cc/40?img=12",
//       message: "wants to follow your private profile.",
//     },
//     {
//       id: 2,
//       type: "group_invite",
//       read: false,
//       status: "pending",
//       createdAt: "10m ago",
//       actor: "Layla Ahmed",
//       avatar: "https://i.pravatar.cc/40?img=21",
//       groupName: "Bahrain Devs",
//       message: "invited you to join the group “Bahrain Devs”.",
//     },
//     {
//       id: 3,
//       type: "group_join_request",
//       read: false,
//       status: "pending",
//       createdAt: "25m ago",
//       actor: "Omar Ali",
//       avatar: "https://i.pravatar.cc/40?img=30",
//       groupName: "Design Lovers",
//       message: "requested to join your group “Design Lovers”.",
//     },
//     {
//       id: 4,
//       type: "group_event",
//       read: false,
//       status: null,
//       createdAt: "1h ago",
//       actor: "Alex Johnson",
//       avatar: "https://i.pravatar.cc/40?img=5",
//       groupName: "Design Lovers",
//       eventTitle: "Weekly Design Critique",
//       message: "created a new event in “Design Lovers”.",
//     },
//   ],
//   []
// );

  const [notifications, setNotifications] = useState(initialNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications =
    filter === "unread"
      ? notifications.filter((n) => !n.read)
      : notifications;

  function handleAction(id, action) {
    // action: "accept" | "decline"
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id
          ? {
              ...n,
              status: action === "accept" ? "accepted" : "declined",
              read: true,
            }
          : n
      )
    );
  }

  function markAsRead(id) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  // icon & color based on type
  function getTypeIconAndLabel(type) {
  switch (type) {
    case "follow_request":
      return { icon: <Lock className="h-4 w-4" />, label: "Follow request" };
    case "group_invite":
      return { icon: <Users2 className="h-4 w-4" />, label: "Group invitation" };
    case "group_join_request":
      return { icon: <UserPlus className="h-4 w-4" />, label: "Join request" };
    case "group_event":
      return { icon: <Calendar className="h-4 w-4" />, label: "Group event" };
    default:
      return { icon: <Bell className="h-4 w-4" />, label: "Notification" };
  }
}

  return (
    <div className="min-h-screen">
      {/* HEADER */}
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
              className="relative flex items-center gap-2 text-blue-600 dark:text-blue-400"
              href="/notifications"
            >
              <Bell className="h-5 w-5" /> Notifications
              {unreadCount > 0 && (
                <span className="absolute -right-3 -top-2 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-bold text-white">
                  {unreadCount}
                </span>
              )}
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

      {/* MOBILE MENU */}
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
              <MobileLink href="/groups" icon={<Users2 className="h-5 w-5" />} label="Groups" onClick={() => setMobileOpen(false)} />
              <MobileLink href="/messages" icon={<MessageCircle className="h-5 w-5" />} label="Messages" onClick={() => setMobileOpen(false)} />
              <MobileLink
                href="/notifications"
                icon={<Bell className="h-5 w-5" />}
                label="Notifications"
                onClick={() => setMobileOpen(false)}
              />
              <div className="my-2 h-px bg-slate-200 dark:bg-slate-700" />
              <MobileLink href="/profile" icon={<User className="h-5 w-5" />} label="Profile" onClick={() => setMobileOpen(false)} />
              <MobileLink href="/saved" icon={<Bookmark className="h-5 w-5" />} label="Saved" onClick={() => setMobileOpen(false)} />
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

      {/* MAIN CONTENT */}
      <main className="mx-auto max-w-4xl px-4 py-6 md:px-6">
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <header className="flex flex-col gap-3 border-b border-slate-200 pb-3 text-sm dark:border-slate-700 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-base font-semibold text-slate-900 dark:text-slate-50">
                Notifications
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                New notifications are separate from private messages. Manage follow requests, group invites, join requests, and events here.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="inline-flex rounded-full bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                Unread:{" "}
                <span className="ml-1 rounded-full bg-blue-600 px-2 text-white">
                  {unreadCount}
                </span>
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="rounded-full border border-slate-300 px-3 py-1 text-[11px] font-medium text-slate-600 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
                >
                  Mark all as read
                </button>
              )}
            </div>
          </header>

          {/* FILTER TABS */}
          <div className="mt-3 inline-flex rounded-full border border-slate-200 bg-slate-50 p-1 text-xs dark:border-slate-700 dark:bg-slate-900">
            <button
              onClick={() => setFilter("all")}
              className={`rounded-full px-3 py-1 font-medium ${
                filter === "all"
                  ? "bg-blue-600 text-white"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`rounded-full px-3 py-1 font-medium ${
                filter === "unread"
                  ? "bg-blue-600 text-white"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              }`}
            >
              Unread
            </button>
          </div>

          {/* LIST */}
          <div className="mt-4 space-y-3">
            {filteredNotifications.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                No notifications to show.
              </p>
            ) : (
              filteredNotifications.map((n) => {
                const { icon, label } = getTypeIconAndLabel(n.type);
                const isActionable =
                  n.type === "follow_request" ||
                  n.type === "group_invite" ||
                  n.type === "group_join_request";

                return (
                  <article
                    key={n.id}
                    className={`flex items-start gap-3 rounded-2xl border px-3 py-2 text-sm transition dark:border-slate-700 ${
                      n.read
                        ? "border-slate-200 bg-white dark:bg-slate-800"
                        : "border-blue-200 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/30"
                    }`}
                  >
                    {/* avatar */}
                    <img
                      src={n.avatar}
                      alt={n.actor}
                      className="mt-0.5 h-9 w-9 flex-shrink-0 rounded-full object-cover"
                    />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700 dark:bg-slate-900 dark:text-slate-200">
                            {icon}
                            <span>{label}</span>
                          </span>
                          {!n.read && (
                            <span className="h-2 w-2 rounded-full bg-blue-500" />
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400 dark:text-slate-500">
                          {n.createdAt}
                        </span>
                      </div>

                      <p className="mt-1 text-sm text-slate-800 dark:text-slate-100">
                        <span className="font-semibold">{n.actor}</span>{" "}
                        {n.message}
                      </p>

                      {n.type === "group_event" && n.eventTitle && (
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          Event: <span className="font-medium">{n.eventTitle}</span>
                        </p>
                      )}

                      {n.type === "group_invite" && n.groupName && (
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          Group: <span className="font-medium">{n.groupName}</span>
                        </p>
                      )}

                      {n.type === "group_join_request" && n.groupName && (
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          Group: <span className="font-medium">{n.groupName}</span>
                        </p>
                      )}

                      {/* ACTIONS */}
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        {isActionable && n.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleAction(n.id, "accept")}
                              className="rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white hover:bg-blue-700"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleAction(n.id, "decline")}
                              className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
                            >
                              Decline
                            </button>
                          </>
                        )}

                        {isActionable && n.status === "accepted" && (
                          <span className="rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-semibold text-green-700 dark:bg-green-900 dark:text-green-100">
                            Accepted
                          </span>
                        )}

                        {isActionable && n.status === "declined" && (
                          <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[11px] font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-100">
                            Declined
                          </span>
                        )}

                        {n.type === "group_event" && (
                          <button
                            type="button"
                            className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
                          >
                            View event
                          </button>
                        )}

                        {!isActionable && (
                          <button
                            type="button"
                            onClick={() => markAsRead(n.id)}
                            className="text-[11px] font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                          >
                            {n.read ? "Read" : "Mark as read"}
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

/* helper component */
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
