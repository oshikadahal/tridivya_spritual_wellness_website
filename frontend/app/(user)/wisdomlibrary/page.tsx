"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Bookmark } from "lucide-react";
import {
    getSavedLibraryIds,
    listLibraryItems,
    saveLibraryItem,
    unsaveLibraryItem,
    type ContentItem,
} from "@/lib/api/content";

const filters = ["All", "meditation", "mantra", "yoga"] as const;

type LibraryFilter = Exclude<(typeof filters)[number], "All">;

const filterKeywords: Record<LibraryFilter, string[]> = {
    meditation: ["meditation", "mindfulness", "breath"],
    mantra: ["mantra", "chant", "chants"],
    yoga: ["yoga", "asana", "asanas"],
};

const getLibraryCategory = (item: ContentItem): LibraryFilter | null => {
    const candidates = [
        item.category_slug,
        item.goal_slug,
        item.library_type,
        item.title,
        item.subtitle,
        item.description,
    ]
        .filter((value): value is string => typeof value === "string")
        .map((value) => value.toLowerCase());

    const hasCategory = (category: LibraryFilter) =>
        candidates.some((value) => filterKeywords[category].some((keyword) => value.includes(keyword)));

    if (hasCategory("meditation")) return "meditation";
    if (hasCategory("mantra")) return "mantra";
    if (hasCategory("yoga")) return "yoga";

    return null;
};

export default function WisdomLibraryPage() {
    const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>("All");
    const [items, setItems] = useState<ContentItem[]>([]);
    const [savedIds, setSavedIds] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError(null);
                const [response, saved] = await Promise.all([
                    listLibraryItems({ limit: 500 }),
                    getSavedLibraryIds(),
                ]);
                setItems(response.data);
                setSavedIds(saved);
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : "Failed to load library items";
                setError(message);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const filteredItems = useMemo(() => {
        if (activeFilter === "All") return items;

        return items.filter((item) => {
            return getLibraryCategory(item) === activeFilter;
        });
    }, [activeFilter, items]);

    const featured = filteredItems.find((item) => item.is_featured) || filteredItems[0] || items[0];

    const toggleSaved = async (id: string) => {
        const isSaved = savedIds.includes(id);

        try {
            if (isSaved) {
                await unsaveLibraryItem(id);
                setSavedIds((prev) => prev.filter((itemId) => itemId !== id));
            } else {
                await saveLibraryItem(id);
                setSavedIds((prev) => [...prev, id]);
            }
        } catch {
            setError("Unable to update saved state");
        }
    };

    if (loading) {
        return <div className="px-4 py-10">Loading library...</div>;
    }

    return (
        <div className="min-h-screen bg-linear-to-b from-violet-50 to-indigo-50/40 text-slate-900">
            <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
                <section className="space-y-3">
                    <h1 className="text-3xl font-bold text-slate-800">Wisdom Library</h1>
                    <p className="text-slate-600">Explore meditation, mantra, and yoga resources from the backend library.</p>

                    <div className="rounded-2xl border border-violet-100 bg-white/90 p-3 sm:p-4 shadow-sm">
                        <div className="flex flex-wrap gap-3">
                        {filters.map((item) => (
                            <button
                                key={item}
                                onClick={() => setActiveFilter(item)}
                                aria-pressed={activeFilter === item}
                                className={`h-10 px-5 rounded-full text-sm font-medium border transition ${
                                    activeFilter === item
                                        ? "bg-violet-600 text-white border-violet-600"
                                        : "bg-white text-slate-700 border-violet-100"
                                }`}
                            >
                                {item === "All" ? "All" : item.charAt(0).toUpperCase() + item.slice(1)}
                            </button>
                        ))}
                        </div>
                    </div>
                </section>

                {featured && (
                    <section className="relative rounded-3xl overflow-hidden border border-violet-200 shadow-sm bg-linear-to-r from-violet-600 via-indigo-500 to-violet-400">
                        <div className="absolute inset-0 bg-linear-to-tr from-violet-800/25 to-transparent pointer-events-none" />
                        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 lg:p-8 items-center">
                            <div className="text-white max-w-xl">
                                <span className="inline-flex px-3 py-1 rounded-full bg-white/25 text-xs font-semibold uppercase tracking-wide">
                                    Featured Read
                                </span>
                                <h2 className="text-3xl lg:text-4xl font-bold mt-4 leading-tight">{featured.title}</h2>
                                <p className="text-white/90 mt-4 line-clamp-3">
                                    {featured.description || featured.subtitle || "A curated library resource for your wellness journey."}
                                </p>

                                <Link
                                    href={`/wisdomlibrary/${featured.id}`}
                                    className="mt-6 inline-flex items-center gap-2 h-11 px-6 rounded-full bg-white text-violet-700 font-semibold hover:bg-violet-50 transition"
                                    aria-label={`Open ${featured.title}`}
                                >
                                    Open
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>

                            <div className="relative w-full max-w-md h-56 lg:h-60 mx-auto rounded-2xl overflow-hidden border border-white/30 bg-white/10">
                                <Image
                                    src={featured.cover_image_url || featured.thumbnail_url || featured.image_url || "/images/homepage.png"}
                                    alt={featured.title}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>
                        </div>
                    </section>
                )}

                {error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</div>}

                <section className="space-y-4">
                    <h2 className="text-3xl font-bold text-slate-800">Library Items</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                        {filteredItems.map((item) => (
                            <article key={item.id} className="bg-white border border-violet-100 rounded-2xl shadow-sm overflow-hidden h-80 flex flex-col">
                                <div className="relative h-44 w-full">
                                    <Image
                                        src={item.cover_image_url || item.thumbnail_url || item.image_url || "/images/homepage.png"}
                                        alt={item.title}
                                        fill
                                        className="object-cover"
                                    />
                                    <button
                                        onClick={() => toggleSaved(item.id)}
                                        aria-label={`${savedIds.includes(item.id) ? "Unsave" : "Save"} ${item.title}`}
                                        className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 text-violet-600 flex items-center justify-center shadow-sm"
                                    >
                                        <Bookmark className={`w-4 h-4 ${savedIds.includes(item.id) ? "fill-violet-600" : ""}`} />
                                    </button>
                                </div>
                                <div className="p-3 flex-1 flex flex-col">
                                    <h3 className="text-base font-semibold line-clamp-2">{item.title}</h3>
                                    <p className="text-sm text-slate-500 mt-2 line-clamp-2">{item.subtitle || item.description || "Open to continue reading."}</p>

                                    <Link
                                        href={`/wisdomlibrary/${item.id}`}
                                        className="mt-auto h-10 px-4 rounded-full bg-linear-to-r from-violet-600 to-indigo-500 text-white font-semibold text-sm inline-flex items-center justify-center hover:from-violet-700 hover:to-indigo-600 transition"
                                        aria-label={`Read ${item.title}`}
                                    >
                                        Read
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                    {filteredItems.length === 0 && (
                        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
                            No library items found for this filter.
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
