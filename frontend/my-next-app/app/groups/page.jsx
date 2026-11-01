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
  Calendar,
  MapPin,
} from "lucide-react";

export default function GroupsPage() {
  const [theme, setTheme] = useState("light");
  const [mobileOpen, setMobileOpen] = useState(false);

  // simple auth helpers (same style as other pages)
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

  // ----------------- GROUPS MOCK DATA -----------------
  const initialGroups = useMemo(
    () => [
      {
        id: 1,
        title: "Design Lovers",
        description: "A group for UI/UX, product designers and creative minds.",
        members: 23,
        location: "Online",
        youAreMember: true,
        youAreOwner: true,
      },
      {
        id: 2,
        title: "Bahrain Devs",
        description: "Developers & builders from Bahrain sharing knowledge.",
        members: 48,
        location: "Bahrain",
        youAreMember: true,
        youAreOwner: false,
      },
      {
        id: 3,
        title: "Reboot01 Study Group",
        description: "Study sessions, project help and code reviews.",
        members: 15,
        location: "Online",
        youAreMember: false,
        youRequested: false,
        youAreOwner: false,
      },
    ],
    []
  );

  const [groups, setGroups] = useState(initialGroups);
  const [selectedGroupId, setSelectedGroupId] = useState(1);

  const [createForm, setCreateForm] = useState({
    title: "",
    description: "",
  });

  // Posts & events are per selected group (mocked, but easy to replace)
  const [groupPosts, setGroupPosts] = useState([
    {
      id: 1,
      groupId: 1,
      author: "Alex Johnson",
      text: "Welcome to the Design Lovers group 🎨 Share your latest shots here.",
      createdAt: "2d ago",
    },
    {
      id: 2,
      groupId: 2,
      author: "Layla Ahmed",
      text: "Next Bahrain Devs meetup will be next month, stay tuned.",
      createdAt: "5d ago",
    },
  ]);

  const [newPostText, setNewPostText] = useState("");

  const [events, setEvents] = useState([
    {
      id: 1,
      groupId: 1,
      title: "Weekly Design Critique",
      description: "Bring one screen or flow to get feedback.",
      datetime: "Every Thursday · 7:00 PM",
      goingCount: 8,
      notGoingCount: 2,
      myChoice: "going", // "going" | "not_going" | null
    },
    {
      id: 2,
      groupId: 2,
      title: "Bahrain Devs Coffee Meetup ☕",
      description: "Casual chat about projects and ideas.",
      datetime: "25 Nov · 6:30 PM",
      goingCount: 12,
      notGoingCount: 1,
      myChoice: null,
    },
  ]);

  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    datetime: "",
  });

  const selectedGroup = groups.find((g) => g.id === selectedGroupId) || groups[0];

  const myGroups = groups.filter((g) => g.youAreMember);
  const browseGroups = groups;

  // ----------------- HANDLERS -----------------
  function handleCreateGroup(e) {
    e.preventDefault();
    if (!createForm.title.trim()) return;

    const nextId = groups.length ? Math.max(...groups.map((g) => g.id)) + 1 : 1;
    const newGroup = {
      id: nextId,
      title: createForm.title.trim(),
      description: createForm.description.trim() || "No description yet.",
      members: 1,
      location: "Online",
      youAreMember: true,
      youAreOwner: true,
    };

    setGroups((prev) => [...prev, newGroup]);
    setCreateForm({ title: "", description: "" });
    setSelectedGroupId(nextId);
  }

  function handleRequestToJoin(groupId) {
    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId ? { ...g, youRequested: true } : g
      )
    );
  }

  // Only creator can accept in real backend.
  // Here it's just a demo button.
  function handleAcceptRequestDemo(groupId) {
    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId
          ? { ...g, youAreMember: true, youRequested: false, members: g.members + 1 }
          : g
      )
    );
  }

  function handleAddPost(e) {
    e.preventDefault();
    if (!newPostText.trim()) return;
    if (!selectedGroup?.youAreMember) return; // only members

    const nextId = groupPosts.length ? Math.max(...groupPosts.map((p) => p.id)) + 1 : 1;
    const post = {
      id: nextId,
      groupId: selectedGroup.id,
      author: "You",
      text: newPostText.trim(),
      createdAt: "just now",
    };
    setGroupPosts((prev) => [post, ...prev]);
    setNewPostText("");
  }

  function handleRespondToEvent(eventId, choice) {
    setEvents((prev) =>
      prev.map((ev) => {
        if (ev.id !== eventId) return ev;
        let { goingCount, notGoingCount, myChoice } = ev;

        // remove previous choice
        if (myChoice === "going") goingCount -= 1;
        if (myChoice === "not_going") notGoingCount -= 1;

        // apply new choice
        if (choice === "going") goingCount += 1;
        if (choice === "not_going") notGoingCount += 1;

        return { ...ev, goingCount, notGoingCount, myChoice: choice };
      })
    );
  }

  function handleCreateEvent(e) {
    e.preventDefault();
    if (!selectedGroup?.youAreMember) return;
    if (!newEvent.title.trim()) return;

    const nextId = events.length ? Math.max(...events.map((ev) => ev.id)) + 1 : 1;
    setEvents((prev) => [
      ...prev,
      {
        id: nextId,
        groupId: selectedGroup.id,
        title: newEvent.title.trim(),
        description: newEvent.description.trim() || "No description.",
        datetime: newEvent.datetime || "Time TBA",
        goingCount: 0,
        notGoingCount: 0,
        myChoice: null,
      },
    ]);
    setNewEvent({ title: "", description: "", datetime: "" });
  }

  const postsForSelectedGroup = groupPosts.filter(
    (p) => p.groupId === selectedGroup?.id
  );
  const eventsForSelectedGroup = events.filter(
    (ev) => ev.groupId === selectedGroup?.id
  );

  return (
    <div className="min-h-screen">
      {/* HEADER (same design as home, Messages, Profile) */}
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
            <Link className="flex items-center gap-2 text-blue-600 dark:text-blue-400" href="/groups">
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

      {/* MAIN GROUPS CONTENT */}
      <main className="mx-auto max-w-6xl px-4 py-6 md:px-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* LEFT COLUMN: create group + your groups */}
          <div className="space-y-4 lg:col-span-1">
            {/* Create group */}
            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-100">
                Create a group
              </h2>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Add a title and description. You’ll be the creator and can invite others.
              </p>

              <form onSubmit={handleCreateGroup} className="mt-3 space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-300">
                    Title
                  </label>
                  <input
                    value={createForm.title}
                    onChange={(e) =>
                      setCreateForm((f) => ({ ...f, title: e.target.value }))
                    }
                    required
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900"
                    placeholder="e.g. Reboot01 Study Group"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-300">
                    Description
                  </label>
                  <textarea
                    value={createForm.description}
                    onChange={(e) =>
                      setCreateForm((f) => ({ ...f, description: e.target.value }))
                    }
                    rows={3}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900"
                    placeholder="Describe what this group is about…"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-xl bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Create group
                </button>
              </form>
            </section>

            {/* Your groups */}
            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-100">
                Your groups
              </h2>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Groups you created or joined.
              </p>

              {myGroups.length === 0 ? (
                <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                  You don&apos;t belong to any groups yet.
                </p>
              ) : (
                <ul className="mt-3 space-y-2 text-sm">
                  {myGroups.map((g) => (
                    <li key={g.id}>
                      <button
                        onClick={() => setSelectedGroupId(g.id)}
                        className={`flex w-full items-start justify-between gap-2 rounded-xl px-3 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-900 ${
                          g.id === selectedGroupId
                            ? "border border-blue-200 bg-blue-50/80 dark:border-blue-700 dark:bg-blue-900/40"
                            : "border border-slate-200 dark:border-slate-700"
                        }`}
                      >
                        <div>
                          <p className="font-semibold text-slate-800 dark:text-slate-100">
                            {g.title}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {g.members} members
                          </p>
                          {g.youAreOwner && (
                            <p className="mt-1 inline-flex items-center rounded-full bg-yellow-100 px-2 py-0.5 text-[10px] font-semibold text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
                              Creator
                            </p>
                          )}
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>

          {/* RIGHT COLUMN: browse + selected group details */}
          <div className="space-y-4 lg:col-span-2">
            {/* Browse all groups */}
            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-100">
                Browse groups
              </h2>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Find groups and request to join. Only creators can accept requests.
              </p>

              <ul className="mt-3 space-y-2 text-sm">
                {browseGroups.map((g) => (
                  <li
                    key={g.id}
                    className="flex items-start justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-slate-800 dark:text-slate-100">
                        {g.title}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {g.description}
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
                        <span>{g.members} members</span>
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {g.location}
                        </span>
                        {g.youAreMember && (
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700 dark:bg-green-900 dark:text-green-100">
                            You&apos;re in this group
                          </span>
                        )}
                        {g.youRequested && !g.youAreMember && (
                          <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                            Request pending
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <button
                        onClick={() => setSelectedGroupId(g.id)}
                        className="rounded-full border border-slate-300 px-3 py-1 text-xs font-medium hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-800"
                      >
                        View
                      </button>

                      {!g.youAreMember && !g.youRequested && (
                        <button
                          onClick={() => handleRequestToJoin(g.id)}
                          className="rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white hover:bg-blue-700"
                        >
                          Request to join
                        </button>
                      )}

                      {/* Demo: pretend you are the creator and accept requests */}
                      {g.youRequested && !g.youAreMember && (
                        <button
                          onClick={() => handleAcceptRequestDemo(g.id)}
                          className="rounded-full border border-green-500 px-3 py-1 text-xs font-semibold text-green-700 hover:bg-green-50 dark:hover:bg-green-900/30"
                        >
                          (Demo) Accept request
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            {/* Selected group details: posts + events */}
            {selectedGroup && (
              <section className="space-y-4">
                {/* Group header */}
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-base font-semibold text-slate-800 dark:text-slate-50">
                        {selectedGroup.title}
                      </h2>
                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                        {selectedGroup.description}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                        <span>{selectedGroup.members} members</span>
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {selectedGroup.location}
                        </span>
                        {selectedGroup.youAreOwner && (
                          <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-0.5 text-[10px] font-semibold text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
                            You are the creator
                          </span>
                        )}
                        {selectedGroup.youAreMember && !selectedGroup.youAreOwner && (
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700 dark:bg-green-900 dark:text-green-100">
                            You are a member
                          </span>
                        )}
                      </div>
                    </div>

                    {selectedGroup.youAreMember && (
                      <button className="rounded-full border border-slate-300 px-3 py-1 text-xs font-medium hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-800">
                        Invite members (future backend)
                      </button>
                    )}
                  </div>
                </div>

                {/* Posts */}
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-50">
                      Group posts
                    </h3>
                    {!selectedGroup.youAreMember && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Only members can post and see content.
                      </p>
                    )}
                  </div>

                  {selectedGroup.youAreMember && (
                    <form onSubmit={handleAddPost} className="mt-3 flex flex-col gap-2">
                      <textarea
                        value={newPostText}
                        onChange={(e) => setNewPostText(e.target.value)}
                        rows={2}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900"
                        placeholder="Share something with the group…"
                      />
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
                        >
                          Post
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="mt-4 space-y-3">
                    {selectedGroup.youAreMember ? (
                      postsForSelectedGroup.length === 0 ? (
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          No posts yet. Be the first to post!
                        </p>
                      ) : (
                        postsForSelectedGroup.map((p) => (
                          <article
                            key={p.id}
                            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
                          >
                            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                              <span className="font-semibold text-slate-700 dark:text-slate-200">
                                {p.author}
                              </span>
                              <span>{p.createdAt}</span>
                            </div>
                            <p className="mt-1 text-sm text-slate-800 dark:text-slate-100">
                              {p.text}
                            </p>
                          </article>
                        ))
                      )
                    ) : (
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Join this group to see posts.
                      </p>
                    )}
                  </div>
                </div>

                {/* Events */}
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                  <div className="flex items-center justify-between">
                    <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-50">
                      <Calendar className="h-4 w-4" />
                      Events
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Choose between <strong>Going</strong> or <strong>Not going</strong>.
                    </p>
                  </div>

                  {selectedGroup.youAreMember && (
                    <form
                      onSubmit={handleCreateEvent}
                      className="mt-3 grid gap-2 text-xs md:grid-cols-3"
                    >
                      <div className="md:col-span-1">
                        <label className="block font-medium text-slate-600 dark:text-slate-300">
                          Title
                        </label>
                        <input
                          value={newEvent.title}
                          onChange={(e) =>
                            setNewEvent((ev) => ({ ...ev, title: e.target.value }))
                          }
                          className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900"
                          placeholder="e.g. Group Standup"
                        />
                      </div>
                      <div className="md:col-span-1">
                        <label className="block font-medium text-slate-600 dark:text-slate-300">
                          Day/Time
                        </label>
                        <input
                          value={newEvent.datetime}
                          onChange={(e) =>
                            setNewEvent((ev) => ({ ...ev, datetime: e.target.value }))
                          }
                          className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900"
                          placeholder="e.g. 24 Nov · 8:00 PM"
                        />
                      </div>
                      <div className="md:col-span-1">
                        <label className="block font-medium text-slate-600 dark:text-slate-300">
                          Description
                        </label>
                        <input
                          value={newEvent.description}
                          onChange={(e) =>
                            setNewEvent((ev) => ({ ...ev, description: e.target.value }))
                          }
                          className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900"
                          placeholder="Optional"
                        />
                      </div>
                      <div className="md:col-span-3 flex justify-end">
                        <button
                          type="submit"
                          className="mt-1 rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
                        >
                          Create event
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="mt-4 space-y-3">
                    {eventsForSelectedGroup.length === 0 ? (
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        No events yet.
                      </p>
                    ) : (
                      eventsForSelectedGroup.map((ev) => (
                        <article
                          key={ev.id}
                          className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-semibold text-slate-800 dark:text-slate-100">
                                {ev.title}
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                {ev.datetime}
                              </p>
                              <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                                {ev.description}
                              </p>
                              <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                                Going: {ev.goingCount} · Not going: {ev.notGoingCount}
                              </p>
                            </div>
                            {selectedGroup.youAreMember && (
                              <div className="flex flex-col gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleRespondToEvent(ev.id, "going")}
                                  className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
                                    ev.myChoice === "going"
                                      ? "bg-green-600 text-white"
                                      : "border border-green-500 text-green-700 hover:bg-green-50 dark:hover:bg-green-900/30"
                                  }`}
                                >
                                  Going
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRespondToEvent(ev.id, "not_going")}
                                  className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
                                    ev.myChoice === "not_going"
                                      ? "bg-slate-700 text-white"
                                      : "border border-slate-400 text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
                                  }`}
                                >
                                  Not going
                                </button>
                              </div>
                            )}
                          </div>
                        </article>
                      ))
                    )}
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>
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
