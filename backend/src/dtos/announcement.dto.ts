import { z } from 'zod';

export const CreateAnnouncementDTOSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  message: z.string().min(1, 'Message is required'),
  tone: z.enum(['calm', 'empower', 'celebrate'], {
    errorMap: () => ({ message: "Tone must be 'calm', 'empower', or 'celebrate'" })
  }),
  status: z.enum(['draft', 'scheduled', 'published'], {
    errorMap: () => ({ message: "Status must be 'draft', 'scheduled', or 'published'" })
  }).optional().default('draft'),
  scheduled_at: z.date().optional(),
});

export const UpdateAnnouncementDTOSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters').optional(),
  message: z.string().min(1, 'Message is required').optional(),
  tone: z.enum(['calm', 'empower', 'celebrate']).optional(),
  status: z.enum(['draft', 'scheduled', 'published']).optional(),
  scheduled_at: z.date().optional(),
});

export const ListAnnouncementsQueryDTOSchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
  status: z.enum(['draft', 'scheduled', 'published']).optional(),
  sort: z.enum(['created_at', 'scheduled_at', 'published_at']).optional().default('created_at'),
  order: z.enum(['asc', 'desc']).optional().default('desc'),
});

export type CreateAnnouncementDTO = z.infer<typeof CreateAnnouncementDTOSchema>;
export type UpdateAnnouncementDTO = z.infer<typeof UpdateAnnouncementDTOSchema>;
export type ListAnnouncementsQueryDTO = z.infer<typeof ListAnnouncementsQueryDTOSchema>;
