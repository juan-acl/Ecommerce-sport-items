import { v4 as uuid } from 'uuid';
import { OrderRepository } from '@modules/orders/domain/repositories/order.repository';
import { ORDER_STATUS } from '@modules/orders/domain/value-objects/order-status.vo';
import { OrderNotFoundException } from '@modules/orders/domain/exceptions/order-not-found.exception';
import { ValidationException } from '@shared/domain/exceptions/domain.exception';
import { ProductRepository } from '@modules/products/domain/repositories/product.repository';
import { Product } from '@modules/products/domain/entities/product.entity';
import { InventoryMovementRepository } from '@modules/inventory/domain/repositories/inventory-movement.repository';
import { InventoryMovement } from '@modules/inventory/domain/entities/inventory-movement.entity';

export interface ApproveOrderInput {
  orderId: string;
  action: 'approve' | 'reject';
  adminId: string;
  adminEmail: string;
}

export class ApproveOrderUseCase {
  constructor(
    private readonly orderRepo: OrderRepository,
    private readonly productRepo: ProductRepository,
    private readonly movementRepo: InventoryMovementRepository,
  ) {}

  async execute(input: ApproveOrderInput) {
    const { orderId, action, adminId } = input;

    const order = await this.orderRepo.findById(orderId);
    if (!order) throw new OrderNotFoundException(orderId);

    if (order.status !== ORDER_STATUS.PAID) {
      throw new ValidationException(
        `La orden no está en estado pagado. Estado actual: ${order.status}`,
      );
    }

    if (action === 'approve') {
      await this.orderRepo.updateStatus(orderId, ORDER_STATUS.PROCESSING);
    } else {
      await this.orderRepo.updateStatus(orderId, ORDER_STATUS.CANCELLED);

      for (const item of order.items) {
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
          note: `Devolución por rechazo de orden ${orderId}`,
          createdAt: new Date().toISOString(),
          createdBy: adminId,
        });
        await this.movementRepo.save(movement);
      }
    }

    const updated = await this.orderRepo.findById(orderId);
    return updated!.toJSON();
  }
}
