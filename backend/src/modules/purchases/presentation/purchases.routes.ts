import { Router } from 'express';
import { authMiddleware } from '@shared/infrastructure/http/middlewares/auth.middleware';
import { adminMiddleware } from '@shared/infrastructure/http/middlewares/admin.middleware';
import { requirePermission } from '@shared/infrastructure/http/middlewares/permission.middleware';
import { validate } from '@shared/infrastructure/http/middlewares/validation.middleware';
import { CreatePurchaseSchema, PartialReceivePurchaseSchema } from '../application/dtos/purchase.dto';
import { PurchasesController } from './purchases.controller';

export function buildAdminPurchasesRouter(controller: PurchasesController): Router {
  const router = Router();
  const v1 = Router();

  v1.use(authMiddleware);
  v1.use(adminMiddleware);
  v1.get('/admin/purchases', requirePermission('purchases', 'view'), controller.list);
  v1.get('/admin/purchases/:id', requirePermission('purchases', 'view'), controller.getById);
  v1.post('/admin/purchases', requirePermission('purchases', 'create'), validate(CreatePurchaseSchema), controller.create);
  v1.put('/admin/purchases/:id/receive', requirePermission('purchases', 'edit'), controller.receive);
  v1.put('/admin/purchases/:id/partial-receive', requirePermission('purchases', 'edit'), validate(PartialReceivePurchaseSchema), controller.partialReceive);
  v1.put('/admin/purchases/:id/cancel', requirePermission('purchases', 'edit'), controller.cancel);

  router.use('/v1', v1);
  return router;
}
