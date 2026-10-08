import { OrderRepository } from '@modules/orders/domain/repositories/order.repository';
import { PaginationParams } from '@shared/domain/value-objects/pagination.vo';
import { Order } from '@modules/orders/domain/entities/order.entity';

export class ListAllOrdersUseCase {
  constructor(private readonly orderRepo: OrderRepository) {}

  async execute(
    params: PaginationParams,
  ): Promise<{ orders: ReturnType<Order['toJSON']>[]; nextCursor?: string; count: number }> {
    const result = await this.orderRepo.listAll(params);
    return {
      orders: result.items.map((o) => o.toJSON()),
      nextCursor: result.nextCursor,
      count: result.count,
    };
  }
}
