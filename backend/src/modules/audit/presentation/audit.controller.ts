import { Request, Response, NextFunction } from 'express';
import { ListAuditLogsUseCase } from '@modules/audit/application/use-cases/list-audit-logs.use-case';
import { AuditFilterParams } from '@modules/audit/domain/repositories/audit-log.repository';
import { ApiResponder } from '@shared/infrastructure/http/response.builder';

export class AuditController {
  constructor(private readonly listAuditLogsUseCase: ListAuditLogsUseCase) {}

  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const limit = Math.min(parseInt((req.query.limit as string) ?? '20', 10) || 20, 100);
      const cursor = req.query.cursor as string | undefined;

      const filters: AuditFilterParams = {
        action: req.query.action as string | undefined,
        userId: req.query.userId as string | undefined,
        userEmail: req.query.userEmail as string | undefined,
        entityType: req.query.entityType as string | undefined,
        fromDate: req.query.fromDate as string | undefined,
        toDate: req.query.toDate as string | undefined,
      };

      const result = await this.listAuditLogsUseCase.executeFiltered(filters, { limit, cursor });

      ApiResponder.ok(req, res, result);
    } catch (err) {
      next(err);
    }
  };

  listByEntity = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.listAuditLogsUseCase.executeByEntity(
        pickParam(req.params.entityType),
        pickParam(req.params.entityId),
      );
      ApiResponder.ok(req, res, result);
    } catch (err) {
      next(err);
    }
  };
}

function pickParam(val: string | string[] | undefined): string {
  return (Array.isArray(val) ? val[0] : val) ?? '';
}
