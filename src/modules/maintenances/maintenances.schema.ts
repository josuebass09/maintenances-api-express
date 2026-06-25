import { z } from 'zod';

export const CreateMaintenanceSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.enum(['engine', 'transmission', 'steer', 'coolant']),
  product: z.string().min(1, 'Product is required'),
  odometer: z.number().int().min(0, 'Odometer cannot be negative'),
  carId: z.string().uuid('carId must be a valid UUID'),
  intervalMonths: z.number().int().min(1).max(60).default(6),
});

export const UpdateMaintenanceSchema = CreateMaintenanceSchema.partial().omit({ name: true });

export type CreateMaintenanceInput = z.infer<typeof CreateMaintenanceSchema>;
export type UpdateMaintenanceInput = z.infer<typeof UpdateMaintenanceSchema>;
