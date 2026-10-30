import { Request, Response, NextFunction } from 'express';
import { SalesReportUseCase, ReportPeriod } from '@modules/reports/application/use-cases/sales-report.use-case';
import { InventoryReportUseCase } from '@modules/reports/application/use-cases/inventory-report.use-case';
import { PurchasesReportUseCase } from '@modules/reports/application/use-cases/purchases-report.use-case';
import { ClientAnalyticsReportUseCase } from '@modules/reports/application/use-cases/client-analytics-report.use-case';
import {
  SalesReportQuerySchema,
  PurchasesReportQuerySchema,
  ClientAnalyticsQuerySchema,
} from '@modules/reports/application/dtos/report.dto';
import { ApiResponder } from '@shared/infrastructure/http/response.builder';

export class ReportsController {
  constructor(
    private readonly salesReportUseCase: SalesReportUseCase,
    private readonly inventoryReportUseCase: InventoryReportUseCase,
    private readonly purchasesReportUseCase: PurchasesReportUseCase,
    private readonly clientAnalyticsUseCase: ClientAnalyticsReportUseCase,
  ) {}

  getSalesReport = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query = SalesReportQuerySchema.parse({
        period: req.query.period ?? 'month',
        from: req.query.from,
        to: req.query.to,
      });
      const result = await this.salesReportUseCase.execute({
        period: query.period as ReportPeriod,
        from: query.from,
        to: query.to,
      });
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

  getPurchasesReport = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query = PurchasesReportQuerySchema.parse({
        period: req.query.period ?? 'month',
        from: req.query.from,
        to: req.query.to,
      });
      const result = await this.purchasesReportUseCase.execute({
        period: query.period as ReportPeriod,
        from: query.from,
        to: query.to,
      });
      ApiResponder.ok(req, res, result);
    } catch (err) {
      next(err);
    }
  };

  getClientAnalyticsReport = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query = ClientAnalyticsQuerySchema.parse({
        period: req.query.period ?? 'month',
        from: req.query.from,
        to: req.query.to,
      });
      const result = await this.clientAnalyticsUseCase.execute({
        period: query.period as ReportPeriod,
        from: query.from,
        to: query.to,
      });
      ApiResponder.ok(req, res, result);
    } catch (err) {
      next(err);
    }
  };
}
