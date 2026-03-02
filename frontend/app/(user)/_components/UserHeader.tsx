"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Bell } from "lucide-react";
import { getPublicAnnouncements, type Announcement } from "@/lib/api/announcements";

export default function UserHeader() {
  const { user } = useAuth();
  const router = useRouter();
  const [notificationsOpen, setNotificationsOpen] = React.useState(false);
  const [announcements, setAnnouncements] = React.useState<Announcement[]>([]);
  const [loadingAnnouncements, setLoadingAnnouncements] = React.useState(false);
  const [lastSeenAt, setLastSeenAt] = React.useState<string | null>(null);

  const storageKey = "user_notifications_last_seen_at";

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const seen = window.localStorage.getItem(storageKey);
    setLastSeenAt(seen);
  }, []);

  React.useEffect(() => {
    const loadAnnouncements = async () => {
      try {
        setLoadingAnnouncements(true);
        const response = await getPublicAnnouncements(1, 20);
        setAnnouncements(response?.data || []);
      } catch {
        setAnnouncements([]);
      } finally {
        setLoadingAnnouncements(false);
      }
    };

    loadAnnouncements();
  }, []);

  const unreadCount = React.useMemo(() => {
    if (!announcements.length) return 0;
    const seenTs = lastSeenAt ? new Date(lastSeenAt).getTime() : 0;
    return announcements.filter((announcement) => {
      const timestamp = new Date(announcement.published_at || announcement.created_at).getTime();
      return timestamp > seenTs;
    }).length;
  }, [announcements, lastSeenAt]);

  const toggleNotifications = () => {
    const next = !notificationsOpen;
    setNotificationsOpen(next);

    if (next && typeof window !== "undefined") {
      const nowIso = new Date().toISOString();
      window.localStorage.setItem(storageKey, nowIso);
      setLastSeenAt(nowIso);
    }
  };

  const initials = `${user?.firstName?.[0] ?? "U"}${user?.lastName?.[0] ?? ""}`;
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050";
  const profileImageUrl = user?.imageUrl
    ? (user.imageUrl.startsWith("http") ? user.imageUrl : `${apiBaseUrl}${user.imageUrl}`)
    : null;

  return (
    <header className="w-full bg-transparent px-4 md:px-8 py-3 md:py-4 flex items-center justify-between">
      <div />

      <div className="flex items-center gap-2 md:gap-3">
        <div className="relative">
          <button
            aria-label="Notifications"
            onClick={toggleNotifications}
            className="w-9 h-9 md:w-10 md:h-10 bg-white border border-slate-200 rounded-full shadow-sm flex items-center justify-center hover:shadow-md transition relative"
          >
            <Bell className="w-5 h-5 text-slate-600" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-red-500 text-white text-[10px] leading-4 font-semibold text-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white border border-slate-200 rounded-2xl shadow-lg z-50 p-3">
              <p className="text-sm font-semibold text-slate-900 px-2 pb-2">Notifications</p>
              {loadingAnnouncements ? (
                <p className="text-sm text-slate-500 px-2 py-3">Loading...</p>
              ) : announcements.length === 0 ? (
                <p className="text-sm text-slate-500 px-2 py-3">No notifications yet.</p>
              ) : (
                <div className="space-y-2">
                  {announcements.map((announcement) => (
                    <article key={announcement.id} className="rounded-xl border border-slate-100 p-3 bg-slate-50">
                      <p className="text-sm font-semibold text-slate-900">{announcement.title}</p>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-2">{announcement.message}</p>
                      <p className="text-[11px] text-slate-400 mt-2">
                        {new Date(announcement.published_at || announcement.created_at).toLocaleString()}
                      </p>
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <button
          aria-label="Profile"
          onClick={() => router.push("/user/my-profile")}
          className="flex items-center gap-2 md:gap-3 bg-white border border-slate-200 rounded-full px-2.5 md:px-3 py-1.5 md:py-2 shadow-sm hover:shadow-md transition"
        >
          {profileImageUrl ? (
            <img
              src={profileImageUrl}
              alt={user?.firstName || "User"}
              className="w-9 h-9 rounded-full object-cover border border-violet-100"
            />
          ) : (
            <span className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-semibold text-sm">
              {initials}
            </span>
          )}
          <span className="text-sm font-medium text-slate-700">{user?.firstName ?? "User"}</span>
        </button>
      </div>
    </header>
  );
}
