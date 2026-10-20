export type PurchaseStatus = 'pending' | 'partial' | 'received' | 'cancelled';

export interface PurchaseItem {
  productId: string;
  productName: string;
  quantity: number;
  unitCost: number;
  subtotal: number;
}

export interface ReceivedItem {
  productId: string;
  receivedQuantity: number;
}

export interface PurchaseProps {
  id: string;
  supplierId: string;
  supplierName: string;
  supplierNit?: string;
  buyerNit?: string;
  items: PurchaseItem[];
  total: number;
  status: PurchaseStatus;
  notes?: string;
  createdAt: string;
  receivedAt?: string;
  receivedItems?: ReceivedItem[];
}

export class Purchase {
  constructor(private readonly props: PurchaseProps) {}

  get id(): string { return this.props.id; }
  get supplierId(): string { return this.props.supplierId; }
  get supplierName(): string { return this.props.supplierName; }
  get supplierNit(): string | undefined { return this.props.supplierNit; }
  get buyerNit(): string | undefined { return this.props.buyerNit; }
  get items(): PurchaseItem[] { return this.props.items; }
  get total(): number { return this.props.total; }
  get status(): PurchaseStatus { return this.props.status; }
  get notes(): string | undefined { return this.props.notes; }
  get createdAt(): string { return this.props.createdAt; }
  get receivedAt(): string | undefined { return this.props.receivedAt; }
  get receivedItems(): ReceivedItem[] { return this.props.receivedItems ?? []; }

  get canBeReceived(): boolean {
    return this.props.status === 'pending' || this.props.status === 'partial';
  }
  get canBeCancelled(): boolean {
    return this.props.status === 'pending' || this.props.status === 'partial';
  }
  get wasReceived(): boolean { return this.props.status === 'received'; }

  getReceivedQty(productId: string): number {
    return this.receivedItems.find((r) => r.productId === productId)?.receivedQuantity ?? 0;
  }

  getRemainingQty(productId: string): number {
    const item = this.items.find((i) => i.productId === productId);
    if (!item) return 0;
    return item.quantity - this.getReceivedQty(productId);
  }

  receive(): Purchase {
    return new Purchase({ ...this.props, status: 'received', receivedAt: new Date().toISOString() });
  }

  partialReceive(newlyReceived: ReceivedItem[]): Purchase {
    const merged: ReceivedItem[] = this.receivedItems.map((r) => ({ ...r }));

    for (const nr of newlyReceived) {
      const existing = merged.find((r) => r.productId === nr.productId);
      if (existing) {
        existing.receivedQuantity += nr.receivedQuantity;
      } else {
        merged.push({ ...nr });
      }
    }

    const allReceived = this.props.items.every((item) => {
      const received = merged.find((r) => r.productId === item.productId)?.receivedQuantity ?? 0;
      return received >= item.quantity;
    });

    const newStatus: PurchaseStatus = allReceived ? 'received' : 'partial';

    return new Purchase({
      ...this.props,
      status: newStatus,
      receivedItems: merged,
      receivedAt: allReceived ? new Date().toISOString() : this.props.receivedAt,
    });
  }

  cancel(): Purchase {
    return new Purchase({ ...this.props, status: 'cancelled' });
  }

  toJSON(): PurchaseProps {
    return {
      ...this.props,
      items: [...this.props.items],
      receivedItems: this.props.receivedItems ? [...this.props.receivedItems] : undefined,
    };
  }
}
