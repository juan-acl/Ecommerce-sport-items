import { v4 as uuid } from 'uuid';
import { PurchaseRepository } from '@modules/purchases/domain/repositories/purchase.repository';
import { PurchaseNotFoundException } from '@modules/purchases/domain/exceptions/purchase-not-found.exception';
import { ConflictException } from '@shared/domain/exceptions/domain.exception';
import { PurchaseProps } from '@modules/purchases/domain/entities/purchase.entity';
import { ProductRepository } from '@modules/products/domain/repositories/product.repository';
import { Product } from '@modules/products/domain/entities/product.entity';
import { InventoryMovementRepository } from '@modules/inventory/domain/repositories/inventory-movement.repository';
import { InventoryMovement } from '@modules/inventory/domain/entities/inventory-movement.entity';

export class CancelPurchaseUseCase {
  constructor(
    private readonly purchaseRepo: PurchaseRepository,
    private readonly productRepo: ProductRepository,
    private readonly movementRepo: InventoryMovementRepository,
  ) {}

  async execute(id: string): Promise<PurchaseProps> {
    const purchase = await this.purchaseRepo.findById(id);
    if (!purchase) throw new PurchaseNotFoundException(id);

    if (!purchase.canBeCancelled) {
      throw new ConflictException(
        `No se puede cancelar una compra en estado "${purchase.status}"`,
      );
    }

    const wasReceived = purchase.wasReceived;
    const cancelled = purchase.cancel();
    await this.purchaseRepo.update(cancelled);

    if (wasReceived) {
      for (const item of purchase.items) {
        const product = await this.productRepo.findById(item.productId);
        if (!product) continue;

        const restored = new Product({
          ...product.toJSON(),
          stock: Math.max(product.stock - item.quantity, 0),
        });
        await this.productRepo.update(restored);

        const movement = new InventoryMovement({
          id: uuid(),
          productId: item.productId,
          productName: item.productName,
          type: 'adjustment',
          quantity: -item.quantity,
          referenceId: purchase.id,
          note: `Reversión por cancelación de compra ${purchase.id}`,
          createdAt: new Date().toISOString(),
          createdBy: 'system',
        });
        await this.movementRepo.save(movement);
      }
    }

    return cancelled.toJSON();
  }
}
