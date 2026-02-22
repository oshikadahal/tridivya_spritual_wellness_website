import { z } from 'zod';

export const UpsertMeditationProgressDTOSchema = z.object({
  meditation_id: z.string(),
  progress_percent: z.number().min(0).max(100),
  last_position_seconds: z.number().min(0),
  status: z.enum(['not_started', 'in_progress', 'completed']).optional(),
});

export const UpsertYogaProgressDTOSchema = z.object({
  yoga_id: z.string(),
  progress_percent: z.number().min(0).max(100),
  last_position_seconds: z.number().min(0),
  status: z.enum(['not_started', 'in_progress', 'completed']).optional(),
});

export const UpsertMantraProgressDTOSchema = z.object({
  mantra_id: z.string(),
  times_practiced: z.number().min(0),
});

export const UpsertLibraryProgressDTOSchema = z.object({
  library_item_id: z.string(),
  progress_percent: z.number().min(0).max(100),
  status: z.enum(['not_started', 'in_progress', 'completed']).optional(),
});

export type UpsertMeditationProgressDTO = z.infer<typeof UpsertMeditationProgressDTOSchema>;
export type UpsertYogaProgressDTO = z.infer<typeof UpsertYogaProgressDTOSchema>;
export type UpsertMantraProgressDTO = z.infer<typeof UpsertMantraProgressDTOSchema>;
export type UpsertLibraryProgressDTO = z.infer<typeof UpsertLibraryProgressDTOSchema>;
