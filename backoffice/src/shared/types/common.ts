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
export type OrderStatus = 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
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
  discountCode?: string;
  discountAmount?: number;
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

export interface Supplier {
  id: string;
  name: string;
  nit?: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  isActive: boolean;
  createdAt: string;
}

export type PurchaseStatus = 'pending' | 'partial' | 'received' | 'cancelled';

export interface PurchaseItem {
  productId: string;
  productName: string;
  quantity: number;
  unitCost: number;
  subtotal: number;
}

export interface PurchaseReceivedItem {
  productId: string;
  receivedQuantity: number;
}

export interface Purchase {
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
  receivedItems?: PurchaseReceivedItem[];
}

export type MovementType = 'purchase' | 'sale' | 'adjustment' | 'return';

export type DiscountType = 'percentage' | 'fixed';

export interface Discount {
  id: string;
  code: string;
  type: DiscountType;
  value: number;
  minPurchase: number;
  maxUses: number;
  usedCount: number;
  isActive: boolean;
  expiresAt: string | null;
  createdAt: string;
  createdBy: string;
  applicableCategories?: string[];
}

export interface AuditLog {
  id: string;
  userId: string;
  userEmail: string;
  action: string;
  entityType: string;
  entityId: string;
  details: Record<string, unknown>;
  createdAt: string;
}

export interface SalesReport {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  ordersByStatus: { paid: number; cancelled: number; pending: number; shipped: number; pendingApproval: number };
  topProducts: Array<{ productId: string; productName: string; totalQuantity: number; totalRevenue: number }>;
}

export interface InventoryReport {
  totalProducts: number;
  totalStockValue: number;
  lowStockProducts: Array<{ id: string; name: string; stock: number; minStock: number }>;
  recentMovements: Array<{ id: string; productName: string; type: string; quantity: number; createdAt: string }>;
}

export interface InventoryMovement {
  id: string;
  productId: string;
  productName: string;
  type: MovementType;
  quantity: number;
  referenceId?: string;
  note?: string;
  createdAt: string;
  createdBy: string;
}
