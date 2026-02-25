import { AnnouncementRepository } from '../repositories/announcement.repository';
import { CreateAnnouncementDTO, UpdateAnnouncementDTO, ListAnnouncementsQueryDTO } from '../dtos/announcement.dto';
import { HttpError } from '../errors/http-error';

export class AnnouncementService {
  private repository: AnnouncementRepository;

  constructor() {
    this.repository = new AnnouncementRepository();
  }

  async create(data: CreateAnnouncementDTO, adminId: string) {
    return this.repository.create({ ...data, created_by: adminId });
  }

  async findAll(query: ListAnnouncementsQueryDTO) {
    return this.repository.findAll(query);
  }

  async findById(id: string) {
    const announcement = await this.repository.findById(id);
    if (!announcement) {
      throw new HttpError(404, 'Announcement not found');
    }
    return announcement;
  }

  async findPublished(query: ListAnnouncementsQueryDTO) {
    return this.repository.findPublished(query);
  }

  async update(id: string, data: UpdateAnnouncementDTO, adminId: string) {
    const announcement = await this.repository.update(id, {
      ...data,
      updated_by: adminId,
    });
    if (!announcement) {
      throw new HttpError(404, 'Announcement not found');
    }
    return announcement;
  }

  async delete(id: string) {
    const deleted = await this.repository.delete(id);
    if (!deleted) {
      throw new HttpError(404, 'Announcement not found');
    }
    return { message: 'Announcement deleted successfully' };
  }

  async publish(id: string, adminId: string) {
    const announcement = await this.repository.publish(id, adminId);
    if (!announcement) {
      throw new HttpError(404, 'Announcement not found');
    }
    return announcement;
  }
}
