export type MovementType = 'purchase' | 'sale' | 'adjustment' | 'return';

export interface InventoryMovementProps {
  id: string;
  productId: string;
  productName: string;
  type: MovementType;
  quantity: number;
  referenceId?: string;
  note?: string;
  createdAt: string;
  createdBy: string;
}

export class InventoryMovement {
  constructor(private readonly props: InventoryMovementProps) {}

  get id(): string { return this.props.id; }
  get productId(): string { return this.props.productId; }
  get productName(): string { return this.props.productName; }
  get type(): MovementType { return this.props.type; }
  get quantity(): number { return this.props.quantity; }
  get referenceId(): string | undefined { return this.props.referenceId; }
  get note(): string | undefined { return this.props.note; }
  get createdAt(): string { return this.props.createdAt; }
  get createdBy(): string { return this.props.createdBy; }

  toJSON(): InventoryMovementProps {
    return { ...this.props };
  }
}
