import { PurchaseRepository } from '@modules/purchases/domain/repositories/purchase.repository';
import { PurchaseNotFoundException } from '@modules/purchases/domain/exceptions/purchase-not-found.exception';
import { ConflictException } from '@shared/domain/exceptions/domain.exception';
import { PurchaseProps } from '@modules/purchases/domain/entities/purchase.entity';

export class CancelPurchaseUseCase {
  constructor(private readonly purchaseRepo: PurchaseRepository) {}

  async execute(id: string): Promise<PurchaseProps> {
    const purchase = await this.purchaseRepo.findById(id);
    if (!purchase) throw new PurchaseNotFoundException(id);

    if (!purchase.canBeCancelled) {
      throw new ConflictException(
        `No se puede cancelar una compra en estado "${purchase.status}"`,
      );
    }

    const cancelled = purchase.cancel();
    await this.purchaseRepo.update(cancelled);
    return cancelled.toJSON();
  }
}
