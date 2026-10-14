import { Supplier } from '../entities/supplier.entity';
import { PaginatedResult } from '@shared/domain/value-objects/pagination.vo';

export interface ListSuppliersParams {
  limit: number;
  cursor?: string;
}

export interface SupplierRepository {
  list(params: ListSuppliersParams): Promise<PaginatedResult<Supplier>>;
  findById(id: string): Promise<Supplier | null>;
  findByEmail(email: string): Promise<Supplier | null>;
  save(supplier: Supplier): Promise<void>;
  update(supplier: Supplier): Promise<void>;
  delete(id: string): Promise<void>;
}
