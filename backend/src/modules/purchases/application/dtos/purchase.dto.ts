import { z } from 'zod';

export const PurchaseItemSchema = z.object({
  productId: z.string().min(1, 'El ID del producto es requerido'),
  productName: z.string().min(1, 'El nombre del producto es requerido').max(150),
  quantity: z
    .number()
    .int('La cantidad debe ser un número entero')
    .min(1, 'La cantidad debe ser al menos 1')
    .max(9999, 'La cantidad no puede exceder 9,999'),
  unitCost: z
    .number()
    .positive('El costo unitario debe ser mayor a 0')
    .max(999999.99, 'El costo no puede exceder Q999,999.99'),
});

export type PurchaseItemDto = z.infer<typeof PurchaseItemSchema>;

export const CreatePurchaseSchema = z.object({
  supplierId: z.string().min(1, 'El proveedor es requerido'),
  items: z
    .array(PurchaseItemSchema)
    .min(1, 'La compra debe tener al menos un producto')
    .max(50, 'La compra no puede tener más de 50 productos'),
  notes: z
    .string().trim()
    .max(500, 'Las notas no pueden exceder 500 caracteres')
    .regex(/^[^<>{}@]*$/, 'Las notas contienen caracteres no permitidos')
    .optional(),
});

export type CreatePurchaseDto = z.infer<typeof CreatePurchaseSchema>;
