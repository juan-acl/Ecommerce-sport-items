import { z } from 'zod';

export const ReportQuerySchema = z.object({
  period: z.enum(['day', 'week', 'month'], { error: 'El período debe ser day, week o month' }).default('month'),
  from: z.string().optional(),
  to: z.string().optional(),
});

export type ReportQueryDto = z.infer<typeof ReportQuerySchema>;
