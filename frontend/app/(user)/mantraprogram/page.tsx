"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Bookmark, Play } from "lucide-react";
import {
    getSavedMantraIds,
    listMantras,
    saveMantra,
    unsaveMantra,
    type ContentItem,
} from "@/lib/api/content";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5051";

const resolveMediaUrl = (mediaUrl: string | undefined, fallbackUrl: string) => {
    const source = mediaUrl || fallbackUrl;
    if (source.startsWith("http")) return source;
    const normalizedPath = source.startsWith("/") ? source : `/${source}`;
    return `${API_BASE_URL}${normalizedPath}`;
};

const durationText = (seconds?: number) => {
    if (!seconds || seconds <= 0) return "--";
    const totalSeconds = Math.floor(seconds);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    if (mins <= 0) return `${secs}s`;
    return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
};

export default function MantraProgramPage() {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [currentTrackUrl, setCurrentTrackUrl] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
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
                const [mantras, saved] = await Promise.all([
                    listMantras({ limit: 60, is_active: true }),
                    getSavedMantraIds(),
                ]);
                setItems(mantras.data);
                setSavedIds(saved);
            } catch (err: Error | any) {
                setError(err.message || "Failed to load mantras");
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

    const mantraOfDay = filteredItems[0] ?? items[0];
    const popularMantras = filteredItems.slice(0, 5);
    const playlistItems = items.slice(0, 12);

    const handlePlayMantra = async (audioUrl?: string) => {
        if (!audioUrl) return;

        const audioEl = audioRef.current;
        if (!audioEl) return;

        if (currentTrackUrl === audioUrl) {
            if (isPlaying) {
                audioEl.pause();
                setIsPlaying(false);
                return;
            }

            try {
                await audioEl.play();
                setIsPlaying(true);
            } catch {
                setIsPlaying(false);
            }
            return;
        }

        audioEl.src = resolveMediaUrl(audioUrl, "/uploads/audio/gyatri%20mantra.mp3");
        setCurrentTrackUrl(audioUrl);

        try {
            await audioEl.play();
            setIsPlaying(true);
        } catch {
            setIsPlaying(false);
        }
    };

    const toggleSaved = async (id: string) => {
        const saved = savedIds.includes(id);
        try {
            if (saved) {
                await unsaveMantra(id);
                setSavedIds((prev) => prev.filter((item) => item !== id));
            } else {
                await saveMantra(id);
                setSavedIds((prev) => [...prev, id]);
            }
        } catch {
            setError("Unable to update saved state");
        }
    };

    if (loading) {
        return <div className="px-4 py-10">Loading mantras...</div>;
    }

    return (
        <div className="min-h-screen bg-linear-to-b from-slate-50 to-white text-slate-900">
            <div className="max-w-7xl mx-auto px-4 pb-10 space-y-8">
            <audio
                ref={audioRef}
                onEnded={() => setIsPlaying(false)}
                onPause={() => setIsPlaying(false)}
                onPlay={() => setIsPlaying(true)}
            />

            <section className="space-y-3">
                <h1 className="text-3xl font-bold">Discover Mantras</h1>
                <p className="text-base text-slate-600">Connect with your inner self through sacred sounds.</p>

                <div className="flex flex-wrap gap-3">
                    {categories.map((item) => (
                        <button
                            key={item}
                            onClick={() => setActiveCategory(item)}
                            aria-pressed={activeCategory === item}
                            className={`h-10 px-5 rounded-full text-sm font-medium border transition ${
                                activeCategory === item
                                    ? "bg-[#6a5ae0] text-white border-[#6a5ae0]"
                                    : "bg-white text-slate-700 border-slate-200"
                            }`}
                        >
                            {item}
                        </button>
                    ))}
                </div>
            </section>

            {mantraOfDay && (
                <section className="relative overflow-hidden rounded-3xl border border-slate-200 shadow-sm p-8 bg-linear-to-r from-[#8f6ff1] to-[#7c55e8]">
                    <div className="text-white max-w-2xl">
                        <span className="inline-flex px-3 py-1 rounded-full bg-white/20 text-xs font-semibold uppercase tracking-widest">
                            Mantra of the Day
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold leading-tight mt-4 italic">
                            {mantraOfDay.title}
                        </h2>
                        <p className="text-white/85 mt-4 text-base leading-relaxed max-w-xl line-clamp-3">
                            {mantraOfDay.meaning || mantraOfDay.description || mantraOfDay.subtitle || "Practice this mantra for grounding and clarity."}
                        </p>
                        <button
                            className="mt-6 inline-flex items-center gap-2 h-11 px-6 rounded-full bg-white text-[#6a5ae0] font-semibold"
                            onClick={() => handlePlayMantra(mantraOfDay.audio_url)}
                            aria-label={`${currentTrackUrl === mantraOfDay.audio_url && isPlaying ? "Pause" : "Play"} mantra ${mantraOfDay.title}`}
                        >
                            <Play className="w-4 h-4" />
                            {currentTrackUrl === mantraOfDay.audio_url && isPlaying ? "Pause" : "Listen & Chant"}
                        </button>
                    </div>
                </section>
            )}

            {error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</div>}

            <section className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
                <div className="xl:col-span-2 space-y-6">
                    <div>
                        <h2 className="text-3xl font-bold mb-4">Popular Mantras</h2>
                        <div className="space-y-3">
                            {popularMantras.map((mantra) => (
                                <article key={mantra.id} className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-4 shadow-sm">
                                    <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
                                        <Image src={mantra.image_url || mantra.cover_image_url || "/images/homepage.png"} alt={mantra.title} fill className="object-cover" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h3 className="font-semibold truncate">{mantra.title}</h3>
                                        <p className="text-sm text-slate-500 truncate">{mantra.subtitle || mantra.goal_slug || "Sacred Mantra"}</p>
                                    </div>
                                    <div className="flex items-center gap-3 shrink-0">
                                        <span className="text-xs text-slate-500">{durationText(mantra.duration_seconds)}</span>
                                        <button
                                            className="w-9 h-9 rounded-full bg-[#ede9fe] text-[#6a5ae0] flex items-center justify-center"
                                            onClick={() => handlePlayMantra(mantra.audio_url)}
                                            aria-label={`${currentTrackUrl === mantra.audio_url && isPlaying ? "Pause" : "Play"} ${mantra.title}`}
                                        >
                                            <Play className="w-4 h-4" />
                                        </button>
                                        <button aria-label={`${savedIds.includes(mantra.id) ? "Unsave" : "Save"} ${mantra.title}`} onClick={() => toggleSaved(mantra.id)}>
                                            <Bookmark className={`w-4 h-4 ${savedIds.includes(mantra.id) ? "fill-[#6a5ae0] text-[#6a5ae0]" : "text-slate-500"}`} />
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </div>

                <aside className="space-y-6">
                    <article className="rounded-3xl bg-slate-900 text-white p-5">
                        <p className="text-[10px] uppercase tracking-widest text-white/70">My Progress</p>
                        <h3 className="text-3xl font-bold mt-1">Keep chanting daily</h3>
                        <p className="text-sm text-white/80 mt-1">{savedIds.length} saved mantras</p>
                        <div className="mt-3 h-1.5 bg-white/20 rounded-full overflow-hidden">
                            <div className="h-full bg-[#7c62f7]" style={{ width: `${Math.min(100, savedIds.length * 10)}%` }} />
                        </div>
                    </article>

                    <div className="space-y-3">
                        <h3 className="text-lg font-bold">Learn the Meaning</h3>
                        {popularMantras.slice(0, 2).map((mantra) => (
                            <article key={mantra.id} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                                <span className="text-[10px] font-semibold uppercase tracking-widest text-[#8f6ff1]">
                                    MANTRA INSIGHT
                                </span>
                                <h4 className="text-sm font-semibold mt-2">{mantra.title}</h4>
                                <p className="text-xs text-slate-600 mt-2 leading-relaxed line-clamp-3">{mantra.meaning || mantra.description || "Open this mantra and explore its meaning and pronunciation."}</p>
                            </article>
                        ))}
                    </div>
                </aside>
            </section>

            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold">Mantra Playlists</h2>
                    <Link href="/search" className="text-sm font-semibold text-[#6a5ae0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 rounded">Explore All Playlists</Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                    {playlistItems.map((item, index) => (
                        <article key={item.id} className={`rounded-3xl p-5 text-center shadow-sm relative overflow-hidden ${
                            index % 2 === 0 ? "bg-linear-to-br from-amber-100 to-orange-100" : "bg-linear-to-br from-teal-100 to-green-100"
                        }`}>
                            <div className="relative h-32 rounded-2xl overflow-hidden mb-4 bg-white/10">
                                <Image src={item.image_url || item.cover_image_url || "/images/homepage.png"} alt={item.title} fill className="object-cover" />
                            </div>
                            <h3 className="text-xl font-bold leading-tight">{item.title}</h3>
                            <p className="text-xs mt-2 text-slate-600">
                                {durationText(item.duration_seconds)} • {item.goal_slug || "Daily Practice"}
                            </p>
                            <Link
                                href={`/mantraprogram/playlist/${item.id}`}
                                aria-label={`Open mantra playlist ${item.title}`}
                                className="mt-3 w-10 h-10 mx-auto rounded-full flex items-center justify-center bg-slate-900 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300"
                            >
                                <Play className="w-4 h-4" />
                            </Link>
                        </article>
                    ))}
                </div>
            </section>
            </div>
        </div>
    );
}
