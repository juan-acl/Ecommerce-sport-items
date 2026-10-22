import { z } from 'zod';

export const discountCodeSchema = z
  .string()
  .trim()
  .toUpperCase()
  .min(3, 'Mínimo 3 caracteres')
  .max(20, 'Máximo 20 caracteres')
  .regex(/^[A-Z0-9-]+$/, 'Solo letras mayúsculas, números y guiones');

export const discountSchema = z
  .object({
    code: discountCodeSchema,
    type: z.enum(['percentage', 'fixed']),
    value: z.number('Ingresa un valor válido').positive('El valor debe ser mayor a 0'),
    minPurchase: z
      .number('Ingresa un valor válido')
      .min(0, 'Debe ser 0 o mayor'),
    maxUses: z
      .number('Ingresa un número válido')
      .int('Debe ser un número entero')
      .min(0, 'Debe ser 0 o mayor'),
    expiresAt: z.string().optional(),
    applicableCategories: z.array(z.string()).optional(),
  })
  .refine(
    (data) => {
      if (data.type === 'percentage') return data.value >= 1 && data.value <= 100;
      return data.value >= 0.01 && data.value <= 9999.99;
    },
    (data) => ({
      message:
        data.type === 'percentage'
          ? 'El porcentaje debe estar entre 1 y 100'
          : 'El monto fijo debe estar entre Q0.01 y Q9,999.99',
      path: ['value'],
    }),
  )
  .refine(
    (data) => {
      if (!data.expiresAt) return true;
      return new Date(data.expiresAt) > new Date();
    },
    { message: 'La fecha de expiración debe ser en el futuro', path: ['expiresAt'] },
  );

export type DiscountFormData = z.infer<typeof discountSchema>;
