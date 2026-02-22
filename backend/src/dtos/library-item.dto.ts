import z from 'zod';

export const LibraryTypeSchema = z.enum(['book', 'article', 'resource']);

export const CreateLibraryItemDTO = z.object({
  library_type: LibraryTypeSchema,
  title: z.string().min(1),
  author_name: z.string().optional(),
  description: z.string().optional(),
  read_minutes: z.number().int().min(0).optional(),
  cover_image_url: z.string().url().optional().or(z.literal('')),
  content_url: z.string().url().optional().or(z.literal('')),
  thumbnail_url: z.string().url().optional().or(z.literal('')),
  category_slug: z.string().optional(),
  is_featured: z.boolean().optional(),
  is_active: z.boolean().optional(),
});

export type CreateLibraryItemDTO = z.infer<typeof CreateLibraryItemDTO>;

export const UpdateLibraryItemDTO = CreateLibraryItemDTO.partial();
export type UpdateLibraryItemDTO = z.infer<typeof UpdateLibraryItemDTO>;

export const ListLibraryItemsQueryDTO = z.object({
  library_type: LibraryTypeSchema.optional(),
  category_slug: z.string().optional(),
  is_featured: z.coerce.boolean().optional(),
  sort: z.enum(['recent', 'title_asc', 'title_desc']).optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
});

export type ListLibraryItemsQueryDTO = z.infer<typeof ListLibraryItemsQueryDTO>;
