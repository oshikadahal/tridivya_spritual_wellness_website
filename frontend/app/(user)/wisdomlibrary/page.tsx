"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Bookmark } from "lucide-react";
import {
    getSavedLibraryIds,
    listLibraryItems,
    saveLibraryItem,
    unsaveLibraryItem,
    type ContentItem,
} from "@/lib/api/content";

export default function WisdomLibraryPage() {
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

                const [library, saved] = await Promise.all([
                    listLibraryItems({ limit: 60 }),
                    getSavedLibraryIds(),
                ]);

                setItems(library.data);
                setSavedIds(saved);
            } catch (err: Error | any) {
                setError(err.message || "Failed to load library");
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const categories = useMemo(() => {
        const dynamic = Array.from(new Set(items.map((item) => item.category_slug).filter(Boolean))) as string[];
        return ["All", ...dynamic.slice(0, 8)];
    }, [items]);

    const filteredItems = useMemo(() => (
        activeCategory === "All"
            ? items
            : items.filter((item) => item.category_slug === activeCategory)
    ), [activeCategory, items]);

    const featured = filteredItems.find((item) => item.is_featured) || filteredItems[0] || items[0];
    const essentialBooks = filteredItems.slice(0, 8);
    const learningPaths = filteredItems.slice(8, 10);
    const shortReads = filteredItems.filter((item) => item.library_type === "article").slice(0, 4);
    const savedItems = items.filter((item) => savedIds.includes(item.id)).slice(0, 8);

    const toggleSavedBook = async (id: string) => {
        const isSaved = savedIds.includes(id);
        try {
            if (isSaved) {
                await unsaveLibraryItem(id);
                setSavedIds((prev) => prev.filter((item) => item !== id));
            } else {
                await saveLibraryItem(id);
                setSavedIds((prev) => [...prev, id]);
            }
        } catch {
            setError("Unable to update saved list");
        }
    };

    if (loading) {
        return <div className="px-8 py-10">Loading library...</div>;
    }

    return (
        <div className="px-8 pb-10 space-y-8 text-slate-900">
            <section className="space-y-3 pt-2">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">Wisdom Library</h1>
                        <p className="text-sm text-slate-600 mt-1">Expand your knowledge through curated resources</p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-3">
                    {categories.map((item) => (
                        <button
                            key={item}
                            onClick={() => setActiveCategory(item)}
                            className={`h-10 px-5 rounded-full text-sm font-medium border ${
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

            {featured && (
                <section className="relative overflow-hidden rounded-3xl border border-slate-200 shadow-sm bg-linear-to-r from-slate-700 to-slate-600 text-white">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-8 lg:p-10 items-center">
                        <div className="max-w-md z-10">
                            <span className="inline-flex px-3 py-1 rounded-full bg-white/20 text-xs font-semibold uppercase tracking-widest mb-3">
                                Featured
                            </span>
                            <h2 className="text-4xl md:text-5xl font-bold leading-tight">{featured.title}</h2>
                            <p className="text-white/80 mt-4 text-base leading-relaxed line-clamp-3">
                                {featured.description || featured.subtitle || "Ancient wisdom for modern mental mastery."}
                            </p>
                            <button
                                type="button"
                                onClick={() => toggleSavedBook(featured.id)}
                                aria-label="Save featured book"
                                className="mt-6 inline-flex items-center gap-2 h-11 px-6 rounded-full bg-white text-slate-900 font-semibold"
                            >
                                <Bookmark className={`w-4 h-4 transition ${savedIds.includes(featured.id) ? "text-[#6a5ae0] fill-[#6a5ae0]" : "text-slate-900"}`} />
                                Save to List
                            </button>
                        </div>

                        <div className="relative w-full max-w-sm h-72 rounded-2xl overflow-hidden border border-white/20">
                            <Image src={featured.cover_image_url || featured.thumbnail_url || "/images/homepage.png"} alt={featured.title} fill className="object-cover" priority />
                        </div>
                    </div>
                </section>
            )}

            {error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</div>}

            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold">Essential Books</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                    {essentialBooks.map((book) => (
                        <article key={book.id} className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm flex flex-col">
                            <Link href={`/wisdomlibrary/${book.id}`} className="relative h-48 block">
                                <Image src={book.cover_image_url || book.thumbnail_url || "/images/homepage.png"} alt={book.title} fill className="object-cover" />
                            </Link>
                            <div className="p-4 flex flex-col flex-1">
                                <div className="flex items-start justify-between gap-3">
                                    <Link href={`/wisdomlibrary/${book.id}`} className="flex-1">
                                        <h3 className="text-lg font-semibold leading-tight hover:text-[#6a5ae0] transition">
                                            {book.title}
                                        </h3>
                                    </Link>
                                    <button type="button" onClick={() => toggleSavedBook(book.id)} aria-label={`Save ${book.title}`} className="mt-0.5">
                                        <Bookmark className={`w-5 h-5 transition ${savedIds.includes(book.id) ? "text-[#6a5ae0] fill-[#6a5ae0]" : "text-slate-400"}`} />
                                    </button>
                                </div>
                                <p className="text-sm text-slate-600 mt-1">{book.author_name || book.category_slug || "Resource"}</p>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            <section className="space-y-4">
                <h2 className="text-3xl font-bold">Learning Paths</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {learningPaths.map((path) => (
                        <Link
                            key={path.id}
                            href={`/wisdomlibrary/${path.id}`}
                            className="relative h-48 rounded-3xl overflow-hidden shadow-sm border border-slate-200 hover:border-[#6a5ae0] transition"
                        >
                            <Image src={path.cover_image_url || path.thumbnail_url || "/images/homepage.png"} alt={path.title} fill className="object-cover" />
                            <div className="absolute inset-0 bg-linear-to-t from-black/70 to-black/20" />
                            <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                                <h3 className="text-2xl font-bold">{path.title}</h3>
                                <p className="text-sm text-white/80 mt-1">{path.category_slug || path.library_type || "Curated path"}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            <section className="space-y-4">
                <h2 className="text-3xl font-bold">Short Reads & Articles</h2>

                <div className="space-y-3">
                    {shortReads.map((read) => (
                        <Link
                            key={read.id}
                            href={`/wisdomlibrary/${read.id}`}
                            className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-4 shadow-sm hover:border-[#6a5ae0] transition"
                        >
                            <div className="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center text-2xl shrink-0">📚</div>
                            <div className="min-w-0 flex-1">
                                <span className="text-[10px] font-semibold uppercase tracking-widest text-[#6a5ae0]">{read.category_slug || "ARTICLE"}</span>
                                <h3 className="font-semibold text-lg mt-1">{read.title}</h3>
                            </div>
                            <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0">
                                <Image src={read.thumbnail_url || "/images/homepage.png"} alt={read.title} fill className="object-cover" />
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            <section className="space-y-4 pb-2">
                <h2 className="text-3xl font-bold flex items-center gap-2">
                    <span className="w-4 h-4 rounded bg-[#6a5ae0]" />
                    Saved for Later
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
                    {savedItems.map((item) => (
                        <Link
                            key={item.id}
                            href={`/wisdomlibrary/${item.id}`}
                            className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:border-[#6a5ae0] transition"
                        >
                            <div className="relative h-24">
                                <Image src={item.cover_image_url || item.thumbnail_url || "/images/homepage.png"} alt={item.title} fill className="object-cover" />
                            </div>
                            <div className="p-3">
                                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">{item.library_type || "resource"}</p>
                                <h4 className="text-sm font-semibold mt-1 line-clamp-2">{item.title}</h4>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
}
