import serverless from 'serverless-http';
import { buildContainer } from '@shared/infrastructure/di/container';
import { createExpressApp } from '@shared/infrastructure/http/express-app.factory';
import { buildRolesRouter } from '@modules/roles/presentation/roles.routes';

const container = buildContainer();
const router = buildRolesRouter(container.resolve('rolesController'));
const app = createExpressApp({ router, serviceName: 'admin-roles' });

export const handler = serverless(app);
