"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { getLibraryItemById, type ContentItem } from "@/lib/api/content";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050";

const resolveDocumentUrl = (value?: string) => {
    if (!value) return "";
    if (value.startsWith("http")) return value;
    const normalized = value.startsWith("/") ? value : `/${value}`;
    return `${API_BASE_URL}${normalized}`;
};

export default function WisdomLibraryDetailPage() {
    const params = useParams<{ slug: string }>();
    const contentId = params?.slug;

    const [item, setItem] = useState<ContentItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!contentId) return;

        const loadData = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await getLibraryItemById(contentId);
                setItem(response);
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : "Failed to load library item";
                setError(message);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [contentId]);

    const contentUrl = useMemo(() => resolveDocumentUrl(item?.content_url), [item?.content_url]);

    if (loading) return <div className="px-4 py-10">Loading library item...</div>;
    if (!item) return <div className="px-4 py-10">Library item not found.</div>;

    return (
        <div className="min-h-screen bg-linear-to-b from-slate-50 to-white text-slate-900">
            <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
                <Link
                    href="/wisdomlibrary"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Library
                </Link>

                <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                    <div>
                        <p className="text-xs uppercase tracking-wide text-indigo-600 font-semibold">{item.library_type || "resource"}</p>
                        <h1 className="text-3xl font-bold mt-1">{item.title}</h1>
                        <p className="text-slate-600 mt-2">{item.subtitle || item.description || "Read and reflect at your own pace."}</p>
                    </div>

                    {contentUrl && (
                        <a
                            href={contentUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 h-10 px-4 rounded-full bg-indigo-600 text-white text-sm font-semibold"
                        >
                            Open Document
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    )}

                    {item.content_text ? (
                        <article className="prose prose-slate max-w-none whitespace-pre-line leading-relaxed">
                            {item.content_text}
                        </article>
                    ) : (
                        <p className="text-slate-500">No in-app reading text found for this item.</p>
                    )}
                </section>

                {error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</div>}
            </div>
        </div>
    );
}
