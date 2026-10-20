import { Discount } from '../entities/discount.entity';
import { PaginatedResult, PaginationParams } from '@shared/domain/value-objects/pagination.vo';

export interface DiscountRepository {
  findByCode(code: string): Promise<Discount | null>;
  findById(id: string): Promise<Discount | null>;
  save(discount: Discount): Promise<void>;
  listAll(params: PaginationParams): Promise<PaginatedResult<Discount>>;
  incrementUsedCount(id: string): Promise<void>;
  setActive(id: string, isActive: boolean): Promise<void>;
}
