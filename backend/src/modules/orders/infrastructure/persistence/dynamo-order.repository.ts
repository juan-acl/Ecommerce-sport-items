import { DynamoDBDocumentClient, QueryCommand, TransactWriteCommand } from '@aws-sdk/lib-dynamodb';
import { TransactionCanceledException } from '@aws-sdk/client-dynamodb';
import { Order } from '@modules/orders/domain/entities/order.entity';
import {
  CheckoutTransaction,
  OrderRepository,
} from '@modules/orders/domain/repositories/order.repository';
import { InsufficientStockException } from '@modules/products/domain/exceptions/insufficient-stock.exception';
import { PaginatedResult, PaginationParams } from '@shared/domain/value-objects/pagination.vo';
import { KEY_PREFIXES, SK_VALUES } from '@shared/infrastructure/dynamodb/single-table.constants';
import { OrderMapper } from './order.mapper';
import { logger } from '@/shared/infrastructure/logging/winston.logger';

export class DynamoOrderRepository implements OrderRepository {
  constructor(
    private readonly client: DynamoDBDocumentClient,
    private readonly tableName: string,
  ) {}

  async executeCheckout(input: CheckoutTransaction): Promise<void> {
    logger.info('Ejecutando transacción de checkout', { input });
    const { order, cartItems } = input;

    const transactItems: Parameters<typeof this.client.send>[0] extends never ? never : object[] =
      [];

    // 1. Update de stock por cada producto (con condición)
    for (const item of cartItems) {
      transactItems.push({
        Update: {
          TableName: this.tableName,
          Key: {
            PK: `${KEY_PREFIXES.PRODUCT}${item.productId}`,
            SK: SK_VALUES.METADATA,
          },
          UpdateExpression: 'SET stock = stock - :qty',
          ConditionExpression: 'stock >= :qty',
          ExpressionAttributeValues: {
            ':qty': item.quantity,
          },
        },
      });
    }

    logger.info('Prepared stock update operations', { transactItems });

    // 2. Put de la orden
    transactItems.push({
      Put: {
        TableName: this.tableName,
        Item: OrderMapper.toItem(order),
      },
    });

    // 3. Delete de cada item del carrito
    for (const item of cartItems) {
      transactItems.push({
        Delete: {
          TableName: this.tableName,
          Key: {
            PK: `${KEY_PREFIXES.USER}${order.userId}`,
            SK: `${KEY_PREFIXES.CART}${KEY_PREFIXES.PRODUCT}${item.productId}`,
          },
        },
      });
    }

    try {
      await this.client.send(
        new TransactWriteCommand({
          TransactItems: transactItems as never,
        }),
      );
      logger.info('Transacción de checkout ejecutada exitosamente', { orderId: order.id });
    } catch (err) {
      if (err instanceof TransactionCanceledException) {
        const reasons = err.CancellationReasons ?? [];
        for (let i = 0; i < cartItems.length; i++) {
          if (reasons[i]?.Code === 'ConditionalCheckFailed') {
            logger.error('Error ejecutando transacción de checkout', cartItems[i]);
            const failed = cartItems[i];
            throw new InsufficientStockException(failed.productName);
          }
        }
      }
      throw err;
    }
  }

  async listByUserId(userId: string, params: PaginationParams): Promise<PaginatedResult<Order>> {
    const { limit, cursor } = params;
    const exclusiveStartKey = cursor ? this.decodeCursor(cursor) : undefined;

    const result = await this.client.send(
      new QueryCommand({
        TableName: this.tableName,
        KeyConditionExpression: 'PK = :pk AND begins_with(SK, :skPrefix)',
        ExpressionAttributeValues: {
          ':pk': `${KEY_PREFIXES.USER}${userId}`,
          ':skPrefix': KEY_PREFIXES.ORDER,
        },
        Limit: limit,
        ScanIndexForward: false, // lo ordenamos de forma descendente
        ExclusiveStartKey: exclusiveStartKey,
      }),
    );

    const orders = (result.Items ?? []).map((it) => OrderMapper.toDomain(it));
    const nextCursor = result.LastEvaluatedKey
      ? this.encodeCursor(result.LastEvaluatedKey)
      : undefined;

    return {
      items: orders,
      count: orders.length,
      nextCursor,
    };
  }

  async findByIdForUser(orderId: string, userId: string): Promise<Order | null> {
    const result = await this.client.send(
      new QueryCommand({
        TableName: this.tableName,
        KeyConditionExpression: 'PK = :pk AND begins_with(SK, :skPrefix)',
        FilterExpression: 'id = :orderId',
        ExpressionAttributeValues: {
          ':pk': `${KEY_PREFIXES.USER}${userId}`,
          ':skPrefix': KEY_PREFIXES.ORDER,
          ':orderId': orderId,
        },
        // Limit: 1,
      }),
    );

    if (!result.Items || result.Items.length === 0) return null;
    return OrderMapper.toDomain(result.Items[0]);
  }

  private encodeCursor(key: Record<string, unknown>): string {
    return Buffer.from(JSON.stringify(key)).toString('base64url');
  }

  private decodeCursor(cursor: string): Record<string, unknown> {
    try {
      return JSON.parse(Buffer.from(cursor, 'base64url').toString('utf-8'));
    } catch {
      throw new Error('Cursor de paginación inválido');
    }
  }
}
