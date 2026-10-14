import { Router } from 'express';
import { authMiddleware } from '@shared/infrastructure/http/middlewares/auth.middleware';
import { adminMiddleware } from '@shared/infrastructure/http/middlewares/admin.middleware';
import { validate } from '@shared/infrastructure/http/middlewares/validation.middleware';
import { CreatePurchaseSchema } from '../application/dtos/purchase.dto';
import { PurchasesController } from './purchases.controller';

export function buildAdminPurchasesRouter(controller: PurchasesController): Router {
  const router = Router();
  const v1 = Router();

  v1.use(authMiddleware);
  v1.use(adminMiddleware);
  v1.get('/admin/purchases', controller.list);
  v1.get('/admin/purchases/:id', controller.getById);
  v1.post('/admin/purchases', validate(CreatePurchaseSchema), controller.create);
  v1.put('/admin/purchases/:id/receive', controller.receive);
  v1.put('/admin/purchases/:id/cancel', controller.cancel);

  router.use('/v1', v1);
  return router;
}
