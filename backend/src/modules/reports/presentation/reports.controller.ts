import { Request, Response, NextFunction } from 'express';
import { SalesReportUseCase, ReportPeriod } from '@modules/reports/application/use-cases/sales-report.use-case';
import { InventoryReportUseCase } from '@modules/reports/application/use-cases/inventory-report.use-case';
import { SalesReportQuerySchema } from '@modules/reports/application/dtos/report.dto';
import { ApiResponder } from '@shared/infrastructure/http/response.builder';

export class ReportsController {
  constructor(
    private readonly salesReportUseCase: SalesReportUseCase,
    private readonly inventoryReportUseCase: InventoryReportUseCase,
  ) {}

  getSalesReport = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query = SalesReportQuerySchema.parse({
        period: req.query.period ?? 'month',
      });
      const result = await this.salesReportUseCase.execute({ period: query.period as ReportPeriod });
      ApiResponder.ok(req, res, result);
    } catch (err) {
      next(err);
    }
  };

  getInventoryReport = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.inventoryReportUseCase.execute();
      ApiResponder.ok(req, res, result);
    } catch (err) {
      next(err);
    }
  };
}
