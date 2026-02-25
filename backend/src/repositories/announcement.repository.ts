import { AnnouncementModel, IAnnouncement } from '../models/announcement.model';
import { CreateAnnouncementDTO, UpdateAnnouncementDTO, ListAnnouncementsQueryDTO } from '../dtos/announcement.dto';

export class AnnouncementRepository {
  async create(data: CreateAnnouncementDTO & { created_by: string }): Promise<IAnnouncement> {
    const announcement = new AnnouncementModel(data);
    return announcement.save();
  }

  async findAll(query: ListAnnouncementsQueryDTO): Promise<{ data: IAnnouncement[]; total: number; page: number; limit: number }> {
    const { page = 1, limit = 10, status, sort = 'created_at', order = 'desc' } = query;

    const filter: any = {};
    if (status) filter.status = status;

    const skip = (page - 1) * limit;
    const sortOptions: any = { [sort]: order === 'asc' ? 1 : -1 };

    const [data, total] = await Promise.all([
      AnnouncementModel.find(filter).sort(sortOptions).skip(skip).limit(limit).lean(),
      AnnouncementModel.countDocuments(filter),
    ]);

    return { data: data as IAnnouncement[], total, page, limit };
  }

  async findById(id: string): Promise<IAnnouncement | null> {
    return AnnouncementModel.findOne({ id }).lean();
  }

  async findPublished(query: ListAnnouncementsQueryDTO): Promise<{ data: IAnnouncement[]; total: number; page: number; limit: number }> {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const filter = {
      status: 'published',
      published_at: { $lte: new Date() },
    };

    const [data, total] = await Promise.all([
      AnnouncementModel.find(filter)
        .sort({ published_at: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      AnnouncementModel.countDocuments(filter),
    ]);

    return { data: data as IAnnouncement[], total, page, limit };
  }

  async update(id: string, data: UpdateAnnouncementDTO & { updated_by?: string }): Promise<IAnnouncement | null> {
    return AnnouncementModel.findOneAndUpdate({ id }, data, { new: true }).lean();
  }

  async delete(id: string): Promise<boolean> {
    const result = await AnnouncementModel.deleteOne({ id });
    return result.deletedCount > 0;
  }

  async publish(id: string, admin_id: string): Promise<IAnnouncement | null> {
    return AnnouncementModel.findOneAndUpdate(
      { id },
      {
        status: 'published',
        published_at: new Date(),
        updated_by: admin_id,
      },
      { new: true }
    ).lean();
  }
}
