import { Purchase } from '../entities/purchase.entity';
import { PaginatedResult } from '@shared/domain/value-objects/pagination.vo';

export interface ListPurchasesParams {
  limit: number;
  cursor?: string;
  supplierId?: string;
}

export interface PurchaseRepository {
  list(params: ListPurchasesParams): Promise<PaginatedResult<Purchase>>;
  findById(id: string): Promise<Purchase | null>;
  save(purchase: Purchase): Promise<void>;
  update(purchase: Purchase): Promise<void>;
  listActive(): Promise<Purchase[]>;
}
