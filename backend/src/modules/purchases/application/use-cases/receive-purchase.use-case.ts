import { v4 as uuid } from 'uuid';
import { PurchaseRepository } from '@modules/purchases/domain/repositories/purchase.repository';
import { PurchaseNotFoundException } from '@modules/purchases/domain/exceptions/purchase-not-found.exception';
import { ConflictException } from '@shared/domain/exceptions/domain.exception';
import { ProductRepository } from '@modules/products/domain/repositories/product.repository';
import { Product } from '@modules/products/domain/entities/product.entity';
import { InventoryMovementRepository } from '@modules/inventory/domain/repositories/inventory-movement.repository';
import { InventoryMovement } from '@modules/inventory/domain/entities/inventory-movement.entity';
import { PurchaseProps } from '@modules/purchases/domain/entities/purchase.entity';

export class ReceivePurchaseUseCase {
  constructor(
    private readonly purchaseRepo: PurchaseRepository,
    private readonly productRepo: ProductRepository,
    private readonly movementRepo: InventoryMovementRepository,
  ) {}

  async execute(id: string): Promise<PurchaseProps> {
    const purchase = await this.purchaseRepo.findById(id);
    if (!purchase) throw new PurchaseNotFoundException(id);

    if (purchase.status === 'received') {
      throw new ConflictException('La compra ya fue recibida');
    }
    if (purchase.status === 'cancelled') {
      throw new ConflictException('No se puede recibir una compra cancelada');
    }

    const received = purchase.receive();
    await this.purchaseRepo.update(received);

    for (const item of purchase.items) {
      const product = await this.productRepo.findById(item.productId);
      if (!product) continue;

      const updatedProduct = new Product({
        ...product.toJSON(),
        stock: product.stock + item.quantity,
      });
      await this.productRepo.update(updatedProduct);

      const movement = new InventoryMovement({
        id: uuid(),
        productId: item.productId,
        productName: item.productName,
        type: 'purchase',
        quantity: item.quantity,
        referenceId: purchase.id,
        note: `Recepción de compra ${purchase.id}`,
        createdAt: new Date().toISOString(),
        createdBy: 'system',
      });
      await this.movementRepo.save(movement);
    }

    return received.toJSON();
  }
}
