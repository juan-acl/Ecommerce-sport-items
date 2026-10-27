import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
} from '@aws-sdk/lib-dynamodb';
import { AuditLogEntity } from '@modules/audit/domain/entities/audit-log.entity';
import { AuditLogRepository, AuditFilterParams } from '@modules/audit/domain/repositories/audit-log.repository';
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

  async listFiltered(
    filters: AuditFilterParams,
    params: PaginationParams,
  ): Promise<PaginatedResult<AuditLogEntity>> {
    const exclusiveStartKey = params.cursor ? this.decodeCursor(params.cursor) : undefined;

    const expressionNames: Record<string, string> = {};
    const expressionValues: Record<string, unknown> = { ':pk': 'AUDIT' };
    const filterParts: string[] = [];

    let keyCondition = 'GSI1PK = :pk';

    if (filters.fromDate && filters.toDate) {
      keyCondition += ' AND GSI1SK BETWEEN :from AND :to';
      expressionValues[':from'] = filters.fromDate;
      expressionValues[':to'] = `${filters.toDate}~`;
    } else if (filters.fromDate) {
      keyCondition += ' AND GSI1SK >= :from';
      expressionValues[':from'] = filters.fromDate;
    } else if (filters.toDate) {
      keyCondition += ' AND GSI1SK <= :to';
      expressionValues[':to'] = `${filters.toDate}~`;
    }

    if (filters.action) {
      expressionNames['#action'] = 'action';
      expressionValues[':action'] = filters.action;
      filterParts.push('#action = :action');
    }
    if (filters.userId) {
      expressionValues[':userId'] = filters.userId;
      filterParts.push('userId = :userId');
    }
    if (filters.userEmail) {
      expressionValues[':userEmail'] = filters.userEmail;
      filterParts.push('userEmail = :userEmail');
    }
    if (filters.entityType) {
      expressionValues[':entityType'] = filters.entityType;
      filterParts.push('entityType = :entityType');
    }

    const result = await this.client.send(
      new QueryCommand({
        TableName: this.tableName,
        IndexName: TABLE.GSI1,
        KeyConditionExpression: keyCondition,
        FilterExpression: filterParts.length > 0 ? filterParts.join(' AND ') : undefined,
        ExpressionAttributeNames: Object.keys(expressionNames).length > 0 ? expressionNames : undefined,
        ExpressionAttributeValues: expressionValues,
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
