import { Router } from 'express';
import { authMiddleware } from '@shared/infrastructure/http/middlewares/auth.middleware';
import { adminMiddleware } from '@shared/infrastructure/http/middlewares/admin.middleware';
import { requirePermission } from '@shared/infrastructure/http/middlewares/permission.middleware';
import { AuditController } from './audit.controller';

export function buildAdminAuditRouter(controller: AuditController): Router {
  const router = Router();
  const v1 = Router();
  v1.use(authMiddleware);
  v1.use(adminMiddleware);
  v1.get('/admin/audit', requirePermission('audit', 'view'), controller.list);
  v1.get('/admin/audit/:entityType/:entityId', requirePermission('audit', 'view'), controller.listByEntity);

  router.use('/v1', v1);
  return router;
}
