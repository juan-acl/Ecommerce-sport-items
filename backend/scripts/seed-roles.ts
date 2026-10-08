import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuid } from 'uuid';
import { dynamoClient, TABLE_NAME } from '../src/shared/infrastructure/dynamodb/dynamodb.client';
import {
  KEY_PREFIXES,
  SK_VALUES,
} from '../src/shared/infrastructure/dynamodb/single-table.constants';

const ADMIN_ROLE_NAME = 'admin';
const CLIENT_ROLE_NAME = 'client';

const adminPermissions = [
  { module: 'dashboard', actions: ['view'] },
  { module: 'products', actions: ['view', 'create', 'edit', 'delete'] },
  { module: 'users', actions: ['view', 'create', 'edit', 'delete'] },
  { module: 'clients', actions: ['view', 'create', 'edit', 'delete'] },
  { module: 'orders', actions: ['view', 'edit'] },
  { module: 'roles', actions: ['view', 'create', 'edit'] },
];

const clientPermissions: { module: string; actions: string[] }[] = [];

async function seedRole(params: {
  name: string;
  description: string;
  permissions: { module: string; actions: string[] }[];
  isSystem: boolean;
}) {
  const id = uuid();
  const createdAt = new Date().toISOString();

  await dynamoClient.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        PK: `${KEY_PREFIXES.ROLE}${id}`,
        SK: SK_VALUES.METADATA,
        GSI2PK: 'ENTITY#ROLE',
        GSI2SK: `${createdAt}#${id}`,
        id,
        name: params.name,
        description: params.description,
        permissions: params.permissions,
        isSystem: params.isSystem,
        createdAt,
      },
    }),
  );

  console.log(`✓ Rol "${params.name}" creado exitosamente (id: ${id})`);
}

async function main() {
  console.log('Creando roles del sistema...\n');

  await seedRole({
    name: ADMIN_ROLE_NAME,
    description: 'Acceso completo al backoffice de administración',
    permissions: adminPermissions,
    isSystem: true,
  });

  await seedRole({
    name: CLIENT_ROLE_NAME,
    description: 'Rol de cliente sin acceso al backoffice',
    permissions: clientPermissions,
    isSystem: true,
  });

  console.log('\n✓ Roles del sistema creados exitosamente');
}

main().catch((err) => {
  console.error('Error creando roles:', err);
  process.exit(1);
});
