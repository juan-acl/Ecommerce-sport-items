import { Request, Response, NextFunction } from 'express';
import { ListUsersUseCase } from '@modules/users/application/use-cases/list-users.use-case';
import { GetUserByIdUseCase } from '@modules/users/application/use-cases/get-user-by-id.use-case';
import { CreateUserAdminUseCase } from '@modules/users/application/use-cases/create-user-admin.use-case';
import { UpdateUserAdminUseCase } from '@modules/users/application/use-cases/update-user-admin.use-case';
import { DeactivateUserUseCase } from '@modules/users/application/use-cases/deactivate-user.use-case';
import { CreateAuditLogUseCase } from '@modules/audit/application/use-cases/create-audit-log.use-case';
import { ApiResponder } from '@shared/infrastructure/http/response.builder';

type AdminReq = Request & { user?: { id: string; email: string } };

function buildDiff(
  before: Record<string, unknown>,
  updates: Record<string, unknown>,
): Record<string, { from: unknown; to: unknown }> {
  const changes: Record<string, { from: unknown; to: unknown }> = {};
  for (const [key, newVal] of Object.entries(updates)) {
    if (key === 'id' || key === 'createdAt' || key === 'password') continue;
    const oldVal = before[key];
    if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
      changes[key] = { from: oldVal ?? null, to: newVal };
    }
  }
  return changes;
}

export class AdminUsersController {
  constructor(
    private readonly listUsersUseCase: ListUsersUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
    private readonly createUserAdminUseCase: CreateUserAdminUseCase,
    private readonly updateUserAdminUseCase: UpdateUserAdminUseCase,
    private readonly deactivateUserUseCase: DeactivateUserUseCase,
    private readonly auditUseCase?: CreateAuditLogUseCase,
  ) {}

  private audit(req: AdminReq, action: string, entityId: string, details: Record<string, unknown>) {
    if (!this.auditUseCase) return;
    this.auditUseCase.execute({
      userId: req.user?.id ?? 'unknown',
      userEmail: req.user?.email ?? 'unknown',
      action,
      entityType: 'user',
      entityId,
      details,
    }).catch(() => undefined);
  }

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

  create = async (req: AdminReq, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await this.createUserAdminUseCase.execute(req.body);
      this.audit(req, 'USER_CREATED', user.id, {
        created: { email: user.email, name: user.name, role: user.role },
      });
      ApiResponder.created(req, res, user);
    } catch (err) {
      next(err);
    }
  };

  update = async (req: AdminReq, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      let beforeData: Record<string, unknown> = {};
      try {
        const before = await this.getUserByIdUseCase.execute(id ?? '');
        const { passwordHash: _pw, ...safeFields } = before as Record<string, unknown>;
        beforeData = safeFields;
      } catch { /* continúa */ }

      const user = await this.updateUserAdminUseCase.execute(id ?? '', req.body);
      const updates = req.body as Record<string, unknown>;
      const safeUpdates: Record<string, unknown> = {};
      for (const key of Object.keys(updates)) {
        if (key !== 'password') safeUpdates[key] = updates[key];
      }
      const changes = buildDiff(beforeData, safeUpdates);
      const detail: Record<string, unknown> = { changes };
      if ((req.body as Record<string, unknown>).password) {
        detail.passwordChanged = true;
      }
      this.audit(req, 'USER_UPDATED', id ?? '', detail);
      ApiResponder.ok(req, res, user);
    } catch (err) {
      next(err);
    }
  };

  deactivate = async (req: AdminReq, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      let beforeData: Record<string, unknown> = {};
      try {
        const before = await this.getUserByIdUseCase.execute(id ?? '');
        beforeData = { email: (before as Record<string, unknown>).email, name: (before as Record<string, unknown>).name, role: (before as Record<string, unknown>).role };
      } catch { /* continúa */ }

      await this.deactivateUserUseCase.execute(id ?? '');
      this.audit(req, 'USER_DEACTIVATED', id ?? '', { deleted: beforeData });
      ApiResponder.noContent(res);
    } catch (err) {
      next(err);
    }
  };
}
