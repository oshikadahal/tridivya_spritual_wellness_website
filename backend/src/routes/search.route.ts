import { Router } from "express";
import SearchController from "../controllers/search.controller";
import { authorizedMiddleware } from "../middlewares/authorization.middleware";

const router = Router();
const searchController = new SearchController();

// Public search endpoints (no auth required)
router.get("/content", (req, res) => searchController.searchContent(req, res));
router.get("/trending", (req, res) => searchController.getTrendingContent(req, res));
router.get("/featured", (req, res) => searchController.getFeaturedContent(req, res));
router.get("/by-goal", (req, res) => searchController.getContentByGoal(req, res));
router.get("/suggestions", (req, res) => searchController.getSearchSuggestions(req, res));
router.get("/filters", (req, res) => searchController.getFilterOptions(req, res));

export default router;
