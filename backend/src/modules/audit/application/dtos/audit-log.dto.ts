import { z } from 'zod';

export const ListAuditLogsQuerySchema = z.object({
  limit: z.number().int().min(1).max(100).default(20),
  cursor: z.string().optional(),
  action: z.string().optional(),
  userId: z.string().optional(),
  userEmail: z.string().optional(),
  entityType: z.string().optional(),
  fromDate: z.string().optional(),
  toDate: z.string().optional(),
});

export type ListAuditLogsQueryDto = z.infer<typeof ListAuditLogsQuerySchema>;
