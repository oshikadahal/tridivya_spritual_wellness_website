"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Bell, Flame, Play, Search } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { getMantraProgress, getMeditationProgress, getYogaProgress, listMantras, listMeditations, listYogas, type ContentItem } from "@/lib/api/content";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050";

const formatDuration = (seconds?: number) => {
    if (!seconds || seconds <= 0) return "--";
    const totalSeconds = Math.floor(seconds);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    if (mins <= 0) return `${secs}s`;
    return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
};

const normalizeUploadPath = (value: string) => {
    if (!value.startsWith("/uploads/")) return value;

    const uploadSubPath = value.replace("/uploads/", "");
    const hasKnownFolder = uploadSubPath.startsWith("images/") || uploadSubPath.startsWith("video/") || uploadSubPath.startsWith("audio/");

    if (hasKnownFolder) return value;

    return `/uploads/images/${uploadSubPath}`;
};

const resolveImageUrl = (imageUrl?: string) => {
    if (!imageUrl) return "/images/homepage.png";
    if (imageUrl.includes("example.com")) return "/images/homepage.png";
    if (imageUrl.startsWith("http")) return imageUrl;
    const normalizedPath = imageUrl.startsWith("/") ? normalizeUploadPath(imageUrl) : normalizeUploadPath(`/${imageUrl}`);
    return `${API_BASE_URL}${normalizedPath}`;
};

const getCardImageUrl = (item: ContentItem) => resolveImageUrl(item.thumbnail_url || item.cover_image_url || item.image_url);

export default function Dashboard() {
    const { isAuthenticated, loading, user } = useAuth();
    const router = useRouter();
    const [recommendations, setRecommendations] = useState<Array<ContentItem & { contentType: "yoga" | "meditation" | "mantra" }>>([]);
    const [featuredMantra, setFeaturedMantra] = useState<ContentItem | null>(null);
    const [streakDays, setStreakDays] = useState(0);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push("/login");
        }
    }, [isAuthenticated, loading, router]);

    useEffect(() => {
        if (!isAuthenticated) return;

        const loadDashboardData = async () => {
            try {
                setError(null);
                const [yogas, meditations, mantras, yogaProgress, meditationProgress, mantraProgress] = await Promise.all([
                    listYogas({ limit: 4, is_active: true }),
                    listMeditations({ limit: 4, is_active: true }),
                    listMantras({ limit: 4, is_active: true }),
                    getYogaProgress(),
                    getMeditationProgress(),
                    getMantraProgress(),
                ]);

                const merged = [
                    ...yogas.data.map((item) => ({ ...item, contentType: "yoga" as const })),
                    ...meditations.data.map((item) => ({ ...item, contentType: "meditation" as const })),
                    ...mantras.data.map((item) => ({ ...item, contentType: "mantra" as const })),
                ];

                setRecommendations(merged.slice(0, 8));
                setFeaturedMantra(mantras.data[0] ?? null);

                const completedCount = [
                    ...yogaProgress,
                    ...meditationProgress,
                    ...mantraProgress,
                ].filter((item) => item.status === "completed").length;

                setStreakDays(completedCount);
            } catch (err: Error | any) {
                setError(err.message || "Failed to load dashboard data");
            }
        };

        loadDashboardData();
    }, [isAuthenticated]);

    const getRecommendedLink = (item: ContentItem & { contentType: "yoga" | "meditation" | "mantra" }) => {
        if (item.contentType === "yoga") return `/yogaprograms/${item.id}`;
        if (item.contentType === "meditation") return `/meditationvideos/${item.id}`;
        return `/mantraprogram/playlist/${item.id}`;
    };

    const featuredDuration = useMemo(() => formatDuration(featuredMantra?.duration_seconds), [featuredMantra?.duration_seconds]);

    if (loading) {
        return <div className="text-center py-10">Loading...</div>;
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-linear-to-b from-slate-50 to-white text-slate-900">
            <main className="max-w-7xl mx-auto px-4 py-8 flex flex-col gap-8">

                {/* Streak + Resume */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center justify-between">
                        <div>
                            <div className="text-xs font-semibold text-slate-500">Current Streak</div>
                            <div className="text-2xl font-bold text-slate-900 flex items-center gap-2 mt-1">
                                <Flame className="w-5 h-5 text-[#f2994a]" /> {streakDays} Days
                            </div>
                        </div>
                        <Link href="/saved" className="text-xs font-semibold text-indigo-600 underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 rounded">
                            View progress
                        </Link>
                    </div>
                    <div className="bg-indigo-600 text-white rounded-xl p-5 shadow-sm flex items-center justify-between">
                        <div>
                            <div className="text-xs font-semibold opacity-80">Continue where you left</div>
                            <div className="text-2xl font-bold mt-1">Resume Session</div>
                        </div>
                        <Link href="/mantraprogram" aria-label="Resume your mantra session" className="session-btn-primary rounded-full w-12 h-12 flex items-center justify-center shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70">
                            <Play className="w-5 h-5" />
                        </Link>
                    </div>
                </div>

                {/* Hero */}
                <section className="relative overflow-hidden rounded-xl bg-linear-to-r from-indigo-100 via-indigo-50 to-white border border-slate-200 shadow-sm">
                    <div className="absolute inset-0">
                        <Image src="/images/homepage.png" alt="Home" fill className="object-cover opacity-70" />
                        <div className="absolute inset-0 bg-linear-to-r from-indigo-700/80 via-indigo-500/70 to-transparent" />
                    </div>
                    <div className="relative p-8 md:p-12 text-white max-w-xl">
                        <p className="text-xs font-semibold uppercase tracking-wide opacity-90">Personalized for you</p>
                        <h2 className="text-3xl md:text-4xl font-bold leading-snug mt-2">{featuredMantra?.title ?? "Explore your next session"}</h2>
                        <div className="mt-4 flex items-center gap-4 text-sm font-medium opacity-90">
                            <span>{featuredDuration}</span>
                            <span>•</span>
                            <span>{featuredMantra?.goal_slug ?? "Daily Focus"}</span>
                        </div>
                        <Link href="/mantraprogram" className="session-btn-primary mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-full font-semibold shadow-lg">
                            <Play className="w-4 h-4" /> Resume Session
                        </Link>
                    </div>
                </section>

                {/* Recommended */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-slate-900">Recommended for You</h3>
                        <Link href="/search" className="text-sm font-semibold text-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 rounded">
                            See All
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {recommendations.map((item) => (
                            <article key={`${item.contentType}-${item.id}`} className="bg-white border border-slate-200 rounded-2xl p-3 shadow-sm flex flex-col gap-3">
                                <div className="relative h-36 rounded-xl overflow-hidden">
                                    <img
                                        src={getCardImageUrl(item)}
                                        alt={item.title}
                                        className="h-full w-full object-cover"
                                        loading="lazy"
                                        onError={(event) => {
                                            event.currentTarget.src = "/images/homepage.png";
                                        }}
                                    />
                                </div>
                                <div className="flex items-center justify-between text-[11px] text-slate-500">
                                    <span>{formatDuration(item.duration_seconds)}</span>
                                    <span className="capitalize">{item.difficulty ?? item.contentType}</span>
                                </div>
                                <h4 className="font-semibold text-slate-900 text-sm leading-tight">{item.title}</h4>
                                <Link
                                    href={getRecommendedLink(item)}
                                    aria-label={`Open ${item.title}`}
                                    className="session-btn-primary mt-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 text-sm font-semibold py-2 rounded-xl transition text-center"
                                >
                                    Start Practice
                                </Link>
                            </article>
                        ))}
                    </div>
                </section>

                {error && (
                    <section className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 text-sm text-red-700">
                        {error}
                    </section>
                )}

                {/* Your Growth */}
                <section className="bg-linear-to-br from-white via-indigo-50/40 to-white border border-indigo-100 rounded-3xl p-6 md:p-7 shadow-sm space-y-5">
                    <div>
                        <p className="text-xs font-semibold text-slate-500">Your Growth</p>
                        <h3 className="text-xl font-bold text-slate-900">Wellness Information</h3>
                        <p className="text-sm text-slate-600 mt-1">Build a balanced routine with simple daily practices.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <article className="bg-white/90 border border-indigo-100 rounded-2xl px-4 py-4 shadow-xs hover:shadow-sm transition">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 text-base">🧘</span>
                                <h4 className="text-sm font-semibold text-slate-900">Yoga</h4>
                            </div>
                            <p className="text-sm text-slate-600">Yoga supports flexibility, posture, and body awareness. Regular practice can also help ease physical tension and improve daily energy.</p>
                        </article>
                        <article className="bg-white/90 border border-indigo-100 rounded-2xl px-4 py-4 shadow-xs hover:shadow-sm transition">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 text-base">🕉️</span>
                                <h4 className="text-sm font-semibold text-slate-900">Mantra</h4>
                            </div>
                            <p className="text-sm text-slate-600">Mantra chanting uses rhythmic repetition to settle the mind and strengthen focus. It can create a calming routine for emotional balance.</p>
                        </article>
                        <article className="bg-white/90 border border-indigo-100 rounded-2xl px-4 py-4 shadow-xs hover:shadow-sm transition">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 text-base">🧠</span>
                                <h4 className="text-sm font-semibold text-slate-900">Meditation</h4>
                            </div>
                            <p className="text-sm text-slate-600">Meditation trains attention and helps you observe thoughts with less reactivity. Short daily sessions often improve clarity and reduce stress.</p>
                        </article>
                    </div>
                </section>

                {/* Mantra */}
                <section className="bg-linear-to-r from-indigo-600 to-indigo-500 text-white rounded-xl p-6 shadow-sm">
                    <p className="text-xs font-semibold opacity-90">Mantra of the Day</p>
                    <h3 className="text-2xl font-bold mt-1">{featuredMantra?.title ?? "No mantra available"}</h3>
                    <p className="text-sm opacity-90 mt-2 max-w-3xl">{featuredMantra?.meaning || featuredMantra?.description || "Explore mantra sessions tailored to your current goals."}</p>
                    <Link href="/mantraprogram" className="session-btn-primary mt-4 inline-flex items-center gap-2 px-4 py-3 rounded-xl font-semibold shadow">
                        <Play className="w-4 h-4" /> Listen & Chant
                    </Link>
                </section>
            </main>
        </div>
    );
}
