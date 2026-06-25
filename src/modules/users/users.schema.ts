import { z } from 'zod';

export const UpdateUserSchema = z.object({
  firstName: z.string().min(1, 'First name cannot be empty').optional(),
  lastName: z.string().min(1, 'Last name cannot be empty').optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  emailEnabled: z.boolean().optional(),
  daysBeforeReminder: z.array(z.number().int().min(0)).optional(),
});

export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
