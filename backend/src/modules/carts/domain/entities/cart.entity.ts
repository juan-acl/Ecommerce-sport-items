import { CartItem } from './cart-item.entity';

export class Cart {
  constructor(
    public readonly userId: string,
    private readonly items: CartItem[],
  ) {}

  get itemCount(): number {
    return this.items.length;
  }

  get totalQuantity(): number {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  get total(): number {
    return this.items.reduce((sum, item) => sum + item.subtotal, 0);
  }

  getItems(): CartItem[] {
    return [...this.items];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  toJSON() {
    return {
      userId: this.userId,
      items: this.items.map((i) => i.toJSON()),
      itemCount: this.itemCount,
      totalQuantity: this.totalQuantity,
      total: this.total,
    };
  }
}
