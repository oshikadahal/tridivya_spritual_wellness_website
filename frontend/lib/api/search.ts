import axios from "./axios";
import { API } from "./endpoints";

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

export interface SearchResponse {
  success: boolean;
  data: SearchResult[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  message?: string;
}

const getClientAuthToken = () => {
  if (typeof document === "undefined") return null;
  const cookieName = "auth_token=";
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const trimmedCookie = cookie.trim();
    if (trimmedCookie.startsWith(cookieName)) {
      return trimmedCookie.substring(cookieName.length);
    }
  }
  return null;
};

const getAuthHeaders = () => {
  const token = getClientAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const toErrorMessage = (err: Error | any, fallback: string) => (
  err?.response?.data?.message || err?.message || fallback
);

/**
 * Search content across all types with filters and sorting
 */
export const searchContent = async (
  query: string,
  filters?: SearchFilters
): Promise<SearchResult[]> => {
  try {
    const params = {
      q: query,
      ...(filters?.contentTypes && { contentTypes: filters.contentTypes.join(",") }),
      ...(filters?.difficulty && { difficulty: filters.difficulty.join(",") }),
      ...(filters?.minRating && { minRating: filters.minRating }),
      ...(filters?.goals && { goals: filters.goals.join(",") }),
      ...(filters?.sortBy && { sortBy: filters.sortBy }),
      page: filters?.page || 1,
      limit: filters?.limit || 20,
    };

    const response = await axios.get<SearchResponse>("/api/search/content", {
      params,
      headers: getAuthHeaders(),
    });

    return response.data.data || [];
  } catch (error: any) {
    throw new Error(toErrorMessage(error, "Search failed"));
  }
};

/**
 * Get trending content
 */
export const getTrendingContent = async (limit: number = 6) => {
  try {
    const response = await axios.get<SearchResponse>("/api/search/trending", {
      params: { limit },
      headers: getAuthHeaders(),
    });
    return response.data.data || [];
  } catch (error: any) {
    throw new Error(toErrorMessage(error, "Failed to fetch trending content"));
  }
};

/**
 * Get featured content
 */
export const getFeaturedContent = async (limit: number = 6) => {
  try {
    const response = await axios.get<SearchResponse>("/api/search/featured", {
      params: { limit },
      headers: getAuthHeaders(),
    });
    return response.data.data || [];
  } catch (error: any) {
    throw new Error(toErrorMessage(error, "Failed to fetch featured content"));
  }
};

/**
 * Get content by goal/category
 */
export const getContentByGoal = async (
  goalSlug: string,
  options?: { page?: number; limit?: number }
) => {
  try {
    const response = await axios.get<SearchResponse>("/api/search/by-goal", {
      params: {
        goal: goalSlug,
        page: options?.page || 1,
        limit: options?.limit || 20,
      },
      headers: getAuthHeaders(),
    });
    return response.data.data || [];
  } catch (error: any) {
    throw new Error(toErrorMessage(error, "Failed to fetch goal content"));
  }
};

/**
 * Get search suggestions/autocomplete
 */
export const getSearchSuggestions = async (query: string, limit: number = 5) => {
  try {
    const response = await axios.get<{ success: boolean; data: string[] }>(
      "/api/search/suggestions",
      {
        params: { q: query, limit },
        headers: getAuthHeaders(),
      }
    );
    return response.data.data || [];
  } catch (error: any) {
    throw new Error(toErrorMessage(error, "Failed to fetch suggestions"));
  }
};

/**
 * Get available filters and options
 */
export const getSearchFilters = async () => {
  try {
    const response = await axios.get<{
      success: boolean;
      data: {
        difficulties: string[];
        goals: { slug: string; label: string }[];
        contentTypes: { id: string; label: string }[];
      };
    }>("/api/search/filters", {
      headers: getAuthHeaders(),
    });
    return response.data.data;
  } catch (error: any) {
    throw new Error(toErrorMessage(error, "Failed to fetch filter options"));
  }
};
