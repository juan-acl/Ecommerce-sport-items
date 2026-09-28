export interface OrderItemProps {
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  imageUrl: string;
}

export class OrderItem {
  constructor(private readonly props: OrderItemProps) {
    if (props.quantity < 1) throw new Error('La cantidad debe ser al menos 1');
    if (props.unitPrice < 0) throw new Error('El precio no puede ser negativo');
  }

  get productId(): string {
    return this.props.productId;
  }
  get productName(): string {
    return this.props.productName;
  }
  get unitPrice(): number {
    return this.props.unitPrice;
  }
  get quantity(): number {
    return this.props.quantity;
  }
  get imageUrl(): string {
    return this.props.imageUrl;
  }

  get subtotal(): number {
    return this.props.unitPrice * this.props.quantity;
  }

  toJSON(): OrderItemProps & { subtotal: number } {
    return { ...this.props, subtotal: this.subtotal };
  }
}
