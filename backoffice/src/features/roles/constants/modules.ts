export const SYSTEM_MODULES = [
  { id: 'dashboard',  label: 'Dashboard',   actions: ['view'] },
  { id: 'products',   label: 'Productos',   actions: ['view', 'create', 'edit', 'delete'] },
  { id: 'users',      label: 'Usuarios',    actions: ['view', 'create', 'edit', 'delete'] },
  { id: 'clients',    label: 'Clientes',    actions: ['view', 'create', 'edit', 'delete'] },
  { id: 'orders',     label: 'Órdenes',     actions: ['view', 'edit'] },
  { id: 'suppliers',  label: 'Proveedores', actions: ['view', 'create', 'edit', 'delete'] },
  { id: 'purchases',  label: 'Compras',     actions: ['view', 'create', 'edit'] },
  { id: 'inventory',  label: 'Inventario',  actions: ['view'] },
  { id: 'alerts',     label: 'Alertas',     actions: ['view'] },
  { id: 'discounts',  label: 'Descuentos',  actions: ['view', 'create', 'edit'] },
  { id: 'reports',    label: 'Reportes',    actions: ['view'] },
  { id: 'audit',      label: 'Auditoría',   actions: ['view'] },
  { id: 'roles',      label: 'Roles',       actions: ['view', 'create', 'edit'] },
] as const;

export type SystemModuleId = typeof SYSTEM_MODULES[number]['id'];

export const ACTION_LABELS: Record<string, string> = {
  view:   'Ver',
  create: 'Crear',
  edit:   'Editar',
  delete: 'Eliminar',
};

export const ALL_ACTIONS = ['view', 'create', 'edit', 'delete'] as const;

export const DEFAULT_ADMIN_PERMISSIONS = SYSTEM_MODULES.map((m) => ({
  module: m.id,
  actions: [...m.actions],
}));

export const DEFAULT_CLIENT_PERMISSIONS: { module: string; actions: string[] }[] = [];
