import { z } from 'zod';

export const ModulePermissionSchema = z.object({
  module: z.string().min(1),
  actions: z.array(z.string()),
});

export const CreateRoleSchema = z.object({
  name: z.string().min(2, 'Mínimo 2 caracteres').max(50),
  description: z.string().max(200).optional().default(''),
  permissions: z.array(ModulePermissionSchema),
  isSystem: z.boolean().optional().default(false),
});

export type CreateRoleDto = z.infer<typeof CreateRoleSchema>;
