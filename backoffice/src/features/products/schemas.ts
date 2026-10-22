import { z } from 'zod';

const CATEGORY_VALUES = [
  'running',
  'football',
  'basketball',
  'tennis',
  'swimming',
  'cycling',
  'fitness',
  'other',
] as const;

export type ProductCategory = (typeof CATEGORY_VALUES)[number];

const sharedFields = {
  name: z
    .string()
    .trim()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(150, 'El nombre no puede exceder 150 caracteres')
    .regex(
      /^[\p{L}\p{N}\s.,\-'/()+]+$/u,
      'Solo puede contener letras, números, espacios y signos básicos',
    )
    .refine(
      (val) => /\p{L}/u.test(val),
      'El nombre debe contener al menos una letra (ej: Zapatos Running, Talla 42)',
    ),
  category: z.enum(CATEGORY_VALUES, {
    errorMap: () => ({ message: 'Selecciona una categoría válida' }),
  }),
  price: z
    .number('El precio debe ser un número')
    .positive('El precio debe ser mayor a 0')
    .max(999999.99, 'El precio no puede exceder Q999,999.99'),
  description: z
    .string()
    .trim()
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(1000, 'La descripción no puede exceder 1000 caracteres')
    .regex(/^[^<>{}@]+$/, 'La descripción contiene caracteres no permitidos (@, <, >, etc.)')
    .refine(
      (val) => /\p{L}/u.test(val),
      'La descripción debe contener texto descriptivo, no solo números',
    ),
  imageUrl: z.string().url('URL de imagen inválida').or(z.literal('')),
};

export const createProductSchema = z.object(sharedFields);

export const editProductSchema = z.object({
  ...sharedFields,
  minStock: z
    .number('El stock mínimo debe ser un número')
    .int('El stock mínimo debe ser un número entero')
    .min(0, 'El stock mínimo no puede ser negativo')
    .max(99999, 'El stock mínimo no puede exceder 99,999'),
});

export type CreateProductFormData = z.infer<typeof createProductSchema>;
export type EditProductFormData = z.infer<typeof editProductSchema>;
export { CATEGORY_VALUES };
