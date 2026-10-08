import { Router } from 'express';
import { authMiddleware } from '@shared/infrastructure/http/middlewares/auth.middleware';
import { adminMiddleware } from '@shared/infrastructure/http/middlewares/admin.middleware';
import { RolesController } from './roles.controller';

export function buildRolesRouter(controller: RolesController): Router {
  const router = Router();
  const v1 = Router();

  v1.use(authMiddleware);
  v1.use(adminMiddleware);
  v1.get('/admin/roles', controller.list);
  v1.get('/admin/roles/:id', controller.getById);
  v1.post('/admin/roles', controller.create);
  v1.put('/admin/roles/:id', controller.update);
  router.use('/v1', v1);
  return router;
}
