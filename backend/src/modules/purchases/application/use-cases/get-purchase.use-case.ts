import { PurchaseRepository } from '@modules/purchases/domain/repositories/purchase.repository';
import { PurchaseProps } from '@modules/purchases/domain/entities/purchase.entity';
import { PurchaseNotFoundException } from '@modules/purchases/domain/exceptions/purchase-not-found.exception';

export class GetPurchaseUseCase {
  constructor(private readonly purchaseRepo: PurchaseRepository) {}

  async execute(id: string): Promise<PurchaseProps> {
    const purchase = await this.purchaseRepo.findById(id);
    if (!purchase) throw new PurchaseNotFoundException(id);
    return purchase.toJSON();
  }
}
