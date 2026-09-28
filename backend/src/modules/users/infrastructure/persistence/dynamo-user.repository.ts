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
        ExpressionAttributeValues: {
          ':pk': `${KEY_PREFIXES.EMAIL}${email.toLowerCase()}`,
          ':sk': SK_VALUES.USER,
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
}
