import { v4 as uuid } from 'uuid';
import { Supplier, SupplierProps } from '@modules/suppliers/domain/entities/supplier.entity';
import { SupplierRepository } from '@modules/suppliers/domain/repositories/supplier.repository';
import { CreateSupplierDto } from '../dtos/supplier.dto';
import { SupplierAlreadyExistsException } from '@modules/suppliers/domain/exceptions/supplier-already-exists.exception';

export class CreateSupplierUseCase {
  constructor(private readonly supplierRepo: SupplierRepository) {}

  async execute(dto: CreateSupplierDto): Promise<SupplierProps> {
    const existing = await this.supplierRepo.findByEmail(dto.email);
    if (existing) throw new SupplierAlreadyExistsException(dto.email);

    const supplier = new Supplier({
      id: uuid(),
      name: dto.name,
      contactName: dto.contactName,
      email: dto.email,
      phone: dto.phone,
      address: dto.address,
      isActive: true,
      createdAt: new Date().toISOString(),
    });

    await this.supplierRepo.save(supplier);
    return supplier.toJSON();
  }
}
