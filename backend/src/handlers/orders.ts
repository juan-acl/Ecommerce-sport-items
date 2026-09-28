import serverless from 'serverless-http';
import { buildContainer } from '@shared/infrastructure/di/container';
import { createExpressApp } from '@shared/infrastructure/http/express-app.factory';
import { buildOrdersRouter } from '@modules/orders/presentation/orders.routes';

const container = buildContainer();
const router = buildOrdersRouter(container.resolve('ordersController'));
const app = createExpressApp({ router, serviceName: 'orders' });

export const handler = serverless(app);
