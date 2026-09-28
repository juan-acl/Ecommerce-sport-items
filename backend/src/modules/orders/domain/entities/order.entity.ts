import { OrderItem } from './order-item.entity';
import { OrderStatus, ORDER_STATUS } from '../value-objects/order-status.vo';
import { ShippingAddress } from '../value-objects/shipping-address.vo';

export interface OrderProps {
  id: string;
  userId: string;
  items: OrderItem[];
  status: OrderStatus;
  shippingAddress: ShippingAddress;
  createdAt: string;
}

export class Order {
  constructor(private readonly props: OrderProps) {
    if (props.items.length === 0) {
      throw new Error('Una orden debe tener al menos un item');
    }
  }

  get id(): string {
    return this.props.id;
  }
  get userId(): string {
    return this.props.userId;
  }
  get items(): OrderItem[] {
    return [...this.props.items];
  }
  get status(): OrderStatus {
    return this.props.status;
  }
  get shippingAddress(): ShippingAddress {
    return { ...this.props.shippingAddress };
  }
  get createdAt(): string {
    return this.props.createdAt;
  }

  get subtotal(): number {
    return this.props.items.reduce((sum, i) => sum + i.subtotal, 0);
  }

  get total(): number {
    return this.subtotal;
  }

  get totalQuantity(): number {
    return this.props.items.reduce((sum, i) => sum + i.quantity, 0);
  }

  static createPaid(props: Omit<OrderProps, 'status'>): Order {
    return new Order({ ...props, status: ORDER_STATUS.PAID });
  }

  toJSON() {
    return {
      id: this.props.id,
      userId: this.props.userId,
      items: this.props.items.map((i) => i.toJSON()),
      subtotal: this.subtotal,
      total: this.total,
      totalQuantity: this.totalQuantity,
      status: this.props.status,
      shippingAddress: this.props.shippingAddress,
      createdAt: this.props.createdAt,
    };
  }
}
