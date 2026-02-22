import { FilterQuery } from 'mongoose';
import { HttpError } from '../errors/http-error';
import { CreateLibraryItemDTO, ListLibraryItemsQueryDTO, UpdateLibraryItemDTO } from '../dtos/library-item.dto';
import { ILibraryItem } from '../models/library-item.model';
import { LibraryItemRepository } from '../repositories/library-item.repository';

const libraryItemRepository = new LibraryItemRepository();

export class LibraryItemService {
  async create(data: CreateLibraryItemDTO) {
    return libraryItemRepository.create(data as Partial<ILibraryItem>);
  }

  async list(query: ListLibraryItemsQueryDTO) {
    const filters: FilterQuery<ILibraryItem> = {};
    if (query.library_type) filters.library_type = query.library_type;
    if (query.category_slug) filters.category_slug = query.category_slug;
    if (query.is_featured !== undefined) filters.is_featured = query.is_featured;

    let sort: Record<string, 1 | -1> = { created_at: -1 };
    if (query.sort === 'title_asc') sort = { title: 1 };
    if (query.sort === 'title_desc') sort = { title: -1 };

    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const { items, total } = await libraryItemRepository.list(filters, page, limit, sort);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getById(libraryItemId: string) {
    const item = await libraryItemRepository.findByLibraryItemId(libraryItemId);
    if (!item) {
      throw new HttpError(404, 'Library item not found');
    }
    return item;
  }

  async update(libraryItemId: string, data: UpdateLibraryItemDTO) {
    const updated = await libraryItemRepository.updateByLibraryItemId(libraryItemId, data as Partial<ILibraryItem>);
    if (!updated) {
      throw new HttpError(404, 'Library item not found');
    }
    return updated;
  }

  async remove(libraryItemId: string) {
    const removed = await libraryItemRepository.softDelete(libraryItemId);
    if (!removed) {
      throw new HttpError(404, 'Library item not found');
    }
    return removed;
  }
}
