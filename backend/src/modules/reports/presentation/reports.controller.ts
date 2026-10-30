import { Request, Response, NextFunction } from 'express';
import { SalesReportUseCase } from '@modules/reports/application/use-cases/sales-report.use-case';
import { InventoryReportUseCase } from '@modules/reports/application/use-cases/inventory-report.use-case';
import { PurchasesReportUseCase } from '@modules/reports/application/use-cases/purchases-report.use-case';
import { ClientAnalyticsReportUseCase } from '@modules/reports/application/use-cases/client-analytics-report.use-case';
import { ProductsReportUseCase } from '@modules/reports/application/use-cases/products-report.use-case';
import { ReportQuerySchema, ProductsReportQuerySchema } from '@modules/reports/application/dtos/report.dto';
import { ApiResponder } from '@shared/infrastructure/http/response.builder';

export class ReportsController {
  constructor(
    private readonly salesReportUseCase: SalesReportUseCase,
    private readonly inventoryReportUseCase: InventoryReportUseCase,
    private readonly purchasesReportUseCase: PurchasesReportUseCase,
    private readonly clientAnalyticsUseCase: ClientAnalyticsReportUseCase,
    private readonly productsReportUseCase: ProductsReportUseCase,
  ) {}

  getSalesReport = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query = ReportQuerySchema.parse({
        period: req.query.period,
        from: req.query.from,
        to: req.query.to,
      });
      const result = await this.salesReportUseCase.execute({
        period: query.period,
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
      const query = ReportQuerySchema.parse({
        period: req.query.period,
        from: req.query.from,
        to: req.query.to,
      });
      const result = await this.purchasesReportUseCase.execute({
        period: query.period,
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
      const query = ReportQuerySchema.parse({
        period: req.query.period,
        from: req.query.from,
        to: req.query.to,
      });
      const result = await this.clientAnalyticsUseCase.execute({
        period: query.period,
        from: query.from,
        to: query.to,
      });
      ApiResponder.ok(req, res, result);
    } catch (err) {
      next(err);
    }
  };

  getProductsReport = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query = ProductsReportQuerySchema.parse({
        category: req.query.category,
        name: req.query.name,
        stockStatus: req.query.stockStatus,
        page: req.query.page,
        pageSize: req.query.pageSize,
      });
      const result = await this.productsReportUseCase.execute(query);
      ApiResponder.ok(req, res, result);
    } catch (err) {
      next(err);
    }
  };
}
