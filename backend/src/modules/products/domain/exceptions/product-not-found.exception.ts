import { NotFoundException } from '@shared/domain/exceptions/domain.exception';

export class ProductNotFoundException extends NotFoundException {
  constructor(productId: string) {
    super(`Producto con ID ${productId} no encontrado`);
  }
}
