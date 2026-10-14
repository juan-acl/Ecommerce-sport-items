import { SupplierRepository, ListSuppliersParams } from '@modules/suppliers/domain/repositories/supplier.repository';
import { PaginatedResult } from '@shared/domain/value-objects/pagination.vo';
import { SupplierProps } from '@modules/suppliers/domain/entities/supplier.entity';

export class ListSuppliersUseCase {
  constructor(private readonly supplierRepo: SupplierRepository) {}

  async execute(params: ListSuppliersParams): Promise<PaginatedResult<SupplierProps>> {
    const limit = params.limit ?? 20;
    const result = await this.supplierRepo.list({ limit, cursor: params.cursor });
    return {
      items: result.items.map((s) => s.toJSON()),
      count: result.count,
      nextCursor: result.nextCursor,
    };
  }
}
