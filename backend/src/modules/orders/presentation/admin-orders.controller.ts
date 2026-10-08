import { Request, Response, NextFunction } from 'express';
import { ListAllOrdersUseCase } from '@modules/orders/application/use-cases/list-all-orders.use-case';
import { UpdateOrderStatusUseCase } from '@modules/orders/application/use-cases/update-order-status.use-case';
import { ApiResponder } from '@shared/infrastructure/http/response.builder';

export class AdminOrdersController {
  constructor(
    private readonly listAllOrdersUseCase: ListAllOrdersUseCase,
    private readonly updateOrderStatusUseCase: UpdateOrderStatusUseCase,
  ) {}

  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.listAllOrdersUseCase.execute({
        limit: Number(req.query.limit) || 20,
        cursor: req.query.cursor as string | undefined,
      });
      ApiResponder.ok(req, res, result);
    } catch (err) {
      next(err);
    }
  };

  updateStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      await this.updateOrderStatusUseCase.execute(id ?? '', req.body.status);
      ApiResponder.ok(req, res, { message: 'Estado actualizado' });
    } catch (err) {
      next(err);
    }
  };
}
