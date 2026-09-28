export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  description: string;
  imageUrl: string;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  imageUrl: string;
  subtotal: number;
  addedAt: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  total: number;
  totalQuantity: number;
  status: 'pending' | 'paid' | 'shipped' | 'cancelled';
  shippingAddress: ShippingAddress;
  createdAt: string;
}

export interface ShippingAddress {
  street: string;
  city: string;
  country: string;
  postalCode: string;
}
