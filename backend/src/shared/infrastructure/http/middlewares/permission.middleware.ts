import { Response, NextFunction } from 'express';
import { ForbiddenException } from '@shared/domain/exceptions/domain.exception';
import { DynamoRoleRepository } from '@modules/roles/infrastructure/persistence/dynamo-role.repository';
import { dynamoClient, TABLE_NAME } from '@shared/infrastructure/dynamodb/dynamodb.client';
import { isFullAccess } from '@shared/domain/constants/system-modules';
import { AuthenticatedRequest } from './auth.middleware';

const roleRepository = new DynamoRoleRepository(dynamoClient, TABLE_NAME);

/**
 * Verifica que el rol del usuario tenga permiso para ejecutar `action` sobre `module`.
 * Si el rol no tiene permisos definidos (array vacío) se trata como super-admin y se permite todo.
 */
export function requirePermission(module: string, action: string) {
  return async (
    req: AuthenticatedRequest,
    _res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const roleName = req.user?.role;
      if (!roleName) {
        return next(new ForbiddenException('Rol no identificado'));
      }

      const role = await roleRepository.findByName(roleName);

      // Rol sin entidad en BD, sin permisos, o con acceso total = super-admin
      if (!role || role.permissions.length === 0 || isFullAccess(role.permissions)) {
        return next();
      }

      const modulePerms = role.permissions.find((p) => p.module === module);
      if (!modulePerms || !modulePerms.actions.includes(action)) {
        return next(
          new ForbiddenException(
            `No tienes permiso para realizar esta acción en el módulo "${module}"`,
          ),
        );
      }

      next();
    } catch (err) {
      next(err);
    }
  };
}
