import { z } from 'zod';

const DISCOUNT_CATEGORY_VALUES = [
  'running', 'football', 'basketball', 'tennis',
  'swimming', 'cycling', 'fitness', 'other',
] as const;

export const CreateDiscountSchema = z
  .object({
    code: z
      .string()
      .min(3, 'El código debe tener al menos 3 caracteres')
      .max(20, 'El código no puede exceder 20 caracteres')
      .toUpperCase()
      .regex(/^[A-Z0-9\-]+$/, 'El código solo puede contener letras mayúsculas, números y guiones'),
    type: z.enum(['percentage', 'fixed'], { error: 'El tipo debe ser percentage o fixed' }),
    value: z.number().positive('El valor debe ser mayor a 0'),
    minPurchase: z.number().min(0, 'La compra mínima no puede ser negativa').default(0),
    maxUses: z.number().int('maxUses debe ser entero').min(0, 'maxUses no puede ser negativo').default(0),
    expiresAt: z
      .string()
      .trim()
      .refine(
        (val) => !isNaN(new Date(val).getTime()),
        { message: 'La fecha de expiración no es válida' },
      )
      .refine(
        (val) => new Date(val) > new Date(),
        { message: 'La fecha de expiración debe ser una fecha futura' },
      )
      .nullable()
      .optional(),
    applicableCategories: z
      .array(z.enum(DISCOUNT_CATEGORY_VALUES, { error: 'Categoría inválida' }))
      .optional(),
  })
  .refine(
    (data) => {
      if (data.type === 'percentage') {
        return data.value >= 1 && data.value <= 100;
      }
      return data.value >= 0.01 && data.value <= 9999.99;
    },
    {
      message:
        'Para porcentaje, el valor debe ser entre 1 y 100. Para fijo, entre 0.01 y 9999.99',
      path: ['value'],
    },
  );

export type CreateDiscountDto = z.infer<typeof CreateDiscountSchema>;

export const ValidateDiscountSchema = z.object({
  code: z.string().min(1, 'El código es requerido'),
  orderTotal: z.number().positive('El total del pedido debe ser mayor a 0'),
  cartCategories: z.array(z.string()).optional(),
});

export type ValidateDiscountDto = z.infer<typeof ValidateDiscountSchema>;

export const ListDiscountsQuerySchema = z.object({
  limit: z.number().int().min(1).max(100).default(20),
  cursor: z.string().optional(),
});

export type ListDiscountsQueryDto = z.infer<typeof ListDiscountsQuerySchema>;
