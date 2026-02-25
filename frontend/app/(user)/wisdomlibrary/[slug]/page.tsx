"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { getLibraryItemById, type ContentItem } from "@/lib/api/content";

export default function WisdomLibraryDetailPage() {
  const params = useParams<{ slug: string }>();
  const id = params?.slug;

  const [item, setItem] = useState<ContentItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getLibraryItemById(id);
        setItem(data);
      } catch (err: Error | any) {
        setError(err.message || "Failed to load library item");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  if (loading) {
    return <div className="px-6 md:px-8 pt-5 pb-10">Loading...</div>;
  }

  if (!item) {
    return <div className="px-6 md:px-8 pt-5 pb-10">Item not found.</div>;
  }

  return (
    <div className="px-4 sm:px-6 md:px-8 pt-5 pb-10 bg-[#f7f8ff] min-h-screen text-slate-900">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Link
            href="/wisdomlibrary"
            className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
          >
            <span className="inline-flex w-8 h-8 items-center justify-center rounded-full border border-slate-200 bg-white">
              <ArrowLeft className="w-4 h-4" />
            </span>
            Back to Library
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-6 items-start">
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold leading-tight">{item.title}</h1>
            {item.author_name && (
              <p className="text-sm text-slate-500">By {item.author_name}</p>
            )}
            <p className="text-sm text-slate-500">
              {item.library_type || "resource"}
              {item.read_minutes ? ` • ${item.read_minutes} min read` : null}
            </p>
            <p className="text-base text-slate-700 leading-relaxed">
              {item.description || item.subtitle || "Explore this resource to deepen your understanding."}
            </p>
          </div>

          <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden border border-slate-200 bg-white">
            <Image
              src={item.cover_image_url || item.thumbnail_url || "/images/homepage.png"}
              alt={item.title}
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

