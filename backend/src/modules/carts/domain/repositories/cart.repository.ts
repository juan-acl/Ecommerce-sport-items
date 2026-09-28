import { Cart } from '../entities/cart.entity';
import { CartItem } from '../entities/cart-item.entity';

export interface CartRepository {
  getByUserId(userId: string): Promise<Cart>;
  upsertItem(userId: string, item: CartItem): Promise<void>;
  removeItem(userId: string, productId: string): Promise<void>;
  clear(userId: string): Promise<void>;
}
