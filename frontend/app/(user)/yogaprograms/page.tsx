"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, CalendarDays, Flame, Play } from "lucide-react";
import { getYogaProgress, listYogas, type ContentItem } from "@/lib/api/content";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050";

const instructors = [
    { name: "Sarah J.", image: `${API_BASE_URL}/uploads/images/instructor1.jpg`, detailImage: `${API_BASE_URL}/uploads/images/instructor1_detail.jpg` },
    { name: "Rahul V.", image: `${API_BASE_URL}/uploads/images/instructor2.jpg`, detailImage: `${API_BASE_URL}/uploads/images/instructor2_detail.jpg` },
    { name: "Alex K.", image: `${API_BASE_URL}/uploads/images/instructor3.jpg`, detailImage: `${API_BASE_URL}/uploads/images/instructor3_detail.jpg` },
    { name: "Maya P.", image: `${API_BASE_URL}/uploads/images/instructor4.jpg`, detailImage: `${API_BASE_URL}/uploads/images/instructor4_detail.jpg` },
    { name: "Anil R.", image: `${API_BASE_URL}/uploads/images/instructor5.jpg`, detailImage: `${API_BASE_URL}/uploads/images/instructor5_detail.jpg` },
];

const formatDuration = (seconds?: number) => {
    if (!seconds || seconds <= 0) return "--";
    const totalSeconds = Math.floor(seconds);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    if (mins <= 0) return `${secs}s`;
    return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
};

export default function YogaProgramsPage() {
    const [activeFilter, setActiveFilter] = useState("All");
    const [items, setItems] = useState<ContentItem[]>([]);
    const [progress, setProgress] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedInstructor, setSelectedInstructor] = useState<null | typeof instructors[0]>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError(null);
                const [yogas, progressItems] = await Promise.all([
                    listYogas({ limit: 500, is_active: true }),
                    getYogaProgress(),
                ]);

                setItems(yogas.data);

                const progressMap = progressItems.reduce<Record<string, number>>((acc, item) => {
                    if (item.yoga_id) {
                        acc[item.yoga_id] = item.progress_percent ?? 0;
                    }
                    return acc;
                }, {});
                setProgress(progressMap);
            } catch (err: Error | any) {
                setError(err.message || "Failed to load yoga programs");
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const filters = useMemo(() => {
        const difficulty = Array.from(
            new Set(items.map((item) => item.difficulty).filter((level): level is NonNullable<ContentItem["difficulty"]> => Boolean(level)))
        );
        return ["All", ...difficulty.map((level) => `${level.charAt(0).toUpperCase()}${level.slice(1)}`)];
    }, [items]);

    const filteredItems = useMemo(() => {
        if (activeFilter === "All") return items;
        return items.filter((item) => item.difficulty === activeFilter.toLowerCase());
    }, [activeFilter, items]);

    const featured = filteredItems.find((item) => item.is_featured) || filteredItems[0] || items[0];
    const jumpBackIn = items.find((item) => (progress[item.id] ?? 0) > 0 && (progress[item.id] ?? 0) < 100);
    const allClasses = filteredItems;

    const completedCount = Object.values(progress).filter((value) => value >= 100).length;

    if (loading) {
        return <div className="px-4 py-10">Loading yoga programs...</div>;
    }

    return (
        <div className="min-h-screen bg-linear-to-b from-slate-50 to-white text-slate-900">
            <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
            {featured && (
                <section className="relative rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-linear-to-r from-indigo-600 to-indigo-500">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-8 lg:p-10 items-center">
                        <div className="text-white max-w-md">
                            <span className="inline-flex px-3 py-1 rounded-full bg-white/20 text-xs font-semibold uppercase tracking-wide">
                                Top Pick
                            </span>
                            <h1 className="text-5xl font-bold leading-tight mt-4">{featured.title}</h1>
                            <p className="text-white/85 mt-4 text-base leading-relaxed line-clamp-3">
                                {featured.description || featured.subtitle || "Build consistency with guided sessions tailored to your level."}
                            </p>
                            <div className="mt-5 flex items-center gap-5 text-sm font-medium text-white/90">
                                <span className="inline-flex items-center gap-2"><Flame className="w-4 h-4" /> {featured.goal_slug || "Flow"}</span>
                                <span className="inline-flex items-center gap-2"><CalendarDays className="w-4 h-4" /> {formatDuration(featured.duration_seconds)}</span>
                            </div>
                            <Link
                                href={`/yogaprograms/${featured.id}`}
                                aria-label={`Open featured yoga class ${featured.title}`}
                                className="mt-6 inline-flex items-center gap-2 h-11 px-6 rounded-full bg-white text-indigo-600 font-semibold hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white transition"
                            >
                                Start Now
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>

                        <div className="relative w-full max-w-md h-64 mx-auto rounded-sm overflow-hidden border border-white/30 bg-white/10">
                            <Image src={featured.thumbnail_url || featured.cover_image_url || featured.image_url || "/images/homepage.png"} alt={featured.title} fill className="object-cover" priority />
                        </div>
                    </div>
                </section>
            )}

            <section className="flex flex-wrap gap-3">
                {filters.map((item) => (
                    <button
                        key={item}
                        onClick={() => setActiveFilter(item)}
                        aria-pressed={activeFilter === item}
                        className={`h-10 px-5 rounded-xl text-sm font-medium border ${
                            activeFilter === item
                                ? "bg-indigo-600 text-white border-indigo-600"
                                : "bg-white text-slate-600 border-slate-200"
                        }`}
                    >
                        {item}
                    </button>
                ))}
            </section>

            {error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</div>}

            <section className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
                <div className="lg:col-span-2 space-y-3">
                    <h2 className="text-3xl font-bold">Jump Back In</h2>
                    {jumpBackIn ? (
                        <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-4 shadow-sm">
                            <div className="relative w-16 h-16 rounded-2xl overflow-hidden shrink-0">
                                <Image src={jumpBackIn.thumbnail_url || jumpBackIn.cover_image_url || jumpBackIn.image_url || "/images/homepage.png"} alt={jumpBackIn.title} fill className="object-cover" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <h3 className="font-semibold text-lg truncate">{jumpBackIn.title}</h3>
                                <p className="text-sm text-slate-500">{formatDuration(jumpBackIn.duration_seconds)} • {progress[jumpBackIn.id] ?? 0}% complete</p>
                                <div className="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-indigo-600" style={{ width: `${Math.min(100, progress[jumpBackIn.id] ?? 0)}%` }} />
                                </div>
                            </div>
                            <Link href={`/yogaprograms/${jumpBackIn.id}`} aria-label={`Resume ${jumpBackIn.title}`} className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300">
                                <Play className="w-4 h-4" />
                            </Link>
                        </div>
                    ) : (
                        <div className="bg-white border border-slate-200 rounded-xl p-4 text-slate-500">No in-progress sessions yet.</div>
                    )}
                </div>

                <div className="space-y-4">
                    <h2 className="text-3xl font-bold">Yoga for Every Goal</h2>
                    <div className="grid grid-cols-2 gap-3">
                        {filters.slice(1, 5).map((item) => (
                            <article key={item} className="bg-white border border-slate-200 rounded-xl p-4 text-center shadow-sm">
                                <span className="w-9 h-9 mx-auto rounded-full bg-indigo-50 flex items-center justify-center text-lg">🧘</span>
                                <p className="text-sm font-medium mt-2">{item}</p>
                            </article>
                        ))}
                    </div>

                    <article className="rounded-xl bg-slate-900 text-white p-5">
                        <p className="text-[10px] uppercase tracking-[0.12em] text-white/70">My Progress</p>
                        <h3 className="text-3xl font-bold mt-1">You're doing great!</h3>
                        <p className="text-sm text-white/80 mt-1">{completedCount} sessions completed</p>
                        <div className="mt-3 h-1.5 bg-white/20 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-400" style={{ width: `${Math.min(100, completedCount * 10)}%` }} />
                        </div>
                    </article>
                </div>
            </section>

            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold">All Classes</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {allClasses.map((item, index) => (
                        <article key={item.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                            <div className="relative h-48 rounded-2xl overflow-hidden">
                                <Image src={item.thumbnail_url || item.cover_image_url || item.image_url || "/images/homepage.png"} alt={item.title} fill className="object-cover" />
                                {index === 0 && (
                                    <span className="absolute top-3 right-3 text-[10px] bg-slate-900/70 text-white px-2 py-1 rounded-full uppercase">Popular</span>
                                )}
                            </div>
                            <h3 className="text-lg font-semibold mt-3">{item.title}</h3>
                            <p className="text-sm text-slate-500 mt-1 capitalize">{item.difficulty || "all levels"} • {formatDuration(item.duration_seconds)}</p>
                            <Link href={`/yogaprograms/${item.id}`} aria-label={`Start yoga class ${item.title}`} className="mt-4 w-full h-10 rounded-full bg-indigo-600 text-white font-semibold text-sm inline-flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300">Start</Link>
                        </article>
                    ))}
                </div>
            </section>

            <section className="space-y-4">
                <h2 className="text-3xl font-bold">Our Instructors</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
                    {instructors.map((instructor) => (
                        <div key={instructor.name} className="text-center">
                            <div className="relative w-16 h-16 mx-auto rounded-full overflow-hidden border-2 border-[#b9aaff]">
                                <Image src={instructor.image} alt={instructor.name} fill className="object-cover" />
                            </div>
                            <p className="text-sm text-slate-600 mt-2 truncate">{instructor.name}</p>
                        </div>
                    ))}
                </div>
            </section>
            </div>
        </div>
    );
}
