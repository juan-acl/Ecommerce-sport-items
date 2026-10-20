import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { Discount } from '@modules/discounts/domain/entities/discount.entity';
import { DiscountRepository } from '@modules/discounts/domain/repositories/discount.repository';
import { PaginatedResult, PaginationParams } from '@shared/domain/value-objects/pagination.vo';
import { TABLE } from '@shared/infrastructure/dynamodb/single-table.constants';
import { DiscountMapper } from './discount.mapper';

export class DynamoDiscountRepository implements DiscountRepository {
  constructor(
    private readonly client: DynamoDBDocumentClient,
    private readonly tableName: string,
  ) {}

  async findByCode(code: string): Promise<Discount | null> {
    const result = await this.client.send(
      new QueryCommand({
        TableName: this.tableName,
        IndexName: TABLE.GSI2,
        KeyConditionExpression: 'GSI2PK = :pk AND GSI2SK = :sk',
        ExpressionAttributeValues: {
          ':pk': `DISCOUNT_CODE#${code}`,
          ':sk': 'METADATA',
        },
        Limit: 1,
      }),
    );
    if (!result.Items || result.Items.length === 0) return null;
    return DiscountMapper.toDomain(result.Items[0]);
  }

  async findById(id: string): Promise<Discount | null> {
    const result = await this.client.send(
      new GetCommand({
        TableName: this.tableName,
        Key: { PK: `DISCOUNT#${id}`, SK: 'METADATA' },
      }),
    );
    if (!result.Item) return null;
    return DiscountMapper.toDomain(result.Item);
  }

  async save(discount: Discount): Promise<void> {
    await this.client.send(
      new PutCommand({
        TableName: this.tableName,
        Item: DiscountMapper.toItem(discount),
        ConditionExpression: 'attribute_not_exists(PK)',
      }),
    );
  }

  async listAll(params: PaginationParams): Promise<PaginatedResult<Discount>> {
    const exclusiveStartKey = params.cursor ? this.decodeCursor(params.cursor) : undefined;

    const result = await this.client.send(
      new QueryCommand({
        TableName: this.tableName,
        IndexName: TABLE.GSI1,
        KeyConditionExpression: 'GSI1PK = :pk',
        ExpressionAttributeValues: { ':pk': 'DISCOUNT' },
        Limit: params.limit,
        ScanIndexForward: false,
        ExclusiveStartKey: exclusiveStartKey,
      }),
    );

    const discounts = (result.Items ?? []).map((item) => DiscountMapper.toDomain(item));
    const nextCursor = result.LastEvaluatedKey
      ? this.encodeCursor(result.LastEvaluatedKey)
      : undefined;

    return { items: discounts, count: discounts.length, nextCursor };
  }

  async incrementUsedCount(id: string): Promise<void> {
    await this.client.send(
      new UpdateCommand({
        TableName: this.tableName,
        Key: { PK: `DISCOUNT#${id}`, SK: 'METADATA' },
        UpdateExpression: 'SET usedCount = usedCount + :inc',
        ExpressionAttributeValues: { ':inc': 1 },
        ConditionExpression: 'attribute_exists(PK)',
      }),
    );
  }

  async setActive(id: string, isActive: boolean): Promise<void> {
    await this.client.send(
      new UpdateCommand({
        TableName: this.tableName,
        Key: { PK: `DISCOUNT#${id}`, SK: 'METADATA' },
        UpdateExpression: 'SET isActive = :isActive',
        ExpressionAttributeValues: { ':isActive': isActive },
        ConditionExpression: 'attribute_exists(PK)',
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
