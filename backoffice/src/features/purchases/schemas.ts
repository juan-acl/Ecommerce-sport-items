import { z } from 'zod';

export const itemSchema = z.object({
  productId: z.string().min(1, 'Selecciona un producto'),
  productName: z.string().min(1),
  quantity: z
    .number('Ingresa una cantidad válida')
    .int('La cantidad debe ser un número entero')
    .min(1, 'La cantidad debe ser al menos 1')
    .max(9999, 'La cantidad no puede exceder 9,999'),
  unitCost: z
    .number('Ingresa un costo válido')
    .positive('El costo debe ser mayor a 0')
    .max(999999.99, 'El costo no puede exceder Q999,999.99'),
});

export const nitSchema = z
  .string()
  .trim()
  .toUpperCase()
  .regex(/^(CF|\d{1,8}-[\dK])$/i, 'NIT inválido. Usa el formato 12345678-9 o CF')
  .optional()
  .or(z.literal(''));

export const purchaseSchema = z.object({
  supplierId: z.string().min(1, 'Selecciona un proveedor'),
  buyerNit: nitSchema,
  items: z.array(itemSchema).min(1, 'Agrega al menos un producto'),
  notes: z
    .string()
    .trim()
    .max(500, 'Las notas no pueden exceder 500 caracteres')
    .regex(/^[^<>{}@]*$/, 'Las notas contienen caracteres no permitidos (@, <, >, etc.)')
    .optional(),
});

export type ItemFormData = z.infer<typeof itemSchema>;
export type PurchaseFormData = z.infer<typeof purchaseSchema>;
