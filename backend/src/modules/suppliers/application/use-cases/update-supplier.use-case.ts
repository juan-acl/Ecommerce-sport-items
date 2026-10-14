import { Supplier, SupplierProps } from '@modules/suppliers/domain/entities/supplier.entity';
import { SupplierRepository } from '@modules/suppliers/domain/repositories/supplier.repository';
import { UpdateSupplierDto } from '../dtos/supplier.dto';
import { SupplierNotFoundException } from '@modules/suppliers/domain/exceptions/supplier-not-found.exception';
import { SupplierAlreadyExistsException } from '@modules/suppliers/domain/exceptions/supplier-already-exists.exception';

export class UpdateSupplierUseCase {
  constructor(private readonly supplierRepo: SupplierRepository) {}

  async execute(id: string, dto: UpdateSupplierDto): Promise<SupplierProps> {
    const supplier = await this.supplierRepo.findById(id);
    if (!supplier) throw new SupplierNotFoundException(id);

    if (dto.email && dto.email !== supplier.email) {
      const existing = await this.supplierRepo.findByEmail(dto.email);
      if (existing) throw new SupplierAlreadyExistsException(dto.email);
    }

    const updated = new Supplier({
      ...supplier.toJSON(),
      ...dto,
    });

    await this.supplierRepo.update(updated);
    return updated.toJSON();
  }
}
