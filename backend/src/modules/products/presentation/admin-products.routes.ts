import { Router } from 'express';
import { authMiddleware } from '@shared/infrastructure/http/middlewares/auth.middleware';
import { adminMiddleware } from '@shared/infrastructure/http/middlewares/admin.middleware';
import { AdminProductsController } from './admin-products.controller';

export function buildAdminProductsRouter(controller: AdminProductsController): Router {
  const router = Router();
  const v1 = Router();

  v1.use(authMiddleware);
  v1.use(adminMiddleware);
  v1.get('/admin/products/', controller.list);
  v1.post('/admin/products/upload-url', controller.getUploadUrl);
  v1.get('/admin/products/:id', controller.getById);
  v1.post('/admin/products', controller.create);
  v1.put('/admin/products/:id', controller.update);
  v1.delete('/admin/products/:id', controller.delete);

  router.use('/v1', v1);
  return router;
}
