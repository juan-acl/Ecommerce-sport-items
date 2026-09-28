import serverless from 'serverless-http';
import { buildContainer } from '@shared/infrastructure/di/container';
import { createExpressApp } from '@shared/infrastructure/http/express-app.factory';
import { buildAuthRouter } from '@modules/auth/presentation/auth.routes';

const container = buildContainer();
const router = buildAuthRouter(container.resolve('authController'));
const app = createExpressApp({ router, serviceName: 'auth' });

export const handler = serverless(app);
