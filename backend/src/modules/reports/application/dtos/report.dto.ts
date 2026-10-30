import { z } from 'zod';

export const ReportQuerySchema = z.object({
  period: z.enum(['day', 'week', 'month'], { error: 'El período debe ser day, week o month' }).default('month'),
  from: z.string().optional(),
  to: z.string().optional(),
});

export type ReportQueryDto = z.infer<typeof ReportQuerySchema>;

export const ProductsReportQuerySchema = z.object({
  category: z.string().optional(),
  name: z.string().optional(),
  stockStatus: z.enum(['out_of_stock', 'low_stock', 'in_stock']).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export type ProductsReportQueryDto = z.infer<typeof ProductsReportQuerySchema>;
