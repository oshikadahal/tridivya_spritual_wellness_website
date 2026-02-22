import { Request, Response, NextFunction } from 'express';
import { MantraService } from '../services/mantra.service';
import { CreateMantraDTOSchema, UpdateMantraDTOSchema, ListMantrasQueryDTOSchema } from '../dtos/mantra.dto';
import { ZodError } from 'zod';

const mantraService = new MantraService();

export class MantraController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = CreateMantraDTOSchema.parse(req.body);
      const mantra = await mantraService.create(data);
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
