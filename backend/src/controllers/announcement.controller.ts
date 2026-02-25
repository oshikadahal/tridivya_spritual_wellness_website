import { Request, Response, NextFunction } from 'express';
import { AnnouncementService } from '../services/announcement.service';
import {
  CreateAnnouncementDTOSchema,
  UpdateAnnouncementDTOSchema,
  ListAnnouncementsQueryDTOSchema,
} from '../dtos/announcement.dto';
import { ZodError } from 'zod';

const announcementService = new AnnouncementService();

export class AnnouncementController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = CreateAnnouncementDTOSchema.parse(req.body);
      const adminId = (req as any).user?.id;
      
      if (!adminId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const announcement = await announcementService.create(data, adminId);
      return res.status(201).json({
        success: true,
        message: 'Announcement created successfully',
        data: announcement,
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

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const query = ListAnnouncementsQueryDTOSchema.parse(req.query);
      const result = await announcementService.findAll(query);
      return res.status(200).json({
        success: true,
        message: 'Announcements retrieved successfully',
        data: result.data,
        pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: Math.ceil(result.total / result.limit),
        },
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

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const announcement = await announcementService.findById(id);
      return res.status(200).json({
        success: true,
        message: 'Announcement retrieved successfully',
        data: announcement,
      });
    } catch (error) {
      next(error);
    }
  }

  async findPublished(req: Request, res: Response, next: NextFunction) {
    try {
      const query = ListAnnouncementsQueryDTOSchema.parse(req.query);
      const result = await announcementService.findPublished(query);
      return res.status(200).json({
        success: true,
        message: 'Published announcements retrieved successfully',
        data: result.data,
        pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: Math.ceil(result.total / result.limit),
        },
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

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = UpdateAnnouncementDTOSchema.parse(req.body);
      const adminId = (req as any).user?.id;
      
      if (!adminId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const announcement = await announcementService.update(id, data, adminId);
      return res.status(200).json({
        success: true,
        message: 'Announcement updated successfully',
        data: announcement,
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

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await announcementService.delete(id);
      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }

  async publish(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const adminId = (req as any).user?.id;
      
      if (!adminId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const announcement = await announcementService.publish(id, adminId);
      return res.status(200).json({
        success: true,
        message: 'Announcement published successfully',
        data: announcement,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const announcementController = new AnnouncementController();
