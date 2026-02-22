import { MantraModel, IMantra } from '../models/mantra.model';
import { UserMantraReviewModel } from '../models/user-mantra-review.model';
import { CreateMantraDTO, UpdateMantraDTO, ListMantrasQueryDTO } from '../dtos/mantra.dto';

export class MantraRepository {
  async create(data: CreateMantraDTO): Promise<IMantra> {
    const mantra = new MantraModel(data);
    return mantra.save();
  }

  async findAll(query: ListMantrasQueryDTO): Promise<{ data: IMantra[]; total: number; page: number; limit: number }> {
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
      MantraModel.find(filter).sort(sortOptions).skip(skip).limit(limit).lean(),
      MantraModel.countDocuments(filter),
    ]);

    return { data: data as IMantra[], total, page, limit };
  }

  async findById(id: string): Promise<IMantra | null> {
    return MantraModel.findOne({ id }).lean();
  }

  async update(id: string, data: UpdateMantraDTO): Promise<IMantra | null> {
    return MantraModel.findOneAndUpdate({ id }, data, { new: true }).lean();
  }

  async delete(id: string): Promise<boolean> {
    const result = await MantraModel.updateOne({ id }, { is_active: false });
    return result.modifiedCount > 0;
  }

  async getReviewSummary(mantra_id: string): Promise<{ average_rating: number; total_reviews: number } | null> {
    const result = await UserMantraReviewModel.aggregate([
      { $match: { mantra_id } },
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
