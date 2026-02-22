import { Request, Response } from 'express';
import z from 'zod';
import { CreateLibraryItemDTO, ListLibraryItemsQueryDTO, UpdateLibraryItemDTO } from '../dtos/library-item.dto';
import { LibraryItemService } from '../services/library-item.service';

const libraryItemService = new LibraryItemService();

function prettifyZodError(error: z.ZodError) {
  return error.issues.map((i) => `${i.path.join('.') || '<root>'}: ${i.message}`).join('; ');
}

export class LibraryItemController {
  async list(req: Request, res: Response) {
    try {
      const parsed = ListLibraryItemsQueryDTO.safeParse(req.query);
      if (!parsed.success) {
        return res.status(400).json({ success: false, message: prettifyZodError(parsed.error) });
      }

      const result = await libraryItemService.list(parsed.data);
      return res.status(200).json({ success: true, message: 'Library items fetched successfully', data: result.items, pagination: result.pagination });
    } catch (error: unknown) {
      const err = error as { statusCode?: number; message?: string };
      return res.status(err.statusCode ?? 500).json({ success: false, message: err.message || 'Internal Server Error' });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const item = await libraryItemService.getById(req.params.library_item_id);
      return res.status(200).json({ success: true, message: 'Library item fetched successfully', data: item });
    } catch (error: unknown) {
      const err = error as { statusCode?: number; message?: string };
      return res.status(err.statusCode ?? 500).json({ success: false, message: err.message || 'Internal Server Error' });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const parsed = CreateLibraryItemDTO.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ success: false, message: prettifyZodError(parsed.error) });
      }

      const created = await libraryItemService.create(parsed.data);
      return res.status(201).json({ success: true, message: 'Library item created successfully', data: created });
    } catch (error: unknown) {
      const err = error as { statusCode?: number; message?: string };
      return res.status(err.statusCode ?? 500).json({ success: false, message: err.message || 'Internal Server Error' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const parsed = UpdateLibraryItemDTO.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ success: false, message: prettifyZodError(parsed.error) });
      }

      const updated = await libraryItemService.update(req.params.library_item_id, parsed.data);
      return res.status(200).json({ success: true, message: 'Library item updated successfully', data: updated });
    } catch (error: unknown) {
      const err = error as { statusCode?: number; message?: string };
      return res.status(err.statusCode ?? 500).json({ success: false, message: err.message || 'Internal Server Error' });
    }
  }

  async remove(req: Request, res: Response) {
    try {
      await libraryItemService.remove(req.params.library_item_id);
      return res.status(200).json({ success: true, message: 'Library item deleted successfully', data: null });
    } catch (error: unknown) {
      const err = error as { statusCode?: number; message?: string };
      return res.status(err.statusCode ?? 500).json({ success: false, message: err.message || 'Internal Server Error' });
    }
  }
}
