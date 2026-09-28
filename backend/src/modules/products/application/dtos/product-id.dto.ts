import { z } from 'zod';

export const productIdParamsSchema = z.object({
  id: z.string().uuid('ID de producto inválido'),
});

export type ProductIdParams = z.infer<typeof productIdParamsSchema>;
