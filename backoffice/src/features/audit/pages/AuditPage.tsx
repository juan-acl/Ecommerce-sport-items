import { useState } from 'react';
import { ShieldCheck, ClipboardList, Eye } from 'lucide-react';
import { useGetAuditLogsQuery } from '@features/audit/api/auditApi';
import { AuditDetailModal } from '@features/audit/components/AuditDetailModal';
import { DataTable, type Column } from '@shared/components/ui/DataTable';
import { Badge } from '@shared/components/ui/Badge';
import { Button } from '@shared/components/ui/Button';
import type { AuditLog } from '@shared/types/common';

const LIMIT = 20;

function getActionVariant(action: string): 'success' | 'warning' | 'error' | 'info' | 'default' {
  const a = action.toLowerCase();
  if (a.includes('created') || a.includes('approved')) return 'success';
  if (a.includes('deleted') || a.includes('rejected') || a.includes('deactivated')) return 'error';
  if (a.includes('updated') || a.includes('changed') || a.includes('toggled')) return 'info';
  return 'default';
}

const ACTION_LABELS: Record<string, string> = {
  PRODUCT_CREATED: 'Producto creado',
  PRODUCT_UPDATED: 'Producto actualizado',
  PRODUCT_DELETED: 'Producto eliminado',
  USER_CREATED: 'Usuario creado',
  USER_UPDATED: 'Usuario actualizado',
  USER_DEACTIVATED: 'Usuario desactivado',
  ORDER_STATUS_CHANGED: 'Estado de orden cambiado',
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
  name: 'Nombre', category: 'Categoría', price: 'Precio', stock: 'Stock',
  email: 'Correo', role: 'Rol', isActive: 'Activo', status: 'Estado',
  code: 'Código', type: 'Tipo', value: 'Valor',
};

const VALUE_LABELS: Record<string, string> = {
  paid: 'Confirmado', processing: 'En proceso', shipped: 'En tránsito',
  delivered: 'Entregado', cancelled: 'Cancelado',
  percentage: 'Porcentaje', fixed: 'Fijo',
};

function translateVal(v: unknown): string {
  if (v === null || v === undefined) return '—';
  if (typeof v === 'boolean') return v ? 'Sí' : 'No';
  if (Array.isArray(v)) return (v as string[]).map((s) => VALUE_LABELS[s] ?? s).join(', ') || '(ninguna)';
  if (typeof v === 'object') return '';
  const s = String(v);
  return VALUE_LABELS[s] ?? s;
}

function summarizeDetails(details: Record<string, unknown>): string {
  const { changes, created, deleted } = details as {
    changes?: Record<string, { from: unknown; to: unknown }>;
    created?: Record<string, unknown>;
    deleted?: Record<string, unknown>;
  };

  if (changes && typeof changes === 'object') {
    const entries = Object.entries(changes);
    if (entries.length > 0) {
      const [field, diff] = entries[0];
      if (diff && typeof diff === 'object' && 'from' in diff && 'to' in diff) {
        const label = FIELD_LABELS[field] ?? field;
        return `${label}: ${translateVal(diff.from)} → ${translateVal(diff.to)}`;
      }
    }
  }

  if (created && typeof created === 'object') {
    const entries = Object.entries(created);
    if (entries.length > 0) {
      const [field, val] = entries[0];
      return `${FIELD_LABELS[field] ?? field}: ${translateVal(val)}`;
    }
  }

  if (deleted && typeof deleted === 'object') {
    const entries = Object.entries(deleted);
    if (entries.length > 0) {
      const [field, val] = entries[0];
      return `${FIELD_LABELS[field] ?? field}: ${translateVal(val)}`;
    }
  }

  const extras = Object.entries(details).filter(([k]) => !['changes','created','deleted','passwordChanged'].includes(k));
  if (extras.length > 0) {
    const [key, val] = extras[0];
    return `${FIELD_LABELS[key] ?? key}: ${translateVal(val)}`;
  }

  return '—';
}

export function AuditPage() {
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const { data, isLoading, isFetching } = useGetAuditLogsQuery({ limit: LIMIT, cursor });

  const logs = data?.items ?? [];
  const hasMore = !!data?.nextCursor;

  const columns: Column<AuditLog>[] = [
    {
      key: 'createdAt',
      header: 'Fecha',
      sortable: true,
      sortValue: (l) => l.createdAt,
      render: (l) => (
        <span className="text-on-surface-variant text-label-md whitespace-nowrap">
          {new Date(l.createdAt).toLocaleString('es-GT')}
        </span>
      ),
    },
    {
      key: 'userEmail',
      header: 'Administrador',
      sortable: true,
      sortValue: (l) => l.userEmail,
      render: (l) => (
        <span className="text-on-surface-variant text-body-sm">{l.userEmail}</span>
      ),
    },
    {
      key: 'action',
      header: 'Acción',
      render: (l) => (
        <Badge variant={getActionVariant(l.action)}>
          {ACTION_LABELS[l.action] ?? l.action}
        </Badge>
      ),
    },
    {
      key: 'entityType',
      header: 'Entidad',
      sortable: true,
      sortValue: (l) => l.entityType,
      render: (l) => (
        <Badge variant="default">
          {ENTITY_LABELS[l.entityType] ?? l.entityType}
        </Badge>
      ),
    },
    {
      key: 'entityId',
      header: 'ID',
      render: (l) => (
        <span className="font-mono text-xs text-on-surface-variant bg-surface-container px-2 py-0.5 rounded">
          …{l.entityId.slice(-8).toUpperCase()}
        </span>
      ),
    },
    {
      key: 'details',
      header: 'Resumen',
      render: (l) => {
        const summary = summarizeDetails(l.details);
        return (
          <span className="text-body-sm text-on-surface truncate max-w-[200px] block">
            {summary.length > 40 ? summary.slice(0, 40) + '…' : summary}
          </span>
        );
      },
    },
    {
      key: 'action_btn',
      header: '',
      width: '80px',
      render: (l) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => setSelectedLog(l)}
          title="Ver detalle completo"
        >
          <Eye size={13} />
          Ver
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-xl bg-[#ddfbf2] text-[#006b58] flex items-center justify-center shrink-0 ring-1 ring-inset ring-[#006b58]/10">
          <ShieldCheck size={20} strokeWidth={1.75} />
        </div>
        <div>
          <h1 className="text-[24px] font-bold tracking-[-0.02em] leading-tight text-on-surface">
            Auditoría
          </h1>
          <p className="text-body-md text-on-surface-variant mt-0.5">
            Registro de actividad del sistema
          </p>
        </div>
      </div>

      <DataTable
        data={logs}
        columns={columns}
        keyExtractor={(l) => l.id}
        isLoading={isLoading}
        title="Registros de auditoría"
        totalLabel="registros"
        searchFilter={(l, q) =>
          l.userEmail.toLowerCase().includes(q) ||
          l.action.toLowerCase().includes(q) ||
          l.entityType.toLowerCase().includes(q) ||
          l.entityId.toLowerCase().includes(q)
        }
        searchPlaceholder="Buscar por usuario, acción o entidad..."
        emptyTitle="Sin registros de auditoría"
        emptyDescription="Las acciones del sistema aparecerán aquí."
        emptyIcon={ClipboardList}
        serverPagination={{
          hasMore,
          onLoadMore: () => setCursor(data?.nextCursor),
          isLoading: isFetching,
        }}
      />

      <AuditDetailModal
        log={selectedLog}
        onClose={() => setSelectedLog(null)}
      />
    </div>
  );
}
