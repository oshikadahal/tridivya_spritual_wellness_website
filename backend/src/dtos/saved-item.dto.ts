import z from 'zod';

export const SaveSessionDTO = z.object({
  session_id: z.string().min(1),
});

export type SaveSessionDTO = z.infer<typeof SaveSessionDTO>;

export const SaveLibraryItemDTO = z.object({
  library_item_id: z.string().min(1),
});

export type SaveLibraryItemDTO = z.infer<typeof SaveLibraryItemDTO>;

export const MoodCheckinDTO = z.object({
  mood_code: z.string().min(1),
  note: z.string().optional(),
});

export type MoodCheckinDTO = z.infer<typeof MoodCheckinDTO>;
