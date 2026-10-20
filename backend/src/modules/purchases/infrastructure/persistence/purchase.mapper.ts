import { Purchase, PurchaseProps, PurchaseItem, PurchaseStatus, ReceivedItem } from '@modules/purchases/domain/entities/purchase.entity';

export class PurchaseMapper {
  static toDomain(item: Record<string, unknown>): Purchase {
    const props: PurchaseProps = {
      id: item.id as string,
      supplierId: item.supplierId as string,
      supplierName: item.supplierName as string,
      supplierNit: item.supplierNit as string | undefined,
      buyerNit: item.buyerNit as string | undefined,
      items: item.items as PurchaseItem[],
      total: item.total as number,
      status: item.status as PurchaseStatus,
      notes: item.notes as string | undefined,
      createdAt: item.createdAt as string,
      receivedAt: item.receivedAt as string | undefined,
      receivedItems: item.receivedItems as ReceivedItem[] | undefined,
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
