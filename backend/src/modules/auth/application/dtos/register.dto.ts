import { z } from 'zod';

export const registerSchema = z.object({
  name: z
    .string().trim()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .regex(/^[\p{L}\s'.\-]+$/u, 'El nombre solo puede contener letras y espacios'),
  email: z
    .string().trim().toLowerCase()
    .min(1, 'El correo electrónico es requerido')
    .email('Correo electrónico inválido')
    .max(254, 'El correo electrónico es demasiado largo'),
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(128, 'La contraseña no puede exceder 128 caracteres')
    .regex(/[A-Z]/, 'Debe contener al menos una letra mayúscula')
    .regex(/[a-z]/, 'Debe contener al menos una letra minúscula')
    .regex(/[0-9]/, 'Debe contener al menos un número')
    .regex(/[^A-Za-z0-9]/, 'Debe contener al menos un carácter especial (!@#$%...)'),
});

export type RegisterDto = z.infer<typeof registerSchema>;
