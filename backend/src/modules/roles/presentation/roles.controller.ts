import { Request, Response, NextFunction } from 'express';
import { ListRolesUseCase } from '@modules/roles/application/use-cases/list-roles.use-case';
import { GetRoleUseCase } from '@modules/roles/application/use-cases/get-role.use-case';
import { CreateRoleUseCase } from '@modules/roles/application/use-cases/create-role.use-case';
import { UpdateRoleUseCase } from '@modules/roles/application/use-cases/update-role.use-case';
import { CreateRoleSchema } from '@modules/roles/application/dtos/create-role.dto';
import { UpdateRoleSchema } from '@modules/roles/application/dtos/update-role.dto';
import { ApiResponder } from '@shared/infrastructure/http/response.builder';

export class RolesController {
  constructor(
    private readonly listRolesUseCase: ListRolesUseCase,
    private readonly getRoleUseCase: GetRoleUseCase,
    private readonly createRoleUseCase: CreateRoleUseCase,
    private readonly updateRoleUseCase: UpdateRoleUseCase,
  ) {}

  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const roles = await this.listRolesUseCase.execute();
      ApiResponder.ok(req, res, roles);
    } catch (err) {
      next(err);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const role = await this.getRoleUseCase.execute(id ?? '');
      ApiResponder.ok(req, res, role);
    } catch (err) {
      next(err);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = CreateRoleSchema.parse(req.body);
      const role = await this.createRoleUseCase.execute(dto);
      ApiResponder.created(req, res, role);
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const dto = UpdateRoleSchema.parse(req.body);
      const role = await this.updateRoleUseCase.execute(id ?? '', dto);
      ApiResponder.ok(req, res, role);
    } catch (err) {
      next(err);
    }
  };
}
