import { Request, Response, NextFunction } from 'express';
import { ListAuditLogsUseCase } from '@modules/audit/application/use-cases/list-audit-logs.use-case';
import { ApiResponder } from '@shared/infrastructure/http/response.builder';

export class AuditController {
  constructor(private readonly listAuditLogsUseCase: ListAuditLogsUseCase) {}

  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const limit = Math.min(parseInt((req.query.limit as string) ?? '20', 10) || 20, 100);
      const cursor = req.query.cursor as string | undefined;
      const result = await this.listAuditLogsUseCase.execute({ limit, cursor });
      ApiResponder.ok(req, res, result);
    } catch (err) {
      next(err);
    }
  };

  listByEntity = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const entityType = Array.isArray(req.params.entityType)
        ? req.params.entityType[0]
        : req.params.entityType;
      const entityId = Array.isArray(req.params.entityId)
        ? req.params.entityId[0]
        : req.params.entityId;
      const result = await this.listAuditLogsUseCase.executeByEntity(
        entityType ?? '',
        entityId ?? '',
      );
      ApiResponder.ok(req, res, result);
    } catch (err) {
      next(err);
    }
  };
}
