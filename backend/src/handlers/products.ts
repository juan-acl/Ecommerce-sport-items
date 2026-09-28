import serverless from 'serverless-http';
import { buildContainer } from '@shared/infrastructure/di/container';
import { createExpressApp } from '@shared/infrastructure/http/express-app.factory';
import { buildProductsRouter } from '@modules/products/presentation/products.routes';

const container = buildContainer();
const router = buildProductsRouter(container.resolve('productsController'));
const app = createExpressApp({ router, serviceName: 'products' });

export const handler = serverless(app);
