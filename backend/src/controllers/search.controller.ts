import { Request, Response } from "express";
import { searchService, SearchFilters } from "../services/search.service";

export class SearchController {
  /**
   * Search content across all types
   * GET /api/search/content?q=query&contentTypes=meditation,yoga&difficulty=beginner&sortBy=relevance&page=1&limit=20
   */
  async searchContent(req: Request, res: Response) {
    try {
      const { q, contentTypes, difficulty, minRating, goals, sortBy, page, limit } =
        req.query;

      if (!q || typeof q !== "string") {
        return res.status(400).json({
          success: false,
          message: "Search query is required",
        });
      }

      const filters: SearchFilters = {
        contentTypes: contentTypes
          ? ((contentTypes as string)
              .split(",")
              .filter((t) => t) as ("meditation" | "yoga" | "mantra" | "library")[])
          : undefined,
        difficulty: difficulty
          ? ((difficulty as string)
              .split(",")
              .filter((d) => d) as ("beginner" | "intermediate" | "advanced")[])
          : undefined,
        minRating: minRating ? parseInt(minRating as string) : undefined,
        goals: goals ? (goals as string).split(",").filter((g) => g) : undefined,
        sortBy: (sortBy as any) || "relevance",
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 20,
      };

      const results = await searchService.searchContent(q, filters);
      const resolvedLimit = filters.limit ?? 20;

      return res.status(200).json({
        success: true,
        data: results,
        pagination: {
          page: filters.page,
          limit: resolvedLimit,
          total: results.length,
          totalPages: Math.ceil(results.length / resolvedLimit),
        },
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Search failed",
      });
    }
  }

  /**
   * Get trending content
   * GET /api/search/trending?limit=6
   */
  async getTrendingContent(req: Request, res: Response) {
    try {
      const { limit } = req.query;
      const contentLimit = limit ? parseInt(limit as string) : 6;

      const results = await searchService.getTrendingContent(contentLimit);

      return res.status(200).json({
        success: true,
        data: results,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Failed to fetch trending content",
      });
    }
  }

  /**
   * Get featured content
   * GET /api/search/featured?limit=6
   */
  async getFeaturedContent(req: Request, res: Response) {
    try {
      const { limit } = req.query;
      const contentLimit = limit ? parseInt(limit as string) : 6;

      const results = await searchService.getFeaturedContent(contentLimit);

      return res.status(200).json({
        success: true,
        data: results,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Failed to fetch featured content",
      });
    }
  }

  /**
   * Get content by goal
   * GET /api/search/by-goal?goal=stress-relief&page=1&limit=20
   */
  async getContentByGoal(req: Request, res: Response) {
    try {
      const { goal, page, limit } = req.query;

      if (!goal || typeof goal !== "string") {
        return res.status(400).json({
          success: false,
          message: "Goal parameter is required",
        });
      }

      const results = await searchService.getContentByGoal(goal, {
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 20,
      });

      return res.status(200).json({
        success: true,
        data: results,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Failed to fetch goal content",
      });
    }
  }

  /**
   * Get search suggestions
   * GET /api/search/suggestions?q=meditation&limit=5
   */
  async getSearchSuggestions(req: Request, res: Response) {
    try {
      const { q, limit } = req.query;

      if (!q || typeof q !== "string") {
        return res.status(200).json({
          success: true,
          data: [],
        });
      }

      const suggestions = await searchService.getSearchSuggestions(
        q,
        limit ? parseInt(limit as string) : 5
      );

      return res.status(200).json({
        success: true,
        data: suggestions,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Failed to fetch suggestions",
      });
    }
  }

  /**
   * Get available filter options
   * GET /api/search/filters
   */
  async getFilterOptions(req: Request, res: Response) {
    try {
      const filters = await searchService.getFilterOptions();

      return res.status(200).json({
        success: true,
        data: filters,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Failed to fetch filter options",
      });
    }
  }
}

export default SearchController;
