import { z } from 'zod';

export const CreateMoodCheckinDTOSchema = z.object({
  mood_code: z.enum(['calm', 'stressed', 'tired', 'energized', 'focused', 'distracted', 'anxious', 'happy', 'sad', 'neutral'], {
    errorMap: () => ({ message: 'Invalid mood code' })
  }),
});

export type CreateMoodCheckinDTO = z.infer<typeof CreateMoodCheckinDTOSchema>;
