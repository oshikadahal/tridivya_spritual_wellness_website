import { FilterQuery } from 'mongoose';
import { HttpError } from '../errors/http-error';
import { CreateSessionDTO, ListSessionsQueryDTO, UpdateSessionDTO, CreateSessionReviewDTO, UpdateSessionReviewDTO } from '../dtos/session.dto';
import { ISession } from '../models/session.model';
import { SessionRepository } from '../repositories/session.repository';

const sessionRepository = new SessionRepository();

export class SessionService {
  async create(data: CreateSessionDTO) {
    return sessionRepository.create(data as Partial<ISession>);
  }

  async list(query: ListSessionsQueryDTO) {
    const filters: FilterQuery<ISession> = {};
    if (query.session_type) filters.session_type = query.session_type;
    if (query.goal_slug) filters.goal_slug = query.goal_slug;
    if (query.difficulty) filters.difficulty = query.difficulty;

    if (query.min_duration_seconds !== undefined || query.max_duration_seconds !== undefined) {
      filters.duration_seconds = {};
      if (query.min_duration_seconds !== undefined) {
        (filters.duration_seconds as Record<string, number>).$gte = query.min_duration_seconds;
      }
      if (query.max_duration_seconds !== undefined) {
        (filters.duration_seconds as Record<string, number>).$lte = query.max_duration_seconds;
      }
    }

    if (query.is_featured !== undefined) filters.is_featured = query.is_featured;
    if (query.is_trending !== undefined) filters.is_trending = query.is_trending;

    let sort: Record<string, 1 | -1> = { created_at: -1 };
    if (query.sort === 'duration_asc') sort = { duration_seconds: 1 };
    if (query.sort === 'duration_desc') sort = { duration_seconds: -1 };

    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const { items, total } = await sessionRepository.list(filters, page, limit, sort);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getById(sessionId: string) {
    const session = await sessionRepository.findBySessionId(sessionId);
    if (!session) {
      throw new HttpError(404, 'Session not found');
    }

    const [reviews, review_summary] = await Promise.all([
      sessionRepository.listReviews(sessionId),
      sessionRepository.reviewSummary(sessionId),
    ]);

    return {
      ...session.toObject(),
      reviews,
      review_summary,
    };
  }

  async update(sessionId: string, data: UpdateSessionDTO) {
    const updated = await sessionRepository.updateBySessionId(sessionId, data as Partial<ISession>);
    if (!updated) {
      throw new HttpError(404, 'Session not found');
    }
    return updated;
  }

  async remove(sessionId: string) {
    const removed = await sessionRepository.softDelete(sessionId);
    if (!removed) {
      throw new HttpError(404, 'Session not found');
    }
    return removed;
  }

  async listReviews(sessionId: string) {
    await this.getById(sessionId);
    return sessionRepository.listReviews(sessionId);
  }

  async createReview(userId: string, sessionId: string, data: CreateSessionReviewDTO) {
    await this.getById(sessionId);
    try {
      return await sessionRepository.createReview({
        user_id: userId,
        session_id: sessionId,
        rating: data.rating,
        title: data.title,
        comment: data.comment,
      });
    } catch (error: unknown) {
      if (error instanceof Error && error.message.includes('duplicate key')) {
        throw new HttpError(409, 'You already reviewed this session');
      }
      throw error;
    }
  }

  async updateReview(userId: string, sessionId: string, reviewId: string, data: UpdateSessionReviewDTO) {
    const existing = await sessionRepository.findReviewById(reviewId);
    if (!existing) {
      throw new HttpError(404, 'Review not found');
    }
    if (existing.user_id !== userId || existing.session_id !== sessionId) {
      throw new HttpError(403, 'Forbidden');
    }

    const review = await sessionRepository.updateReviewById(reviewId, userId, sessionId, data);
    if (!review) {
      throw new HttpError(404, 'Review not found');
    }
    return review;
  }

  async deleteReview(userId: string, sessionId: string, reviewId: string) {
    const existing = await sessionRepository.findReviewById(reviewId);
    if (!existing) {
      throw new HttpError(404, 'Review not found');
    }
    if (existing.user_id !== userId || existing.session_id !== sessionId) {
      throw new HttpError(403, 'Forbidden');
    }

    const review = await sessionRepository.deleteReviewById(reviewId, userId, sessionId);
    if (!review) {
      throw new HttpError(404, 'Review not found');
    }
    return true;
  }
}
