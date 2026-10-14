import { SupplierRepository } from '@modules/suppliers/domain/repositories/supplier.repository';
import { SupplierProps } from '@modules/suppliers/domain/entities/supplier.entity';
import { SupplierNotFoundException } from '@modules/suppliers/domain/exceptions/supplier-not-found.exception';

export class GetSupplierUseCase {
  constructor(private readonly supplierRepo: SupplierRepository) {}

  async execute(id: string): Promise<SupplierProps> {
    const supplier = await this.supplierRepo.findById(id);
    if (!supplier) throw new SupplierNotFoundException(id);
    return supplier.toJSON();
  }
}
