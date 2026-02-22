import { MeRepository } from '../repositories/me.repository';
import { UpsertMeditationProgressDTO, UpsertYogaProgressDTO, UpsertMantraProgressDTO, UpsertLibraryProgressDTO } from '../dtos/progress.dto';
import { CreateReviewDTO, UpdateReviewDTO } from '../dtos/review.dto';
import { HttpError } from '../errors/http-error';

export class MeService {
  private repository: MeRepository;

  constructor() {
    this.repository = new MeRepository();
  }

  // Saved Meditations
  async saveMeditation(user_id: string, meditation_id: string) {
    await this.repository.saveMeditation(user_id, meditation_id);
    return { message: 'Meditation saved successfully' };
  }

  async unsaveMeditation(user_id: string, meditation_id: string) {
    const removed = await this.repository.unsaveMeditation(user_id, meditation_id);
    if (!removed) {
      throw new HttpError(404, 'Saved meditation not found');
    }
    return { message: 'Meditation unsaved successfully' };
  }

  async getSavedMeditations(user_id: string) {
    return this.repository.getSavedMeditations(user_id);
  }

  // Saved Yogas
  async saveYoga(user_id: string, yoga_id: string) {
    await this.repository.saveYoga(user_id, yoga_id);
    return { message: 'Yoga saved successfully' };
  }

  async unsaveYoga(user_id: string, yoga_id: string) {
    const removed = await this.repository.unsaveYoga(user_id, yoga_id);
    if (!removed) {
      throw new HttpError(404, 'Saved yoga not found');
    }
    return { message: 'Yoga unsaved successfully' };
  }

  async getSavedYogas(user_id: string) {
    return this.repository.getSavedYogas(user_id);
  }

  // Saved Mantras
  async saveMantra(user_id: string, mantra_id: string) {
    await this.repository.saveMantra(user_id, mantra_id);
    return { message: 'Mantra saved successfully' };
  }

  async unsaveMantra(user_id: string, mantra_id: string) {
    const removed = await this.repository.unsaveMantra(user_id, mantra_id);
    if (!removed) {
      throw new HttpError(404, 'Saved mantra not found');
    }
    return { message: 'Mantra unsaved successfully' };
  }

  async getSavedMantras(user_id: string) {
    return this.repository.getSavedMantras(user_id);
  }

  // Saved Library Items
  async saveLibraryItem(user_id: string, library_item_id: string) {
    await this.repository.saveLibraryItem(user_id, library_item_id);
    return { message: 'Library item saved successfully' };
  }

  async unsaveLibraryItem(user_id: string, library_item_id: string) {
    const removed = await this.repository.unsaveLibraryItem(user_id, library_item_id);
    if (!removed) {
      throw new HttpError(404, 'Saved library item not found');
    }
    return { message: 'Library item unsaved successfully' };
  }

  async getSavedLibraryItems(user_id: string) {
    return this.repository.getSavedLibraryItems(user_id);
  }

  // Meditation Progress
  async upsertMeditationProgress(user_id: string, data: UpsertMeditationProgressDTO) {
    return this.repository.upsertMeditationProgress(user_id, data);
  }

  async getMeditationProgress(user_id: string) {
    return this.repository.getMeditationProgress(user_id);
  }

  // Yoga Progress
  async upsertYogaProgress(user_id: string, data: UpsertYogaProgressDTO) {
    return this.repository.upsertYogaProgress(user_id, data);
  }

  async getYogaProgress(user_id: string) {
    return this.repository.getYogaProgress(user_id);
  }

  // Mantra Progress
  async upsertMantraProgress(user_id: string, data: UpsertMantraProgressDTO) {
    return this.repository.upsertMantraProgress(user_id, data);
  }

  async getMantraProgress(user_id: string) {
    return this.repository.getMantraProgress(user_id);
  }

  // Library Progress
  async upsertLibraryProgress(user_id: string, data: UpsertLibraryProgressDTO) {
    return this.repository.upsertLibraryProgress(user_id, data);
  }

  async getLibraryProgress(user_id: string) {
    return this.repository.getLibraryProgress(user_id);
  }

  async getSavedSessions(user_id: string, content_type?: string, page = 1, limit = 20) {
    return this.repository.getSavedSessions(user_id, content_type, page, limit);
  }

  // Meditation Reviews
  async createMeditationReview(user_id: string, meditation_id: string, data: CreateReviewDTO) {
    return this.repository.createMeditationReview(user_id, meditation_id, data);
  }

  async updateMeditationReview(user_id: string, meditation_id: string, data: UpdateReviewDTO) {
    const review = await this.repository.updateMeditationReview(user_id, meditation_id, data);
    if (!review) {
      throw new HttpError(404, 'Review not found');
    }
    return review;
  }

  async deleteMeditationReview(user_id: string, meditation_id: string) {
    const deleted = await this.repository.deleteMeditationReview(user_id, meditation_id);
    if (!deleted) {
      throw new HttpError(404, 'Review not found');
    }
    return { message: 'Review deleted successfully' };
  }

  async getMeditationReviews(meditation_id: string) {
    return this.repository.getMeditationReviews(meditation_id);
  }

  // Yoga Reviews
  async createYogaReview(user_id: string, yoga_id: string, data: CreateReviewDTO) {
    return this.repository.createYogaReview(user_id, yoga_id, data);
  }

  async updateYogaReview(user_id: string, yoga_id: string, data: UpdateReviewDTO) {
    const review = await this.repository.updateYogaReview(user_id, yoga_id, data);
    if (!review) {
      throw new HttpError(404, 'Review not found');
    }
    return review;
  }

  async deleteYogaReview(user_id: string, yoga_id: string) {
    const deleted = await this.repository.deleteYogaReview(user_id, yoga_id);
    if (!deleted) {
      throw new HttpError(404, 'Review not found');
    }
    return { message: 'Review deleted successfully' };
  }

  async getYogaReviews(yoga_id: string) {
    return this.repository.getYogaReviews(yoga_id);
  }

  // Mantra Reviews
  async createMantraReview(user_id: string, mantra_id: string, data: CreateReviewDTO) {
    return this.repository.createMantraReview(user_id, mantra_id, data);
  }

  async updateMantraReview(user_id: string, mantra_id: string, data: UpdateReviewDTO) {
    const review = await this.repository.updateMantraReview(user_id, mantra_id, data);
    if (!review) {
      throw new HttpError(404, 'Review not found');
    }
    return review;
  }

  async deleteMantraReview(user_id: string, mantra_id: string) {
    const deleted = await this.repository.deleteMantraReview(user_id, mantra_id);
    if (!deleted) {
      throw new HttpError(404, 'Review not found');
    }
    return { message: 'Review deleted successfully' };
  }

  async getMantraReviews(mantra_id: string) {
    return this.repository.getMantraReviews(mantra_id);
  }

  // Library Reviews
  async createLibraryReview(user_id: string, library_item_id: string, data: CreateReviewDTO) {
    return this.repository.createLibraryReview(user_id, library_item_id, data);
  }

  async updateLibraryReview(user_id: string, library_item_id: string, data: UpdateReviewDTO) {
    const review = await this.repository.updateLibraryReview(user_id, library_item_id, data);
    if (!review) {
      throw new HttpError(404, 'Review not found');
    }
    return review;
  }

  async deleteLibraryReview(user_id: string, library_item_id: string) {
    const deleted = await this.repository.deleteLibraryReview(user_id, library_item_id);
    if (!deleted) {
      throw new HttpError(404, 'Review not found');
    }
    return { message: 'Review deleted successfully' };
  }

  async getLibraryReviews(library_item_id: string) {
    return this.repository.getLibraryReviews(library_item_id);
  }
}
