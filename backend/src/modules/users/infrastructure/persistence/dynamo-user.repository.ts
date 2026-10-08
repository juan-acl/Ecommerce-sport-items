import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
} from '@aws-sdk/lib-dynamodb';
import { User } from '@modules/users/domain/entities/user.entity';
import { UserRepository } from '@modules/users/domain/repositories/user.repository';
import {
  KEY_PREFIXES,
  SK_VALUES,
  TABLE,
} from '@shared/infrastructure/dynamodb/single-table.constants';
import { UserMapper } from './user.mapper';

export class DynamoUserRepository implements UserRepository {
  constructor(
    private readonly client: DynamoDBDocumentClient,
    private readonly tableName: string,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    const result = await this.client.send(
      new QueryCommand({
        TableName: this.tableName,
        IndexName: TABLE.GSI1,
        KeyConditionExpression: 'GSI1PK = :pk AND GSI1SK = :sk',
        FilterExpression: 'attribute_not_exists(#ia) OR #ia = :true',
        ExpressionAttributeNames: { '#ia': 'isActive' },
        ExpressionAttributeValues: {
          ':pk': `${KEY_PREFIXES.EMAIL}${email.toLowerCase()}`,
          ':sk': SK_VALUES.USER,
          ':true': true,
        },
        Limit: 1,
      }),
    );

    if (!result.Items || result.Items.length === 0) return null;
    return UserMapper.toDomain(result.Items[0]);
  }

  async findById(id: string): Promise<User | null> {
    const result = await this.client.send(
      new GetCommand({
        TableName: this.tableName,
        Key: {
          PK: `${KEY_PREFIXES.USER}${id}`,
          SK: SK_VALUES.PROFILE,
        },
      }),
    );

    if (!result.Item) return null;
    return UserMapper.toDomain(result.Item);
  }

  async save(user: User): Promise<void> {
    await this.client.send(
      new PutCommand({
        TableName: this.tableName,
        Item: UserMapper.toItem(user),
        ConditionExpression: 'attribute_not_exists(PK)',
      }),
    );
  }

  async listAll(params: {
    limit?: number;
    cursor?: string;
    role?: string;
  }): Promise<{ users: User[]; nextCursor?: string }> {
    const limit = params.limit ?? 50;
    const exclusiveStartKey = params.cursor ? this.decodeCursor(params.cursor) : undefined;

    const filterParts = ['(attribute_not_exists(#ia) OR #ia = :true)'];
    const attrNames: Record<string, string> = { '#ia': 'isActive' };
    const attrValues: Record<string, unknown> = { ':pk': 'ENTITY#USER', ':true': true };

    if (params.role) {
      filterParts.push('#role = :role');
      attrNames['#role'] = 'role';
      attrValues[':role'] = params.role;
    }

    const result = await this.client.send(
      new QueryCommand({
        TableName: this.tableName,
        IndexName: TABLE.GSI2,
        KeyConditionExpression: 'GSI2PK = :pk',
        FilterExpression: filterParts.join(' AND '),
        ExpressionAttributeNames: attrNames,
        ExpressionAttributeValues: attrValues,
        Limit: limit,
        ScanIndexForward: false,
        ExclusiveStartKey: exclusiveStartKey,
      }),
    );
    const users = (result.Items ?? []).map((item) => UserMapper.toDomain(item));
    const nextCursor = result.LastEvaluatedKey
      ? this.encodeCursor(result.LastEvaluatedKey)
      : undefined;
    return { users, nextCursor };
  }

  async update(user: User): Promise<void> {
    await this.client.send(
      new PutCommand({
        TableName: this.tableName,
        Item: UserMapper.toItem(user),
      }),
    );
  }

  async delete(id: string): Promise<void> {
    const user = await this.findById(id);
    if (!user) return;
    await this.update(user.deactivate());
  }

  private encodeCursor(key: Record<string, unknown>): string {
    return Buffer.from(JSON.stringify(key)).toString('base64url');
  }

  private decodeCursor(cursor: string): Record<string, unknown> {
    try {
      return JSON.parse(Buffer.from(cursor, 'base64url').toString('utf-8'));
    } catch {
      throw new Error('Cursor inválido');
    }
  }
}
