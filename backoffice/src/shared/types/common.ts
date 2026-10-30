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

export interface PaymentMethodInfo {
  cardType: 'visa' | 'mastercard' | 'amex' | 'other';
  last4: string;
  cardholderName?: string;
  expiryMonth: string;
  expiryYear: string;
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
  paymentMethod?: PaymentMethodInfo;
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
  needsApproval?: boolean;
  approvedBy?: string;
  approvalReason?: string;
  targetClientId?: string | null;
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

export interface PurchasesReport {
  totalPurchases: number;
  totalCost: number;
  averagePurchaseCost: number;
  purchasesByStatus: { pending: number; partial: number; received: number; cancelled: number };
  topSuppliers: Array<{ supplierId: string; supplierName: string; totalPurchases: number; totalSpent: number }>;
}

export interface ClientAnalyticsReport {
  totalClients: number;
  newClients: number;
  topClients: Array<{ clientId: string; clientName: string; orderCount: number; totalSpent: number }>;
}

export interface ProductReportEntry {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  minStock: number;
}

export type StockStatus = 'out_of_stock' | 'low_stock' | 'in_stock';

export interface ProductsReport {
  products: ProductReportEntry[];
  total: number;
  page: number;
  pageSize: number;
}
