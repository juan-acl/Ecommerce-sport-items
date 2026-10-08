import { z } from 'zod';
import { ModulePermissionSchema } from './create-role.dto';

export const UpdateRoleSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  description: z.string().max(200).optional(),
  permissions: z.array(ModulePermissionSchema).optional(),
});

export type UpdateRoleDto = z.infer<typeof UpdateRoleSchema>;
