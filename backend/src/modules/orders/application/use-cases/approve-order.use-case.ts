import { v4 as uuid } from 'uuid';
import { OrderRepository } from '@modules/orders/domain/repositories/order.repository';
import { ORDER_STATUS, OrderStatus } from '@modules/orders/domain/value-objects/order-status.vo';
import { OrderNotFoundException } from '@modules/orders/domain/exceptions/order-not-found.exception';
import { ValidationException } from '@shared/domain/exceptions/domain.exception';
import { ProductRepository } from '@modules/products/domain/repositories/product.repository';
import { Product } from '@modules/products/domain/entities/product.entity';
import { InventoryMovementRepository } from '@modules/inventory/domain/repositories/inventory-movement.repository';
import { InventoryMovement } from '@modules/inventory/domain/entities/inventory-movement.entity';
import { EmailSenderPort } from '@modules/orders/domain/ports/email-sender.port';
import { UserRepository } from '@modules/users/domain/repositories/user.repository';

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
    private readonly emailSender?: EmailSenderPort,
    private readonly userRepo?: UserRepository,
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

    const newStatus: OrderStatus = action === 'approve' ? ORDER_STATUS.PROCESSING : ORDER_STATUS.CANCELLED;

    await this.orderRepo.updateStatus(orderId, newStatus);

    if (action !== 'approve') {
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

    if (this.emailSender && this.userRepo) {
      this.userRepo.findById(order.userId).then((user) => {
        if (!user) return;
        return this.emailSender!.sendOrderStatusUpdate({
          to: user.email,
          userName: user.name,
          orderId,
          newStatus,
        });
      }).catch(() => undefined);
    }

    const updated = await this.orderRepo.findById(orderId);
    return updated!.toJSON();
  }
}
