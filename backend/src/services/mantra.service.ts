import { MantraRepository } from '../repositories/mantra.repository';
import { CreateMantraDTO, UpdateMantraDTO, ListMantrasQueryDTO } from '../dtos/mantra.dto';
import { HttpError } from '../errors/http-error';

export class MantraService {
  private repository: MantraRepository;

  constructor() {
    this.repository = new MantraRepository();
  }

  async create(data: CreateMantraDTO) {
    return this.repository.create(data);
  }

  async findAll(query: ListMantrasQueryDTO) {
    return this.repository.findAll(query);
  }

  async findById(id: string) {
    const mantra = await this.repository.findById(id);
    if (!mantra) {
      throw new HttpError(404, 'Mantra not found');
    }

    const reviewSummary = await this.repository.getReviewSummary(id);

    return {
      ...mantra,
      review_summary: reviewSummary || { average_rating: 0, total_reviews: 0 },
    };
  }

  async update(id: string, data: UpdateMantraDTO) {
    const mantra = await this.repository.update(id, data);
    if (!mantra) {
      throw new HttpError(404, 'Mantra not found');
    }
    return mantra;
  }

  async delete(id: string) {
    const deleted = await this.repository.delete(id);
    if (!deleted) {
      throw new HttpError(404, 'Mantra not found');
    }
    return { message: 'Mantra deleted successfully' };
  }
}
