import serverless from 'serverless-http';
import { buildContainer } from '@shared/infrastructure/di/container';
import { createExpressApp } from '@shared/infrastructure/http/express-app.factory';
import { buildAdminInventoryRouter } from '@modules/inventory/presentation/inventory.routes';

const container = buildContainer();
const router = buildAdminInventoryRouter(container.resolve('inventoryController'));
const app = createExpressApp({ router, serviceName: 'admin-inventory' });

export const handler = serverless(app);
