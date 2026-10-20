import { DiscountRepository } from '@modules/discounts/domain/repositories/discount.repository';
import { DiscountProps } from '@modules/discounts/domain/entities/discount.entity';
import { PaginationParams } from '@shared/domain/value-objects/pagination.vo';

export class ListDiscountsUseCase {
  constructor(private readonly discountRepo: DiscountRepository) {}

  async execute(
    params: PaginationParams,
  ): Promise<{ items: DiscountProps[]; nextCursor?: string; count: number }> {
    const result = await this.discountRepo.listAll(params);
    return {
      items: result.items.map((d) => d.toJSON()),
      nextCursor: result.nextCursor,
      count: result.count,
    };
  }
}
