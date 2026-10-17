import { v4 as uuid } from 'uuid';
import { Purchase, PurchaseProps } from '@modules/purchases/domain/entities/purchase.entity';
import { PurchaseRepository } from '@modules/purchases/domain/repositories/purchase.repository';
import { SupplierRepository } from '@modules/suppliers/domain/repositories/supplier.repository';
import { SupplierNotFoundException } from '@modules/suppliers/domain/exceptions/supplier-not-found.exception';
import { CreatePurchaseDto } from '../dtos/purchase.dto';

export class CreatePurchaseUseCase {
  constructor(
    private readonly purchaseRepo: PurchaseRepository,
    private readonly supplierRepo: SupplierRepository,
  ) {}

  async execute(dto: CreatePurchaseDto): Promise<PurchaseProps> {
    const supplier = await this.supplierRepo.findById(dto.supplierId);
    if (!supplier) throw new SupplierNotFoundException(dto.supplierId);

    const items = dto.items.map((item) => ({
      ...item,
      subtotal: parseFloat((item.quantity * item.unitCost).toFixed(2)),
    }));

    const total = parseFloat(items.reduce((sum, item) => sum + item.subtotal, 0).toFixed(2));

    const purchase = new Purchase({
      id: uuid(),
      supplierId: supplier.id,
      supplierName: supplier.name,
      supplierNit: supplier.nit,
      buyerNit: dto.buyerNit,
      items,
      total,
      status: 'pending',
      notes: dto.notes,
      createdAt: new Date().toISOString(),
    });

    await this.purchaseRepo.save(purchase);
    return purchase.toJSON();
  }
}
