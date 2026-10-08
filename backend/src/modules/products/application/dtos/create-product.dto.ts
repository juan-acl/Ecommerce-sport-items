import { z } from 'zod';

export const CreateProductSchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  price: z.number().positive(),
  stock: z.number().int().min(0),
  minStock: z.number().int().min(0).default(0),
  description: z.string().min(1),
  imageUrl: z.string().url(),
});

export type CreateProductDto = z.infer<typeof CreateProductSchema>;
