export interface OrderItem {
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  imageUrl: string;
  subtotal: number;
}

export interface ShippingAddress {
  street: string;
  city: string;
  country: string;
  postalCode: string;
}

export type OrderStatus = 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  total: number;
  totalQuantity: number;
  status: OrderStatus;
  shippingAddress: ShippingAddress;
  createdAt: string;
  discountCode?: string;
  discountAmount?: number;
  paymentMethod?: PaymentMethodInfo;
}

export interface PaymentMethodInfo {
  cardType: 'visa' | 'mastercard' | 'amex' | 'other';
  last4: string;
  cardholderName: string;
  expiryMonth: string;
  expiryYear: string;
}

export interface CheckoutPayload {
  shippingAddress?: ShippingAddress;
  discountCode?: string;
  paymentMethod?: PaymentMethodInfo;
}
