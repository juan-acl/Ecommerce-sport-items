import { env } from '@/shared/infrastructure/config/env';
import { dynamoClient } from '@/shared/infrastructure/dynamodb/dynamodb.client';
import { DeleteTableCommand } from '@aws-sdk/client-dynamodb';

async function main() {
  const tableName = env.DYNAMODB_TABLE_NAME;

  try {
    await dynamoClient.send(new DeleteTableCommand({ TableName: tableName }));
    console.log(`Tabla "${tableName}" eliminada.`);
  } catch (err) {
    const error = err as { name?: string };
    if (error.name === 'ResourceNotFoundException') {
      console.log(`La tabla "${tableName}" no existe.`);
      return;
    }
    throw err;
  }
}

main().catch((err) => {
  console.error('Error eliminando tabla:', err);
  process.exit(1);
});
