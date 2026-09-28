import { OrderRepository } from '@modules/orders/domain/repositories/order.repository';
import { OrderNotFoundException } from '@modules/orders/domain/exceptions/order-not-found.exception';

export class GetOrderUseCase {
  constructor(private readonly orderRepo: OrderRepository) {}

  async execute(userId: string, orderId: string) {
    const order = await this.orderRepo.findByIdForUser(orderId, userId);
    if (!order) throw new OrderNotFoundException(orderId);
    return order.toJSON();
  }
}
