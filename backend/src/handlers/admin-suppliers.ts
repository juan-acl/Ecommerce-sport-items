import serverless from 'serverless-http';
import { buildContainer } from '@shared/infrastructure/di/container';
import { createExpressApp } from '@shared/infrastructure/http/express-app.factory';
import { buildAdminSuppliersRouter } from '@modules/suppliers/presentation/suppliers.routes';

const container = buildContainer();
const router = buildAdminSuppliersRouter(container.resolve('suppliersController'));
const app = createExpressApp({ router, serviceName: 'admin-suppliers' });

export const handler = serverless(app);
