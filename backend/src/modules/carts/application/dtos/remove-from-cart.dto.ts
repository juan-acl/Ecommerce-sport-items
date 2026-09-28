import { z } from 'zod';

export const removeFromCartSchema = z.object({
  productId: z.string().uuid('ID de producto inválido'),
});

export type RemoveFromCartDto = z.infer<typeof removeFromCartSchema>;
