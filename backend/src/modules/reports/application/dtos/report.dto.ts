import { z } from 'zod';

export const SalesReportQuerySchema = z.object({
  period: z.enum(['day', 'week', 'month'], { error: 'El período debe ser day, week o month' }).default('month'),
});

export type SalesReportQueryDto = z.infer<typeof SalesReportQuerySchema>;
