import { z } from 'zod';

export const CreateCarSchema = z.object({
  vin: z.string().min(1, 'VIN is required'),
  make: z.string().min(1, 'Make is required'),
  model: z.string().min(1, 'Model is required'),
  year: z
    .number()
    .int()
    .min(1886, 'Year must be 1886 or later')
    .max(new Date().getFullYear() + 2, 'Year is too far in the future'),
  color: z.string().min(1, 'Color is required'),
  licensePlate: z.string().min(1, 'License plate is required'),
  fuel: z.enum(['gasoline', 'diesel', 'electric', 'hybrid']),
  transmission: z.enum(['manual', 'automatic']),
  odometer: z.number().int().min(0, 'Odometer cannot be negative'),
  notes: z.string().optional(),
});

export const UpdateCarSchema = CreateCarSchema.partial().omit({ licensePlate: true });

export type CreateCarInput = z.infer<typeof CreateCarSchema>;
export type UpdateCarInput = z.infer<typeof UpdateCarSchema>;
