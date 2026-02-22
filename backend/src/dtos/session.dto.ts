import z from 'zod';

export const SessionTypeSchema = z.enum(['meditation', 'yoga', 'mantra']);
export const DifficultySchema = z.enum(['beginner', 'intermediate', 'advanced', 'all_levels']);

export const CreateSessionDTO = z.object({
  session_type: SessionTypeSchema,
  title: z.string().min(1),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  difficulty: DifficultySchema.optional().default('all_levels'),
  duration_seconds: z.number().int().min(0).optional(),
  thumbnail_url: z.string().url().optional().or(z.literal('')),
  cover_image_url: z.string().url().optional().or(z.literal('')),
  media_url: z.string().url().optional().or(z.literal('')),
  goal_slug: z.string().optional(),
  is_featured: z.boolean().optional(),
  is_trending: z.boolean().optional(),
  is_active: z.boolean().optional(),
  accent_label: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
});

export type CreateSessionDTO = z.infer<typeof CreateSessionDTO>;

export const UpdateSessionDTO = CreateSessionDTO.partial();
export type UpdateSessionDTO = z.infer<typeof UpdateSessionDTO>;

export const ListSessionsQueryDTO = z.object({
  session_type: SessionTypeSchema.optional(),
  goal_slug: z.string().optional(),
  difficulty: DifficultySchema.optional(),
  min_duration_seconds: z.coerce.number().int().min(0).optional(),
  max_duration_seconds: z.coerce.number().int().min(0).optional(),
  is_featured: z.coerce.boolean().optional(),
  is_trending: z.coerce.boolean().optional(),
  sort: z.enum(['recent', 'popular', 'duration_asc', 'duration_desc']).optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
});

export type ListSessionsQueryDTO = z.infer<typeof ListSessionsQueryDTO>;

export const UpsertSessionProgressDTO = z.object({
  session_id: z.string().min(1),
  progress_percent: z.number().min(0).max(100),
  status: z.enum(['not_started', 'in_progress', 'completed']),
  last_position_seconds: z.number().int().min(0),
});

export type UpsertSessionProgressDTO = z.infer<typeof UpsertSessionProgressDTO>;

export const CreateSessionReviewDTO = z.object({
  rating: z.number().int().min(1).max(5),
  title: z.string().optional(),
  comment: z.string().optional(),
});

export type CreateSessionReviewDTO = z.infer<typeof CreateSessionReviewDTO>;

export const UpdateSessionReviewDTO = CreateSessionReviewDTO.partial();
export type UpdateSessionReviewDTO = z.infer<typeof UpdateSessionReviewDTO>;
