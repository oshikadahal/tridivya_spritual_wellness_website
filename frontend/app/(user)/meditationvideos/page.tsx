"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Bookmark, Play } from "lucide-react";
import {
    getSavedMeditationIds,
    listMeditations,
    saveMeditation,
    unsaveMeditation,
    type ContentItem,
} from "@/lib/api/content";

const durationText = (seconds?: number) => {
    if (!seconds || seconds <= 0) return "--";
    const totalSeconds = Math.floor(seconds);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    if (mins <= 0) return `${secs}s`;
    return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
};

export default function MeditationVideosPage() {
    const [activeCategory, setActiveCategory] = useState("All");
    const [items, setItems] = useState<ContentItem[]>([]);
    const [savedIds, setSavedIds] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError(null);

                const [meditations, saved] = await Promise.all([
                    listMeditations({ limit: 50, is_active: true }),
                    getSavedMeditationIds(),
                ]);

                setItems(meditations.data);
                setSavedIds(saved);
            } catch (err: Error | any) {
                setError(err.message || "Failed to load meditation videos");
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const categories = useMemo(() => {
        const dynamic = Array.from(new Set(items.map((item) => item.goal_slug).filter(Boolean))).slice(0, 8) as string[];
        return ["All", ...dynamic];
    }, [items]);

    const filteredItems = useMemo(() => (
        activeCategory === "All"
            ? items
            : items.filter((item) => item.goal_slug === activeCategory)
    ), [activeCategory, items]);

    const featured = filteredItems[0] ?? items[0];
    const recentlyAdded = filteredItems.slice(0, 6);
    const topGoals = categories.filter((cat) => cat !== "All").slice(0, 6);
    const meditationSeries = items.filter((item) => item.is_featured || item.is_trending).slice(0, 6);
    const quickCalm = [...items]
        .filter((item) => Boolean(item.duration_seconds))
        .sort((a, b) => (a.duration_seconds ?? 0) - (b.duration_seconds ?? 0))
        .slice(0, 4);

    const toggleSave = async (id: string) => {
        const isSaved = savedIds.includes(id);
        try {
            if (isSaved) {
                await unsaveMeditation(id);
                setSavedIds((prev) => prev.filter((item) => item !== id));
            } else {
                await saveMeditation(id);
                setSavedIds((prev) => [...prev, id]);
            }
        } catch {
            setError("Unable to update saved state");
        }
    };

    if (loading) {
        return <div className="px-4 py-10">Loading meditation videos...</div>;
    }

    return (
        <div className="min-h-screen bg-linear-to-b from-slate-50 to-white text-slate-900">
            <div className="max-w-7xl mx-auto px-4 pb-10 space-y-8">
            <section className="space-y-4 pt-2">
                <div className="flex flex-wrap gap-3">
                    {categories.map((item) => (
                        <button
                            key={item}
                            onClick={() => setActiveCategory(item)}
                            aria-pressed={activeCategory === item}
                            className={`px-5 h-10 rounded-full text-sm font-medium border transition ${
                                activeCategory === item
                                    ? "bg-[#6a5ae0] text-white border-[#6a5ae0]"
                                    : "bg-white text-slate-700 border-slate-200 hover:border-[#6a5ae0]"
                            }`}
                        >
                            {item}
                        </button>
                    ))}
                </div>
            </section>

            {featured && (
                <section className="relative overflow-hidden rounded-[28px] h-72.5 border border-slate-200 shadow-sm">
                    <Image src={featured.image_url || featured.thumbnail_url || "/images/homepage.png"} alt={featured.title} fill className="object-cover" priority />
                    <div className="absolute inset-0 bg-linear-to-r from-black/65 via-black/45 to-transparent" />

                    <div className="relative h-full flex flex-col justify-center px-8 md:px-12 text-white max-w-2xl">
                        <p className="text-[11px] uppercase tracking-[0.14em] font-semibold opacity-85">Daily Featured</p>
                        <h1 className="text-4xl md:text-5xl font-bold mt-3">{featured.title}</h1>
                        <p className="text-lg leading-relaxed mt-3 text-white/90 line-clamp-2">
                            {featured.description || featured.subtitle || "A guided session to reset your mind and body."}
                        </p>

                        <div className="mt-7 flex items-center gap-4">
                            <Link
                                href={`/meditationvideos/${featured.id}`}
                                aria-label={`Play featured meditation ${featured.title}`}
                                className="inline-flex items-center gap-2 h-12 px-7 rounded-full bg-[#7c62f7] hover:bg-[#6a5ae0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white font-semibold shadow-lg transition"
                            >
                                <Play className="w-4 h-4" />
                                Play Session
                            </Link>
                            <button
                                onClick={() => toggleSave(featured.id)}
                                aria-label={`${savedIds.includes(featured.id) ? "Unsave" : "Save"} ${featured.title}`}
                                className="w-12 h-12 rounded-full border border-white/40 bg-white/10 backdrop-blur-sm flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                            >
                                <Bookmark className={`w-4 h-4 ${savedIds.includes(featured.id) ? "fill-white" : ""}`} />
                            </button>
                        </div>
                    </div>
                </section>
            )}

            {error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</div>}

            <section className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
                <div className="xl:col-span-2 space-y-3">
                    <div className="flex items-center justify-between">
                        <h2 className="text-3xl font-bold">Recently Added</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {recentlyAdded.map((item) => (
                            <Link
                                key={item.id}
                                href={`/meditationvideos/${item.id}`}
                                aria-label={`Open meditation ${item.title}`}
                                className="bg-white border border-slate-200 rounded-3xl p-4 flex gap-4 shadow-sm hover:border-[#6a5ae0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 transition"
                            >
                                <div className="relative w-23 h-23 rounded-2xl overflow-hidden shrink-0">
                                    <Image src={item.image_url || item.thumbnail_url || "/images/homepage.png"} alt={item.title} fill className="object-cover" />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="text-lg font-semibold leading-tight">{item.title}</h3>
                                    <p className="text-sm text-slate-500 mt-1">{item.goal_slug || "Meditation"} • {durationText(item.duration_seconds)}</p>
                                    <span className="inline-flex mt-3 px-2.5 py-1 rounded-full bg-[#e8f5ec] text-[#278a4f] text-[11px] font-semibold uppercase tracking-wide">
                                        {item.difficulty || "all levels"}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                <aside className="space-y-4">
                    <h2 className="text-3xl font-bold">Top Goals</h2>
                    <div className="grid grid-cols-3 gap-4">
                        {topGoals.map((goal) => (
                            <div key={goal} className="text-center">
                                <div className="relative w-14 h-14 mx-auto rounded-full overflow-hidden border-2 border-[#b9aaff]">
                                    <Image src="/images/homepage.png" alt={goal} fill className="object-cover" />
                                </div>
                                <p className="text-xs text-slate-600 mt-2 truncate">{goal}</p>
                            </div>
                        ))}
                    </div>
                </aside>
            </section>

            <section className="space-y-4">
                <h2 className="text-3xl font-bold">Meditation Series</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {meditationSeries.map((item, index) => (
                        <Link
                            key={item.id}
                            href={`/meditationvideos/${item.id}`}
                            aria-label={`Open meditation series ${item.title}`}
                            className="relative h-48 rounded-3xl overflow-hidden shadow-sm border border-slate-200 hover:border-[#6a5ae0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 transition"
                        >
                            <Image src={item.image_url || item.thumbnail_url || "/images/homepage.png"} alt={item.title} fill className="object-cover" />
                            <div
                                className={`absolute inset-0 ${
                                    index % 2 === 0
                                        ? "bg-linear-to-t from-black/70 to-black/20"
                                        : "bg-linear-to-t from-[#2f2566]/75 to-transparent"
                                }`}
                            />
                            <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                                <h3 className="text-3xl font-bold leading-tight">{item.title}</h3>
                                <p className="text-sm text-white/80 mt-1">{durationText(item.duration_seconds)} • {item.goal_slug || "Mindfulness"}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            <section className="space-y-3">
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold">Quick Calm</h2>
                    <p className="text-xs font-semibold tracking-[0.12em] uppercase text-slate-400">Short Sessions</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                    {quickCalm.map((item) => (
                        <Link
                            key={item.id}
                            href={`/meditationvideos/${item.id}`}
                            aria-label={`Open quick calm session ${item.title}`}
                            className="bg-white border border-slate-200 rounded-3xl p-4 min-h-32 shadow-sm hover:border-[#6a5ae0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 transition"
                        >
                            <span className="w-8 h-8 rounded-full bg-[#ede9fe] text-lg flex items-center justify-center">⚡</span>
                            <h3 className="text-lg font-semibold mt-4">{item.title}</h3>
                            <p className="text-sm text-slate-500 mt-1 line-clamp-2">{item.subtitle || item.description || durationText(item.duration_seconds)}</p>
                        </Link>
                    ))}
                </div>
            </section>
            </div>
        </div>
    );
}
