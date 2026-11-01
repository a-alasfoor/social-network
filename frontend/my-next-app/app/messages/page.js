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
  Users,
  UserPlus,
  LogOut, 
} from "lucide-react";

export default function MessagesPage() {
  const [theme, setTheme] = useState("light");
  const [mobileOpen, setMobileOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [messageInput, setMessageInput] = useState("");

  // --- theme load ---
  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("theme") : null;
    const prefersDark =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(saved || (prefersDark ? "dark" : "light"));
  }, []);

  // --- theme apply ---
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

  // --- mock previous chats (replace with backend later) ---
  const chats = useMemo(
    () => [
      {
        id: 1,
        name: "Alex Johnson",
        username: "alexj",
        avatar: "https://i.pravatar.cc/64?img=5",
        lastMessage: "I’ll share the design soon!",
        lastActive: "2m ago",
        online: true,
      },
      {
        id: 2,
        name: "Layla Ahmed",
        username: "layla",
        avatar: "https://i.pravatar.cc/64?img=21",
        lastMessage: "The prototype is almost done 🚀",
        lastActive: "10m ago",
        online: false,
      },
      {
        id: 3,
        name: "Sarah Johnson",
        username: "sarahj",
        avatar: "https://i.pravatar.cc/64?img=12",
        lastMessage: "Let’s meet tomorrow?",
        lastActive: "1h ago",
        online: true,
      },
    ],
    []
  );

  // --- mock messages for selected chat (static for now) ---
  const messages = useMemo(
    () => [
      { id: "m1", fromMe: false, text: "Hey! How is your project going?", time: "10:20" },
      { id: "m2", fromMe: true, text: "Pretty good, working on the frontend now 😄", time: "10:21" },
      { id: "m3", fromMe: false, text: "Nice! Send me a screenshot later.", time: "10:22" },
      { id: "m4", fromMe: true, text: "Inshallah 🙌", time: "10:23" },
    ],
    []
  );

  // select first chat by default
  useEffect(() => {
    if (!selectedChatId && chats.length > 0) {
      setSelectedChatId(chats[0].id);
    }
  }, [chats, selectedChatId]);

  const filteredChats = chats.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.username.toLowerCase().includes(q)
    );
  });

  const selectedChat = chats.find((c) => c.id === selectedChatId) || null;

  function handleSubmit(e) {
    e.preventDefault();
    if (!selectedChat || !messageInput.trim()) return;

    // Frontend-only: just clear input for now
    // Later you will push message to state & send to backend
    setMessageInput("");
  }

  return (
    <div className="min-h-screen">
      {/* HEADER (same style as home) */}
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
            <Link className="flex items-center gap-2 text-blue-600 dark:text-blue-400" href="/messages">
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
              <MobileLink href="/friends" icon={<Users2 className="h-5 w-5" />} label="Friends" onClick={() => setMobileOpen(false)} />
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

      {/* CHAT LAYOUT */}
      <main className="mx-auto max-w-5xl px-4 py-6 md:px-6">
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <header className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-700">
            <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
              Messages
            </h1>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Frontend only · demo chats
            </span>
          </header>

          <div className="flex h-[calc(100vh-170px)] flex-col divide-y divide-slate-200 dark:divide-slate-700 lg:h-[72vh] lg:flex-row lg:divide-x">

            <aside className="w-full flex-shrink-0 lg:w-72">
              <div className="border-b border-slate-200 p-3 dark:border-slate-700">
                <div className="relative">
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search users…"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 pr-9 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900"
                  />
                  <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                    🔍
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                  Search to start a new chat.
                </p>
              </div>

              <div className="max-h-48 overflow-y-auto p-2 space-y-1 lg:max-h-none lg:h-full">
                {filteredChats.length === 0 && (
                  <div className="p-3 text-sm text-slate-500 dark:text-slate-400">
                    No conversations match{" "}
                    <span className="font-medium">&quot;{search}&quot;</span>.
                  </div>
                )}

                {filteredChats.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedChatId(c.id)}
                    className={`flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-900 ${
                      c.id === selectedChatId
                        ? "bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-100"
                        : "text-slate-800 dark:text-slate-100"
                    }`}
                  >
                    <div className="relative">
                      <img
                        src={c.avatar}
                        alt={c.name}
                        className="h-9 w-9 rounded-full object-cover"
                      />
                      {c.online && (
                        <span className="absolute -bottom-0.5 -right-0.5 inline-block h-3 w-3 rounded-full border-2 border-white bg-green-500 dark:border-slate-800" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate font-medium">{c.name}</span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          {c.lastActive}
                        </span>
                      </div>
                      <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                        {c.lastMessage}
                      </p>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500">
                        @{c.username}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </aside>

            {/* RIGHT: message thread */}
            <section className="flex min-h-0 flex-1 flex-col">
              {/* chat header */}
              <div className="flex items-center gap-3 border-b border-slate-200 px-4 py-3 dark:border-slate-700">
                {selectedChat ? (
                  <>
                    <div className="relative">
                      <img
                        src={selectedChat.avatar}
                        alt={selectedChat.name}
                        className="h-9 w-9 rounded-full object-cover"
                      />
                      {selectedChat.online && (
                        <span className="absolute -bottom-0.5 -right-0.5 inline-block h-3 w-3 rounded-full border-2 border-white bg-green-500 dark:border-slate-800" />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                        {selectedChat.name}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        @{selectedChat.username} ·{" "}
                        {selectedChat.online
                          ? "Online"
                          : `Last active ${selectedChat.lastActive}`}
                      </span>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Select a conversation from the left to start chatting.
                  </p>
                )}
              </div>

              {/* messages area */}
              <div className="flex-1 space-y-2 overflow-y-auto bg-slate-50 px-4 py-4 dark:bg-slate-900">
                {selectedChat ? (
                  messages.map((m) => (
                    <div
                      key={m.id}
                      className={`flex ${
                        m.fromMe ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs rounded-2xl px-3 py-2 text-sm shadow-sm md:max-w-sm ${
                          m.fromMe
                            ? "rounded-br-sm bg-blue-600 text-white"
                            : "rounded-bl-sm bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-50"
                        }`}
                      >
                        <p>{m.text}</p>
                        <span
                          className={`mt-1 block text-[10px] ${
                            m.fromMe
                              ? "text-blue-100"
                              : "text-slate-400 dark:text-slate-500"
                          }`}
                        >
                          {m.time}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <div className="text-center text-sm text-slate-500 dark:text-slate-400">
                      <p className="font-semibold">No conversation selected</p>
                      <p className="mt-1 text-xs">
                        Choose someone from the left or search for a user to start a chat.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* input */}
              <form
                onSubmit={handleSubmit}
                className="border-t border-slate-200 px-4 py-3 dark:border-slate-700"
              >
                <div className="flex items-center gap-2">
                  <input
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder={
                      selectedChat
                        ? `Message @${selectedChat.username}…`
                        : "Select a chat to start messaging…"
                    }
                    disabled={!selectedChat}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900"
                  />
                  <button
                    type="submit"
                    disabled={!selectedChat || !messageInput.trim()}
                    className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Send
                  </button>
                </div>
              </form>
            </section>
          </div>
        </section>
      </main>
    </div>
  );
}

/* helpers */

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
