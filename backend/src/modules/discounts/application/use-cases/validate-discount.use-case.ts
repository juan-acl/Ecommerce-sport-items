import { DiscountRepository } from '@modules/discounts/domain/repositories/discount.repository';
import { DiscountNotFoundException, DiscountInvalidException } from '@modules/discounts/domain/exceptions/discount.exceptions';
import { ValidateDiscountDto } from '../dtos/discount.dto';

export interface ValidateDiscountResult {
  discountId: string;
  code: string;
  type: string;
  value: number;
  discountAmount: number;
  finalTotal: number;
}

export class ValidateDiscountUseCase {
  constructor(private readonly discountRepo: DiscountRepository) {}

  async execute(dto: ValidateDiscountDto): Promise<ValidateDiscountResult> {
    const discount = await this.discountRepo.findByCode(dto.code);
    if (!discount) {
      throw new DiscountNotFoundException(dto.code);
    }

    if (!discount.isValid(dto.orderTotal, dto.cartCategories)) {
      if (!discount.isActive) {
        throw new DiscountInvalidException('Este descuento no está activo');
      }
      if (discount.expiresAt && new Date(discount.expiresAt) < new Date()) {
        throw new DiscountInvalidException('Este descuento ha expirado');
      }
      if (discount.maxUses > 0 && discount.usedCount >= discount.maxUses) {
        throw new DiscountInvalidException('Este descuento ha alcanzado su límite de usos');
      }
      if (dto.orderTotal < discount.minPurchase) {
        throw new DiscountInvalidException(
          `Este descuento requiere una compra mínima de Q${discount.minPurchase.toFixed(2)}`,
        );
      }
      if (
        discount.applicableCategories.length > 0 &&
        dto.cartCategories &&
        dto.cartCategories.length > 0 &&
        !dto.cartCategories.some((c) => discount.applicableCategories.includes(c))
      ) {
        throw new DiscountInvalidException('Este descuento no aplica para los productos en tu carrito');
      }
      throw new DiscountInvalidException('Este descuento no es válido');
    }

    const discountAmount = discount.calculateDiscount(dto.orderTotal);
    const finalTotal = parseFloat((dto.orderTotal - discountAmount).toFixed(2));

    return {
      discountId: discount.id,
      code: discount.code,
      type: discount.type,
      value: discount.value,
      discountAmount,
      finalTotal,
    };
  }
}
