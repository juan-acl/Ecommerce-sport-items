import { Router } from 'express';
import { authMiddleware } from '@shared/infrastructure/http/middlewares/auth.middleware';
import { adminMiddleware } from '@shared/infrastructure/http/middlewares/admin.middleware';
import { requirePermission } from '@shared/infrastructure/http/middlewares/permission.middleware';
import { DiscountsController } from './discounts.controller';

export function buildAdminDiscountsRouter(controller: DiscountsController): Router {
  const router = Router();
  const v1 = Router();
  v1.use(authMiddleware);
  v1.use(adminMiddleware);
  v1.post('/admin/discounts', requirePermission('discounts', 'create'), controller.create);
  v1.get('/admin/discounts', requirePermission('discounts', 'view'), controller.list);
  v1.put('/admin/discounts/:id/toggle', requirePermission('discounts', 'edit'), controller.toggle);

  router.use('/v1', v1);
  return router;
}
