import { Order } from '../entities/order.entity';
import { CartItem } from '@modules/carts/domain/entities/cart-item.entity';
import { PaginatedResult, PaginationParams } from '@shared/domain/value-objects/pagination.vo';

export interface CheckoutTransaction {
  order: Order;
  cartItems: CartItem[];
}

export interface OrderRepository {
  executeCheckout(input: CheckoutTransaction): Promise<void>;

  listByUserId(userId: string, params: PaginationParams): Promise<PaginatedResult<Order>>;

  findByIdForUser(orderId: string, userId: string): Promise<Order | null>;
}
