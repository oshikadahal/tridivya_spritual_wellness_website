import { MeditationRepository } from '../repositories/meditation.repository';
import { CreateMeditationDTO, UpdateMeditationDTO, ListMeditationsQueryDTO } from '../dtos/meditation.dto';
import { HttpError } from '../errors/http-error';

export class MeditationService {
  private repository: MeditationRepository;

  constructor() {
    this.repository = new MeditationRepository();
  }

  async create(data: CreateMeditationDTO) {
    const payload: CreateMeditationDTO = {
      ...data,
      image_url: data.image_url,
      thumbnail_url: data.thumbnail_url || data.image_url,
      cover_image_url: data.cover_image_url || data.image_url,
    };

    return this.repository.create(payload);
  }

  async findAll(query: ListMeditationsQueryDTO) {
    return this.repository.findAll(query);
  }

  async findById(id: string) {
    const meditation = await this.repository.findById(id);
    if (!meditation) {
      throw new HttpError(404, 'Meditation not found');
    }

    const reviewSummary = await this.repository.getReviewSummary(id);

    return {
      ...meditation,
      review_summary: reviewSummary || { average_rating: 0, total_reviews: 0 },
    };
  }

  async update(id: string, data: UpdateMeditationDTO) {
    const resolvedImageUrl = data.image_url;

    const payload: UpdateMeditationDTO = {
      ...data,
      thumbnail_url: data.thumbnail_url || (resolvedImageUrl ? resolvedImageUrl : undefined),
      cover_image_url: data.cover_image_url || (resolvedImageUrl ? resolvedImageUrl : undefined),
    };

    const meditation = await this.repository.update(id, payload);
    if (!meditation) {
      throw new HttpError(404, 'Meditation not found');
    }
    return meditation;
  }

  async delete(id: string) {
    const deleted = await this.repository.delete(id);
    if (!deleted) {
      throw new HttpError(404, 'Meditation not found');
    }
    return { message: 'Meditation deleted successfully' };
  }
}
