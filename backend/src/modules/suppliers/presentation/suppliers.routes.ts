import { Router } from 'express';
import { authMiddleware } from '@shared/infrastructure/http/middlewares/auth.middleware';
import { adminMiddleware } from '@shared/infrastructure/http/middlewares/admin.middleware';
import { validate } from '@shared/infrastructure/http/middlewares/validation.middleware';
import { CreateSupplierSchema, UpdateSupplierSchema } from '../application/dtos/supplier.dto';
import { SuppliersController } from './suppliers.controller';

export function buildAdminSuppliersRouter(controller: SuppliersController): Router {
  const router = Router();
  const v1 = Router();

  v1.use(authMiddleware);
  v1.use(adminMiddleware);
  v1.get('/admin/suppliers', controller.list);
  v1.get('/admin/suppliers/:id', controller.getById);
  v1.post('/admin/suppliers', validate(CreateSupplierSchema), controller.create);
  v1.put('/admin/suppliers/:id', validate(UpdateSupplierSchema), controller.update);
  v1.delete('/admin/suppliers/:id', controller.delete);

  router.use('/v1', v1);
  return router;
}
