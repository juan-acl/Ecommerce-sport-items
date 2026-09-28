import { z } from 'zod';

export const shippingAddressSchema = z.object({
  street: z.string().min(3, 'La dirección debe tener al menos 3 caracteres').max(200),
  city: z.string().min(2, 'La ciudad debe tener al menos 2 caracteres').max(100),
  country: z.string().min(2, 'El país es requerido').max(100),
  postalCode: z.string().min(3, 'Código postal inválido').max(20),
});

export type ShippingAddressFormData = z.infer<typeof shippingAddressSchema>;
