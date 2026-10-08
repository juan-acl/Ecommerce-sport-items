import {
  DynamoDBDocumentClient,
  DeleteCommand,
  GetCommand,
  PutCommand,
  QueryCommand,
} from '@aws-sdk/lib-dynamodb';
import { Session } from '../../domain/entities/session.entity';
import { SessionRepository } from '../../domain/repositories/session.repository';
import { TABLE } from '@shared/infrastructure/dynamodb/single-table.constants';
import { SessionMapper } from './session.mapper';

export class DynamoSessionRepository implements SessionRepository {
  constructor(
    private readonly client: DynamoDBDocumentClient,
    private readonly tableName: string,
  ) {}

  async save(session: Session): Promise<void> {
    await this.client.send(
      new PutCommand({
        TableName: this.tableName,
        Item: SessionMapper.toItem(session),
      }),
    );
  }

  async findById(sessionId: string): Promise<Session | null> {
    const result = await this.client.send(
      new GetCommand({
        TableName: this.tableName,
        Key: {
          PK: `SESSION#${sessionId}`,
          SK: 'METADATA',
        },
      }),
    );

    if (!result.Item) return null;
    return SessionMapper.toDomain(result.Item);
  }

  async delete(sessionId: string): Promise<void> {
    await this.client.send(
      new DeleteCommand({
        TableName: this.tableName,
        Key: {
          PK: `SESSION#${sessionId}`,
          SK: 'METADATA',
        },
      }),
    );
  }

  async deleteAllByUserId(userId: string): Promise<void> {
    const result = await this.client.send(
      new QueryCommand({
        TableName: this.tableName,
        IndexName: TABLE.GSI2,
        KeyConditionExpression: 'GSI2PK = :pk AND begins_with(GSI2SK, :prefix)',
        ExpressionAttributeValues: {
          ':pk': `USER#${userId}`,
          ':prefix': 'SESSION#',
        },
        ProjectionExpression: 'sessionId',
      }),
    );

    const items = result.Items ?? [];
    await Promise.all(items.map((item) => this.delete(item.sessionId as string)));
  }
}
