import { z } from 'zod';

export const CreateUserAdminSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.string().min(1),
});

export type CreateUserAdminDto = z.infer<typeof CreateUserAdminSchema>;
