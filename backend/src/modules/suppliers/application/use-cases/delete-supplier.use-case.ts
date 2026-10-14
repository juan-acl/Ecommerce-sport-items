import { SupplierRepository } from '@modules/suppliers/domain/repositories/supplier.repository';
import { SupplierNotFoundException } from '@modules/suppliers/domain/exceptions/supplier-not-found.exception';

export class DeleteSupplierUseCase {
  constructor(private readonly supplierRepo: SupplierRepository) {}

  async execute(id: string): Promise<void> {
    const supplier = await this.supplierRepo.findById(id);
    if (!supplier) throw new SupplierNotFoundException(id);
    await this.supplierRepo.delete(id);
  }
}
