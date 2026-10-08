import serverless from 'serverless-http';
import { buildContainer } from '@shared/infrastructure/di/container';
import { createExpressApp } from '@shared/infrastructure/http/express-app.factory';
import { buildAdminOrdersRouter } from '@modules/orders/presentation/admin-orders.routes';

const container = buildContainer();
const router = buildAdminOrdersRouter(container.resolve('adminOrdersController'));
const app = createExpressApp({ router, serviceName: 'admin-orders' });

export const handler = serverless(app);
