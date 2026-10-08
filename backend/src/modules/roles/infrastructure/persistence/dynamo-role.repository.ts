import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  DeleteCommand,
} from '@aws-sdk/lib-dynamodb';
import { Role } from '@modules/roles/domain/entities/role.entity';
import { RoleRepository } from '@modules/roles/domain/repositories/role.repository';
import {
  KEY_PREFIXES,
  SK_VALUES,
  TABLE,
} from '@shared/infrastructure/dynamodb/single-table.constants';
import { RoleMapper } from './role.mapper';

export class DynamoRoleRepository implements RoleRepository {
  constructor(
    private readonly client: DynamoDBDocumentClient,
    private readonly tableName: string,
  ) {}

  async findById(id: string): Promise<Role | null> {
    const result = await this.client.send(
      new GetCommand({
        TableName: this.tableName,
        Key: {
          PK: `${KEY_PREFIXES.ROLE}${id}`,
          SK: SK_VALUES.METADATA,
        },
      }),
    );

    if (!result.Item) return null;
    return RoleMapper.toDomain(result.Item);
  }

  async findByName(name: string): Promise<Role | null> {
    const result = await this.client.send(
      new QueryCommand({
        TableName: this.tableName,
        IndexName: TABLE.GSI2,
        KeyConditionExpression: 'GSI2PK = :pk',
        FilterExpression: '#nm = :name',
        ExpressionAttributeNames: { '#nm': 'name' },
        ExpressionAttributeValues: {
          ':pk': 'ENTITY#ROLE',
          ':name': name,
        },
        Limit: 1,
      }),
    );

    if (!result.Items || result.Items.length === 0) return null;
    return RoleMapper.toDomain(result.Items[0]);
  }

  async listAll(): Promise<Role[]> {
    const result = await this.client.send(
      new QueryCommand({
        TableName: this.tableName,
        IndexName: TABLE.GSI2,
        KeyConditionExpression: 'GSI2PK = :pk',
        ExpressionAttributeValues: { ':pk': 'ENTITY#ROLE' },
        ScanIndexForward: false,
      }),
    );

    return (result.Items ?? []).map((item) => RoleMapper.toDomain(item));
  }

  async save(role: Role): Promise<void> {
    await this.client.send(
      new PutCommand({
        TableName: this.tableName,
        Item: RoleMapper.toItem(role),
        ConditionExpression: 'attribute_not_exists(PK)',
      }),
    );
  }

  async update(role: Role): Promise<void> {
    await this.client.send(
      new PutCommand({
        TableName: this.tableName,
        Item: RoleMapper.toItem(role),
      }),
    );
  }

  async delete(id: string): Promise<void> {
    await this.client.send(
      new DeleteCommand({
        TableName: this.tableName,
        Key: {
          PK: `${KEY_PREFIXES.ROLE}${id}`,
          SK: SK_VALUES.METADATA,
        },
      }),
    );
  }
}
