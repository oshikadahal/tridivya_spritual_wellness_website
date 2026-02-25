"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getSavedSessions, type SavedSession } from "@/lib/api/content";

const filterLabelToType: Record<string, SavedSession["content_type"] | undefined> = {
    "All Content": undefined,
    "Meditation Videos": "meditation",
    "Yoga Programs": "yoga",
    "Mantras & Chants": "mantra",
};

const durationText = (seconds?: number) => {
    if (!seconds || seconds <= 0) return "--";
    return `${Math.max(1, Math.round(seconds / 60))} mins`;
};

export default function SavedSessionsPage() {
    const [filter, setFilter] = useState("All Content");
    const [searchText, setSearchText] = useState("");
    const [sessions, setSessions] = useState<SavedSession[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const filters = ["All Content", "Meditation Videos", "Yoga Programs", "Mantras & Chants"];

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getSavedSessions(filterLabelToType[filter]);
                setSessions(data);
            } catch (err: Error | any) {
                setError(err.message || "Failed to load saved sessions");
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [filter]);

    const filteredSessions = useMemo(() => {
        if (!searchText.trim()) return sessions;
        const q = searchText.toLowerCase();
        return sessions.filter((item) => (
            item.title.toLowerCase().includes(q)
            || (item.subtitle || "").toLowerCase().includes(q)
            || item.content_type.toLowerCase().includes(q)
        ));
    }, [searchText, sessions]);

    const getSessionLink = (session: SavedSession) => {
        if (session.content_type === "meditation") {
            return `/meditationvideos/${session.content_id}`;
        }
        if (session.content_type === "yoga") {
            return `/yogaprograms/${session.content_id}`;
        }
        if (session.content_type === "mantra") {
            return `/mantraprogram/playlist/${session.content_id}`;
        }
        return "/wisdomlibrary";
    };

    return (
        <div className="min-h-screen bg-linear-to-b from-slate-50 to-white text-slate-900">
            <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-10 space-y-6">
                <section className="space-y-4">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">Your Saved Sessions</h1>
                            <p className="text-sm text-slate-500 mt-1">All your bookmarked practices in one place.</p>
                        </div>
                        <div className="w-full md:w-80">
                            <input
                                type="text"
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                placeholder="Search your library..."
                                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
                            />
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 flex items-center gap-3 shadow-sm">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">
                            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" aria-hidden="true"><rect width="24" height="24" rx="6" fill="#4F46E5" fillOpacity="0.15"/><path d="M7 7h10v10H7V7z" fill="#4F46E5"/></svg>
                        </span>
                        <p className="text-sm font-medium text-slate-700">You have {sessions.length} saved sessions</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {filters.map((f) => (
                            <button
                                key={f}
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition ${filter === f ? "session-btn-primary text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
                                onClick={() => setFilter(f)}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </section>

                {error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</div>}
                {loading && <div className="text-sm text-slate-500">Loading...</div>}

                {!loading && filteredSessions.length === 0 ? (
                    <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
                        No saved sessions found for this filter.
                    </div>
                ) : (
                    <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        {filteredSessions.map((session) => (
                            <article
                                key={`${session.content_type}-${session.content_id}`}
                                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col"
                            >
                                <div className="flex gap-4">
                                    <img
                                        src={session.thumbnail_url || "/images/homepage.png"}
                                        alt={session.title}
                                        className="w-20 h-20 rounded-xl object-cover shrink-0"
                                    />

                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2 mb-2">
                                            <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-md text-[11px] font-semibold capitalize">
                                                {session.content_type}
                                            </span>
                                            <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-md text-[11px] font-semibold">
                                                {durationText(session.duration_seconds)}
                                            </span>
                                        </div>
                                        <h2 className="text-2xl font-bold text-slate-900 leading-tight">{session.title}</h2>
                                        {session.subtitle && (
                                            <p className="text-sm text-slate-500 mt-1 line-clamp-2">{session.subtitle}</p>
                                        )}
                                    </div>
                                </div>

                                <Link
                                    href={getSessionLink(session)}
                                    className="session-btn-primary mt-4 inline-flex items-center justify-center px-6 py-2.5 rounded-xl font-semibold"
                                >
                                    Open Session
                                </Link>
                            </article>
                        ))}
                    </section>
                )}
            </main>
        </div>
    );
}
