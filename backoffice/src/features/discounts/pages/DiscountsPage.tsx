import { useState } from 'react';
import { Percent, Plus, ToggleLeft, ToggleRight } from 'lucide-react';
import { toast } from 'sonner';
import { useGetDiscountsQuery, useToggleDiscountMutation } from '@features/discounts/api/discountsApi';
import { DiscountFormModal } from '@features/discounts/components/DiscountFormModal';
import { DataTable, type Column } from '@shared/components/ui/DataTable';
import { Badge } from '@shared/components/ui/Badge';
import { Button } from '@shared/components/ui/Button';
import { formatCurrency } from '@shared/utils/formatCurrency';
import type { Discount } from '@shared/types/common';

const LIMIT = 20;

export function DiscountsPage() {
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const { data, isLoading, isFetching } = useGetDiscountsQuery({ limit: LIMIT, cursor });
  const [toggleDiscount, { isLoading: isToggling }] = useToggleDiscountMutation();
  const [formOpen, setFormOpen] = useState(false);

  const discounts = data?.items ?? [];
  const hasMore = !!data?.nextCursor;

  const handleToggle = async (id: string, isActive: boolean) => {
    try {
      await toggleDiscount(id).unwrap();
      toast.success(isActive ? 'Descuento desactivado.' : 'Descuento activado.');
    } catch {
      toast.error('Error al cambiar el estado del descuento.');
    }
  };

  const columns: Column<Discount>[] = [
    {
      key: 'code',
      header: 'Código',
      sortable: true,
      sortValue: (d) => d.code,
      render: (d) => (
        <span className="font-mono text-xs font-semibold text-on-surface bg-surface-container px-2 py-1 rounded tracking-wider">
          {d.code}
        </span>
      ),
    },
    {
      key: 'type',
      header: 'Tipo',
      render: (d) => (
        <Badge variant={d.type === 'percentage' ? 'info' : 'warning'}>
          {d.type === 'percentage' ? 'Porcentaje' : 'Monto fijo'}
        </Badge>
      ),
    },
    {
      key: 'value',
      header: 'Valor',
      align: 'right',
      sortable: true,
      sortValue: (d) => d.value,
      render: (d) => (
        <span className="font-semibold text-on-surface">
          {d.type === 'percentage' ? `${d.value}%` : formatCurrency(d.value)}
        </span>
      ),
    },
    {
      key: 'applicableCategories',
      header: 'Categorías',
      render: (d) =>
        d.applicableCategories && d.applicableCategories.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {d.applicableCategories.map((cat) => (
              <span
                key={cat}
                className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant capitalize"
              >
                {cat}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-on-surface-variant text-label-sm">Todos</span>
        ),
    },
    {
      key: 'minPurchase',
      header: 'Compra mínima',
      align: 'right',
      render: (d) => (
        <span className="text-on-surface-variant">
          {d.minPurchase > 0 ? formatCurrency(d.minPurchase) : '—'}
        </span>
      ),
    },
    {
      key: 'uses',
      header: 'Usos',
      align: 'center',
      render: (d) => (
        <span className="text-on-surface-variant tabular-nums">
          {d.usedCount} / {d.maxUses === 0 ? '∞' : d.maxUses}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Estado',
      render: (d) => (
        <Badge variant={d.isActive ? 'success' : 'default'}>
          {d.isActive ? 'Activo' : 'Inactivo'}
        </Badge>
      ),
    },
    {
      key: 'expiresAt',
      header: 'Expira',
      render: (d) => (
        <span className="text-on-surface-variant text-label-md">
          {d.expiresAt ? new Date(d.expiresAt).toLocaleDateString('es-GT') : '—'}
        </span>
      ),
    },
    {
      key: 'action',
      header: 'Acción',
      width: '120px',
      render: (d) => (
        <Button
          size="sm"
          variant={d.isActive ? 'outline' : 'secondary'}
          onClick={() => handleToggle(d.id, d.isActive)}
          disabled={isToggling}
        >
          {d.isActive ? (
            <>
              <ToggleLeft size={13} />
              Desactivar
            </>
          ) : (
            <>
              <ToggleRight size={13} />
              Activar
            </>
          )}
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-xl bg-[#ddfbf2] text-[#006b58] flex items-center justify-center shrink-0 ring-1 ring-inset ring-[#006b58]/10">
          <Percent size={20} strokeWidth={1.75} />
        </div>
        <div>
          <h1 className="text-[24px] font-bold tracking-[-0.02em] leading-tight text-on-surface">
            Descuentos
          </h1>
          <p className="text-body-md text-on-surface-variant mt-0.5">
            Gestión de códigos de descuento
          </p>
        </div>
      </div>

      <DataTable
        data={discounts}
        columns={columns}
        keyExtractor={(d) => d.id}
        isLoading={isLoading}
        title="Descuentos"
        totalLabel="descuentos"
        actions={
          <Button size="sm" onClick={() => setFormOpen(true)}>
            <Plus size={14} />
            Nuevo descuento
          </Button>
        }
        searchFilter={(d, q) =>
          d.code.toLowerCase().includes(q) ||
          d.type.toLowerCase().includes(q)
        }
        searchPlaceholder="Buscar por código..."
        emptyTitle="No hay descuentos"
        emptyDescription="Los códigos de descuento aparecerán aquí."
        emptyIcon={Percent}
        serverPagination={{
          hasMore,
          onLoadMore: () => setCursor(data?.nextCursor),
          isLoading: isFetching,
        }}
      />

      <DiscountFormModal isOpen={formOpen} onClose={() => setFormOpen(false)} />
    </div>
  );
}
