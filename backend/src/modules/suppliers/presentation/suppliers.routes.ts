import { Router } from 'express';
import { authMiddleware } from '@shared/infrastructure/http/middlewares/auth.middleware';
import { adminMiddleware } from '@shared/infrastructure/http/middlewares/admin.middleware';
import { requirePermission } from '@shared/infrastructure/http/middlewares/permission.middleware';
import { validate } from '@shared/infrastructure/http/middlewares/validation.middleware';
import { CreateSupplierSchema, UpdateSupplierSchema } from '../application/dtos/supplier.dto';
import { SuppliersController } from './suppliers.controller';

export function buildAdminSuppliersRouter(controller: SuppliersController): Router {
  const router = Router();
  const v1 = Router();

  v1.use(authMiddleware);
  v1.use(adminMiddleware);
  v1.get('/admin/suppliers', requirePermission('suppliers', 'view'), controller.list);
  v1.get('/admin/suppliers/:id', requirePermission('suppliers', 'view'), controller.getById);
  v1.post('/admin/suppliers', requirePermission('suppliers', 'create'), validate(CreateSupplierSchema), controller.create);
  v1.put('/admin/suppliers/:id', requirePermission('suppliers', 'edit'), validate(UpdateSupplierSchema), controller.update);
  v1.delete('/admin/suppliers/:id', requirePermission('suppliers', 'delete'), controller.delete);

  router.use('/v1', v1);
  return router;
}
