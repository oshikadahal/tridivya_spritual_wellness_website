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
        <div className="p-8">
            <h1 className="text-3xl font-bold text-[#3B4A6B] mb-2">Your Saved Sessions</h1>
            <div className="flex items-center mb-6">
                <input
                    type="text"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder="Search your library..."
                    className="border border-[#E6EAF3] rounded-lg px-4 py-2 focus:outline-none w-80 mr-4"
                />
            </div>
            <div className="bg-[#F3F4F6] rounded-xl p-4 flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <span className="bg-[#E6EAF3] p-3 rounded-xl">
                        <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><rect width="24" height="24" rx="6" fill="#5B6EF8" fillOpacity="0.1"/><path d="M7 7h10v10H7V7z" fill="#5B6EF8"/></svg>
                    </span>
                    <span className="font-medium text-[#3B4A6B]">You have {sessions.length} saved sessions</span>
                </div>
            </div>
            <div className="flex gap-2 mb-8">
                {filters.map((f) => (
                    <button
                        key={f}
                        className={`px-4 py-2 rounded-lg font-medium ${filter === f ? "bg-[#5B6EF8] text-white" : "bg-[#E6EAF3] text-[#3B4A6B]"}`}
                        onClick={() => setFilter(f)}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">{error}</div>}
            {loading && <div className="text-sm text-slate-500 mb-4">Loading...</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredSessions.map((session) => (
                    <div key={`${session.content_type}-${session.content_id}`} className="bg-white rounded-2xl shadow-lg p-6 flex flex-col">
                        <div className="flex items-center gap-4 mb-4">
                            <img src={session.thumbnail_url || "/images/homepage.png"} alt={session.title} className="w-20 h-20 rounded-xl object-cover" />
                            <div className="flex-1">
                                <div className="flex gap-2 mb-1">
                                    <span className="bg-[#5B6EF8] text-white px-2 py-1 rounded-lg text-xs font-semibold capitalize">{session.content_type}</span>
                                    <span className="bg-[#E6EAF3] text-[#5B6EF8] px-2 py-1 rounded-lg text-xs font-semibold">{durationText(session.duration_seconds)}</span>
                                </div>
                                <h2 className="text-lg font-bold text-[#3B4A6B] mb-1">{session.title}</h2>
                                {session.subtitle && <span className="text-xs text-[#6B7280]">{session.subtitle}</span>}
                            </div>
                        </div>
                        <Link
                            href={getSessionLink(session)}
                            className="mt-4 inline-flex items-center justify-center px-6 py-2 rounded-lg font-medium text-white bg-[#5B6EF8]"
                        >
                            Open Session
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}
