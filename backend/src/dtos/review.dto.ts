import { z } from 'zod';

export const CreateReviewDTOSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional(),
});

export const UpdateReviewDTOSchema = z.object({
  rating: z.number().int().min(1).max(5).optional(),
  comment: z.string().optional(),
});

export type CreateReviewDTO = z.infer<typeof CreateReviewDTOSchema>;
export type UpdateReviewDTO = z.infer<typeof UpdateReviewDTOSchema>;
