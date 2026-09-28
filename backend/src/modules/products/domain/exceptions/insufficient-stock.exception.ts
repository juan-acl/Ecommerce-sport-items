import { ConflictException } from '@shared/domain/exceptions/domain.exception';

export class InsufficientStockException extends ConflictException {
  constructor(productName: string) {
    super(`Stock insuficiente para "${productName}".`);
  }
}
