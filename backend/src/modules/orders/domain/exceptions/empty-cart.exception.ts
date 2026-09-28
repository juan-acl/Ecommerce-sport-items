import { DomainException } from '@shared/domain/exceptions/domain.exception';

export class EmptyCartException extends DomainException {
  readonly code = 'EMPTY_CART';
  readonly statusCode = 400;

  constructor() {
    super('No se puede hacer checkout con un carrito vacío');
  }
}
