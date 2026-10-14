import {
  DynamoDBDocumentClient,
  DeleteCommand,
  GetCommand,
  PutCommand,
  QueryCommand,
} from '@aws-sdk/lib-dynamodb';
import { Supplier } from '@modules/suppliers/domain/entities/supplier.entity';
import {
  ListSuppliersParams,
  SupplierRepository,
} from '@modules/suppliers/domain/repositories/supplier.repository';
import { PaginatedResult } from '@shared/domain/value-objects/pagination.vo';
import { TABLE } from '@shared/infrastructure/dynamodb/single-table.constants';
import { SupplierMapper } from './supplier.mapper';

export class DynamoSupplierRepository implements SupplierRepository {
  constructor(
    private readonly client: DynamoDBDocumentClient,
    private readonly tableName: string,
  ) {}

  async list(params: ListSuppliersParams): Promise<PaginatedResult<Supplier>> {
    const exclusiveStartKey = params.cursor ? this.decodeCursor(params.cursor) : undefined;

    const result = await this.client.send(
      new QueryCommand({
        TableName: this.tableName,
        IndexName: TABLE.GSI1,
        KeyConditionExpression: 'GSI1PK = :pk',
        ExpressionAttributeValues: { ':pk': 'SUPPLIER' },
        Limit: params.limit,
        ExclusiveStartKey: exclusiveStartKey,
      }),
    );

    const suppliers = (result.Items ?? []).map((item) => SupplierMapper.toDomain(item));
    const nextCursor = result.LastEvaluatedKey
      ? this.encodeCursor(result.LastEvaluatedKey)
      : undefined;

    return { items: suppliers, count: suppliers.length, nextCursor };
  }

  async findById(id: string): Promise<Supplier | null> {
    const result = await this.client.send(
      new GetCommand({
        TableName: this.tableName,
        Key: { PK: `SUPPLIER#${id}`, SK: 'METADATA' },
      }),
    );
    if (!result.Item) return null;
    return SupplierMapper.toDomain(result.Item);
  }

  async findByEmail(email: string): Promise<Supplier | null> {
    const result = await this.client.send(
      new QueryCommand({
        TableName: this.tableName,
        IndexName: TABLE.GSI2,
        KeyConditionExpression: 'GSI2PK = :pk',
        ExpressionAttributeValues: { ':pk': `EMAIL#${email}` },
        Limit: 1,
      }),
    );
    const item = result.Items?.[0];
    if (!item) return null;
    return SupplierMapper.toDomain(item);
  }

  async save(supplier: Supplier): Promise<void> {
    await this.client.send(
      new PutCommand({
        TableName: this.tableName,
        Item: SupplierMapper.toItem(supplier),
        ConditionExpression: 'attribute_not_exists(PK)',
      }),
    );
  }

  async update(supplier: Supplier): Promise<void> {
    await this.client.send(
      new PutCommand({
        TableName: this.tableName,
        Item: SupplierMapper.toItem(supplier),
      }),
    );
  }

  async delete(id: string): Promise<void> {
    await this.client.send(
      new DeleteCommand({
        TableName: this.tableName,
        Key: { PK: `SUPPLIER#${id}`, SK: 'METADATA' },
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
