import { Discount, DiscountProps } from '@modules/discounts/domain/entities/discount.entity';

export class DiscountMapper {
  static toDomain(item: Record<string, unknown>): Discount {
    const props: DiscountProps = {
      id: item.id as string,
      code: item.code as string,
      type: item.type as DiscountProps['type'],
      value: item.value as number,
      minPurchase: item.minPurchase as number,
      maxUses: item.maxUses as number,
      usedCount: item.usedCount as number,
      isActive: item.isActive as boolean,
      expiresAt: (item.expiresAt as string | null | undefined) ?? null,
      createdAt: item.createdAt as string,
      createdBy: item.createdBy as string,
      applicableCategories: (item.applicableCategories as string[] | undefined) ?? [],
    };
    return new Discount(props);
  }

  static toItem(discount: Discount): Record<string, unknown> {
    const json = discount.toJSON();
    return {
      PK: `DISCOUNT#${discount.id}`,
      SK: 'METADATA',
      GSI1PK: 'DISCOUNT',
      GSI1SK: `${discount.createdAt}#${discount.id}`,
      GSI2PK: `DISCOUNT_CODE#${discount.code}`,
      GSI2SK: 'METADATA',
      ...json,
    };
  }
}
