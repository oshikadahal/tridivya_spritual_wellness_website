import { Request, Response, NextFunction } from 'express';
import { MeService } from '../services/me.service';
import { UpsertMeditationProgressDTOSchema, UpsertYogaProgressDTOSchema, UpsertMantraProgressDTOSchema, UpsertLibraryProgressDTOSchema } from '../dtos/progress.dto';
import { CreateReviewDTOSchema, UpdateReviewDTOSchema } from '../dtos/review.dto';
import { ZodError } from 'zod';

const meService = new MeService();

export class MeController {
  // Saved Meditations
  async saveMeditation(req: Request, res: Response, next: NextFunction) {
    try {
      const user_id = req.user!.id;
      const { meditation_id } = req.body;
      const result = await meService.saveMeditation(user_id, meditation_id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async unsaveMeditation(req: Request, res: Response, next: NextFunction) {
    try {
      const user_id = req.user!.id;
      const { meditation_id } = req.params;
      const result = await meService.unsaveMeditation(user_id, meditation_id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getSavedMeditations(req: Request, res: Response, next: NextFunction) {
    try {
      const user_id = req.user!.id;
      const meditations = await meService.getSavedMeditations(user_id);
      res.json(meditations);
    } catch (error) {
      next(error);
    }
  }

  // Saved Yogas
  async saveYoga(req: Request, res: Response, next: NextFunction) {
    try {
      const user_id = req.user!.id;
      const { yoga_id } = req.body;
      const result = await meService.saveYoga(user_id, yoga_id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async unsaveYoga(req: Request, res: Response, next: NextFunction) {
    try {
      const user_id = req.user!.id;
      const { yoga_id } = req.params;
      const result = await meService.unsaveYoga(user_id, yoga_id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getSavedYogas(req: Request, res: Response, next: NextFunction) {
    try {
      const user_id = req.user!.id;
      const yogas = await meService.getSavedYogas(user_id);
      res.json(yogas);
    } catch (error) {
      next(error);
    }
  }

  // Saved Mantras
  async saveMantra(req: Request, res: Response, next: NextFunction) {
    try {
      const user_id = req.user!.id;
      const { mantra_id } = req.body;
      const result = await meService.saveMantra(user_id, mantra_id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async unsaveMantra(req: Request, res: Response, next: NextFunction) {
    try {
      const user_id = req.user!.id;
      const { mantra_id } = req.params;
      const result = await meService.unsaveMantra(user_id, mantra_id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getSavedMantras(req: Request, res: Response, next: NextFunction) {
    try {
      const user_id = req.user!.id;
      const mantras = await meService.getSavedMantras(user_id);
      res.json(mantras);
    } catch (error) {
      next(error);
    }
  }

  // Saved Library Items
  async saveLibraryItem(req: Request, res: Response, next: NextFunction) {
    try {
      const user_id = req.user!.id;
      const { library_item_id } = req.body;
      const result = await meService.saveLibraryItem(user_id, library_item_id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async unsaveLibraryItem(req: Request, res: Response, next: NextFunction) {
    try {
      const user_id = req.user!.id;
      const { library_item_id } = req.params;
      const result = await meService.unsaveLibraryItem(user_id, library_item_id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getSavedLibraryItems(req: Request, res: Response, next: NextFunction) {
    try {
      const user_id = req.user!.id;
      const items = await meService.getSavedLibraryItems(user_id);
      res.json(items);
    } catch (error) {
      next(error);
    }
  }

  // Meditation Progress
  async upsertMeditationProgress(req: Request, res: Response, next: NextFunction) {
    try {
      const user_id = req.user!.id;
      const data = UpsertMeditationProgressDTOSchema.parse(req.body);
      const progress = await meService.upsertMeditationProgress(user_id, data);
      res.json(progress);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      next(error);
    }
  }

  async getMeditationProgress(req: Request, res: Response, next: NextFunction) {
    try {
      const user_id = req.user!.id;
      const progress = await meService.getMeditationProgress(user_id);
      res.json(progress);
    } catch (error) {
      next(error);
    }
  }

  // Yoga Progress
  async upsertYogaProgress(req: Request, res: Response, next: NextFunction) {
    try {
      const user_id = req.user!.id;
      const data = UpsertYogaProgressDTOSchema.parse(req.body);
      const progress = await meService.upsertYogaProgress(user_id, data);
      res.json(progress);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      next(error);
    }
  }

  async getYogaProgress(req: Request, res: Response, next: NextFunction) {
    try {
      const user_id = req.user!.id;
      const progress = await meService.getYogaProgress(user_id);
      res.json(progress);
    } catch (error) {
      next(error);
    }
  }

  // Mantra Progress
  async upsertMantraProgress(req: Request, res: Response, next: NextFunction) {
    try {
      const user_id = req.user!.id;
      const data = UpsertMantraProgressDTOSchema.parse(req.body);
      const progress = await meService.upsertMantraProgress(user_id, data);
      res.json(progress);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      next(error);
    }
  }

  async getMantraProgress(req: Request, res: Response, next: NextFunction) {
    try {
      const user_id = req.user!.id;
      const progress = await meService.getMantraProgress(user_id);
      res.json(progress);
    } catch (error) {
      next(error);
    }
  }

  // Library Progress
  async upsertLibraryProgress(req: Request, res: Response, next: NextFunction) {
    try {
      const user_id = req.user!.id;
      const data = UpsertLibraryProgressDTOSchema.parse(req.body);
      const progress = await meService.upsertLibraryProgress(user_id, data);
      res.json(progress);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      next(error);
    }
  }

  async getLibraryProgress(req: Request, res: Response, next: NextFunction) {
    try {
      const user_id = req.user!.id;
      const progress = await meService.getLibraryProgress(user_id);
      res.json(progress);
    } catch (error) {
      next(error);
    }
  }

  // Aggregated saved sessions
  async getSavedSessions(req: Request, res: Response, next: NextFunction) {
    try {
      const user_id = req.user!.id;
      const { content_type } = req.query as any;
      const page = req.query.page ? Number(req.query.page) : 1;
      const limit = req.query.limit ? Number(req.query.limit) : 20;
      const items = await meService.getSavedSessions(user_id, content_type, page, limit);
      res.json(items);
    } catch (error) {
      next(error);
    }
  }

  // Meditation Reviews (routes now use :id param from /api/v1/meditations/:id/reviews)
  async createMeditationReview(req: Request, res: Response, next: NextFunction) {
    try {
      const user_id = req.user!.id;
      const meditation_id = req.params.id; // Changed from req.params.meditation_id
      const data = CreateReviewDTOSchema.parse(req.body);
      const review = await meService.createMeditationReview(user_id, meditation_id, data);
      res.status(201).json(review);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      next(error);
    }
  }

  async updateMeditationReview(req: Request, res: Response, next: NextFunction) {
    try {
      const user_id = req.user!.id;
      const meditation_id = req.params.id; // Changed from req.params.meditation_id
      const data = UpdateReviewDTOSchema.parse(req.body);
      const review = await meService.updateMeditationReview(user_id, meditation_id, data);
      res.json(review);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      next(error);
    }
  }

  async deleteMeditationReview(req: Request, res: Response, next: NextFunction) {
    try {
      const user_id = req.user!.id;
      const meditation_id = req.params.id; // Changed from req.params.meditation_id
      const result = await meService.deleteMeditationReview(user_id, meditation_id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getMeditationReviews(req: Request, res: Response, next: NextFunction) {
    try {
      const meditation_id = req.params.id; // Changed from req.params.meditation_id
      const reviews = await meService.getMeditationReviews(meditation_id);
      res.json(reviews);
    } catch (error) {
      next(error);
    }
  }

  // Yoga Reviews (routes now use :id param from /api/v1/yogas/:id/reviews)
  async createYogaReview(req: Request, res: Response, next: NextFunction) {
    try {
      const user_id = req.user!.id;
      const yoga_id = req.params.id; // Changed from req.params.yoga_id
      const data = CreateReviewDTOSchema.parse(req.body);
      const review = await meService.createYogaReview(user_id, yoga_id, data);
      res.status(201).json(review);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      next(error);
    }
  }

  async updateYogaReview(req: Request, res: Response, next: NextFunction) {
    try {
      const user_id = req.user!.id;
      const yoga_id = req.params.id; // Changed from req.params.yoga_id
      const data = UpdateReviewDTOSchema.parse(req.body);
      const review = await meService.updateYogaReview(user_id, yoga_id, data);
      res.json(review);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      next(error);
    }
  }

  async deleteYogaReview(req: Request, res: Response, next: NextFunction) {
    try {
      const user_id = req.user!.id;
      const yoga_id = req.params.id; // Changed from req.params.yoga_id
      const result = await meService.deleteYogaReview(user_id, yoga_id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getYogaReviews(req: Request, res: Response, next: NextFunction) {
    try {
      const yoga_id = req.params.id; // Changed from req.params.yoga_id
      const reviews = await meService.getYogaReviews(yoga_id);
      res.json(reviews);
    } catch (error) {
      next(error);
    }
  }

  // Mantra Reviews (routes now use :id param from /api/v1/mantras/:id/reviews)
  async createMantraReview(req: Request, res: Response, next: NextFunction) {
    try {
      const user_id = req.user!.id;
      const mantra_id = req.params.id; // Changed from req.params.mantra_id
      const data = CreateReviewDTOSchema.parse(req.body);
      const review = await meService.createMantraReview(user_id, mantra_id, data);
      res.status(201).json(review);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      next(error);
    }
  }

  async updateMantraReview(req: Request, res: Response, next: NextFunction) {
    try {
      const user_id = req.user!.id;
      const mantra_id = req.params.id; // Changed from req.params.mantra_id
      const data = UpdateReviewDTOSchema.parse(req.body);
      const review = await meService.updateMantraReview(user_id, mantra_id, data);
      res.json(review);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      next(error);
    }
  }

  async deleteMantraReview(req: Request, res: Response, next: NextFunction) {
    try {
      const user_id = req.user!.id;
      const mantra_id = req.params.id; // Changed from req.params.mantra_id
      const result = await meService.deleteMantraReview(user_id, mantra_id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getMantraReviews(req: Request, res: Response, next: NextFunction) {
    try {
      const mantra_id = req.params.id; // Changed from req.params.mantra_id
      const reviews = await meService.getMantraReviews(mantra_id);
      res.json(reviews);
    } catch (error) {
      next(error);
    }
  }

  // Library Reviews
  async createLibraryReview(req: Request, res: Response, next: NextFunction) {
    try {
      const user_id = req.user!.id;
      const { library_item_id } = req.params;
      const data = CreateReviewDTOSchema.parse(req.body);
      const review = await meService.createLibraryReview(user_id, library_item_id, data);
      res.status(201).json(review);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      next(error);
    }
  }

  async updateLibraryReview(req: Request, res: Response, next: NextFunction) {
    try {
      const user_id = req.user!.id;
      const { library_item_id } = req.params;
      const data = UpdateReviewDTOSchema.parse(req.body);
      const review = await meService.updateLibraryReview(user_id, library_item_id, data);
      res.json(review);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      next(error);
    }
  }

  async deleteLibraryReview(req: Request, res: Response, next: NextFunction) {
    try {
      const user_id = req.user!.id;
      const { library_item_id } = req.params;
      const result = await meService.deleteLibraryReview(user_id, library_item_id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getLibraryReviews(req: Request, res: Response, next: NextFunction) {
    try {
      const { library_item_id } = req.params;
      const reviews = await meService.getLibraryReviews(library_item_id);
      res.json(reviews);
    } catch (error) {
      next(error);
    }
  }
}

export const meController = new MeController();