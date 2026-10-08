import { z } from 'zod';

export const UpdateUserAdminSchema = z.object({
  name: z.string().min(1).optional(),
  role: z.string().min(1).optional(),
  password: z.string().min(6).optional(),
});

export type UpdateUserAdminDto = z.infer<typeof UpdateUserAdminSchema>;
