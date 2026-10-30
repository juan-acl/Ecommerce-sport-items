import { z } from 'zod';

export const SalesReportQuerySchema = z.object({
  period: z.enum(['day', 'week', 'month'], { error: 'El período debe ser day, week o month' }).default('month'),
  from: z.string().optional(),
  to: z.string().optional(),
});

export type SalesReportQueryDto = z.infer<typeof SalesReportQuerySchema>;

export const PurchasesReportQuerySchema = z.object({
  period: z.enum(['day', 'week', 'month'], { error: 'El período debe ser day, week o month' }).default('month'),
  from: z.string().optional(),
  to: z.string().optional(),
});

export type PurchasesReportQueryDto = z.infer<typeof PurchasesReportQuerySchema>;

export const ClientAnalyticsQuerySchema = z.object({
  period: z.enum(['day', 'week', 'month'], { error: 'El período debe ser day, week o month' }).default('month'),
  from: z.string().optional(),
  to: z.string().optional(),
});

export type ClientAnalyticsQueryDto = z.infer<typeof ClientAnalyticsQuerySchema>;
