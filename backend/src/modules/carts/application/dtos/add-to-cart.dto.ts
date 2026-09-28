import { z } from 'zod';

export const addToCartSchema = z.object({
  productId: z.string().uuid('ID de producto inválido'),
  quantity: z.number().int().min(1, 'La cantidad debe ser al menos 1').max(99),
});

export type AddToCartDto = z.infer<typeof addToCartSchema>;
