import { NotFoundException } from '@shared/domain/exceptions/domain.exception';

export class OrderNotFoundException extends NotFoundException {
  constructor(orderId: string) {
    super(`Orden con ID ${orderId} no encontrada`);
  }
}
