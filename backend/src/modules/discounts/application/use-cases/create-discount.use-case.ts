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

    const discount = Discount.create({
      id: uuid(),
      code: dto.code,
      type: dto.type,
      value: dto.value,
      minPurchase: dto.minPurchase ?? 0,
      maxUses: dto.maxUses ?? 0,
      expiresAt: dto.expiresAt ?? null,
      applicableCategories: dto.applicableCategories ?? [],
      targetClientId: dto.targetClientId ?? null,
      createdBy,
      createdAt: new Date().toISOString(),
    });

    await this.discountRepo.save(discount);
    return discount.toJSON();
  }
}
