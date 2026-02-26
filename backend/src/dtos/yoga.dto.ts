import { z } from 'zod';

export const CreateYogaDTOSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().optional(),
  description: z.string(),
  image_url: z.string().url(),
  thumbnail_url: z.string().url().optional(),
  cover_image_url: z.string().url().optional(),
  media_url: z.string().url(),
  duration_seconds: z.number().int().min(0),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  goal_slug: z.string().min(1),
  is_featured: z.boolean().optional().default(false),
  is_trending: z.boolean().optional().default(false),
  is_active: z.boolean().optional().default(true),
  metadata: z.record(z.any()).optional(),
});

export const UpdateYogaDTOSchema = z.object({
  title: z.string().min(1).optional(),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  image_url: z.string().url().optional(),
  thumbnail_url: z.string().url().optional(),
  cover_image_url: z.string().url().optional(),
  media_url: z.string().url().optional(),
  duration_seconds: z.number().int().min(0).optional(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  goal_slug: z.string().min(1).optional(),
  is_featured: z.boolean().optional(),
  is_trending: z.boolean().optional(),
  is_active: z.boolean().optional(),
  metadata: z.record(z.any()).optional(),
});

export const ListYogasQueryDTOSchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
  goal_slug: z.string().optional(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  is_featured: z.coerce.boolean().optional(),
  is_trending: z.coerce.boolean().optional(),
  is_active: z.coerce.boolean().optional(),
  sort_by: z.enum(['created_at', 'title', 'duration_seconds']).optional().default('created_at'),
  sort_order: z.enum(['asc', 'desc']).optional().default('desc'),
});

export type CreateYogaDTO = z.infer<typeof CreateYogaDTOSchema>;
export type UpdateYogaDTO = z.infer<typeof UpdateYogaDTOSchema>;
export type ListYogasQueryDTO = z.infer<typeof ListYogasQueryDTOSchema>;
