import { DiscountRepository } from '@modules/discounts/domain/repositories/discount.repository';
import { DiscountNotFoundException } from '@modules/discounts/domain/exceptions/discount.exceptions';
import { DiscountProps } from '@modules/discounts/domain/entities/discount.entity';

export class ToggleDiscountUseCase {
  constructor(private readonly discountRepo: DiscountRepository) {}

  async execute(id: string): Promise<DiscountProps> {
    const discount = await this.discountRepo.findById(id);
    if (!discount) {
      throw new DiscountNotFoundException(id);
    }

    const toggled = discount.withToggled();
    await this.discountRepo.setActive(id, toggled.isActive);
    return toggled.toJSON();
  }
}
