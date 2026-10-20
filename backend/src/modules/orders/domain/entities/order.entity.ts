import { OrderItem } from './order-item.entity';
import { OrderStatus, ORDER_STATUS } from '../value-objects/order-status.vo';
import { ShippingAddress } from '../value-objects/shipping-address.vo';

export interface PaymentMethodInfo {
  cardType: 'visa' | 'mastercard' | 'amex' | 'other';
  last4: string;
  cardholderName: string;
  expiryMonth: string;
  expiryYear: string;
}

export interface OrderProps {
  id: string;
  userId: string;
  userEmail?: string;
  items: OrderItem[];
  status: OrderStatus;
  shippingAddress: ShippingAddress;
  createdAt: string;
  discountCode?: string;
  discountAmount?: number;
  paymentMethod?: PaymentMethodInfo;
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
  get userEmail(): string | undefined {
    return this.props.userEmail;
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
    return Math.max(0, this.subtotal - (this.props.discountAmount ?? 0));
  }

  get discountCode(): string | undefined {
    return this.props.discountCode;
  }

  get discountAmount(): number | undefined {
    return this.props.discountAmount;
  }

  get paymentMethod(): PaymentMethodInfo | undefined {
    return this.props.paymentMethod;
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
      userEmail: this.props.userEmail,
      items: this.props.items.map((i) => i.toJSON()),
      subtotal: this.subtotal,
      discountCode: this.props.discountCode,
      discountAmount: this.props.discountAmount,
      total: this.total,
      totalQuantity: this.totalQuantity,
      status: this.props.status,
      shippingAddress: this.props.shippingAddress,
      paymentMethod: this.props.paymentMethod,
      createdAt: this.props.createdAt,
    };
  }
}
