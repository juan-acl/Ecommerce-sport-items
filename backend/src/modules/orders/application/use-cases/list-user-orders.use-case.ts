import { OrderRepository } from '@modules/orders/domain/repositories/order.repository';
import { ListOrdersQuery } from '../dtos/list-orders.dto';

export class ListUserOrdersUseCase {
  constructor(private readonly orderRepo: OrderRepository) {}

  async execute(userId: string, query: ListOrdersQuery) {
    const result = await this.orderRepo.listByUserId(userId, {
      limit: query.limit,
      cursor: query.cursor,
    });

    return {
      orders: result.items.map((o) => o.toJSON()),
      pagination: {
        limit: query.limit,
        count: result.count,
        nextCursor: result.nextCursor,
      },
    };
  }
}
