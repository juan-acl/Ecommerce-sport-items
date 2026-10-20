import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
} from '@aws-sdk/lib-dynamodb';
import { AuditLogEntity } from '@modules/audit/domain/entities/audit-log.entity';
import { AuditLogRepository } from '@modules/audit/domain/repositories/audit-log.repository';
import { PaginatedResult, PaginationParams } from '@shared/domain/value-objects/pagination.vo';
import { TABLE } from '@shared/infrastructure/dynamodb/single-table.constants';
import { AuditLogMapper } from './audit-log.mapper';

export class DynamoAuditLogRepository implements AuditLogRepository {
  constructor(
    private readonly client: DynamoDBDocumentClient,
    private readonly tableName: string,
  ) {}

  async save(log: AuditLogEntity): Promise<void> {
    await this.client.send(
      new PutCommand({
        TableName: this.tableName,
        Item: AuditLogMapper.toItem(log),
        ConditionExpression: 'attribute_not_exists(PK)',
      }),
    );
  }

  async listAll(params: PaginationParams): Promise<PaginatedResult<AuditLogEntity>> {
    const exclusiveStartKey = params.cursor ? this.decodeCursor(params.cursor) : undefined;

    const result = await this.client.send(
      new QueryCommand({
        TableName: this.tableName,
        IndexName: TABLE.GSI1,
        KeyConditionExpression: 'GSI1PK = :pk',
        ExpressionAttributeValues: { ':pk': 'AUDIT' },
        Limit: params.limit,
        ScanIndexForward: false,
        ExclusiveStartKey: exclusiveStartKey,
      }),
    );

    const logs = (result.Items ?? []).map((item) => AuditLogMapper.toDomain(item));
    const nextCursor = result.LastEvaluatedKey
      ? this.encodeCursor(result.LastEvaluatedKey)
      : undefined;

    return { items: logs, count: logs.length, nextCursor };
  }

  async listByEntity(entityType: string, entityId: string): Promise<AuditLogEntity[]> {
    const result = await this.client.send(
      new QueryCommand({
        TableName: this.tableName,
        IndexName: TABLE.GSI2,
        KeyConditionExpression: 'GSI2PK = :pk',
        ExpressionAttributeValues: {
          ':pk': `AUDIT_ENTITY#${entityType}#${entityId}`,
        },
        ScanIndexForward: false,
      }),
    );

    return (result.Items ?? []).map((item) => AuditLogMapper.toDomain(item));
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
