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

export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'cancelled';

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
}

export interface CheckoutPayload {
  shippingAddress?: ShippingAddress;
}
