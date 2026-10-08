import { z } from 'zod';

export const UpdateProductSchema = z.object({
  name: z.string().min(1).optional(),
  category: z.string().min(1).optional(),
  price: z.number().positive().optional(),
  stock: z.number().int().min(0).optional(),
  minStock: z.number().int().min(0).optional(),
  description: z.string().min(1).optional(),
  imageUrl: z.string().url().optional(),
});

export type UpdateProductDto = z.infer<typeof UpdateProductSchema>;
