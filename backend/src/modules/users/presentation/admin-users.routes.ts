import { Router } from 'express';
import { authMiddleware } from '@shared/infrastructure/http/middlewares/auth.middleware';
import { adminMiddleware } from '@shared/infrastructure/http/middlewares/admin.middleware';
import { requirePermission } from '@shared/infrastructure/http/middlewares/permission.middleware';
import { AdminUsersController } from './admin-users.controller';

export function buildAdminUsersRouter(controller: AdminUsersController): Router {
  const router = Router();
  const v1 = Router();

  v1.use(authMiddleware);
  v1.use(adminMiddleware);
  v1.get('/admin/users', requirePermission('users', 'view'), controller.list);
  v1.post('/admin/users', requirePermission('users', 'create'), controller.create);
  v1.put('/admin/users/:id', requirePermission('users', 'edit'), controller.update);
  v1.delete('/admin/users/:id', requirePermission('users', 'delete'), controller.deactivate);
  router.use('/v1', v1);
  return router;
}
