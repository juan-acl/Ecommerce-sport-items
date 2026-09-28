import { CartItem, CartItemProps } from '@modules/carts/domain/entities/cart-item.entity';
import { KEY_PREFIXES } from '@shared/infrastructure/dynamodb/single-table.constants';

export class CartMapper {
  static toItem(userId: string, cartItem: CartItem) {
    return {
      PK: `${KEY_PREFIXES.USER}${userId}`,
      SK: `${KEY_PREFIXES.CART}${KEY_PREFIXES.PRODUCT}${cartItem.productId}`,
      productId: cartItem.productId,
      productName: cartItem.productName,
      unitPrice: cartItem.unitPrice,
      quantity: cartItem.quantity,
      imageUrl: cartItem.imageUrl,
      addedAt: cartItem.addedAt,
    };
  }

  static toDomain(item: Record<string, unknown>): CartItem {
    const props: CartItemProps = {
      productId: item.productId as string,
      productName: item.productName as string,
      unitPrice: item.unitPrice as number,
      quantity: item.quantity as number,
      imageUrl: item.imageUrl as string,
      addedAt: item.addedAt as string,
    };
    return new CartItem(props);
  }
}
