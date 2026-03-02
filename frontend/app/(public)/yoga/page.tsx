"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Play } from "lucide-react";
import { listYogas, type ContentItem } from "@/lib/api/content";

const durationText = (seconds?: number) => {
    if (!seconds || seconds <= 0) return "--";
    return `${Math.max(1, Math.round(seconds / 60))}m`;
};

export default function YogaPage() {
    const [activeLevel, setActiveLevel] = useState("All Levels");
    const [activeDuration, setActiveDuration] = useState("All");
    const [sessions, setSessions] = useState<ContentItem[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const yogaResp = await listYogas({ limit: 500, is_active: true });
                setSessions(yogaResp.data);
            } catch (err: Error | any) {
                setError(err.message || "Failed to load yoga content");
            }
        };

        loadData();
    }, []);

    const levels = ["All Levels", "Beginner", "Intermediate", "Advanced"];
    const durations = ["All", "15m", "30m", "45m+"];

    const filteredSessions = useMemo(() => {
        return sessions.filter((session) => {
            const byLevel = activeLevel === "All Levels" || (session.difficulty || "").toLowerCase() === activeLevel.toLowerCase();
            const mins = Math.round((session.duration_seconds || 0) / 60);
            const byDuration = activeDuration === "All"
                || (activeDuration === "15m" && mins <= 15)
                || (activeDuration === "30m" && mins > 15 && mins <= 30)
                || (activeDuration === "45m+" && mins > 30);
            return byLevel && byDuration;
        });
    }, [activeDuration, activeLevel, sessions]);

    return (
        <main className="min-h-screen w-full bg-[#CAD3FF] px-4 py-10">
            <div className="max-w-6xl mx-auto">
                <section className="text-center mb-12">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6">
                        <span className="text-gray-800">Yoga for</span> <span className="text-orange-400">Every Body</span>
                    </h1>
                    <p className="text-gray-600 max-w-3xl mx-auto text-base leading-relaxed">
                        Discover guided classes from Tridivya.
                    </p>
                </section>

                <div className="max-w-12xl mx-auto bg-white/80 backdrop-blur-sm rounded-3xl p-6 md:p-8 mb-12 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="text-left">
                            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-4">Level:</h3>
                            <div className="flex flex-wrap gap-3">
                                {levels.map((level) => (
                                    <button
                                        key={level}
                                        onClick={() => setActiveLevel(level)}
                                        className={`px-5 py-2 rounded-full text-xs font-semibold transition-all ${
                                            activeLevel === level ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        }`}
                                    >
                                        {level}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="text-left">
                            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-4">Duration:</h3>
                            <div className="flex flex-wrap gap-3">
                                {durations.map((duration) => (
                                    <button
                                        key={duration}
                                        onClick={() => setActiveDuration(duration)}
                                        className={`px-5 py-2 rounded-full text-xs font-semibold transition-all ${
                                            activeDuration === duration ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        }`}
                                    >
                                        {duration}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">{error}</div>}

                <section className="mb-14">
                    <h2 className="text-3xl font-bold text-gray-800 mb-8">Explore Sessions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {filteredSessions.map((session) => (
                            <div key={session.id} className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                                <div className="h-72 flex items-center justify-center relative overflow-hidden bg-purple-100">
                                    <img src={session.image_url || session.thumbnail_url || session.cover_image_url || "/images/homepage.png"} alt={session.title} className="w-full h-full object-cover" />
                                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-gray-800 shadow-md">
                                        ⏱ {durationText(session.duration_seconds)}
                                    </div>
                                </div>
                                <div className="p-7">
                                    <div className="mb-3">
                                        <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">{session.difficulty || "all levels"}</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">{session.title}</h3>
                                    <p className="text-sm text-gray-600 mb-6 leading-relaxed line-clamp-2">{session.description || session.subtitle}</p>
                                    <div className="flex items-center justify-between pt-2">
                                        <span className="text-sm font-medium text-gray-800">{session.goal_slug || "Flow"}</span>
                                        <Link href="/login" className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center hover:bg-indigo-700 transition-colors shadow-sm">
                                            <Play className="w-5 h-5 text-white fill-white" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
}
