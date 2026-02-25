"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, X, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { toast } from "react-toastify";
import {
  searchContent,
  getSearchFilters,
  type SearchFilters,
  type SearchResult,
} from "@/lib/api/search";

const CONTENT_TYPE_ICONS: Record<string, string> = {
  meditation: "🧘",
  yoga: "🧘‍♀️",
  mantra: "🎵",
  library: "📚",
};

const CONTENT_TYPE_LABELS: Record<string, string> = {
  meditation: "Meditation",
  yoga: "Yoga",
  mantra: "Mantra",
  library: "Library",
};

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(12);

  // Filter state
  const [contentTypes, setContentTypes] = useState<
    ("meditation" | "yoga" | "mantra" | "library")[]
  >([]);
  const [difficulties, setDifficulties] = useState<
    ("beginner" | "intermediate" | "advanced")[]
  >([]);
  const [sortBy, setSortBy] = useState<
    "relevance" | "newest" | "popular" | "most-rated" | "duration-asc" | "duration-desc"
  >("relevance");
  const [minRating, setMinRating] = useState(0);

  // Available filters
  const [availableGoals, setAvailableGoals] = useState<
    { slug: string; label: string }[]
  >([]);

  // Load available filters
  useEffect(() => {
    const loadFilters = async () => {
      try {
        const filters = await getSearchFilters();
        setAvailableGoals(filters.goals || []);
      } catch (error) {
        console.error("Failed to load filters:", error);
      }
    };
    loadFilters();
  }, []);

  // Perform search
  const performSearch = useCallback(
    async (searchPage: number = 1) => {
      if (!query.trim()) {
        toast.warn("Please enter a search query");
        return;
      }

      setLoading(true);
      try {
        const filters: SearchFilters = {
          ...(contentTypes.length > 0 && { contentTypes }),
          ...(difficulties.length > 0 && { difficulty: difficulties }),
          ...(minRating > 0 && { minRating }),
          sortBy,
          page: searchPage,
          limit,
        };

        const data = await searchContent(query, filters);
        setResults(data);
        setPage(searchPage);

        // Estimate total (from pagination if available)
        const estimatedTotal = data.length * searchPage;
        setTotalResults(Math.max(data.length, estimatedTotal));

        // Update URL
        const params = new URLSearchParams();
        params.set("q", query);
        if (contentTypes.length > 0) params.set("types", contentTypes.join(","));
        if (difficulties.length > 0) params.set("difficulty", difficulties.join(","));
        if (sortBy !== "relevance") params.set("sort", sortBy);
        router.push(`?${params.toString()}`, { scroll: false });
      } catch (error: any) {
        toast.error(error.message || "Search failed");
        setResults([]);
      } finally {
        setLoading(false);
      }
    },
    [query, contentTypes, difficulties, minRating, sortBy, limit, router]
  );

  // Search on initial load
  useEffect(() => {
    if (initialQuery) {
      performSearch(1);
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    performSearch(1);
  };

  const toggleContentType = (type: "meditation" | "yoga" | "mantra" | "library") => {
    setContentTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
    setPage(1);
  };

  const toggleDifficulty = (diff: "beginner" | "intermediate" | "advanced") => {
    setDifficulties((prev) =>
      prev.includes(diff) ? prev.filter((d) => d !== diff) : [...prev, diff]
    );
    setPage(1);
  };

  const clearFilters = () => {
    setContentTypes([]);
    setDifficulties([]);
    setMinRating(0);
    setSortBy("relevance");
    setPage(1);
  };

  const hasActiveFilters = contentTypes.length > 0 || difficulties.length > 0 || minRating > 0;

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Search Content</h1>
          <p className="text-slate-600">Find meditations, yoga, mantras, and wisdom</p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-2 bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search meditations, yoga, mantras..."
              className="flex-1 px-4 py-3 outline-none text-slate-900"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-indigo-500 text-white hover:bg-indigo-600 transition disabled:opacity-60 flex items-center gap-2"
            >
              <Search className="w-5 h-5" />
              Search
            </button>
          </div>
        </form>

        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <div
            className={`w-64 ${
              showFilters ? "block" : "hidden lg:block"
            } bg-white rounded-lg shadow-sm p-6 border border-slate-200 h-fit sticky top-20`}
          >
            <div className="flex items-center justify-between mb-4 lg:hidden">
              <h3 className="font-semibold text-slate-900">Filters</h3>
              <button onClick={() => setShowFilters(false)} className="p-1 hover:bg-slate-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Type Filter */}
            <div className="mb-6">
              <h4 className="font-semibold text-slate-800 mb-3">Content Type</h4>
              <div className="space-y-2">
                {(["meditation", "yoga", "mantra", "library"] as const).map((type) => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={contentTypes.includes(type)}
                      onChange={() => toggleContentType(type)}
                      className="w-4 h-4 rounded border-slate-300"
                    />
                    <span className="text-sm text-slate-700">
                      {CONTENT_TYPE_ICONS[type]} {CONTENT_TYPE_LABELS[type]}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Difficulty Filter */}
            <div className="mb-6 pb-6 border-b border-slate-200">
              <h4 className="font-semibold text-slate-800 mb-3">Difficulty</h4>
              <div className="space-y-2">
                {(["beginner", "intermediate", "advanced"] as const).map((diff) => (
                  <label key={diff} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={difficulties.includes(diff)}
                      onChange={() => toggleDifficulty(diff)}
                      className="w-4 h-4 rounded border-slate-300"
                    />
                    <span className="text-sm text-slate-700 capitalize">{diff}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Minimum Rating Filter */}
            <div className="mb-6 pb-6 border-b border-slate-200">
              <h4 className="font-semibold text-slate-800 mb-3">Minimum Rating</h4>
              <select
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              >
                <option value={0}>All ratings</option>
                <option value={2}>2+ stars</option>
                <option value={3}>3+ stars</option>
                <option value={4}>4+ stars</option>
              </select>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="w-full px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition text-sm font-medium"
              >
                Clear Filters
              </button>
            )}
          </div>

          {/* Results Section */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-slate-600">
                  {loading ? "Searching..." : `Found ${results.length} results`}
                  {query && ` for "${query}"`}
                </p>
              </div>

              <div className="flex gap-2 items-center">
                {/* Mobile Filter Toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                </button>

                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-sm bg-white"
                >
                  <option value="relevance">Relevance</option>
                  <option value="newest">Newest</option>
                  <option value="popular">Most Popular</option>
                  <option value="most-rated">Most Rated</option>
                  <option value="duration-asc">Shortest Duration</option>
                  <option value="duration-desc">Longest Duration</option>
                </select>
              </div>
            </div>

            {/* Results Grid */}
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
                  <p className="text-slate-600">Searching...</p>
                </div>
              </div>
            ) : results.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {results.map((result) => (
                    <Link
                      key={result.id}
                      href={`/${
                        result.contentType === "meditation"
                          ? "meditationvideos"
                          : result.contentType === "yoga"
                          ? "yogaprograms"
                          : result.contentType === "mantra"
                          ? "mantraprogram/playlist"
                          : "wisdomlibrary"
                      }/${result.id}`}
                      className="group bg-white rounded-lg overflow-hidden border border-slate-200 hover:shadow-lg transition"
                    >
                      {/* Image */}
                      <div className="relative w-full h-40 bg-slate-100 overflow-hidden">
                        {result.thumbnail_url || result.image_url ? (
                          <Image
                            src={result.thumbnail_url || result.image_url || ""}
                            alt={result.title}
                            fill
                            className="object-cover group-hover:scale-105 transition"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-4xl">
                            {CONTENT_TYPE_ICONS[result.contentType]}
                          </div>
                        )}

                        {/* Content Type Badge */}
                        <div className="absolute top-2 right-2 bg-indigo-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                          {CONTENT_TYPE_LABELS[result.contentType]}
                        </div>

                        {/* Rating Badge */}
                        {result.rating && (
                          <div className="absolute top-2 left-2 bg-amber-400 text-xs font-bold px-2 py-1 rounded">
                            ⭐ {result.rating.toFixed(1)}
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <h3 className="font-semibold text-slate-900 line-clamp-2 group-hover:text-indigo-600">
                          {result.title}
                        </h3>

                        {result.subtitle && (
                          <p className="text-xs text-slate-500 line-clamp-1 mt-1">{result.subtitle}</p>
                        )}

                        {/* Meta */}
                        <div className="flex gap-2 mt-3 flex-wrap">
                          {result.difficulty && (
                            <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded capitalize">
                              {result.difficulty}
                            </span>
                          )}
                          {result.duration_seconds && (
                            <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">
                              {Math.round(result.duration_seconds / 60)} min
                            </span>
                          )}
                          {result.is_featured && (
                            <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded font-semibold">
                              Featured
                            </span>
                          )}
                          {result.is_trending && (
                            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded font-semibold">
                              Trending
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {results.length >= limit && (
                  <div className="flex items-center justify-center gap-4">
                    <button
                      onClick={() => performSearch(page - 1)}
                      disabled={page === 1 || loading}
                      className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-60"
                    >
                      <ChevronLeft className="w-4 h-4" /> Previous
                    </button>

                    <span className="text-sm text-slate-600">Page {page}</span>

                    <button
                      onClick={() => performSearch(page + 1)}
                      disabled={results.length < limit || loading}
                      className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-60"
                    >
                      Next <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <p className="text-slate-600 text-lg mb-4">No results found</p>
                {query && (
                  <div>
                    <p className="text-slate-500 mb-4">Try adjusting your search or filters</p>
                    <button
                      onClick={clearFilters}
                      className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
