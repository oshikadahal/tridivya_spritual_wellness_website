import { MeditationModel, IMeditation } from '../models/meditation.model';
import { UserMeditationReviewModel } from '../models/user-meditation-review.model';
import { CreateMeditationDTO, UpdateMeditationDTO, ListMeditationsQueryDTO } from '../dtos/meditation.dto';

export class MeditationRepository {
  async create(data: CreateMeditationDTO): Promise<IMeditation> {
    const meditation = new MeditationModel(data);
    return meditation.save();
  }

  async findAll(query: ListMeditationsQueryDTO): Promise<{ data: IMeditation[]; total: number; page: number; limit: number }> {
    const { page = 1, limit = 10, goal_slug, difficulty, is_featured, is_trending, is_active, sort_by = 'created_at', sort_order = 'desc' } = query;

    const filter: any = {};
    if (goal_slug) filter.goal_slug = goal_slug;
    if (difficulty) filter.difficulty = difficulty;
    if (is_featured !== undefined) filter.is_featured = is_featured;
    if (is_trending !== undefined) filter.is_trending = is_trending;
    if (is_active !== undefined) filter.is_active = is_active;

    const skip = (page - 1) * limit;
    const sortOptions: any = { [sort_by]: sort_order === 'asc' ? 1 : -1 };

    const [data, total] = await Promise.all([
      MeditationModel.find(filter).sort(sortOptions).skip(skip).limit(limit).lean(),
      MeditationModel.countDocuments(filter),
    ]);

    return { data: data as IMeditation[], total, page, limit };
  }

  async findById(id: string): Promise<IMeditation | null> {
    return MeditationModel.findOne({ id }).lean();
  }

  async update(id: string, data: UpdateMeditationDTO): Promise<IMeditation | null> {
    return MeditationModel.findOneAndUpdate({ id }, data, { new: true }).lean();
  }

  async delete(id: string): Promise<boolean> {
    const result = await MeditationModel.updateOne({ id }, { is_active: false });
    return result.modifiedCount > 0;
  }

  async getReviewSummary(meditation_id: string): Promise<{ average_rating: number; total_reviews: number } | null> {
    const result = await UserMeditationReviewModel.aggregate([
      { $match: { meditation_id } },
      {
        $group: {
          _id: null,
          average_rating: { $avg: '$rating' },
          total_reviews: { $sum: 1 },
        },
      },
    ]);

    if (result.length === 0) {
      return null;
    }

    return {
      average_rating: Math.round(result[0].average_rating * 10) / 10,
      total_reviews: result[0].total_reviews,
    };
  }
}
