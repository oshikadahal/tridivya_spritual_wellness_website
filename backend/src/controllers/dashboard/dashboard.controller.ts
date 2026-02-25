import { Request, Response, NextFunction } from 'express';
import { DashboardService } from '../../services/dashboard/dashboard.service';
import { CreateMoodCheckinDTOSchema } from '../../dtos/mood-checkin.dto';
import { ZodError } from 'zod';
import { HttpError } from '../../errors/http-error';

const dashboardService = new DashboardService();

export class DashboardController {
  async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const stats = await dashboardService.getDashboardStats(userId);
      return res.status(200).json({
        success: true,
        message: 'Dashboard stats retrieved successfully',
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }

  async getRecommendations(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const limit = req.query.limit ? parseInt(req.query.limit as string) : 8;
      const recommendations = await dashboardService.getRecommendedContent(userId, limit);

      return res.status(200).json({
        success: true,
        message: 'Recommendations retrieved successfully',
        data: recommendations,
      });
    } catch (error) {
      next(error);
    }
  }

  async getTrending(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 4;
      const trending = await dashboardService.getTrendingContent(limit);

      return res.status(200).json({
        success: true,
        message: 'Trending content retrieved successfully',
        data: trending,
      });
    } catch (error) {
      next(error);
    }
  }

  async getMoodCheckins(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const limit = req.query.limit ? parseInt(req.query.limit as string) : 7;
      const moods = await dashboardService.getRecentMoodCheckins(userId, limit);

      return res.status(200).json({
        success: true,
        message: 'Mood checkins retrieved successfully',
        data: moods,
      });
    } catch (error) {
      next(error);
    }
  }

  async getMoodSummary(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const days = req.query.days ? parseInt(req.query.days as string) : 30;
      const summary = await dashboardService.getMoodSummary(userId, days);

      return res.status(200).json({
        success: true,
        message: 'Mood summary retrieved successfully',
        data: summary,
      });
    } catch (error) {
      next(error);
    }
  }

  async createMoodCheckin(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const data = CreateMoodCheckinDTOSchema.parse(req.body);
      const moodCheckin = await dashboardService.recordMoodCheckin(userId, data.mood_code);

      return res.status(201).json({
        success: true,
        message: 'Mood checkin recorded successfully',
        data: moodCheckin,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.errors,
        });
      }
      next(error);
    }
  }

  async getRecentActivity(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const activity = await dashboardService.getRecentActivity(userId, limit);

      return res.status(200).json({
        success: true,
        message: 'Recent activity retrieved successfully',
        data: activity,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const dashboardController = new DashboardController();
