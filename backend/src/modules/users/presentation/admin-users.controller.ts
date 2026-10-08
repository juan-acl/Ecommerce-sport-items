import { Request, Response, NextFunction } from 'express';
import { ListUsersUseCase } from '@modules/users/application/use-cases/list-users.use-case';
import { CreateUserAdminUseCase } from '@modules/users/application/use-cases/create-user-admin.use-case';
import { UpdateUserAdminUseCase } from '@modules/users/application/use-cases/update-user-admin.use-case';
import { DeactivateUserUseCase } from '@modules/users/application/use-cases/deactivate-user.use-case';
import { ApiResponder } from '@shared/infrastructure/http/response.builder';

export class AdminUsersController {
  constructor(
    private readonly listUsersUseCase: ListUsersUseCase,
    private readonly createUserAdminUseCase: CreateUserAdminUseCase,
    private readonly updateUserAdminUseCase: UpdateUserAdminUseCase,
    private readonly deactivateUserUseCase: DeactivateUserUseCase,
  ) {}

  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.listUsersUseCase.execute({
        limit: Number(req.query.limit) || 20,
        cursor: req.query.cursor as string | undefined,
        role: req.query.role as string | undefined,
      });
      ApiResponder.ok(req, res, result);
    } catch (err) {
      next(err);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await this.createUserAdminUseCase.execute(req.body);
      ApiResponder.created(req, res, user);
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const user = await this.updateUserAdminUseCase.execute(id ?? '', req.body);
      ApiResponder.ok(req, res, user);
    } catch (err) {
      next(err);
    }
  };

  deactivate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      await this.deactivateUserUseCase.execute(id ?? '');
      ApiResponder.noContent(res);
    } catch (err) {
      next(err);
    }
  };
}
