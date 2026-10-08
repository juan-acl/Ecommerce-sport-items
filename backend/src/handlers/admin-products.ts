import serverless from 'serverless-http';
import { buildContainer } from '@shared/infrastructure/di/container';
import { createExpressApp } from '@shared/infrastructure/http/express-app.factory';
import { buildAdminProductsRouter } from '@modules/products/presentation/admin-products.routes';

const container = buildContainer();
const router = buildAdminProductsRouter(container.resolve('adminProductsController'));
const app = createExpressApp({ router, serviceName: 'admin-products' });

export const handler = serverless(app);
