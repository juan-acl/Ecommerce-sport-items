import { Modal } from '@shared/components/ui/Modal';
import { Badge } from '@shared/components/ui/Badge';
import { ArrowRight } from 'lucide-react';
import type { AuditLog } from '@shared/types/common';

const ACTION_LABELS: Record<string, string> = {
  PRODUCT_CREATED: 'Producto creado',
  PRODUCT_UPDATED: 'Producto actualizado',
  PRODUCT_DELETED: 'Producto eliminado',
  USER_CREATED: 'Usuario creado',
  USER_UPDATED: 'Usuario actualizado',
  USER_DEACTIVATED: 'Usuario desactivado',
  ORDER_STATUS_CHANGED: 'Estado de orden cambiado',
  ORDER_APPROVED: 'Orden aprobada',
  ORDER_REJECTED: 'Orden rechazada',
  DISCOUNT_CREATED: 'Descuento creado',
  DISCOUNT_TOGGLED: 'Descuento activado/desactivado',
};

const ENTITY_LABELS: Record<string, string> = {
  product: 'Producto',
  user: 'Usuario',
  order: 'Orden',
  discount: 'Descuento',
};

const FIELD_LABELS: Record<string, string> = {
  name: 'Nombre',
  category: 'Categoría',
  price: 'Precio',
  stock: 'Stock',
  minStock: 'Stock mínimo',
  description: 'Descripción',
  imageUrl: 'Imagen',
  email: 'Correo',
  role: 'Rol',
  isActive: 'Activo',
  status: 'Estado',
  code: 'Código',
  type: 'Tipo',
  value: 'Valor',
  minPurchase: 'Compra mínima',
  maxUses: 'Usos máximos',
  expiresAt: 'Expira',
  applicableCategories: 'Categorías aplicables',
  passwordChanged: 'Contraseña',
  total: 'Total',
  userId: 'ID Cliente',
};

const VALUE_LABELS: Record<string, string> = {
  // Order statuses
  paid: 'Confirmado',
  processing: 'En proceso',
  shipped: 'En tránsito',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
  // Discount types
  percentage: 'Porcentaje',
  fixed: 'Fijo',
  // Product categories
  running: 'Running',
  football: 'Fútbol',
  basketball: 'Baloncesto',
  tennis: 'Tenis',
  swimming: 'Natación',
  cycling: 'Ciclismo',
  fitness: 'Fitness',
  other: 'Otro',
  // Roles
  admin: 'Administrador',
  customer: 'Cliente',
  manager: 'Gerente',
};

function getActionVariant(action: string): 'success' | 'warning' | 'error' | 'info' | 'default' {
  const a = action.toLowerCase();
  if (a.includes('created') || a.includes('approved')) return 'success';
  if (a.includes('deleted') || a.includes('rejected') || a.includes('deactivated')) return 'error';
  if (a.includes('updated') || a.includes('changed') || a.includes('toggled')) return 'info';
  return 'default';
}

function formatVal(value: unknown): string {
  if (value === null || value === undefined) return '—';
  if (typeof value === 'boolean') return value ? 'Sí' : 'No';
  if (Array.isArray(value)) return value.length > 0 ? (value as string[]).map((v) => VALUE_LABELS[v] ?? v).join(', ') : '(ninguna)';
  if (typeof value === 'number') return String(value);
  if (typeof value === 'object') return JSON.stringify(value);
  const s = String(value);
  return (VALUE_LABELS[s] ?? s) || '—';
}

function Row({ label, value }: { label: string; value: unknown }) {
  return (
    <>
      <span className="text-on-surface-variant text-body-sm">{label}</span>
      <span className="text-on-surface text-body-sm font-medium break-all">{formatVal(value)}</span>
    </>
  );
}

function CreatedSection({ data }: { data: Record<string, unknown> }) {
  return (
    <section className="space-y-2">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant">Datos registrados</p>
      <div className="rounded-lg border border-outline-variant overflow-hidden">
        <div className="grid grid-cols-[140px_1fr] divide-y divide-outline-variant">
          {Object.entries(data).map(([key, val]) => (
            <div key={key} className="contents">
              <span className="px-3 py-2 text-on-surface-variant text-body-sm bg-surface-container-low">
                {FIELD_LABELS[key] ?? key}
              </span>
              <span className="px-3 py-2 text-on-surface text-body-sm font-medium break-all">
                {formatVal(val)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ChangesSection({ changes }: { changes: Record<string, { from: unknown; to: unknown }> }) {
  const entries = Object.entries(changes);
  if (entries.length === 0) {
    return (
      <section className="space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant">Cambios</p>
        <p className="text-body-sm text-on-surface-variant">Sin cambios detectados.</p>
      </section>
    );
  }
  return (
    <section className="space-y-2">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant">Cambios realizados</p>
      <div className="rounded-lg border border-outline-variant overflow-hidden divide-y divide-outline-variant">
        {/* Header */}
        <div className="grid grid-cols-[130px_1fr_24px_1fr] gap-x-2 px-3 py-1.5 bg-surface-container-low">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant">Campo</span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-error">Antes</span>
          <span />
          <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">Después</span>
        </div>
        {entries.map(([key, { from, to }]) => (
          <div key={key} className="grid grid-cols-[130px_1fr_24px_1fr] gap-x-2 items-center px-3 py-2">
            <span className="text-body-sm text-on-surface-variant font-medium">
              {FIELD_LABELS[key] ?? key}
            </span>
            <span className="text-body-sm text-error/80 bg-error/5 px-2 py-0.5 rounded truncate">
              {formatVal(from)}
            </span>
            <ArrowRight size={14} className="text-on-surface-variant shrink-0" />
            <span className="text-body-sm text-primary bg-primary/5 px-2 py-0.5 rounded truncate font-medium">
              {formatVal(to)}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

interface Props {
  log: AuditLog | null;
  onClose: () => void;
}

export function AuditDetailModal({ log, onClose }: Props) {
  if (!log) return null;

  const { created, deleted, changes, passwordChanged, ...extraDetails } = log.details as Record<string, unknown>;

  return (
    <Modal
      isOpen={!!log}
      onClose={onClose}
      title="Detalle del registro"
      className="max-w-2xl"
    >
      <div className="space-y-5">

        {/* Acción */}
        <section className="space-y-1.5">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant">Acción</p>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant={getActionVariant(log.action)}>{log.action}</Badge>
            {ACTION_LABELS[log.action] && (
              <span className="text-body-sm text-on-surface-variant">— {ACTION_LABELS[log.action]}</span>
            )}
          </div>
        </section>

        <hr className="border-outline-variant" />

        {/* Quién y cuándo */}
        <section className="space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant">Administrador</p>
          <div className="grid grid-cols-[140px_1fr] gap-y-1.5">
            <Row label="Correo" value={log.userEmail} />
            <Row label="ID usuario" value={log.userId} />
          </div>
        </section>

        <hr className="border-outline-variant" />

        {/* Entidad */}
        <section className="space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant">Entidad afectada</p>
          <div className="grid grid-cols-[140px_1fr] gap-y-1.5">
            <Row label="Tipo" value={ENTITY_LABELS[log.entityType] ?? log.entityType} />
            <span className="text-on-surface-variant text-body-sm">ID</span>
            <span className="font-mono text-xs text-on-surface-variant bg-surface-container px-2 py-1 rounded break-all">
              {log.entityId}
            </span>
          </div>
        </section>

        <hr className="border-outline-variant" />

        {/* Creación */}
        {created && typeof created === 'object' && (
          <CreatedSection data={created as Record<string, unknown>} />
        )}

        {/* Eliminación */}
        {deleted && typeof deleted === 'object' && (
          <section className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant">Datos al momento de la eliminación</p>
            <div className="rounded-lg border border-error/20 bg-error/5 overflow-hidden">
              <div className="grid grid-cols-[140px_1fr] divide-y divide-error/10">
                {Object.entries(deleted as Record<string, unknown>).map(([key, val]) => (
                  <div key={key} className="contents">
                    <span className="px-3 py-2 text-error/70 text-body-sm">{FIELD_LABELS[key] ?? key}</span>
                    <span className="px-3 py-2 text-error text-body-sm font-medium break-all">{formatVal(val)}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Cambios */}
        {changes && typeof changes === 'object' && (
          <ChangesSection changes={changes as Record<string, { from: unknown; to: unknown }>} />
        )}

        {/* Cambio de contraseña */}
        {passwordChanged && (
          <section className="space-y-1.5">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant">Contraseña</p>
            <p className="text-body-sm text-on-surface-variant">La contraseña fue modificada (no se almacena el valor).</p>
          </section>
        )}

        {/* Detalles extra (total, userId, etc.) */}
        {Object.keys(extraDetails).length > 0 && (
          <>
            <hr className="border-outline-variant" />
            <section className="space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant">Información adicional</p>
              <div className="grid grid-cols-[140px_1fr] gap-y-1.5">
                {Object.entries(extraDetails).map(([key, val]) => (
                  <Row key={key} label={FIELD_LABELS[key] ?? key} value={val} />
                ))}
              </div>
            </section>
          </>
        )}

        <hr className="border-outline-variant" />

        {/* Fecha */}
        <section className="space-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant">Fecha y hora</p>
          <p className="text-body-sm text-on-surface">
            {new Date(log.createdAt).toLocaleString('es-GT', {
              weekday: 'long', year: 'numeric', month: 'long',
              day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit',
            })}
          </p>
          <p className="text-[11px] font-mono text-on-surface-variant">{log.createdAt}</p>
        </section>

      </div>
    </Modal>
  );
}
