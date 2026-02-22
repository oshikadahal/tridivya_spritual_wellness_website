import { Request, Response } from 'express';
import z from 'zod';
import { MoodCheckinDTO } from '../dtos/saved-item.dto';
import { SessionService } from '../services/session.service';

const sessionService = new SessionService();

function prettifyZodError(error: z.ZodError) {
  return error.issues.map((i) => `${i.path.join('.') || '<root>'}: ${i.message}`).join('; ');
}

export class HomeController {
  async home(_req: Request, res: Response) {
    try {
      const featured = await sessionService.list({ page: 1, limit: 5, is_featured: true });
      const recommended = await sessionService.list({ page: 1, limit: 8 });

      return res.status(200).json({
        success: true,
        message: 'Home data fetched successfully',
        data: {
          user_greeting: 'Welcome back',
          streak_summary: { current_streak_days: 0 },
          featured_sessions: featured.items,
          recommended_sessions: recommended.items,
          mantra_of_day: null,
          learning_paths: [],
        },
      });
    } catch (error: unknown) {
      const err = error as { statusCode?: number; message?: string };
      return res.status(err.statusCode ?? 500).json({ success: false, message: err.message || 'Internal Server Error' });
    }
  }

  async moodCheckin(req: Request, res: Response) {
    try {
      const parsed = MoodCheckinDTO.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ success: false, message: prettifyZodError(parsed.error) });
      }

      const recommendations = await sessionService.list({ page: 1, limit: 6, sort: 'recent' });
      return res.status(200).json({
        success: true,
        message: 'Mood check-in saved successfully',
        data: {
          mood_code: parsed.data.mood_code,
          note: parsed.data.note,
          recommended_sessions: recommendations.items,
        },
      });
    } catch (error: unknown) {
      const err = error as { statusCode?: number; message?: string };
      return res.status(err.statusCode ?? 500).json({ success: false, message: err.message || 'Internal Server Error' });
    }
  }
}
