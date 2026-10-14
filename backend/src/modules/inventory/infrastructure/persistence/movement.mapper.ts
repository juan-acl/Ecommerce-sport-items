import { InventoryMovement, InventoryMovementProps, MovementType } from '@modules/inventory/domain/entities/inventory-movement.entity';

export class MovementMapper {
  static toDomain(item: Record<string, unknown>): InventoryMovement {
    const props: InventoryMovementProps = {
      id: item.id as string,
      productId: item.productId as string,
      productName: item.productName as string,
      type: item.type as MovementType,
      quantity: item.quantity as number,
      referenceId: item.referenceId as string | undefined,
      note: item.note as string | undefined,
      createdAt: item.createdAt as string,
      createdBy: item.createdBy as string,
    };
    return new InventoryMovement(props);
  }

  static toItem(movement: InventoryMovement): Record<string, unknown> {
    return {
      PK: `MOVEMENT#${movement.id}`,
      SK: 'METADATA',
      GSI1PK: 'MOVEMENT',
      GSI1SK: movement.id,
      GSI2PK: `PRODUCT#${movement.productId}`,
      GSI2SK: `MOVEMENT#${movement.id}`,
      ...movement.toJSON(),
    };
  }
}
