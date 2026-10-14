import { PurchaseRepository, ListPurchasesParams } from '@modules/purchases/domain/repositories/purchase.repository';
import { PaginatedResult } from '@shared/domain/value-objects/pagination.vo';
import { PurchaseProps } from '@modules/purchases/domain/entities/purchase.entity';

export class ListPurchasesUseCase {
  constructor(private readonly purchaseRepo: PurchaseRepository) {}

  async execute(params: ListPurchasesParams): Promise<PaginatedResult<PurchaseProps>> {
    const result = await this.purchaseRepo.list(params);
    return {
      items: result.items.map((p) => p.toJSON()),
      count: result.count,
      nextCursor: result.nextCursor,
    };
  }
}
