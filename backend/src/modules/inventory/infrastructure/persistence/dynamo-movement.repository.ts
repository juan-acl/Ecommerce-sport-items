import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
} from '@aws-sdk/lib-dynamodb';
import { InventoryMovement } from '@modules/inventory/domain/entities/inventory-movement.entity';
import {
  InventoryMovementRepository,
  ListMovementsParams,
} from '@modules/inventory/domain/repositories/inventory-movement.repository';
import { PaginatedResult } from '@shared/domain/value-objects/pagination.vo';
import { TABLE } from '@shared/infrastructure/dynamodb/single-table.constants';
import { MovementMapper } from './movement.mapper';

export class DynamoMovementRepository implements InventoryMovementRepository {
  constructor(
    private readonly client: DynamoDBDocumentClient,
    private readonly tableName: string,
  ) {}

  async list(params: ListMovementsParams): Promise<PaginatedResult<InventoryMovement>> {
    const exclusiveStartKey = params.cursor ? this.decodeCursor(params.cursor) : undefined;

    const queryParams = params.productId
      ? {
          TableName: this.tableName,
          IndexName: TABLE.GSI2,
          KeyConditionExpression: 'GSI2PK = :pk',
          ExpressionAttributeValues: { ':pk': `PRODUCT#${params.productId}` },
          Limit: params.limit,
          ExclusiveStartKey: exclusiveStartKey,
          ScanIndexForward: false,
        }
      : {
          TableName: this.tableName,
          IndexName: TABLE.GSI1,
          KeyConditionExpression: 'GSI1PK = :pk',
          ExpressionAttributeValues: { ':pk': 'MOVEMENT' },
          Limit: params.limit,
          ExclusiveStartKey: exclusiveStartKey,
          ScanIndexForward: false,
        };

    const result = await this.client.send(new QueryCommand(queryParams));

    const movements = (result.Items ?? []).map((item) => MovementMapper.toDomain(item));
    const nextCursor = result.LastEvaluatedKey
      ? this.encodeCursor(result.LastEvaluatedKey)
      : undefined;

    return { items: movements, count: movements.length, nextCursor };
  }

  async save(movement: InventoryMovement): Promise<void> {
    await this.client.send(
      new PutCommand({
        TableName: this.tableName,
        Item: MovementMapper.toItem(movement),
        ConditionExpression: 'attribute_not_exists(PK)',
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
