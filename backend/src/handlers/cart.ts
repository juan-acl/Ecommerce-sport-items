import serverless from 'serverless-http';
import { buildContainer } from '@/shared/infrastructure/di/container';
import { createExpressApp } from '@/shared/infrastructure/http/express-app.factory';
import { buildCartsRouter } from '@/modules/carts/presentation/carts.routes';

const container = buildContainer();
const router = buildCartsRouter(container.resolve('cartsController'));
const app = createExpressApp({ router, serviceName: 'cart' });

export const handler = serverless(app);
