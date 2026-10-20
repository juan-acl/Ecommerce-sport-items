import { Router } from 'express';
import { authMiddleware } from '@shared/infrastructure/http/middlewares/auth.middleware';
import { adminMiddleware } from '@shared/infrastructure/http/middlewares/admin.middleware';
import { requirePermission } from '@shared/infrastructure/http/middlewares/permission.middleware';
import { AdminProductsController } from './admin-products.controller';

export function buildAdminProductsRouter(controller: AdminProductsController): Router {
  const router = Router();
  const v1 = Router();

  v1.use(authMiddleware);
  v1.use(adminMiddleware);
  v1.get('/admin/products/', requirePermission('products', 'view'), controller.list);
  v1.post('/admin/products/upload-url', requirePermission('products', 'create'), controller.getUploadUrl);
  v1.get('/admin/products/:id', requirePermission('products', 'view'), controller.getById);
  v1.post('/admin/products', requirePermission('products', 'create'), controller.create);
  v1.put('/admin/products/:id', requirePermission('products', 'edit'), controller.update);
  v1.delete('/admin/products/:id', requirePermission('products', 'delete'), controller.delete);

  router.use('/v1', v1);
  return router;
}
