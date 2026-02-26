import { YogaRepository } from '../repositories/yoga.repository';
import { CreateYogaDTO, UpdateYogaDTO, ListYogasQueryDTO } from '../dtos/yoga.dto';
import { HttpError } from '../errors/http-error';

export class YogaService {
  private repository: YogaRepository;

  constructor() {
    this.repository = new YogaRepository();
  }

  async create(data: CreateYogaDTO) {
    const payload: CreateYogaDTO = {
      ...data,
      image_url: data.image_url,
      thumbnail_url: data.thumbnail_url || data.image_url,
      cover_image_url: data.cover_image_url || data.image_url,
    };

    return this.repository.create(payload);
  }

  async findAll(query: ListYogasQueryDTO) {
    return this.repository.findAll(query);
  }

  async findById(id: string) {
    const yoga = await this.repository.findById(id);
    if (!yoga) {
      throw new HttpError(404, 'Yoga not found');
    }

    const reviewSummary = await this.repository.getReviewSummary(id);

    return {
      ...yoga,
      review_summary: reviewSummary || { average_rating: 0, total_reviews: 0 },
    };
  }

  async update(id: string, data: UpdateYogaDTO) {
    const resolvedImageUrl = data.image_url;

    const payload: UpdateYogaDTO = {
      ...data,
      thumbnail_url: data.thumbnail_url || (resolvedImageUrl ? resolvedImageUrl : undefined),
      cover_image_url: data.cover_image_url || (resolvedImageUrl ? resolvedImageUrl : undefined),
    };

    const yoga = await this.repository.update(id, payload);
    if (!yoga) {
      throw new HttpError(404, 'Yoga not found');
    }
    return yoga;
  }

  async delete(id: string) {
    const deleted = await this.repository.delete(id);
    if (!deleted) {
      throw new HttpError(404, 'Yoga not found');
    }
    return { message: 'Yoga deleted successfully' };
  }
}
