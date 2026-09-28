import { z } from 'zod';

export const updateCartItemBodySchema = z.object({
  quantity: z.number().int().min(1, 'La cantidad debe ser al menos 1').max(99),
});

export type UpdateCartItemBodyDto = z.infer<typeof updateCartItemBodySchema>;

export const updateCartItemParamsSchema = z.object({
  productId: z.string().uuid('ID de producto inválido'),
});

export type UpdateCartItemParamsDto = z.infer<typeof updateCartItemParamsSchema>;
