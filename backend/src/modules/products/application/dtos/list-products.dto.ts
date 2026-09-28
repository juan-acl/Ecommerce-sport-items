import { z } from 'zod';
import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from '@shared/domain/value-objects/pagination.vo';

export const listProductsQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
  cursor: z.string().optional(),
  category: z.string().optional(),
});

export type ListProductsQuery = z.infer<typeof listProductsQuerySchema>;
