import { env } from '@/shared/infrastructure/config/env';
import { dynamoClient } from '@/shared/infrastructure/dynamodb/dynamodb.client';
import { CreateTableCommand, DescribeTableCommand } from '@aws-sdk/client-dynamodb';

async function tableExists(name: string): Promise<boolean> {
  try {
    await dynamoClient.send(new DescribeTableCommand({ TableName: name }));
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const tableName = env.DYNAMODB_TABLE_NAME;

  if (await tableExists(tableName)) {
    console.log(`La tabla "${tableName}" ya existe. Saltando creación.`);
    return;
  }

  await dynamoClient.send(
    new CreateTableCommand({
      TableName: tableName,
      BillingMode: 'PAY_PER_REQUEST',
      AttributeDefinitions: [
        { AttributeName: 'PK', AttributeType: 'S' },
        { AttributeName: 'SK', AttributeType: 'S' },
        { AttributeName: 'GSI1PK', AttributeType: 'S' },
        { AttributeName: 'GSI1SK', AttributeType: 'S' },
        { AttributeName: 'GSI2PK', AttributeType: 'S' },
        { AttributeName: 'GSI2SK', AttributeType: 'S' },
      ],
      KeySchema: [
        { AttributeName: 'PK', KeyType: 'HASH' },
        { AttributeName: 'SK', KeyType: 'RANGE' },
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: 'GSI1',
          KeySchema: [
            { AttributeName: 'GSI1PK', KeyType: 'HASH' },
            { AttributeName: 'GSI1SK', KeyType: 'RANGE' },
          ],
          Projection: { ProjectionType: 'ALL' },
        },
        {
          IndexName: 'GSI2',
          KeySchema: [
            { AttributeName: 'GSI2PK', KeyType: 'HASH' },
            { AttributeName: 'GSI2SK', KeyType: 'RANGE' },
          ],
          Projection: { ProjectionType: 'ALL' },
        },
      ],
    }),
  );

  console.log(`tabla "${tableName}" creada exitosamente.`);
}

main().catch((err) => {
  console.error('Error creando tabla:', err);
  process.exit(1);
});
