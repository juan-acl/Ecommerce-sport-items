import { Order } from '../entities/order.entity';
import { CartItem } from '@modules/carts/domain/entities/cart-item.entity';
import { PaginatedResult, PaginationParams } from '@shared/domain/value-objects/pagination.vo';
import { OrderStatus } from '../value-objects/order-status.vo';

export interface CheckoutTransaction {
  order: Order;
  cartItems: CartItem[];
}

export interface OrderRepository {
  executeCheckout(input: CheckoutTransaction): Promise<void>;

  listByUserId(userId: string, params: PaginationParams): Promise<PaginatedResult<Order>>;

  findByIdForUser(orderId: string, userId: string): Promise<Order | null>;

  findById(orderId: string): Promise<Order | null>;

  listAll(params: PaginationParams): Promise<PaginatedResult<Order>>;

  updateStatus(orderId: string, status: OrderStatus): Promise<void>;
}
