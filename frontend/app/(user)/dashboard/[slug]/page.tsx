"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, RotateCcw } from "lucide-react";
import {
    getMeditationById,
    getMeditationReviews,
    getYogaById,
    getYogaReviews,
    type ContentItem,
    type ReviewItem,
} from "@/lib/api/content";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050";

const resolveMediaUrl = (mediaUrl: string | undefined, fallbackUrl: string) => {
    const source = mediaUrl || fallbackUrl;
    if (source.startsWith("http")) return source;
    const normalizedPath = source.startsWith("/") ? source : `/${source}`;
    return `${API_BASE_URL}${normalizedPath}`;
};

const formatDuration = (seconds?: number) => {
    if (!seconds || seconds <= 0) return "--";
    return `${Math.max(1, Math.round(seconds / 60))} mins`;
};

export default function DashboardPracticeDetailsPage() {
    const params = useParams<{ slug: string }>();
    const contentId = params?.slug;
    const videoRef = useRef<HTMLVideoElement | null>(null);

    const [item, setItem] = useState<ContentItem | null>(null);
    const [contentType, setContentType] = useState<"yoga" | "meditation" | null>(null);
    const [reviews, setReviews] = useState<ReviewItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!contentId) return;

        const load = async () => {
            setLoading(true);
            try {
                const yoga = await getYogaById(contentId);
                const yogaReviews = await getYogaReviews(contentId);
                setItem(yoga);
                setReviews(yogaReviews);
                setContentType("yoga");
                return;
            } catch {
                try {
                    const meditation = await getMeditationById(contentId);
                    const meditationReviews = await getMeditationReviews(contentId);
                    setItem(meditation);
                    setReviews(meditationReviews);
                    setContentType("meditation");
                } catch {
                    setItem(null);
                    setReviews([]);
                    setContentType(null);
                }
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [contentId]);

    const tags = useMemo(() => {
        if (!item) return [];
        return [item.goal_slug, item.difficulty].filter(Boolean) as string[];
    }, [item]);

    if (loading) return <div className="px-4 sm:px-6 md:px-8 pt-5 pb-10">Loading...</div>;
    if (!item || !contentType) return <div className="px-4 sm:px-6 md:px-8 pt-5 pb-10">Content not found.</div>;

    return (
        <div className="min-h-screen bg-linear-to-b from-slate-50 to-white text-slate-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-5 pb-10">
                <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-6 items-start">
                    <div className="space-y-5">
                        <div className="relative rounded-3xl overflow-hidden border border-slate-200 bg-black/80">
                            <div className="absolute left-4 top-4 z-10">
                                <Link href="/dashboard" className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center">
                                    <ArrowLeft className="w-5 h-5" />
                                </Link>
                            </div>

                            <video
                                ref={videoRef}
                                className="w-full h-65 md:h-105 object-cover"
                                controls
                                poster={item.image_url || item.thumbnail_url || "/images/homepage.png"}
                            >
                                <source src={resolveMediaUrl(item.media_url, "/uploads/videos/video.mp4")} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        </div>

                        <div>
                            <h1 className="text-4xl font-bold tracking-tight">{item.title}</h1>
                            <p className="text-slate-500 mt-1">
                                {item.subtitle || "Guided Session"} • {formatDuration(item.duration_seconds)} • <span className="text-indigo-600 font-medium capitalize">{item.difficulty || "all levels"}</span>
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            {tags.map((tag) => (
                                <span key={tag} className="inline-flex items-center px-4 py-2 rounded-full bg-white border border-slate-200 text-sm font-medium text-slate-700 capitalize">
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <section className="space-y-3">
                            <h2 className="text-4xl font-bold">About this {contentType === "yoga" ? "Practice" : "Session"}</h2>
                            <p className="text-slate-600 leading-relaxed">{item.description || "Continue your guided wellness journey."}</p>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-4xl font-bold">Reviews</h2>
                            {reviews.map((review, index) => (
                                <article key={`${review.user_id || "user"}-${index}`} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                                    <div className="flex items-center justify-between">
                                        <span className="font-semibold">User Review</span>
                                        <span className="text-amber-400 text-sm">{"★".repeat(review.rating)}</span>
                                    </div>
                                    <p className="text-sm text-slate-600 mt-3">{review.comment || "Great session."}</p>
                                </article>
                            ))}
                        </section>
                    </div>

                    <aside className="space-y-5 lg:sticky lg:top-24">
                        <article className="bg-white border border-slate-200 rounded-2xl p-5">
                            <h3 className="text-xl font-bold">Quick Actions</h3>
                            <button onClick={() => videoRef.current?.play()} className="mt-5 w-full h-12 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition">
                                Start Now
                            </button>
                        </article>

                        <article className="bg-linear-to-r from-indigo-600 to-indigo-500 text-white rounded-2xl p-5">
                            <h3 className="text-xl font-bold">Keep practicing</h3>
                            <p className="text-sm text-white/80 mt-1">Regular sessions improve consistency and focus.</p>
                            <div className="mt-4 inline-flex items-center gap-2 text-2xl font-bold">
                                <RotateCcw className="w-5 h-5" /> Daily
                            </div>
                        </article>
                    </aside>
                </section>
            </div>
        </div>
    );
}
