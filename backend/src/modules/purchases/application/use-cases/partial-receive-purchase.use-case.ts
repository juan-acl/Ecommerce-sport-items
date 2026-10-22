import { v4 as uuid } from 'uuid';
import { PurchaseRepository } from '@modules/purchases/domain/repositories/purchase.repository';
import { PurchaseNotFoundException } from '@modules/purchases/domain/exceptions/purchase-not-found.exception';
import { ConflictException, ValidationException, NotFoundException } from '@shared/domain/exceptions/domain.exception';
import { ProductRepository } from '@modules/products/domain/repositories/product.repository';
import { Product } from '@modules/products/domain/entities/product.entity';
import { InventoryMovementRepository } from '@modules/inventory/domain/repositories/inventory-movement.repository';
import { InventoryMovement } from '@modules/inventory/domain/entities/inventory-movement.entity';
import { PurchaseProps, ReceivedItem } from '@modules/purchases/domain/entities/purchase.entity';

export interface PartialReceiveItemDto {
  productId: string;
  receivedQuantity: number;
}

export class PartialReceivePurchaseUseCase {
  constructor(
    private readonly purchaseRepo: PurchaseRepository,
    private readonly productRepo: ProductRepository,
    private readonly movementRepo: InventoryMovementRepository,
  ) {}

  async execute(id: string, items: PartialReceiveItemDto[]): Promise<PurchaseProps> {
    const purchase = await this.purchaseRepo.findById(id);
    if (!purchase) throw new PurchaseNotFoundException(id);

    if (purchase.status === 'received') {
      throw new ConflictException('La compra ya fue recibida completamente');
    }
    if (purchase.status === 'cancelled') {
      throw new ConflictException('No se puede recibir una compra cancelada');
    }

    const newlyReceived: ReceivedItem[] = [];

    for (const dto of items) {
      if (dto.receivedQuantity <= 0) continue;

      if (!Number.isInteger(dto.receivedQuantity)) {
        throw new ValidationException('La cantidad a recibir debe ser un número entero');
      }

      const purchaseItem = purchase.items.find((i) => i.productId === dto.productId);
      if (!purchaseItem) {
        throw new ValidationException(
          `El producto '${dto.productId}' no pertenece a esta compra`,
        );
      }

      const remaining = purchase.getRemainingQty(dto.productId);
      if (remaining <= 0) {
        throw new ValidationException(
          `El producto '${purchaseItem.productName}' ya fue recibido completamente`,
        );
      }
      if (dto.receivedQuantity > remaining) {
        throw new ValidationException(
          `La cantidad a recibir (${dto.receivedQuantity}) supera el pendiente (${remaining}) para '${purchaseItem.productName}'`,
        );
      }

      const product = await this.productRepo.findById(dto.productId);
      if (!product) {
        throw new NotFoundException(`Producto '${purchaseItem.productName}' no encontrado`);
      }

      const updatedProduct = new Product({
        ...product.toJSON(),
        stock: product.stock + dto.receivedQuantity,
      });
      await this.productRepo.update(updatedProduct);

      const movement = new InventoryMovement({
        id: uuid(),
        productId: dto.productId,
        productName: purchaseItem.productName,
        type: 'purchase',
        quantity: dto.receivedQuantity,
        referenceId: purchase.id,
        note: `Recepción parcial de compra ${purchase.id}`,
        createdAt: new Date().toISOString(),
        createdBy: 'system',
      });
      await this.movementRepo.save(movement);

      newlyReceived.push({ productId: dto.productId, receivedQuantity: dto.receivedQuantity });
    }

    if (newlyReceived.length === 0) {
      throw new ValidationException('Debe indicar al menos una cantidad mayor a 0');
    }

    const updated = purchase.partialReceive(newlyReceived);
    await this.purchaseRepo.update(updated);

    return updated.toJSON();
  }
}
