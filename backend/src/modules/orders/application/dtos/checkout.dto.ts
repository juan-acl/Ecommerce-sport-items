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
  discountCode: z.string().trim().toUpperCase().min(1).max(50).optional(),
  paymentMethod: z
    .object({
      cardType: z.enum(['visa', 'mastercard', 'amex', 'other']),
      last4: z.string().length(4),
      cardholderName: z.string().min(1).max(100),
      expiryMonth: z.string().length(2),
      expiryYear: z.string().length(2),
    })
    .optional(),
});

export type CheckoutDto = z.infer<typeof checkoutSchema>;
