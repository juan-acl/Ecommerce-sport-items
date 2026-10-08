import { OrderRepository } from '@modules/orders/domain/repositories/order.repository';
import { OrderStatus, ORDER_STATUS } from '@modules/orders/domain/value-objects/order-status.vo';
import { NotFoundException, ValidationException } from '@shared/domain/exceptions/domain.exception';

const VALID_STATUSES = Object.values(ORDER_STATUS);

export class UpdateOrderStatusUseCase {
  constructor(private readonly orderRepo: OrderRepository) {}

  async execute(orderId: string, status: string): Promise<void> {
    if (!VALID_STATUSES.includes(status as OrderStatus)) {
      throw new ValidationException(
        `Estado inválido. Valores permitidos: ${VALID_STATUSES.join(', ')}`,
      );
    }
    const existing = await this.orderRepo.findById(orderId);
    if (!existing) throw new NotFoundException('Orden no encontrada');
    await this.orderRepo.updateStatus(orderId, status as OrderStatus);
  }
}
