import { DynamoDBDocumentClient, GetCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { Product } from '@modules/products/domain/entities/product.entity';
import {
  ListProductsParams,
  ProductRepository,
} from '@modules/products/domain/repositories/product.repository';
import { PaginatedResult } from '@shared/domain/value-objects/pagination.vo';
import {
  KEY_PREFIXES,
  SK_VALUES,
  TABLE,
} from '@shared/infrastructure/dynamodb/single-table.constants';
import { ProductMapper } from './product.mapper';

export class DynamoProductRepository implements ProductRepository {
  constructor(
    private readonly client: DynamoDBDocumentClient,
    private readonly tableName: string,
  ) {}

  async list(params: ListProductsParams): Promise<PaginatedResult<Product>> {
    const { limit, cursor, category } = params;

    const exclusiveStartKey = cursor ? this.decodeCursor(cursor) : undefined;

    const queryParams = category
      ? this.buildCategoryQuery(category, limit, exclusiveStartKey)
      : this.buildAllProductsQuery(limit, exclusiveStartKey);

    const result = await this.client.send(new QueryCommand(queryParams));

    const products = (result.Items ?? []).map((item) => ProductMapper.toDomain(item));
    const nextCursor = result.LastEvaluatedKey
      ? this.encodeCursor(result.LastEvaluatedKey)
      : undefined;

    return {
      items: products,
      count: products.length,
      nextCursor,
    };
  }

  async findById(id: string): Promise<Product | null> {
    const result = await this.client.send(
      new GetCommand({
        TableName: this.tableName,
        Key: {
          PK: `${KEY_PREFIXES.PRODUCT}${id}`,
          SK: SK_VALUES.METADATA,
        },
      }),
    );

    if (!result.Item) return null;
    return ProductMapper.toDomain(result.Item);
  }

  private buildAllProductsQuery(limit: number, exclusiveStartKey?: Record<string, unknown>) {
    return {
      TableName: this.tableName,
      IndexName: TABLE.GSI1,
      KeyConditionExpression: 'GSI1PK = :pk',
      ExpressionAttributeValues: { ':pk': 'PRODUCT' },
      Limit: limit,
      ExclusiveStartKey: exclusiveStartKey,
    };
  }

  private buildCategoryQuery(
    category: string,
    limit: number,
    exclusiveStartKey?: Record<string, unknown>,
  ) {
    return {
      TableName: this.tableName,
      IndexName: TABLE.GSI2,
      KeyConditionExpression: 'GSI2PK = :pk',
      ExpressionAttributeValues: { ':pk': `${KEY_PREFIXES.CATEGORY}${category}` },
      Limit: limit,
      ExclusiveStartKey: exclusiveStartKey,
    };
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
