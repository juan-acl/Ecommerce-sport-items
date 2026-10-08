export type Role = string;

export interface ModulePermission {
  module: string;
  actions: string[];
}

export interface RoleEntity {
  id: string;
  name: string;
  description: string;
  permissions: ModulePermission[];
  isSystem: boolean;
  createdAt: string;
}
export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'cancelled';
export type ProductCategory =
  | 'running'
  | 'football'
  | 'basketball'
  | 'tennis'
  | 'swimming'
  | 'cycling'
  | 'fitness'
  | 'other';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  createdAt: string;
  isActive?: boolean;
  deletedAt?: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  minStock: number;
  description: string;
  imageUrl: string;
  createdAt: string;
}

export interface Client {
  id: string;
  email: string;
  name: string;
  phone?: string;
  createdAt: string;
}

export interface Order {
  id: string;
  userId: string;
  userEmail?: string;
  items: OrderItem[];
  subtotal: number;
  total: number;
  totalQuantity: number;
  status: OrderStatus;
  shippingAddress: ShippingAddress;
  createdAt: string;
}

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
