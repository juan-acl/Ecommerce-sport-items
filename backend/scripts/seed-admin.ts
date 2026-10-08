import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuid } from 'uuid';
import bcrypt from 'bcryptjs';
import { dynamoClient, TABLE_NAME } from '../src/shared/infrastructure/dynamodb/dynamodb.client';
import {
  KEY_PREFIXES,
  SK_VALUES,
} from '../src/shared/infrastructure/dynamodb/single-table.constants';

const ADMIN_EMAIL = 'admin@sportscart.com';
const ADMIN_PASSWORD = 'Admin123!';
const ADMIN_NAME = 'Administrador';

async function main() {
  console.log('Creando usuario administrador...\n');

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  const id = uuid();
  const createdAt = new Date().toISOString();

  await dynamoClient.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        PK: `${KEY_PREFIXES.USER}${id}`,
        SK: SK_VALUES.PROFILE,
        GSI1PK: `${KEY_PREFIXES.EMAIL}${ADMIN_EMAIL}`,
        GSI1SK: SK_VALUES.USER,
        id,
        email: ADMIN_EMAIL,
        name: ADMIN_NAME,
        passwordHash,
        role: 'admin',
        createdAt,
      },
    }),
  );

  console.log('✓ Usuario admin creado exitosamente\n');
  console.log(`  Email:      ${ADMIN_EMAIL}`);
  console.log(`  Contraseña: ${ADMIN_PASSWORD}`);
  console.log(`  Rol:        admin`);
}

main().catch((err) => {
  console.error('Error creando admin:', err);
  process.exit(1);
});
