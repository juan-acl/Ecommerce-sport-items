import { NotFoundException } from '@shared/domain/exceptions/domain.exception';

export class SupplierNotFoundException extends NotFoundException {
  constructor(supplierId: string) {
    super(`Proveedor con ID ${supplierId} no encontrado`);
  }
}
