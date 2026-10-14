import serverless from 'serverless-http';
import { buildContainer } from '@shared/infrastructure/di/container';
import { createExpressApp } from '@shared/infrastructure/http/express-app.factory';
import { buildAdminPurchasesRouter } from '@modules/purchases/presentation/purchases.routes';

const container = buildContainer();
const router = buildAdminPurchasesRouter(container.resolve('purchasesController'));
const app = createExpressApp({ router, serviceName: 'admin-purchases' });

export const handler = serverless(app);
