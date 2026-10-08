import { Router } from 'express';
import { authMiddleware } from '@shared/infrastructure/http/middlewares/auth.middleware';
import { adminMiddleware } from '@shared/infrastructure/http/middlewares/admin.middleware';
import { AdminUsersController } from './admin-users.controller';

export function buildAdminUsersRouter(controller: AdminUsersController): Router {
  const router = Router();
  const v1 = Router();

  v1.use(authMiddleware);
  v1.use(adminMiddleware);
  v1.get('/admin/users', controller.list);
  v1.post('/admin/users', controller.create);
  v1.put('/admin/users/:id', controller.update);
  v1.delete('/admin/users/:id', controller.deactivate);
  router.use('/v1', v1);
  return router;
}
