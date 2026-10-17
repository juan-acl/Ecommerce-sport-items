import { v4 as uuid } from 'uuid';
import { OrderRepository } from '@modules/orders/domain/repositories/order.repository';
import { OrderStatus, ORDER_STATUS } from '@modules/orders/domain/value-objects/order-status.vo';
import { NotFoundException, ValidationException } from '@shared/domain/exceptions/domain.exception';
import { ProductRepository } from '@modules/products/domain/repositories/product.repository';
import { Product } from '@modules/products/domain/entities/product.entity';
import { InventoryMovementRepository } from '@modules/inventory/domain/repositories/inventory-movement.repository';
import { InventoryMovement } from '@modules/inventory/domain/entities/inventory-movement.entity';

const VALID_STATUSES = Object.values(ORDER_STATUS);

export class UpdateOrderStatusUseCase {
  constructor(
    private readonly orderRepo: OrderRepository,
    private readonly productRepo: ProductRepository,
    private readonly movementRepo: InventoryMovementRepository,
  ) {}

  async execute(orderId: string, status: string): Promise<void> {
    if (!VALID_STATUSES.includes(status as OrderStatus)) {
      throw new ValidationException(
        `Estado inválido. Valores permitidos: ${VALID_STATUSES.join(', ')}`,
      );
    }
    const existing = await this.orderRepo.findById(orderId);
    if (!existing) throw new NotFoundException('Orden no encontrada');

    const prevStatus = existing.status;
    await this.orderRepo.updateStatus(orderId, status as OrderStatus);

    if (status === ORDER_STATUS.CANCELLED && prevStatus !== ORDER_STATUS.CANCELLED) {
      for (const item of existing.items) {
        const product = await this.productRepo.findById(item.productId);
        if (!product) continue;

        const restored = new Product({
          ...product.toJSON(),
          stock: product.stock + item.quantity,
        });
        await this.productRepo.update(restored);

        const movement = new InventoryMovement({
          id: uuid(),
          productId: item.productId,
          productName: item.productName,
          type: 'return',
          quantity: item.quantity,
          referenceId: orderId,
          note: `Devolución por cancelación de orden ${orderId}`,
          createdAt: new Date().toISOString(),
          createdBy: 'system',
        });
        await this.movementRepo.save(movement);
      }
    }
  }
}
