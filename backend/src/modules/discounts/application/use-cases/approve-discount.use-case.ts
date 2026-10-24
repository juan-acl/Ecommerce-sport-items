import { DiscountRepository } from '@modules/discounts/domain/repositories/discount.repository';
import { DiscountNotFoundException, DiscountInvalidException } from '@modules/discounts/domain/exceptions/discount.exceptions';
import { DiscountProps } from '@modules/discounts/domain/entities/discount.entity';

export interface ApproveDiscountInput {
  id: string;
  approvedBy: string;
  approvalReason: string;
}

export class ApproveDiscountUseCase {
  constructor(private readonly discountRepo: DiscountRepository) {}

  async execute(input: ApproveDiscountInput): Promise<DiscountProps> {
    const discount = await this.discountRepo.findById(input.id);
    if (!discount) {
      throw new DiscountNotFoundException(input.id);
    }

    if (!discount.needsApproval) {
      throw new DiscountInvalidException('Este descuento no requiere aprobación');
    }

    const approved = discount.withApproved(input.approvedBy, input.approvalReason);
    await this.discountRepo.approve(input.id, input.approvedBy, input.approvalReason);
    return approved.toJSON();
  }
}
