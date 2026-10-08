import { Order, OrderProps } from '@modules/orders/domain/entities/order.entity';
import { OrderItem } from '@modules/orders/domain/entities/order-item.entity';
import { OrderStatus } from '@modules/orders/domain/value-objects/order-status.vo';
import { ShippingAddress } from '@modules/orders/domain/value-objects/shipping-address.vo';

export class OrderMapper {
  static toItem(order: Order) {
    return {
      PK: `ORDER#${order.id}`,
      SK: 'METADATA',
      GSI1PK: 'ORDER',
      GSI1SK: `${order.createdAt}#${order.id}`,
      GSI2PK: `USER#${order.userId}`,
      GSI2SK: `ORDER#${order.createdAt}#${order.id}`,
      id: order.id,
      userId: order.userId,
      items: order.items.map((i) => i.toJSON()),
      subtotal: order.subtotal,
      total: order.total,
      status: order.status,
      shippingAddress: order.shippingAddress,
      createdAt: order.createdAt,
    };
  }

  static toDomain(item: Record<string, unknown>): Order {
    const rawItems = item.items as Array<{
      productId: string;
      productName: string;
      unitPrice: number;
      quantity: number;
      imageUrl: string;
    }>;

    const orderItems = rawItems.map(
      (i) =>
        new OrderItem({
          productId: i.productId,
          productName: i.productName,
          unitPrice: i.unitPrice,
          quantity: i.quantity,
          imageUrl: i.imageUrl,
        }),
    );

    const props: OrderProps = {
      id: item.id as string,
      userId: item.userId as string,
      items: orderItems,
      status: item.status as OrderStatus,
      shippingAddress: item.shippingAddress as ShippingAddress,
      createdAt: item.createdAt as string,
    };

    return new Order(props);
  }
}
