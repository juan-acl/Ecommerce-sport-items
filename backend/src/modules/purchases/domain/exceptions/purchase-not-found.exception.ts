import { NotFoundException } from '@shared/domain/exceptions/domain.exception';

export class PurchaseNotFoundException extends NotFoundException {
  constructor(purchaseId: string) {
    super(`Compra con ID ${purchaseId} no encontrada`);
  }
}
