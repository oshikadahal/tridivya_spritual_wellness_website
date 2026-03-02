import { Request, Response, NextFunction } from 'express';
import { MantraService } from '../services/mantra.service';
import { CreateMantraDTOSchema, UpdateMantraDTOSchema, ListMantrasQueryDTOSchema } from '../dtos/mantra.dto';
import { ZodError } from 'zod';
import { AnnouncementService } from '../services/announcement.service';

const mantraService = new MantraService();
const announcementService = new AnnouncementService();

export class MantraController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = CreateMantraDTOSchema.parse(req.body);
      const mantra = await mantraService.create(data);

      const adminId = (req as any).user?.id;
      if (adminId) {
        try {
          const announcement = await announcementService.create(
            {
              title: 'New Mantra Session Added',
              message: `A new mantra session is now available: ${mantra.title}.`,
              tone: 'empower',
              status: 'draft',
            },
            adminId
          );

          await announcementService.publish(announcement.id, adminId);
        } catch (announcementError) {
          console.error('Mantra created but announcement publishing failed:', announcementError);
        }
      }

      res.status(201).json(mantra);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      next(error);
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const query = ListMantrasQueryDTOSchema.parse(req.query);
      const result = await mantraService.findAll(query);
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
      const mantra = await mantraService.findById(id);
      res.json(mantra);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = UpdateMantraDTOSchema.parse(req.body);
      const mantra = await mantraService.update(id, data);
      res.json(mantra);
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
      const result = await mantraService.delete(id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

export const mantraController = new MantraController();
