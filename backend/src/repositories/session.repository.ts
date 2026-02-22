import { FilterQuery } from 'mongoose';
import { ISession, SessionModel } from '../models/session.model';
import { IUserSessionReview, UserSessionReviewModel } from '../models/user-session-review.model';

export class SessionRepository {
  async create(data: Partial<ISession>) {
    const created = new SessionModel(data);
    return created.save();
  }

  async findBySessionId(sessionId: string) {
    return SessionModel.findOne({ id: sessionId, is_active: true });
  }

  async list(filters: FilterQuery<ISession>, page: number, limit: number, sort: Record<string, 1 | -1>) {
    const skip = (page - 1) * limit;
    const query = { ...filters, is_active: true };

    const [items, total] = await Promise.all([
      SessionModel.find(query).sort(sort).skip(skip).limit(limit),
      SessionModel.countDocuments(query),
    ]);

    return { items, total };
  }

  async updateBySessionId(sessionId: string, data: Partial<ISession>) {
    return SessionModel.findOneAndUpdate({ id: sessionId }, data, { new: true });
  }

  async softDelete(sessionId: string) {
    return SessionModel.findOneAndUpdate({ id: sessionId }, { is_active: false }, { new: true });
  }

  async listReviews(sessionId: string) {
    return UserSessionReviewModel.find({ session_id: sessionId }).sort({ created_at: -1 });
  }

  async reviewSummary(sessionId: string) {
    const result = await UserSessionReviewModel.aggregate([
      { $match: { session_id: sessionId } },
      {
        $group: {
          _id: '$session_id',
          avg_rating: { $avg: '$rating' },
          total_reviews: { $sum: 1 },
        },
      },
    ]);

    if (result.length === 0) {
      return { avg_rating: 0, total_reviews: 0 };
    }

    return {
      avg_rating: Number(result[0].avg_rating.toFixed(2)),
      total_reviews: result[0].total_reviews,
    };
  }

  async createReview(data: Partial<IUserSessionReview>) {
    const created = new UserSessionReviewModel(data);
    return created.save();
  }

  async findReviewById(reviewId: string) {
    return UserSessionReviewModel.findOne({ id: reviewId });
  }

  async updateReviewById(reviewId: string, userId: string, sessionId: string, data: Partial<IUserSessionReview>) {
    return UserSessionReviewModel.findOneAndUpdate(
      { id: reviewId, user_id: userId, session_id: sessionId },
      data,
      { new: true }
    );
  }

  async deleteReviewById(reviewId: string, userId: string, sessionId: string) {
    return UserSessionReviewModel.findOneAndDelete({ id: reviewId, user_id: userId, session_id: sessionId });
  }
}
