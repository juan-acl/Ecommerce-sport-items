import { z } from 'zod';
import {
  emailValidator,
  nameValidator,
  loginPasswordValidator,
  strongPasswordValidator,
} from '@shared/utils/validationSchemas';

export const loginSchema = z.object({
  email: emailValidator,
  password: loginPasswordValidator,
});

export const registerSchema = z.object({
  name: nameValidator,
  email: emailValidator,
  password: strongPasswordValidator,
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
