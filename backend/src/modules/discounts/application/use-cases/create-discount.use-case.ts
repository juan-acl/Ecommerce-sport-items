import { v4 as uuid } from 'uuid';
import { Discount, DiscountProps } from '@modules/discounts/domain/entities/discount.entity';
import { DiscountRepository } from '@modules/discounts/domain/repositories/discount.repository';
import { ConflictException } from '@shared/domain/exceptions/domain.exception';
import { SpecialCouponRequiresClientException } from '@modules/discounts/domain/exceptions/discount.exceptions';
import { CreateDiscountDto } from '../dtos/discount.dto';

export class CreateDiscountUseCase {
  constructor(private readonly discountRepo: DiscountRepository) {}

  async execute(dto: CreateDiscountDto, createdBy: string): Promise<DiscountProps> {
    if (dto.isSpecial && !dto.targetClientId) {
      throw new SpecialCouponRequiresClientException();
    }

    const code = dto.isSpecial
      ? `SPEC-${uuid().substring(0, 8).toUpperCase()}`
      : (dto.code as string);

    const existing = await this.discountRepo.findByCode(code);
    if (existing && existing.isActive) {
      throw new ConflictException(`Ya existe un descuento activo con el código '${code}'`);
    }

    const discount = Discount.create({
      id: uuid(),
      code,
      type: dto.type,
      value: dto.value,
      minPurchase: dto.minPurchase ?? 0,
      maxUses: dto.maxUses ?? 0,
      expiresAt: dto.expiresAt ?? null,
      applicableCategories: dto.applicableCategories ?? [],
      targetClientId: dto.targetClientId ?? null,
      isSpecial: dto.isSpecial ?? false,
      createdBy,
      createdAt: new Date().toISOString(),
    });

    await this.discountRepo.save(discount);
    return discount.toJSON();
  }
}
