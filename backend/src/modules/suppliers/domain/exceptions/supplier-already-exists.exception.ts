import { ConflictException } from '@shared/domain/exceptions/domain.exception';

export class SupplierAlreadyExistsException extends ConflictException {
  constructor(email: string) {
    super(`Ya existe un proveedor con el correo ${email}`);
  }
}
