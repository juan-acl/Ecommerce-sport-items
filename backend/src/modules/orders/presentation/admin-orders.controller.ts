import { Request, Response, NextFunction } from 'express';
import { ListAllOrdersUseCase } from '@modules/orders/application/use-cases/list-all-orders.use-case';
import { UpdateOrderStatusUseCase } from '@modules/orders/application/use-cases/update-order-status.use-case';
import { ApproveOrderUseCase } from '@modules/orders/application/use-cases/approve-order.use-case';
import { GetOrderUseCase } from '@modules/orders/application/use-cases/get-order.use-case';
import { CreateAuditLogUseCase } from '@modules/audit/application/use-cases/create-audit-log.use-case';
import { ApiResponder } from '@shared/infrastructure/http/response.builder';

type AdminReq = Request & { user?: { id: string; email: string } };

export class AdminOrdersController {
  constructor(
    private readonly listAllOrdersUseCase: ListAllOrdersUseCase,
    private readonly updateOrderStatusUseCase: UpdateOrderStatusUseCase,
    private readonly approveOrderUseCase: ApproveOrderUseCase,
    private readonly getOrderUseCase?: GetOrderUseCase,
    private readonly auditUseCase?: CreateAuditLogUseCase,
  ) {}

  private audit(req: AdminReq, action: string, entityId: string, details: Record<string, unknown>) {
    if (!this.auditUseCase) return;
    this.auditUseCase.execute({
      userId: req.user?.id ?? 'unknown',
      userEmail: req.user?.email ?? 'unknown',
      action,
      entityType: 'order',
      entityId,
      details,
    }).catch(() => undefined);
  }

  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.listAllOrdersUseCase.execute({
        limit: Number(req.query.limit) || 20,
        cursor: req.query.cursor as string | undefined,
        status: req.query.status as string | undefined,
      });
      ApiResponder.ok(req, res, result);
    } catch (err) {
      next(err);
    }
  };

  approve = async (req: AdminReq, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const { action } = req.body as { action: 'approve' | 'reject' };
      const result = await this.approveOrderUseCase.execute({
        orderId: id ?? '',
        action,
        adminId: req.user?.id ?? 'unknown',
        adminEmail: req.user?.email ?? 'unknown',
      });
      this.audit(req, action === 'approve' ? 'ORDER_APPROVED' : 'ORDER_REJECTED', id ?? '', { action });
      ApiResponder.ok(req, res, result);
    } catch (err) {
      next(err);
    }
  };

  updateStatus = async (req: AdminReq, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const newStatus = req.body.status as string;
      let previousStatus: string | null = null;
      if (this.getOrderUseCase) {
        try {
          const order = await this.getOrderUseCase.execute('', id ?? '');
          previousStatus = (order as Record<string, unknown>).status as string;
        } catch { /* continúa */ }
      }
      await this.updateOrderStatusUseCase.execute(id ?? '', newStatus);
      this.audit(req, 'ORDER_STATUS_CHANGED', id ?? '', {
        changes: { status: { from: previousStatus, to: newStatus } },
      });
      ApiResponder.ok(req, res, { message: 'Estado actualizado' });
    } catch (err) {
      next(err);
    }
  };
}
