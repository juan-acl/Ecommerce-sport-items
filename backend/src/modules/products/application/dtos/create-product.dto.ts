import { z } from 'zod';

const CATEGORY_VALUES = [
  'running', 'football', 'basketball', 'tennis',
  'swimming', 'cycling', 'fitness', 'other',
] as const;

export const CreateProductSchema = z.object({
  name: z
    .string().trim()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(150, 'El nombre no puede exceder 150 caracteres')
    .regex(
      /^[\p{L}\p{N}\s.,\-'/()+]+$/u,
      'El nombre solo puede contener letras, números, espacios y signos básicos',
    )
    .refine(
      (val) => /\p{L}/u.test(val),
      'El nombre debe contener al menos una letra',
    ),
  category: z.enum(CATEGORY_VALUES, { error: 'Categoría inválida' }),
  price: z
    .number()
    .positive('El precio debe ser mayor a 0')
    .max(999999.99, 'El precio no puede exceder 999,999.99'),
  description: z
    .string().trim()
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(1000, 'La descripción no puede exceder 1000 caracteres')
    .regex(/^[^<>{}@]+$/, 'La descripción contiene caracteres no permitidos')
    .refine(
      (val) => /\p{L}/u.test(val),
      'La descripción debe contener texto descriptivo, no solo números',
    ),
  imageUrl: z.string().url('URL de imagen inválida').or(z.literal('')),
});

export type CreateProductDto = z.infer<typeof CreateProductSchema>;
