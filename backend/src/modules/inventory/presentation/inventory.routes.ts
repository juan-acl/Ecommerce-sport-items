import { Router } from 'express';
import { authMiddleware } from '@shared/infrastructure/http/middlewares/auth.middleware';
import { adminMiddleware } from '@shared/infrastructure/http/middlewares/admin.middleware';
import { InventoryController } from './inventory.controller';

export function buildAdminInventoryRouter(controller: InventoryController): Router {
  const router = Router();
  const v1 = Router();

  v1.use(authMiddleware);
  v1.use(adminMiddleware);
  v1.get('/admin/inventory/movements', controller.listMovements);
  v1.get('/admin/inventory/low-stock', controller.getLowStock);

  router.use('/v1', v1);
  return router;
}
