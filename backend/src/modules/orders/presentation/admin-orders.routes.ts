import { Router } from 'express';
import { authMiddleware } from '@shared/infrastructure/http/middlewares/auth.middleware';
import { adminMiddleware } from '@shared/infrastructure/http/middlewares/admin.middleware';
import { AdminOrdersController } from './admin-orders.controller';

export function buildAdminOrdersRouter(controller: AdminOrdersController): Router {
  const router = Router();
  const v1 = Router();
  v1.use(authMiddleware);
  v1.use(adminMiddleware);
  v1.get('/admin/orders', controller.list);
  v1.put('/admin/orders/:id/status', controller.updateStatus);

  router.use('/v1', v1);
  return router;
}
