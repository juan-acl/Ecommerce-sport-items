import { z } from 'zod';

export const shippingAddressSchema = z.object({
  street: z
    .string()
    .trim()
    .min(5, 'La dirección debe tener al menos 5 caracteres')
    .max(200, 'La dirección no puede exceder 200 caracteres')
    .regex(
      /^[\p{L}\p{N}\s.,\-#/()°]+$/u,
      'Solo puede contener letras, números, espacios y signos de dirección (# / . ,)',
    ),
  city: z
    .string()
    .trim()
    .min(2, 'La ciudad debe tener al menos 2 caracteres')
    .max(100, 'La ciudad no puede exceder 100 caracteres')
    .regex(/^[\p{L}\s.\-]+$/u, 'La ciudad solo puede contener letras'),
  country: z
    .string()
    .trim()
    .min(2, 'El país es requerido')
    .max(100, 'El país no puede exceder 100 caracteres')
    .regex(/^[\p{L}\s.\-]+$/u, 'El país solo puede contener letras'),
  postalCode: z
    .string()
    .trim()
    .regex(/^\d{5}$/, 'El código postal debe tener exactamente 5 dígitos'),
});

export type ShippingAddressFormData = z.infer<typeof shippingAddressSchema>;
