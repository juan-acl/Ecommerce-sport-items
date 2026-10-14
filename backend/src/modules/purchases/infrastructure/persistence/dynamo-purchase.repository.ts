import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
} from '@aws-sdk/lib-dynamodb';
import { Purchase } from '@modules/purchases/domain/entities/purchase.entity';
import {
  ListPurchasesParams,
  PurchaseRepository,
} from '@modules/purchases/domain/repositories/purchase.repository';
import { PaginatedResult } from '@shared/domain/value-objects/pagination.vo';
import { TABLE } from '@shared/infrastructure/dynamodb/single-table.constants';
import { PurchaseMapper } from './purchase.mapper';

export class DynamoPurchaseRepository implements PurchaseRepository {
  constructor(
    private readonly client: DynamoDBDocumentClient,
    private readonly tableName: string,
  ) {}

  async list(params: ListPurchasesParams): Promise<PaginatedResult<Purchase>> {
    const exclusiveStartKey = params.cursor ? this.decodeCursor(params.cursor) : undefined;

    const queryParams = params.supplierId
      ? {
          TableName: this.tableName,
          IndexName: TABLE.GSI2,
          KeyConditionExpression: 'GSI2PK = :pk',
          ExpressionAttributeValues: { ':pk': `SUPPLIER#${params.supplierId}` },
          Limit: params.limit,
          ExclusiveStartKey: exclusiveStartKey,
          ScanIndexForward: false,
        }
      : {
          TableName: this.tableName,
          IndexName: TABLE.GSI1,
          KeyConditionExpression: 'GSI1PK = :pk',
          ExpressionAttributeValues: { ':pk': 'PURCHASE' },
          Limit: params.limit,
          ExclusiveStartKey: exclusiveStartKey,
          ScanIndexForward: false,
        };

    const result = await this.client.send(new QueryCommand(queryParams));

    const purchases = (result.Items ?? []).map((item) => PurchaseMapper.toDomain(item));
    const nextCursor = result.LastEvaluatedKey
      ? this.encodeCursor(result.LastEvaluatedKey)
      : undefined;

    return { items: purchases, count: purchases.length, nextCursor };
  }

  async findById(id: string): Promise<Purchase | null> {
    const result = await this.client.send(
      new GetCommand({
        TableName: this.tableName,
        Key: { PK: `PURCHASE#${id}`, SK: 'METADATA' },
      }),
    );
    if (!result.Item) return null;
    return PurchaseMapper.toDomain(result.Item);
  }

  async save(purchase: Purchase): Promise<void> {
    await this.client.send(
      new PutCommand({
        TableName: this.tableName,
        Item: PurchaseMapper.toItem(purchase),
        ConditionExpression: 'attribute_not_exists(PK)',
      }),
    );
  }

  async update(purchase: Purchase): Promise<void> {
    await this.client.send(
      new PutCommand({
        TableName: this.tableName,
        Item: PurchaseMapper.toItem(purchase),
      }),
    );
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
