export abstract class DomainException extends Error {
  abstract readonly code: string;
  abstract readonly statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ValidationException extends DomainException {
  readonly code = 'VALIDATION_ERROR';
  readonly statusCode = 400;
}

export class UnauthorizedException extends DomainException {
  readonly code = 'UNAUTHORIZED';
  readonly statusCode = 401;
}

export class ForbiddenException extends DomainException {
  readonly code = 'FORBIDDEN';
  readonly statusCode = 403;
}

export class NotFoundException extends DomainException {
  readonly code = 'NOT_FOUND';
  readonly statusCode = 404;
}

export class ConflictException extends DomainException {
  readonly code = 'CONFLICT';
  readonly statusCode = 409;
}
