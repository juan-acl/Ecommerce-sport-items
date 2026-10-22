import { Request, Response, NextFunction } from 'express';
import { ListMovementsUseCase } from '@modules/inventory/application/use-cases/list-movements.use-case';
import { GetLowStockUseCase } from '@modules/inventory/application/use-cases/get-low-stock.use-case';
import { ApiResponder } from '@shared/infrastructure/http/response.builder';

export class InventoryController {
  constructor(
    private readonly listMovementsUseCase: ListMovementsUseCase,
    private readonly getLowStockUseCase: GetLowStockUseCase,
  ) {}

  listMovements = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const raw = parseInt((req.query.limit as string) ?? '50', 10);
      const limit = isNaN(raw) || raw < 1 ? 50 : Math.min(raw, 200);
      const cursor = req.query.cursor as string | undefined;
      const productId = req.query.productId as string | undefined;
      const result = await this.listMovementsUseCase.execute({ limit, cursor, productId });
      ApiResponder.ok(req, res, result);
    } catch (err) {
      next(err);
    }
  };

  getLowStock = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const alerts = await this.getLowStockUseCase.execute();
      ApiResponder.ok(req, res, { products: alerts });
    } catch (err) {
      next(err);
    }
  };
}
