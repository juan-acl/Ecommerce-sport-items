export type PurchaseStatus = 'pending' | 'received' | 'cancelled';

export interface PurchaseItem {
  productId: string;
  productName: string;
  quantity: number;
  unitCost: number;
  subtotal: number;
}

export interface PurchaseProps {
  id: string;
  supplierId: string;
  supplierName: string;
  items: PurchaseItem[];
  total: number;
  status: PurchaseStatus;
  notes?: string;
  createdAt: string;
  receivedAt?: string;
}

export class Purchase {
  constructor(private readonly props: PurchaseProps) {}

  get id(): string { return this.props.id; }
  get supplierId(): string { return this.props.supplierId; }
  get supplierName(): string { return this.props.supplierName; }
  get items(): PurchaseItem[] { return this.props.items; }
  get total(): number { return this.props.total; }
  get status(): PurchaseStatus { return this.props.status; }
  get notes(): string | undefined { return this.props.notes; }
  get createdAt(): string { return this.props.createdAt; }
  get receivedAt(): string | undefined { return this.props.receivedAt; }

  get canBeReceived(): boolean { return this.props.status === 'pending'; }
  get canBeCancelled(): boolean { return this.props.status === 'pending'; }

  receive(): Purchase {
    return new Purchase({ ...this.props, status: 'received', receivedAt: new Date().toISOString() });
  }

  cancel(): Purchase {
    return new Purchase({ ...this.props, status: 'cancelled' });
  }

  toJSON(): PurchaseProps {
    return { ...this.props, items: [...this.props.items] };
  }
}
