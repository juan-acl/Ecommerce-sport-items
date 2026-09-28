import { z } from 'zod';

export const checkoutSchema = z.object({
  shippingAddress: z
    .object({
      street: z.string().min(1, 'Calle requerida'),
      city: z.string().min(1, 'Ciudad requerida'),
      country: z.string().min(1, 'País requerido'),
      postalCode: z.string().min(1, 'Código postal requerido'),
    })
    .optional(),
});

export type CheckoutDto = z.infer<typeof checkoutSchema>;
