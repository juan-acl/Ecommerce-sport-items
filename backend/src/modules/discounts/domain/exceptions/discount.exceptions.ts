import { DomainException } from '@shared/domain/exceptions/domain.exception';

export class DiscountNotFoundException extends DomainException {
  readonly code = 'DISCOUNT_NOT_FOUND';
  readonly statusCode = 404;

  constructor(identifier: string) {
    super(`Descuento '${identifier}' no encontrado`);
  }
}

export class DiscountInvalidException extends DomainException {
  readonly code = 'DISCOUNT_INVALID';
  readonly statusCode = 422;

  constructor(reason: string) {
    super(reason);
  }
}
