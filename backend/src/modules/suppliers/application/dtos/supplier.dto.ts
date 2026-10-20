import { z } from 'zod';

const nitSchema = z
  .string().trim().toUpperCase()
  .regex(/^(CF|\d{1,8}-[\dK])$/i, 'NIT inválido. Formato: 12345678-9 o CF')
  .optional();

export const CreateSupplierSchema = z.object({
  name: z
    .string().trim()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(150, 'El nombre no puede exceder 150 caracteres')
    .regex(/^[\p{L}\p{N}\s.,\-'&/()+]+$/u, 'El nombre contiene caracteres no permitidos')
    .refine(
      (val) => /\p{L}/u.test(val),
      'El nombre del proveedor debe contener al menos una letra',
    ),
  nit: nitSchema,
  contactName: z
    .string().trim()
    .min(2, 'El nombre de contacto debe tener al menos 2 caracteres')
    .max(100, 'El nombre de contacto no puede exceder 100 caracteres')
    .regex(/^[\p{L}\s'.\-]+$/u, 'El nombre de contacto solo puede contener letras y espacios'),
  email: z.string().trim().toLowerCase().email('Correo electrónico inválido').max(254, 'El correo es demasiado largo'),
  phone: z
    .string().trim()
    .min(7, 'El teléfono debe tener al menos 7 caracteres')
    .max(20, 'El teléfono no puede exceder 20 caracteres')
    .regex(/^\+?[\d\s\-(). ]{7,20}$/, 'El teléfono solo puede contener números y símbolos + - ( )'),
  address: z
    .string().trim()
    .min(5, 'La dirección debe tener al menos 5 caracteres')
    .max(300, 'La dirección no puede exceder 300 caracteres')
    .regex(/^[\p{L}\p{N}\s.,\-#/()°]+$/u, 'La dirección contiene caracteres no permitidos'),
});

export type CreateSupplierDto = z.infer<typeof CreateSupplierSchema>;

export const UpdateSupplierSchema = CreateSupplierSchema.partial().extend({
  isActive: z.boolean().optional(),
});

export type UpdateSupplierDto = z.infer<typeof UpdateSupplierSchema>;
