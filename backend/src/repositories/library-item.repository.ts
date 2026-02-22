import { FilterQuery } from 'mongoose';
import { ILibraryItem, LibraryItemModel } from '../models/library-item.model';

export class LibraryItemRepository {
  async create(data: Partial<ILibraryItem>) {
    const created = new LibraryItemModel(data);
    return created.save();
  }

  async findByLibraryItemId(libraryItemId: string) {
    return LibraryItemModel.findOne({ id: libraryItemId, is_active: true });
  }

  async list(filters: FilterQuery<ILibraryItem>, page: number, limit: number, sort: Record<string, 1 | -1>) {
    const skip = (page - 1) * limit;
    const query = { ...filters, is_active: true };

    const [items, total] = await Promise.all([
      LibraryItemModel.find(query).sort(sort).skip(skip).limit(limit),
      LibraryItemModel.countDocuments(query),
    ]);

    return { items, total };
  }

  async updateByLibraryItemId(libraryItemId: string, data: Partial<ILibraryItem>) {
    return LibraryItemModel.findOneAndUpdate({ id: libraryItemId }, data, { new: true });
  }

  async softDelete(libraryItemId: string) {
    return LibraryItemModel.findOneAndUpdate({ id: libraryItemId }, { is_active: false }, { new: true });
  }
}
