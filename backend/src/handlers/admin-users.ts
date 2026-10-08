import serverless from 'serverless-http';
import { buildContainer } from '@shared/infrastructure/di/container';
import { createExpressApp } from '@shared/infrastructure/http/express-app.factory';
import { buildAdminUsersRouter } from '@modules/users/presentation/admin-users.routes';

const container = buildContainer();
const router = buildAdminUsersRouter(container.resolve('adminUsersController'));
const app = createExpressApp({ router, serviceName: 'admin-users' });

export const handler = serverless(app);
