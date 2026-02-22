import { Request, Response, NextFunction } from 'express';
import { MeditationService } from '../services/meditation.service';
import { CreateMeditationDTOSchema, UpdateMeditationDTOSchema, ListMeditationsQueryDTOSchema } from '../dtos/meditation.dto';
import { ZodError } from 'zod';

const meditationService = new MeditationService();

export class MeditationController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = CreateMeditationDTOSchema.parse(req.body);
      const meditation = await meditationService.create(data);
      res.status(201).json(meditation);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      next(error);
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const query = ListMeditationsQueryDTOSchema.parse(req.query);
      const result = await meditationService.findAll(query);
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
      const meditation = await meditationService.findById(id);
      res.json(meditation);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = UpdateMeditationDTOSchema.parse(req.body);
      const meditation = await meditationService.update(id, data);
      res.json(meditation);
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
      const result = await meditationService.delete(id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

export const meditationController = new MeditationController();
