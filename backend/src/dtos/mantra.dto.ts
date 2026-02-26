import { z } from 'zod';

export const CreateMantraDTOSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().optional(),
  description: z.string(),
  meaning: z.string(),
  lyrics: z.string(),
  transliteration: z.string().optional(),
  pronunciation_guide: z.string().optional(),
  image_url: z.string().url(),
  thumbnail_url: z.string().url().optional(),
  cover_image_url: z.string().url().optional().or(z.literal('')),
  audio_url: z.string().url(),
  duration_seconds: z.number().int().min(0).optional(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  goal_slug: z.string().min(1),
  is_featured: z.boolean().optional().default(false),
  is_trending: z.boolean().optional().default(false),
  is_active: z.boolean().optional().default(true),
  metadata: z.record(z.any()).optional(),
});

export const UpdateMantraDTOSchema = z.object({
  title: z.string().min(1).optional(),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  meaning: z.string().optional(),
  lyrics: z.string().optional(),
  transliteration: z.string().optional(),
  pronunciation_guide: z.string().optional(),
  image_url: z.string().url().optional(),
  thumbnail_url: z.string().url().optional(),
  cover_image_url: z.string().url().optional().or(z.literal('')),
  audio_url: z.string().url().optional(),
  duration_seconds: z.number().int().min(0).optional(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  goal_slug: z.string().min(1).optional(),
  is_featured: z.boolean().optional(),
  is_trending: z.boolean().optional(),
  is_active: z.boolean().optional(),
  metadata: z.record(z.any()).optional(),
});

export const ListMantrasQueryDTOSchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
  goal_slug: z.string().optional(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  is_featured: z.coerce.boolean().optional(),
  is_trending: z.coerce.boolean().optional(),
  is_active: z.coerce.boolean().optional(),
  sort_by: z.enum(['created_at', 'title']).optional().default('created_at'),
  sort_order: z.enum(['asc', 'desc']).optional().default('desc'),
});

export type CreateMantraDTO = z.infer<typeof CreateMantraDTOSchema>;
export type UpdateMantraDTO = z.infer<typeof UpdateMantraDTOSchema>;
export type ListMantrasQueryDTO = z.infer<typeof ListMantrasQueryDTOSchema>;
