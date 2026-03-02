import { Request, Response, NextFunction } from 'express';
import { YogaService } from '../services/yoga.service';
import { CreateYogaDTOSchema, UpdateYogaDTOSchema, ListYogasQueryDTOSchema } from '../dtos/yoga.dto';
import { ZodError } from 'zod';
import { AnnouncementService } from '../services/announcement.service';

const yogaService = new YogaService();
const announcementService = new AnnouncementService();

export class YogaController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = CreateYogaDTOSchema.parse(req.body);
      const yoga = await yogaService.create(data);

      const adminId = (req as any).user?.id;
      if (adminId) {
        try {
          const announcement = await announcementService.create(
            {
              title: 'New Yoga Session Added',
              message: `A new yoga session is now available: ${yoga.title}.`,
              tone: 'celebrate',
              status: 'draft',
            },
            adminId
          );

          await announcementService.publish(announcement.id, adminId);
        } catch (announcementError) {
          console.error('Yoga created but announcement publishing failed:', announcementError);
        }
      }

      res.status(201).json(yoga);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      next(error);
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const query = ListYogasQueryDTOSchema.parse(req.query);
      const result = await yogaService.findAll(query);
      res.json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const yoga = await yogaService.findById(id);
      res.json(yoga);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = UpdateYogaDTOSchema.parse(req.body);
      const yoga = await yogaService.update(id, data);
      res.json(yoga);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await yogaService.delete(id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

export const yogaController = new YogaController();
