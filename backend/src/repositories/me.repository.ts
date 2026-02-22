import { SavedMeditationModel } from '../models/saved-meditation.model';
import { SavedYogaModel } from '../models/saved-yoga.model';
import { SavedMantraModel } from '../models/saved-mantra.model';
import { SavedLibraryItemModel } from '../models/saved-library-item.model';
import { UserMeditationProgressModel, IUserMeditationProgress } from '../models/user-meditation-progress.model';
import { UserYogaProgressModel, IUserYogaProgress } from '../models/user-yoga-progress.model';
import { UserMantraProgressModel, IUserMantraProgress } from '../models/user-mantra-progress.model';
import { UserLibraryProgressModel, IUserLibraryProgress } from '../models/user-library-progress.model';
import { UserMeditationReviewModel, IUserMeditationReview } from '../models/user-meditation-review.model';
import { UserYogaReviewModel, IUserYogaReview } from '../models/user-yoga-review.model';
import { UserMantraReviewModel, IUserMantraReview } from '../models/user-mantra-review.model';
import { UserLibraryReviewModel, IUserLibraryReview } from '../models/user-library-review.model';
import { UpsertMeditationProgressDTO, UpsertYogaProgressDTO, UpsertMantraProgressDTO, UpsertLibraryProgressDTO } from '../dtos/progress.dto';
import { CreateReviewDTO, UpdateReviewDTO } from '../dtos/review.dto';

export class MeRepository {
  // Saved Meditations
  async saveMeditation(user_id: string, meditation_id: string): Promise<void> {
    await SavedMeditationModel.findOneAndUpdate({ user_id, meditation_id }, { user_id, meditation_id, saved_at: new Date() }, { upsert: true });
  }

  async unsaveMeditation(user_id: string, meditation_id: string): Promise<boolean> {
    const result = await SavedMeditationModel.deleteOne({ user_id, meditation_id });
    return result.deletedCount > 0;
  }

  async getSavedMeditations(user_id: string): Promise<string[]> {
    const saved = await SavedMeditationModel.find({ user_id }).select('meditation_id').lean();
    return saved.map((item) => item.meditation_id);
  }

  // Saved Yogas
  async saveYoga(user_id: string, yoga_id: string): Promise<void> {
    await SavedYogaModel.findOneAndUpdate({ user_id, yoga_id }, { user_id, yoga_id, saved_at: new Date() }, { upsert: true });
  }

  async unsaveYoga(user_id: string, yoga_id: string): Promise<boolean> {
    const result = await SavedYogaModel.deleteOne({ user_id, yoga_id });
    return result.deletedCount > 0;
  }

  async getSavedYogas(user_id: string): Promise<string[]> {
    const saved = await SavedYogaModel.find({ user_id }).select('yoga_id').lean();
    return saved.map((item) => item.yoga_id);
  }

  // Saved Mantras
  async saveMantra(user_id: string, mantra_id: string): Promise<void> {
    await SavedMantraModel.findOneAndUpdate({ user_id, mantra_id }, { user_id, mantra_id, saved_at: new Date() }, { upsert: true });
  }

  async unsaveMantra(user_id: string, mantra_id: string): Promise<boolean> {
    const result = await SavedMantraModel.deleteOne({ user_id, mantra_id });
    return result.deletedCount > 0;
  }

  async getSavedMantras(user_id: string): Promise<string[]> {
    const saved = await SavedMantraModel.find({ user_id }).select('mantra_id').lean();
    return saved.map((item) => item.mantra_id);
  }

  // Saved Library Items
  async saveLibraryItem(user_id: string, library_item_id: string): Promise<void> {
    await SavedLibraryItemModel.findOneAndUpdate({ user_id, library_item_id }, { user_id, library_item_id, saved_at: new Date() }, { upsert: true });
  }

  async unsaveLibraryItem(user_id: string, library_item_id: string): Promise<boolean> {
    const result = await SavedLibraryItemModel.deleteOne({ user_id, library_item_id });
    return result.deletedCount > 0;
  }

  async getSavedLibraryItems(user_id: string): Promise<string[]> {
    const saved = await SavedLibraryItemModel.find({ user_id }).select('library_item_id').lean();
    return saved.map((item) => item.library_item_id);
  }

  // Meditation Progress
  async upsertMeditationProgress(user_id: string, data: UpsertMeditationProgressDTO): Promise<IUserMeditationProgress> {
    const updateData: any = {
      progress_percent: data.progress_percent,
      last_position_seconds: data.last_position_seconds,
      last_played_at: new Date(),
      updated_at: new Date(),
    };

    if (data.status) {
      updateData.status = data.status;
    }

    if (data.progress_percent === 100 || data.status === 'completed') {
      updateData.status = 'completed';
      updateData.completed_at = new Date();
    } else if (data.progress_percent > 0) {
      updateData.status = 'in_progress';
    }

    const result = await UserMeditationProgressModel.findOneAndUpdate(
      { user_id, meditation_id: data.meditation_id },
      { $set: updateData, $setOnInsert: { user_id, meditation_id: data.meditation_id, started_at: new Date() } },
      { upsert: true, new: true }
    );

    return result!;
  }

  async getMeditationProgress(user_id: string): Promise<IUserMeditationProgress[]> {
    return UserMeditationProgressModel.find({ user_id }).lean();
  }

  // Yoga Progress
  async upsertYogaProgress(user_id: string, data: UpsertYogaProgressDTO): Promise<IUserYogaProgress> {
    const updateData: any = {
      progress_percent: data.progress_percent,
      last_position_seconds: data.last_position_seconds,
      last_played_at: new Date(),
      updated_at: new Date(),
    };

    if (data.status) {
      updateData.status = data.status;
    }

    if (data.progress_percent === 100 || data.status === 'completed') {
      updateData.status = 'completed';
      updateData.completed_at = new Date();
    } else if (data.progress_percent > 0) {
      updateData.status = 'in_progress';
    }

    const result = await UserYogaProgressModel.findOneAndUpdate(
      { user_id, yoga_id: data.yoga_id },
      { $set: updateData, $setOnInsert: { user_id, yoga_id: data.yoga_id, started_at: new Date() } },
      { upsert: true, new: true }
    );

    return result!;
  }

  async getYogaProgress(user_id: string): Promise<IUserYogaProgress[]> {
    return UserYogaProgressModel.find({ user_id }).lean();
  }

  // Mantra Progress
  async upsertMantraProgress(user_id: string, data: UpsertMantraProgressDTO): Promise<IUserMantraProgress> {
    const result = await UserMantraProgressModel.findOneAndUpdate(
      { user_id, mantra_id: data.mantra_id },
      {
        $set: { times_practiced: data.times_practiced, last_practiced_at: new Date(), updated_at: new Date() },
        $setOnInsert: { user_id, mantra_id: data.mantra_id },
      },
      { upsert: true, new: true }
    );

    return result!;
  }

  async getMantraProgress(user_id: string): Promise<IUserMantraProgress[]> {
    return UserMantraProgressModel.find({ user_id }).lean();
  }

  // Library Progress
  async upsertLibraryProgress(user_id: string, data: UpsertLibraryProgressDTO): Promise<IUserLibraryProgress> {
    const updateData: any = {
      progress_percent: data.progress_percent,
      last_read_at: new Date(),
      updated_at: new Date(),
    };

    if (data.status) {
      updateData.status = data.status;
    }

    if (data.progress_percent === 100 || data.status === 'completed') {
      updateData.status = 'completed';
    } else if (data.progress_percent > 0) {
      updateData.status = 'in_progress';
    }

    const result = await UserLibraryProgressModel.findOneAndUpdate(
      { user_id, library_item_id: data.library_item_id },
      { $set: updateData, $setOnInsert: { user_id, library_item_id: data.library_item_id } },
      { upsert: true, new: true }
    );

    return result!;
  }

  async getLibraryProgress(user_id: string): Promise<IUserLibraryProgress[]> {
    return UserLibraryProgressModel.find({ user_id }).lean();
  }

  // Aggregated saved sessions across content types
  async getSavedSessions(user_id: string, content_type?: string, page = 1, limit = 20) {
    const results: Array<any> = [];

    const skip = (page - 1) * limit;

    // Helper to push mapped items
    const pushItems = (items: any[]) => items.forEach((it) => results.push(it));

    if (!content_type || content_type === 'meditation') {
      const saved = await SavedMeditationModel.find({ user_id }).lean();
      if (saved.length) {
        const ids = saved.map((s) => s.meditation_id);
        const meditations = await (await import('../models/meditation.model')).MeditationModel.find({ id: { $in: ids } }).lean();
        const map = meditations.map((m: any) => {
          const s = saved.find((x: any) => x.meditation_id === m.id);
          return {
            content_type: 'meditation',
            content_id: m.id,
            title: m.title,
            subtitle: m.subtitle || null,
            duration_seconds: m.duration_seconds || 0,
            thumbnail_url: m.thumbnail_url || null,
            saved_at: s?.saved_at || null,
          };
        });
        pushItems(map);
      }
    }

    if (!content_type || content_type === 'yoga') {
      const saved = await SavedYogaModel.find({ user_id }).lean();
      if (saved.length) {
        const ids = saved.map((s) => s.yoga_id);
        const yogas = await (await import('../models/yoga.model')).YogaModel.find({ id: { $in: ids } }).lean();
        const map = yogas.map((y: any) => {
          const s = saved.find((x: any) => x.yoga_id === y.id);
          return {
            content_type: 'yoga',
            content_id: y.id,
            title: y.title,
            subtitle: y.subtitle || null,
            duration_seconds: y.duration_seconds || 0,
            thumbnail_url: y.thumbnail_url || null,
            saved_at: s?.saved_at || null,
          };
        });
        pushItems(map);
      }
    }

    if (!content_type || content_type === 'mantra') {
      const saved = await SavedMantraModel.find({ user_id }).lean();
      if (saved.length) {
        const ids = saved.map((s) => s.mantra_id);
        const mantras = await (await import('../models/mantra.model')).MantraModel.find({ id: { $in: ids } }).lean();
        const map = mantras.map((m: any) => {
          const s = saved.find((x: any) => x.mantra_id === m.id);
          return {
            content_type: 'mantra',
            content_id: m.id,
            title: m.title,
            subtitle: m.subtitle || null,
            duration_seconds: m.duration_seconds || 0,
            thumbnail_url: m.thumbnail_url || null,
            saved_at: s?.saved_at || null,
          };
        });
        pushItems(map);
      }
    }

    if (!content_type || content_type === 'library') {
      const saved = await SavedLibraryItemModel.find({ user_id }).lean();
      if (saved.length) {
        const ids = saved.map((s) => s.library_item_id);
        const items = await (await import('../models/library-item.model')).LibraryItemModel.find({ id: { $in: ids } }).lean();
        const map = items.map((it: any) => {
          const s = saved.find((x: any) => x.library_item_id === it.id);
          return {
            content_type: 'library',
            content_id: it.id,
            title: it.title,
            subtitle: it.author_name || null,
            duration_seconds: it.read_minutes || 0,
            thumbnail_url: it.thumbnail_url || null,
            saved_at: s?.saved_at || null,
          };
        });
        pushItems(map);
      }
    }

    // Sort by saved_at desc and apply pagination
    results.sort((a, b) => {
      const ta = a.saved_at ? new Date(a.saved_at).getTime() : 0;
      const tb = b.saved_at ? new Date(b.saved_at).getTime() : 0;
      return tb - ta;
    });

    const paged = results.slice(skip, skip + limit);
    return paged;
  }

  // Meditation Reviews
  async createMeditationReview(user_id: string, meditation_id: string, data: CreateReviewDTO): Promise<IUserMeditationReview> {
    const review = new UserMeditationReviewModel({ user_id, meditation_id, ...data });
    return review.save();
  }

  async updateMeditationReview(user_id: string, meditation_id: string, data: UpdateReviewDTO): Promise<IUserMeditationReview | null> {
    return UserMeditationReviewModel.findOneAndUpdate({ user_id, meditation_id }, { ...data, updated_at: new Date() }, { new: true }).lean();
  }

  async deleteMeditationReview(user_id: string, meditation_id: string): Promise<boolean> {
    const result = await UserMeditationReviewModel.deleteOne({ user_id, meditation_id });
    return result.deletedCount > 0;
  }

  async getMeditationReviews(meditation_id: string): Promise<IUserMeditationReview[]> {
    return UserMeditationReviewModel.find({ meditation_id }).lean();
  }

  async getUserMeditationReview(user_id: string, meditation_id: string): Promise<IUserMeditationReview | null> {
    return UserMeditationReviewModel.findOne({ user_id, meditation_id }).lean();
  }

  // Yoga Reviews
  async createYogaReview(user_id: string, yoga_id: string, data: CreateReviewDTO): Promise<IUserYogaReview> {
    const review = new UserYogaReviewModel({ user_id, yoga_id, ...data });
    return review.save();
  }

  async updateYogaReview(user_id: string, yoga_id: string, data: UpdateReviewDTO): Promise<IUserYogaReview | null> {
    return UserYogaReviewModel.findOneAndUpdate({ user_id, yoga_id }, { ...data, updated_at: new Date() }, { new: true }).lean();
  }

  async deleteYogaReview(user_id: string, yoga_id: string): Promise<boolean> {
    const result = await UserYogaReviewModel.deleteOne({ user_id, yoga_id });
    return result.deletedCount > 0;
  }

  async getYogaReviews(yoga_id: string): Promise<IUserYogaReview[]> {
    return UserYogaReviewModel.find({ yoga_id }).lean();
  }

  async getUserYogaReview(user_id: string, yoga_id: string): Promise<IUserYogaReview | null> {
    return UserYogaReviewModel.findOne({ user_id, yoga_id }).lean();
  }

  // Mantra Reviews
  async createMantraReview(user_id: string, mantra_id: string, data: CreateReviewDTO): Promise<IUserMantraReview> {
    const review = new UserMantraReviewModel({ user_id, mantra_id, ...data });
    return review.save();
  }

  async updateMantraReview(user_id: string, mantra_id: string, data: UpdateReviewDTO): Promise<IUserMantraReview | null> {
    return UserMantraReviewModel.findOneAndUpdate({ user_id, mantra_id }, { ...data, updated_at: new Date() }, { new: true }).lean();
  }

  async deleteMantraReview(user_id: string, mantra_id: string): Promise<boolean> {
    const result = await UserMantraReviewModel.deleteOne({ user_id, mantra_id });
    return result.deletedCount > 0;
  }

  async getMantraReviews(mantra_id: string): Promise<IUserMantraReview[]> {
    return UserMantraReviewModel.find({ mantra_id }).lean();
  }

  async getUserMantraReview(user_id: string, mantra_id: string): Promise<IUserMantraReview | null> {
    return UserMantraReviewModel.findOne({ user_id, mantra_id }).lean();
  }

  // Library Reviews
  async createLibraryReview(user_id: string, library_item_id: string, data: CreateReviewDTO): Promise<IUserLibraryReview> {
    const review = new UserLibraryReviewModel({ user_id, library_item_id, ...data });
    return review.save();
  }

  async updateLibraryReview(user_id: string, library_item_id: string, data: UpdateReviewDTO): Promise<IUserLibraryReview | null> {
    return UserLibraryReviewModel.findOneAndUpdate({ user_id, library_item_id }, { ...data, updated_at: new Date() }, { new: true }).lean();
  }

  async deleteLibraryReview(user_id: string, library_item_id: string): Promise<boolean> {
    const result = await UserLibraryReviewModel.deleteOne({ user_id, library_item_id });
    return result.deletedCount > 0;
  }

  async getLibraryReviews(library_item_id: string): Promise<IUserLibraryReview[]> {
    return UserLibraryReviewModel.find({ library_item_id }).lean();
  }

  async getUserLibraryReview(user_id: string, library_item_id: string): Promise<IUserLibraryReview | null> {
    return UserLibraryReviewModel.findOne({ user_id, library_item_id }).lean();
  }
}
