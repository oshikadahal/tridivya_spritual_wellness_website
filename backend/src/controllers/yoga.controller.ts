import { Request, Response, NextFunction } from 'express';
import { YogaService } from '../services/yoga.service';
import { CreateYogaDTOSchema, UpdateYogaDTOSchema, ListYogasQueryDTOSchema } from '../dtos/yoga.dto';
import { ZodError } from 'zod';

const yogaService = new YogaService();

export class YogaController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = CreateYogaDTOSchema.parse(req.body);
      const yoga = await yogaService.create(data);
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
