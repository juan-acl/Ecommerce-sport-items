import { Router } from 'express';
import { authMiddleware } from '@shared/infrastructure/http/middlewares/auth.middleware';
import { adminMiddleware } from '@shared/infrastructure/http/middlewares/admin.middleware';
import { requirePermission } from '@shared/infrastructure/http/middlewares/permission.middleware';
import { ReportsController } from './reports.controller';

export function buildAdminReportsRouter(controller: ReportsController): Router {
  const router = Router();
  const v1 = Router();
  v1.use(authMiddleware);
  v1.use(adminMiddleware);
  v1.get('/admin/reports/sales', requirePermission('reports', 'view'), controller.getSalesReport);
  v1.get('/admin/reports/inventory', requirePermission('reports', 'view'), controller.getInventoryReport);

  router.use('/v1', v1);
  return router;
}
