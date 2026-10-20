import { v4 as uuid } from 'uuid';
import { Discount, DiscountProps } from '@modules/discounts/domain/entities/discount.entity';
import { DiscountRepository } from '@modules/discounts/domain/repositories/discount.repository';
import { ConflictException } from '@shared/domain/exceptions/domain.exception';
import { CreateDiscountDto } from '../dtos/discount.dto';

export class CreateDiscountUseCase {
  constructor(private readonly discountRepo: DiscountRepository) {}

  async execute(dto: CreateDiscountDto, createdBy: string): Promise<DiscountProps> {
    const existing = await this.discountRepo.findByCode(dto.code);
    if (existing && existing.isActive) {
      throw new ConflictException(`Ya existe un descuento activo con el código '${dto.code}'`);
    }

    const discount = new Discount({
      id: uuid(),
      code: dto.code,
      type: dto.type,
      value: dto.value,
      minPurchase: dto.minPurchase ?? 0,
      maxUses: dto.maxUses ?? 0,
      usedCount: 0,
      isActive: true,
      expiresAt: dto.expiresAt ?? null,
      createdAt: new Date().toISOString(),
      createdBy,
      applicableCategories: dto.applicableCategories ?? [],
    });

    await this.discountRepo.save(discount);
    return discount.toJSON();
  }
}
