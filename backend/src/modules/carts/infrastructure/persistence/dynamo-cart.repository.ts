import {
  DeleteCommand,
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
  BatchWriteCommand,
} from '@aws-sdk/lib-dynamodb';
import { Cart } from '@modules/carts/domain/entities/cart.entity';
import { CartItem } from '@modules/carts/domain/entities/cart-item.entity';
import { CartRepository } from '@modules/carts/domain/repositories/cart.repository';
import { KEY_PREFIXES } from '@shared/infrastructure/dynamodb/single-table.constants';
import { CartMapper } from './cart.mapper';

export class DynamoCartRepository implements CartRepository {
  constructor(
    private readonly client: DynamoDBDocumentClient,
    private readonly tableName: string,
  ) {}

  async getByUserId(userId: string): Promise<Cart> {
    const result = await this.client.send(
      new QueryCommand({
        TableName: this.tableName,
        KeyConditionExpression: 'PK = :pk AND begins_with(SK, :skPrefix)',
        ExpressionAttributeValues: {
          ':pk': `${KEY_PREFIXES.USER}${userId}`,
          ':skPrefix': KEY_PREFIXES.CART,
        },
      }),
    );

    const items = (result.Items ?? []).map((it) => CartMapper.toDomain(it));
    return new Cart(userId, items);
  }

  async upsertItem(userId: string, item: CartItem): Promise<void> {
    await this.client.send(
      new PutCommand({
        TableName: this.tableName,
        Item: CartMapper.toItem(userId, item),
      }),
    );
  }

  async removeItem(userId: string, productId: string): Promise<void> {
    await this.client.send(
      new DeleteCommand({
        TableName: this.tableName,
        Key: {
          PK: `${KEY_PREFIXES.USER}${userId}`,
          SK: `${KEY_PREFIXES.CART}${KEY_PREFIXES.PRODUCT}${productId}`,
        },
      }),
    );
  }

  async clear(userId: string): Promise<void> {
    const items = await this.getByUserId(userId);
    if (items.isEmpty()) return;

    const requests = items.getItems().map((item) => ({
      DeleteRequest: {
        Key: {
          PK: `${KEY_PREFIXES.USER}${userId}`,
          SK: `${KEY_PREFIXES.CART}${KEY_PREFIXES.PRODUCT}${item.productId}`,
        },
      },
    }));

    const chunks: (typeof requests)[] = [];
    for (let i = 0; i < requests.length; i += 25) {
      chunks.push(requests.slice(i, i + 25));
    }

    for (const chunk of chunks) {
      await this.client.send(
        new BatchWriteCommand({
          RequestItems: { [this.tableName]: chunk },
        }),
      );
    }
  }
}
