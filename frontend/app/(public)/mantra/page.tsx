"use client";

import Link from "next/link";
import { Play } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { listMantras, type ContentItem } from "@/lib/api/content";

const durationText = (seconds?: number) => {
    if (!seconds || seconds <= 0) return "--";
    return `${Math.max(1, Math.round(seconds / 60))} min`;
};

export default function MantraPage() {
    const [items, setItems] = useState<ContentItem[]>([]);
    const [activeGoal, setActiveGoal] = useState("All");
    const [error, setError] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [playingUrl, setPlayingUrl] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const response = await listMantras({ limit: 500, is_active: true });
                setItems(response.data);
            } catch (err: Error | any) {
                setError(err.message || "Failed to load mantra content");
            }
        };

        loadData();
    }, []);

    const goals = useMemo(() => {
        const dynamic = Array.from(new Set(items.map((item) => item.goal_slug).filter(Boolean))) as string[];
        return ["All", ...dynamic.slice(0, 8)];
    }, [items]);

    const filtered = useMemo(() => (
        activeGoal === "All" ? items : items.filter((item) => item.goal_slug === activeGoal)
    ), [activeGoal, items]);

    const featured = filtered[0] ?? items[0];
    const recommended = filtered.length ? filtered : items;
    const popular = filtered.length ? filtered : items;

    const playTrack = async (url?: string) => {
        if (!url || !audioRef.current) return;

        if (playingUrl === url) {
            audioRef.current.pause();
            setPlayingUrl(null);
            return;
        }

        audioRef.current.src = url;
        try {
            await audioRef.current.play();
            setPlayingUrl(url);
        } catch {
            setPlayingUrl(null);
        }
    };

    return (
        <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #ece6ff 0%, #e6e2ff 100%)" }}>
            <audio ref={audioRef} onEnded={() => setPlayingUrl(null)} />

            <main className="max-w-6xl mx-auto p-8 space-y-8">
                <section className="relative rounded-3xl bg-linear-to-br from-[#e7e0ff] to-[#c7bfff] p-8 flex flex-col md:flex-row items-center gap-8 overflow-hidden">
                    <div className="flex-1">
                        <h1 className="text-4xl font-bold text-[#4b2676] mb-2">Mantra Library</h1>
                        <p className="text-lg text-[#6c4bb6] mb-4">Experience chants for healing and emotional well-being.</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {goals.map((goal) => (
                                <button
                                    key={goal}
                                    onClick={() => setActiveGoal(goal)}
                                    className={`font-semibold px-4 py-1 rounded-full text-sm ${
                                        activeGoal === goal ? "bg-[#7c5fe6] text-white" : "bg-white/80 text-[#7c5fe6]"
                                    }`}
                                >
                                    {goal}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {featured && (
                    <section className="rounded-3xl bg-white/80 p-6 flex flex-col md:flex-row items-center gap-6 shadow border border-[#e0d6f7]">
                        <div className="flex-1">
                            <div className="text-[#7c5fe6] font-semibold mb-1">{featured.title}</div>
                            <div className="text-[#bca7f7] text-xs mb-2 capitalize">{featured.goal_slug || "for balance"}</div>
                            <button
                                onClick={() => playTrack(featured.audio_url)}
                                className="bg-white hover:bg-[#f3eaff] text-[#7c5fe6] font-semibold px-6 py-3 rounded-full shadow transition flex items-center gap-2 mb-2"
                            >
                                <Play className="w-5 h-5" /> {playingUrl === featured.audio_url ? "Pause" : "Listen Now"}
                            </button>
                            <div className="flex items-center gap-4 text-[#6c4bb6] text-sm">
                                <span>{featured.difficulty || "all levels"}</span>
                                <span>{durationText(featured.duration_seconds)}</span>
                            </div>
                        </div>
                        <img src={featured.image_url || featured.thumbnail_url || featured.cover_image_url || "/images/homepage.png"} alt={featured.title} className="w-full md:w-60 h-36 rounded-2xl object-cover" />
                    </section>
                )}

                {error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</div>}

                <section>
                    <h3 className="text-xl font-bold text-[#4b2676] mb-3">Recommended</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {recommended.map((mantra) => (
                            <div key={mantra.id} className="bg-white/90 rounded-2xl shadow border border-[#e0d6f7] p-4 flex flex-col">
                                <img src={mantra.image_url || mantra.thumbnail_url || mantra.cover_image_url || "/images/homepage.png"} alt={mantra.title} className="rounded-xl object-cover mb-3 h-36 w-full" />
                                <div className="font-bold text-[#4b2676] mb-1">{mantra.title}</div>
                                <div className="flex items-center gap-2 text-xs mb-2">
                                    <span className="bg-[#e7e0ff] text-[#7c5fe6] px-2 py-1 rounded capitalize">{mantra.difficulty || "all levels"}</span>
                                    <span className="text-[#7c5fe6]">{durationText(mantra.duration_seconds)}</span>
                                </div>
                                <button onClick={() => playTrack(mantra.audio_url)} className="bg-[#7c5fe6] hover:bg-[#6b4fd6] text-white font-semibold px-4 py-2 rounded-xl mt-auto">
                                    {playingUrl === mantra.audio_url ? "Pause" : "Start"}
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                <section>
                    <h3 className="text-xl font-bold text-[#4b2676] mb-3">Popular Mantras</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {popular.map((mantra) => (
                            <div key={mantra.id} className="bg-white/90 rounded-2xl shadow border border-[#e0d6f7] p-6 flex flex-col md:flex-row items-center gap-6">
                                <img src={mantra.image_url || mantra.thumbnail_url || mantra.cover_image_url || "/images/homepage.png"} alt={mantra.title} className="w-40 h-28 rounded-xl object-cover" />
                                <div className="flex-1">
                                    <div className="font-bold text-[#4b2676] mb-1">{mantra.title}</div>
                                    <div className="flex items-center gap-2 text-xs mb-2">
                                        <span className="bg-[#e7e0ff] text-[#7c5fe6] px-2 py-1 rounded capitalize">{mantra.difficulty || "all levels"}</span>
                                        <span className="text-[#7c5fe6]">{durationText(mantra.duration_seconds)}</span>
                                    </div>
                                    <p className="text-sm text-[#6c4bb6] line-clamp-2">{mantra.meaning || mantra.description || mantra.subtitle}</p>
                                    <button onClick={() => playTrack(mantra.audio_url)} className="mt-3 bg-[#f3eaff] hover:bg-[#e7e0ff] text-[#7c5fe6] font-semibold px-6 py-2 rounded-full shadow transition flex items-center gap-2">
                                        <Play className="w-5 h-5" /> {playingUrl === mantra.audio_url ? "Pause" : "Listen Now"}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="text-center">
                    <Link href="/login" className="inline-flex bg-[#7c5fe6] text-white px-6 py-3 rounded-full font-semibold">Sign in for personalized mantra journeys</Link>
                </div>
            </main>
        </div>
    );
}
