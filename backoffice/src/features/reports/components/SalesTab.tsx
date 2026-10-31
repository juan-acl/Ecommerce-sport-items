import { useState, useMemo } from 'react';
import { ShoppingCart, DollarSign, Hash, Download } from 'lucide-react';
import { useGetSalesReportQuery, type ReportPeriod } from '@features/reports/api/reportsApi';
import { useGetOrdersQuery } from '@features/orders/api/ordersApi';
import { Badge } from '@shared/components/ui/Badge';
import { Button } from '@shared/components/ui/Button';
import { formatCurrency } from '@shared/utils/formatCurrency';
import { exportToCsv } from '@shared/utils/exportToCsv';
import { buildTrendBars } from '@features/dashboard/utils/dashboardUtils';
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

const STATUS_CHART_LABELS: Record<string, string> = {
  paid: 'Confirmado',
  processing: 'En proceso',
  shipped: 'En tránsito',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
};

const STATUS_CHART_COLORS: Record<string, string> = {
  paid: 'bg-secondary',
  processing: 'bg-amber-400',
  shipped: 'bg-primary',
  delivered: 'bg-emerald-500',
  cancelled: 'bg-red-400',
};

export function SalesTab() {
  const [period, setPeriod] = useState<ReportPeriod>('month');
  const [statusFilter, setStatusFilter] = useState('all');

  const { data, isLoading, isError } = useGetSalesReportQuery({ period });
  const { data: ordersData } = useGetOrdersQuery({ limit: 100 });

  const orders = ordersData?.items ?? [];
  const trendBars = useMemo(() => buildTrendBars(orders, period), [orders, period]);

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

  const totalStatusOrders = data
    ? Object.values(data.ordersByStatus).reduce((s, c) => s + c, 0)
    : 0;

  return (
    <div className="space-y-5">
      <PeriodFilter period={period} onChange={setPeriod} />

      <div className="bg-white border border-outline-variant rounded-xl shadow-soft" data-section="Tendencia de ingresos">
        <div className="px-5 pt-4 pb-3.5 border-b border-outline-variant">
          <p className="text-[14px] font-semibold tracking-tight text-on-surface">Tendencia de ingresos</p>
          <p className="text-label-md text-on-surface-variant mt-0.5">Ingresos confirmados por período</p>
        </div>
        <div className="px-5 py-5">
          <div className="flex items-end gap-1.5 h-24">
            {trendBars.map((bar, i) => {
              const maxRev = Math.max(...trendBars.map((b) => b.revenue), 1);
              const pct = maxRev > 0 ? Math.max((bar.revenue / maxRev) * 100, bar.revenue > 0 ? 4 : 0) : 0;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1" title={formatCurrency(bar.revenue)}>
                  <div className="w-full flex flex-col justify-end" style={{ height: '72px' }}>
                    <div
                      className={`w-full rounded-t transition-all ${bar.revenue > 0 ? 'bg-primary' : 'bg-outline-variant/40'}`}
                      style={{ height: `${pct}%`, minHeight: bar.orders > 0 ? '4px' : '0' }}
                    />
                  </div>
                  <span className="text-[9px] font-medium text-on-surface-variant capitalize leading-none">{bar.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {data && (
        <div className="bg-white border border-outline-variant rounded-xl shadow-soft" data-section="Distribución por estado">
          <div className="px-5 pt-4 pb-3.5 border-b border-outline-variant">
            <p className="text-[14px] font-semibold tracking-tight text-on-surface">Distribución por estado</p>
            <p className="text-label-md text-on-surface-variant mt-0.5">{data.totalOrders.toLocaleString('es-GT')} órdenes en total</p>
          </div>
          <div className="px-5 py-5 space-y-3">
            {Object.entries(data.ordersByStatus).map(([key, count]) => {
              const pct = totalStatusOrders > 0 ? Math.round((count / totalStatusOrders) * 100) : 0;
              const barClass = STATUS_CHART_COLORS[key] ?? 'bg-primary';
              const label = STATUS_CHART_LABELS[key] ?? key;
              return (
                <div key={key} data-bar-label={label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-body-md text-on-surface">{label}</span>
                    <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                      <span className="text-label-md text-on-surface-variant tabular-nums">{pct}%</span>
                      <span className="text-body-md font-semibold text-on-surface tabular-nums min-w-[28px] text-right">{count}</span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                    <div className={`h-full ${barClass} rounded-full`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

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
