import { Purchase, PurchaseProps, PurchaseItem, PurchaseStatus } from '@modules/purchases/domain/entities/purchase.entity';

export class PurchaseMapper {
  static toDomain(item: Record<string, unknown>): Purchase {
    const props: PurchaseProps = {
      id: item.id as string,
      supplierId: item.supplierId as string,
      supplierName: item.supplierName as string,
      items: item.items as PurchaseItem[],
      total: item.total as number,
      status: item.status as PurchaseStatus,
      notes: item.notes as string | undefined,
      createdAt: item.createdAt as string,
      receivedAt: item.receivedAt as string | undefined,
    };
    return new Purchase(props);
  }

  static toItem(purchase: Purchase): Record<string, unknown> {
    const json = purchase.toJSON();
    return {
      PK: `PURCHASE#${purchase.id}`,
      SK: 'METADATA',
      GSI1PK: 'PURCHASE',
      GSI1SK: purchase.id,
      GSI2PK: `SUPPLIER#${purchase.supplierId}`,
      GSI2SK: `PURCHASE#${purchase.id}`,
      ...json,
    };
  }
}
