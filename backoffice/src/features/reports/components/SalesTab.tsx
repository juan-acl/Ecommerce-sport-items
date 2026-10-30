import { useState } from 'react';
import { ShoppingCart, DollarSign, Hash, Download } from 'lucide-react';
import { useGetSalesReportQuery, type ReportPeriod } from '@features/reports/api/reportsApi';
import { Badge } from '@shared/components/ui/Badge';
import { Button } from '@shared/components/ui/Button';
import { formatCurrency } from '@shared/utils/formatCurrency';
import { exportToCsv } from '@shared/utils/exportToCsv';
import { filterOrdersByStatus } from '../utils/reportFilters';
import { StatCard, SectionLoading, SectionError, EmptyRow, PeriodFilter } from './ReportShared';

const STATUS_LABELS: Record<string, string> = {
  paid: 'Confirmado',
  processing: 'En proceso',
  shipped: 'En tránsito',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
};

const STATUS_VARIANTS: Record<string, 'success' | 'warning' | 'info' | 'error' | 'default'> = {
  paid: 'success',
  processing: 'warning',
  shipped: 'info',
  delivered: 'success',
  cancelled: 'error',
};

export function SalesTab() {
  const [period, setPeriod] = useState<ReportPeriod>('month');
  const [statusFilter, setStatusFilter] = useState('all');

  const { data, isLoading, isError } = useGetSalesReportQuery({ period });

  const filteredOrders = data ? filterOrdersByStatus(data.ordersByStatus, statusFilter) : {};

  const handleExportTopProducts = () => {
    if (!data) return;
    exportToCsv(
      `top-productos-${period}.csv`,
      ['#', 'Producto', 'Unidades', 'Ingresos (GTQ)'],
      data.topProducts.map((p, i) => [
        String(i + 1),
        p.productName,
        String(p.totalQuantity),
        p.totalRevenue.toFixed(2),
      ]),
    );
  };

  const handleExportOrdersByStatus = () => {
    if (!data) return;
    exportToCsv(
      `ordenes-por-estado-${period}.csv`,
      ['Estado', 'Cantidad'],
      Object.entries(data.ordersByStatus).map(([key, count]) => [
        STATUS_LABELS[key] ?? key,
        String(count),
      ]),
    );
  };

  if (isLoading) return <SectionLoading />;
  if (isError || !data) return <SectionError message="No se pudo cargar el reporte de ventas." />;

  return (
    <div className="space-y-5">
      <PeriodFilter period={period} onChange={setPeriod} />

      <div className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            label="Total órdenes"
            value={data.totalOrders.toLocaleString('es-GT')}
            icon={<ShoppingCart size={18} strokeWidth={1.75} />}
          />
          <StatCard
            label="Ingresos totales"
            value={formatCurrency(data.totalRevenue)}
            icon={<DollarSign size={18} strokeWidth={1.75} />}
            accent="#1a6b3f"
          />
          <StatCard
            label="Valor promedio"
            value={formatCurrency(data.averageOrderValue)}
            icon={<Hash size={18} strokeWidth={1.75} />}
            accent="#5b5bd6"
          />
        </div>

        <div className="bg-white border border-outline-variant rounded-xl shadow-soft overflow-hidden">
          <div className="px-5 h-14 flex items-center justify-between gap-4 border-b border-outline-variant">
            <h3 className="text-[14px] font-semibold text-on-surface">Órdenes por estado</h3>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={handleExportOrdersByStatus}>
                <Download size={13} />
                Exportar
              </Button>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-8 pl-3 pr-7 bg-surface-container border border-outline-variant rounded-md text-[12px] text-on-surface focus:outline-none focus:ring-[3px] focus:ring-[#006b58]/10 focus:border-primary"
              >
                <option value="all">Todos los estados</option>
                {Object.keys(data.ordersByStatus).map((key) => (
                  <option key={key} value={key}>
                    {STATUS_LABELS[key] ?? key}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-body-md">
              <thead>
                <tr className="border-b border-outline-variant bg-surface-container-low">
                  <th className="px-5 h-9 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-on-surface-variant">Estado</th>
                  <th className="px-5 h-9 text-right text-[11px] font-semibold uppercase tracking-[0.06em] text-on-surface-variant">Cantidad</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {Object.entries(filteredOrders).map(([key, count]) => (
                  <tr key={key} className="hover:bg-surface-container-low transition-colors">
                    <td className="px-5 py-3">
                      <Badge variant={STATUS_VARIANTS[key] ?? 'default'}>
                        {STATUS_LABELS[key] ?? key}
                      </Badge>
                    </td>
                    <td className="px-5 py-3 text-right font-semibold tabular-nums text-on-surface">
                      {count.toLocaleString('es-GT')}
                    </td>
                  </tr>
                ))}
                {Object.keys(filteredOrders).length === 0 && (
                  <EmptyRow colSpan={2} message="No hay órdenes para el estado seleccionado." />
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white border border-outline-variant rounded-xl shadow-soft overflow-hidden">
          <div className="px-5 h-12 flex items-center justify-between gap-4 border-b border-outline-variant">
            <div className="flex items-center gap-2">
              <h3 className="text-[14px] font-semibold text-on-surface">Top productos</h3>
              <span className="inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-full bg-surface-container text-[11px] font-semibold text-on-surface-variant tabular-nums">
                {data.topProducts.length}
              </span>
            </div>
            <Button size="sm" variant="outline" onClick={handleExportTopProducts}>
              <Download size={13} />
              Exportar
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-body-md">
              <thead>
                <tr className="border-b border-outline-variant bg-surface-container-low">
                  <th className="px-5 h-9 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-on-surface-variant">#</th>
                  <th className="px-5 h-9 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-on-surface-variant">Producto</th>
                  <th className="px-5 h-9 text-right text-[11px] font-semibold uppercase tracking-[0.06em] text-on-surface-variant">Unidades</th>
                  <th className="px-5 h-9 text-right text-[11px] font-semibold uppercase tracking-[0.06em] text-on-surface-variant">Ingresos</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {data.topProducts.slice(0, 5).map((p, idx) => (
                  <tr key={p.productId} className="hover:bg-surface-container-low transition-colors">
                    <td className="px-5 py-3 tabular-nums text-on-surface-variant text-[13px] font-medium w-10">
                      {idx + 1}
                    </td>
                    <td className="px-5 py-3 font-medium text-on-surface">{p.productName}</td>
                    <td className="px-5 py-3 text-right tabular-nums text-on-surface-variant">
                      {p.totalQuantity.toLocaleString('es-GT')}
                    </td>
                    <td className="px-5 py-3 text-right tabular-nums font-semibold text-on-surface">
                      {formatCurrency(p.totalRevenue)}
                    </td>
                  </tr>
                ))}
                {data.topProducts.length === 0 && (
                  <EmptyRow colSpan={4} message="Sin datos de productos para este período." />
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
