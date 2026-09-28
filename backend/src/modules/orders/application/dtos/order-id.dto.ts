import { z } from 'zod';

export const orderIdParamsSchema = z.object({
  orderId: z.string().uuid('ID de orden inválido'),
});

export type OrderIdParams = z.infer<typeof orderIdParamsSchema>;
