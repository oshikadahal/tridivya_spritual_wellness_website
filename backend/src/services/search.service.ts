import { MeditationModel } from '../models/meditation.model';
import { YogaModel } from '../models/yoga.model';
import { MantraModel } from '../models/mantra.model';
import { LibraryItemModel } from '../models/library-item.model';
import { HttpError } from "../errors/http-error";

export interface SearchFilters {
  contentTypes?: ("meditation" | "yoga" | "mantra" | "library")[];
  difficulty?: ("beginner" | "intermediate" | "advanced")[];
  minRating?: number;
  goals?: string[];
  sortBy?: "relevance" | "newest" | "popular" | "most-rated" | "duration-asc" | "duration-desc";
  page?: number;
  limit?: number;
}

export interface SearchResult {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  thumbnail_url?: string;
  image_url?: string;
  contentType: "meditation" | "yoga" | "mantra" | "library";
  difficulty?: "beginner" | "intermediate" | "advanced";
  duration_seconds?: number;
  rating?: number;
  goal_slug?: string;
  is_trending?: boolean;
  is_featured?: boolean;
}

/**
 * Search service for content across all types
 */
export class SearchService {
  /**
   * Search content across all types with filters
   */
  async searchContent(query: string, filters: SearchFilters = {}): Promise<SearchResult[]> {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const skip = (page - 1) * limit;

    const searchRegex = new RegExp(query, "i");
    const results: SearchResult[] = [];

    try {
      // Build content type filter
      const contentTypesFilter = filters.contentTypes || [
        "meditation",
        "yoga",
        "mantra",
        "library",
      ];

      // Search meditations
      if (contentTypesFilter.includes("meditation")) {
        const meditations = await MeditationModel.find({
          $and: [
            {
              $or: [{ title: searchRegex }, { description: searchRegex }],
            },
            ...(filters.difficulty ? [{ difficulty: { $in: filters.difficulty } }] : []),
            ...(filters.goals ? [{ goal_slug: { $in: filters.goals } }] : []),
          ],
        })
          .limit(limit)
          .skip(skip)
          .lean();

        meditations.forEach((m: any) => {
          results.push({
            id: m._id.toString(),
            title: m.title,
            subtitle: m.subtitle,
            description: m.description,
            thumbnail_url: m.thumbnail_url,
            image_url: m.image_url,
            contentType: "meditation",
            difficulty: m.difficulty,
            duration_seconds: m.duration_seconds,
            is_trending: m.is_trending,
            is_featured: m.is_featured,
          });
        });
      }

      // Search yogas
      if (contentTypesFilter.includes("yoga")) {
        const yogas = await YogaModel.find({
          $and: [
            {
              $or: [{ title: searchRegex }, { description: searchRegex }],
            },
            ...(filters.difficulty ? [{ difficulty: { $in: filters.difficulty } }] : []),
            ...(filters.goals ? [{ goal_slug: { $in: filters.goals } }] : []),
          ],
        })
          .limit(limit)
          .skip(skip)
          .lean();

        yogas.forEach((y: any) => {
          results.push({
            id: y._id.toString(),
            title: y.title,
            subtitle: y.subtitle,
            description: y.description,
            thumbnail_url: y.thumbnail_url,
            image_url: y.image_url,
            contentType: "yoga",
            difficulty: y.difficulty,
            duration_seconds: y.duration_seconds,
            is_trending: y.is_trending,
            is_featured: y.is_featured,
          });
        });
      }

      // Search mantras
      if (contentTypesFilter.includes("mantra")) {
        const mantras = await MantraModel.find({
          $or: [{ title: searchRegex }, { meaning: searchRegex }],
        })
          .limit(limit)
          .skip(skip)
          .lean();

        mantras.forEach((m: any) => {
          results.push({
            id: m._id.toString(),
            title: m.title,
            subtitle: m.transliteration,
            description: m.meaning,
            thumbnail_url: m.image_url,
            contentType: "mantra",
          });
        });
      }

      // Search library items
      if (contentTypesFilter.includes("library")) {
        const library = await LibraryItemModel.find({
          $or: [{ title: searchRegex }, { description: searchRegex }],
        })
          .limit(limit)
          .skip(skip)
          .lean();

        library.forEach((l: any) => {
          results.push({
            id: l._id.toString(),
            title: l.title,
            subtitle: l.subtitle,
            description: l.description,
            image_url: l.cover_image_url,
            contentType: "library",
          });
        });
      }

      // Apply sorting
      return this.sortResults(results, filters.sortBy || "relevance");
    } catch (error: any) {
      throw new HttpError(500, "Search failed");
    }
  }

  /**
   * Get trending content
   */
  async getTrendingContent(limit: number = 6): Promise<SearchResult[]> {
    try {
      const [meditations, yogas, mantras] = await Promise.all([
        MeditationModel.find({ is_trending: true }).limit(limit).lean(),
        YogaModel.find({ is_trending: true }).limit(limit).lean(),
        MantraModel.find().sort({ created_at: -1 }).limit(limit).lean(),
      ]);

      const results: SearchResult[] = [];

      meditations.forEach((m: any) => {
        results.push({
          id: m._id.toString(),
          title: m.title,
          subtitle: m.subtitle,
          thumbnail_url: m.thumbnail_url,
          contentType: "meditation",
          is_trending: true,
        });
      });

      yogas.forEach((y: any) => {
        results.push({
          id: y._id.toString(),
          title: y.title,
          subtitle: y.subtitle,
          thumbnail_url: y.thumbnail_url,
          contentType: "yoga",
          is_trending: true,
        });
      });

      mantras.forEach((m: any) => {
        results.push({
          id: m._id.toString(),
          title: m.title,
          contentType: "mantra",
        });
      });

      return results.slice(0, limit);
    } catch (error: any) {
      throw new HttpError(500, "Failed to fetch trending content");
    }
  }

  /**
   * Get featured content
   */
  async getFeaturedContent(limit: number = 6): Promise<SearchResult[]> {
    try {
      const [meditations, yogas, library] = await Promise.all([
        MeditationModel.find({ is_featured: true }).limit(limit).lean(),
        YogaModel.find({ is_featured: true }).limit(limit).lean(),
        LibraryItemModel.find().limit(limit).lean(),
      ]);

      const results: SearchResult[] = [];

      meditations.forEach((m: any) => {
        results.push({
          id: m._id.toString(),
          title: m.title,
          subtitle: m.subtitle,
          thumbnail_url: m.thumbnail_url,
          contentType: "meditation",
          is_featured: true,
        });
      });

      yogas.forEach((y: any) => {
        results.push({
          id: y._id.toString(),
          title: y.title,
          subtitle: y.subtitle,
          thumbnail_url: y.thumbnail_url,
          contentType: "yoga",
          is_featured: true,
        });
      });

      library.forEach((l: any) => {
        results.push({
          id: l._id.toString(),
          title: l.title,
          image_url: l.cover_image_url,
          contentType: "library",
        });
      });

      return results.slice(0, limit);
    } catch (error: any) {
      throw new HttpError(500, "Failed to fetch featured content");
    }
  }

  /**
   * Get content by goal/category
   */
  async getContentByGoal(
    goalSlug: string,
    options: { page?: number; limit?: number } = {}
  ): Promise<SearchResult[]> {
    try {
      const limit = options.limit || 20;
      const skip = ((options.page || 1) - 1) * limit;

      const [meditations, yogas] = await Promise.all([
        MeditationModel.find({ goal_slug: goalSlug }).limit(limit).skip(skip).lean(),
        YogaModel.find({ goal_slug: goalSlug }).limit(limit).skip(skip).lean(),
      ]);

      const results: SearchResult[] = [];

      meditations.forEach((m: any) => {
        results.push({
          id: m._id.toString(),
          title: m.title,
          subtitle: m.subtitle,
          thumbnail_url: m.thumbnail_url,
          contentType: "meditation",
          goal_slug: goalSlug,
        });
      });

      yogas.forEach((y: any) => {
        results.push({
          id: y._id.toString(),
          title: y.title,
          subtitle: y.subtitle,
          thumbnail_url: y.thumbnail_url,
          contentType: "yoga",
          goal_slug: goalSlug,
        });
      });

      return results;
    } catch (error: any) {
      throw new HttpError(500, "Failed to fetch goal content");
    }
  }

  /**
   * Get search suggestions
   */
  async getSearchSuggestions(query: string, limit: number = 5): Promise<string[]> {
    try {
      const searchRegex = new RegExp(`^${query}`, "i");

      const [meditations, yogas, mantras, library] = await Promise.all([
        MeditationModel.find({ title: searchRegex })
          .select("title")
          .limit(limit)
          .lean(),
        YogaModel.find({ title: searchRegex })
          .select("title")
          .limit(limit)
          .lean(),
        MantraModel.find({ title: searchRegex })
          .select("title")
          .limit(limit)
          .lean(),
        LibraryItemModel.find({ title: searchRegex })
          .select("title")
          .limit(limit)
          .lean(),
      ]);

      const suggestions = new Set<string>();

      [meditations, yogas, mantras, library].forEach((items) => {
        items.forEach((item: any) => {
          if (item.title) suggestions.add(item.title);
        });
      });

      return Array.from(suggestions).slice(0, limit);
    } catch (error: any) {
      throw new HttpError(500, "Failed to fetch suggestions");
    }
  }

  /**
   * Get available filter options
   */
  async getFilterOptions() {
    return {
      difficulties: ["beginner", "intermediate", "advanced"],
      goals: [
        { slug: "stress-relief", label: "Stress Relief" },
        { slug: "better-sleep", label: "Better Sleep" },
        { slug: "focus", label: "Focus & Concentration" },
        { slug: "motivation", label: "Motivation" },
        { slug: "mindfulness", label: "Mindfulness" },
      ],
      contentTypes: [
        { id: "meditation", label: "Meditation" },
        { id: "yoga", label: "Yoga" },
        { id: "mantra", label: "Mantra" },
        { id: "library", label: "Library" },
      ],
    };
  }

  /**
   * Sort results based on sortBy parameter
   */
  private sortResults(
    results: SearchResult[],
    sortBy: string = "relevance"
  ): SearchResult[] {
    switch (sortBy) {
      case "newest":
        return results.sort((a, b) => {
          const aDate = new Date(a.id).getTime();
          const bDate = new Date(b.id).getTime();
          return bDate - aDate;
        });
      case "popular":
        return results.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
      case "most-rated":
        return results.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case "duration-asc":
        return results.sort(
          (a, b) => (a.duration_seconds || 0) - (b.duration_seconds || 0)
        );
      case "duration-desc":
        return results.sort(
          (a, b) => (b.duration_seconds || 0) - (a.duration_seconds || 0)
        );
      case "relevance":
      default:
        return results;
    }
  }
}

export const searchService = new SearchService();
