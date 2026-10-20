import { ModulePermission } from '@modules/roles/domain/entities/role.entity';

/**
 * Canonical list of all system modules and their allowed actions.
 * Must stay in sync with backoffice/src/features/roles/constants/modules.ts
 */
export const SYSTEM_MODULE_ACTIONS: Record<string, string[]> = {
  dashboard:  ['view'],
  products:   ['view', 'create', 'edit', 'delete'],
  users:      ['view', 'create', 'edit', 'delete'],
  clients:    ['view', 'create', 'edit', 'delete'],
  orders:     ['view', 'edit'],
  suppliers:  ['view', 'create', 'edit', 'delete'],
  purchases:  ['view', 'create', 'edit'],
  inventory:  ['view'],
  alerts:     ['view'],
  discounts:  ['view', 'create', 'edit'],
  reports:    ['view'],
  audit:      ['view'],
  roles:      ['view', 'create', 'edit'],
};

/**
 * Returns true when the permissions array grants full access to every module
 * and action defined in the system — equivalent to super-admin (empty array).
 */
export function isFullAccess(permissions: ModulePermission[]): boolean {
  return Object.entries(SYSTEM_MODULE_ACTIONS).every(([moduleId, actions]) => {
    const entry = permissions.find((p) => p.module === moduleId);
    return entry !== undefined && actions.every((a) => entry.actions.includes(a));
  });
}
