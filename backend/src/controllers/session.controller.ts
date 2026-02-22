import { Request, Response } from 'express';
import z from 'zod';
import {
  CreateSessionDTO,
  CreateSessionReviewDTO,
  ListSessionsQueryDTO,
  UpdateSessionDTO,
  UpdateSessionReviewDTO,
} from '../dtos/session.dto';
import { SessionService } from '../services/session.service';

const sessionService = new SessionService();

function prettifyZodError(error: z.ZodError) {
  return error.issues.map((i) => `${i.path.join('.') || '<root>'}: ${i.message}`).join('; ');
}

function getUserId(req: Request): string {
  const userId = (req.user as { _id?: string } | undefined)?._id;
  return String(userId || '');
}

export class SessionController {
  async list(req: Request, res: Response) {
    try {
      const parsed = ListSessionsQueryDTO.safeParse(req.query);
      if (!parsed.success) {
        return res.status(400).json({ success: false, message: prettifyZodError(parsed.error) });
      }

      const result = await sessionService.list(parsed.data);
      return res.status(200).json({ success: true, message: 'Sessions fetched successfully', data: result.items, pagination: result.pagination });
    } catch (error: unknown) {
      const err = error as { statusCode?: number; message?: string };
      return res.status(err.statusCode ?? 500).json({ success: false, message: err.message || 'Internal Server Error' });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const session = await sessionService.getById(req.params.session_id);
      return res.status(200).json({ success: true, message: 'Session fetched successfully', data: session });
    } catch (error: unknown) {
      const err = error as { statusCode?: number; message?: string };
      return res.status(err.statusCode ?? 500).json({ success: false, message: err.message || 'Internal Server Error' });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const parsed = CreateSessionDTO.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ success: false, message: prettifyZodError(parsed.error) });
      }

      const created = await sessionService.create(parsed.data);
      return res.status(201).json({ success: true, message: 'Session created successfully', data: created });
    } catch (error: unknown) {
      const err = error as { statusCode?: number; message?: string };
      return res.status(err.statusCode ?? 500).json({ success: false, message: err.message || 'Internal Server Error' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const parsed = UpdateSessionDTO.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ success: false, message: prettifyZodError(parsed.error) });
      }

      const updated = await sessionService.update(req.params.session_id, parsed.data);
      return res.status(200).json({ success: true, message: 'Session updated successfully', data: updated });
    } catch (error: unknown) {
      const err = error as { statusCode?: number; message?: string };
      return res.status(err.statusCode ?? 500).json({ success: false, message: err.message || 'Internal Server Error' });
    }
  }

  async remove(req: Request, res: Response) {
    try {
      await sessionService.remove(req.params.session_id);
      return res.status(200).json({ success: true, message: 'Session deleted successfully', data: null });
    } catch (error: unknown) {
      const err = error as { statusCode?: number; message?: string };
      return res.status(err.statusCode ?? 500).json({ success: false, message: err.message || 'Internal Server Error' });
    }
  }

  async listReviews(req: Request, res: Response) {
    try {
      const reviews = await sessionService.listReviews(req.params.session_id);
      return res.status(200).json({ success: true, message: 'Session reviews fetched successfully', data: reviews });
    } catch (error: unknown) {
      const err = error as { statusCode?: number; message?: string };
      return res.status(err.statusCode ?? 500).json({ success: false, message: err.message || 'Internal Server Error' });
    }
  }

  async createReview(req: Request, res: Response) {
    try {
      const parsed = CreateSessionReviewDTO.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ success: false, message: prettifyZodError(parsed.error) });
      }

      const userId = getUserId(req);
      const created = await sessionService.createReview(userId, req.params.session_id, parsed.data);
      return res.status(201).json({ success: true, message: 'Review created successfully', data: created });
    } catch (error: unknown) {
      const err = error as { statusCode?: number; message?: string };
      return res.status(err.statusCode ?? 500).json({ success: false, message: err.message || 'Internal Server Error' });
    }
  }

  async updateReview(req: Request, res: Response) {
    try {
      const parsed = UpdateSessionReviewDTO.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ success: false, message: prettifyZodError(parsed.error) });
      }

      const userId = getUserId(req);
      const updated = await sessionService.updateReview(userId, req.params.session_id, req.params.review_id, parsed.data);
      return res.status(200).json({ success: true, message: 'Review updated successfully', data: updated });
    } catch (error: unknown) {
      const err = error as { statusCode?: number; message?: string };
      return res.status(err.statusCode ?? 500).json({ success: false, message: err.message || 'Internal Server Error' });
    }
  }

  async removeReview(req: Request, res: Response) {
    try {
      const userId = getUserId(req);
      await sessionService.deleteReview(userId, req.params.session_id, req.params.review_id);
      return res.status(200).json({ success: true, message: 'Review deleted successfully', data: null });
    } catch (error: unknown) {
      const err = error as { statusCode?: number; message?: string };
      return res.status(err.statusCode ?? 500).json({ success: false, message: err.message || 'Internal Server Error' });
    }
  }
}
