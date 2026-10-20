import { useState } from 'react';
import { BarChart2, TrendingUp, Package, AlertTriangle, ArrowRightLeft } from 'lucide-react';
import { useGetSalesReportQuery, useGetInventoryReportQuery, type ReportPeriod } from '@features/reports/api/reportsApi';
import { Badge } from '@shared/components/ui/Badge';
import { Spinner } from '@shared/components/ui/Spinner';
import { formatCurrency } from '@shared/utils/formatCurrency';

const PERIOD_OPTIONS: { label: string; value: ReportPeriod }[] = [
  { label: 'Hoy', value: 'day' },
  { label: 'Semana', value: 'week' },
  { label: 'Mes', value: 'month' },
];

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

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-white border border-outline-variant rounded-xl p-5 shadow-soft">
      <p className="text-[12px] font-medium text-on-surface-variant uppercase tracking-wide">{label}</p>
      <p className="text-[26px] font-bold text-on-surface tracking-tight mt-1">{value}</p>
      {sub && <p className="text-body-md text-on-surface-variant mt-0.5">{sub}</p>}
    </div>
  );
}

function SectionError({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-2 py-8 justify-center text-error">
      <AlertTriangle size={16} />
      <p className="text-body-md">{message}</p>
    </div>
  );
}

function SectionLoading() {
  return (
    <div className="flex items-center justify-center py-12">
      <Spinner size="lg" />
    </div>
  );
}

export function ReportsPage() {
  const [period, setPeriod] = useState<ReportPeriod>('month');

  const {
    data: salesData,
    isLoading: salesLoading,
    isError: salesError,
  } = useGetSalesReportQuery({ period });

  const {
    data: inventoryData,
    isLoading: inventoryLoading,
    isError: inventoryError,
  } = useGetInventoryReportQuery();

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-xl bg-[#ddfbf2] text-[#006b58] flex items-center justify-center shrink-0 ring-1 ring-inset ring-[#006b58]/10">
          <BarChart2 size={20} strokeWidth={1.75} />
        </div>
        <div>
          <h1 className="text-[24px] font-bold tracking-[-0.02em] leading-tight text-on-surface">
            Reportes
          </h1>
          <p className="text-body-md text-on-surface-variant mt-0.5">
            Análisis de ventas e inventario
          </p>
        </div>
      </div>

      {/* ── Sales Report ── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-[#006b58]" />
            <h2 className="text-[16px] font-semibold text-on-surface">Reporte de ventas</h2>
          </div>
          <div className="flex items-center gap-1 bg-surface-container rounded-lg p-1">
            {PERIOD_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setPeriod(opt.value)}
                className={`h-7 px-3 rounded-md text-[13px] font-medium transition-colors ${
                  period === opt.value
                    ? 'bg-white text-on-surface shadow-soft'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {salesLoading ? (
          <SectionLoading />
        ) : salesError || !salesData ? (
          <SectionError message="No se pudo cargar el reporte de ventas." />
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard label="Total órdenes" value={salesData.totalOrders.toLocaleString('es-GT')} />
              <StatCard label="Ingresos totales" value={formatCurrency(salesData.totalRevenue)} />
              <StatCard label="Valor promedio" value={formatCurrency(salesData.averageOrderValue)} />
            </div>

            {/* Orders by status */}
            <div className="bg-white border border-outline-variant rounded-xl shadow-soft overflow-hidden">
              <div className="px-5 h-12 flex items-center border-b border-outline-variant">
                <h3 className="text-[14px] font-semibold text-on-surface">Órdenes por estado</h3>
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
                    {Object.entries(salesData.ordersByStatus).map(([key, count]) => (
                      <tr key={key} className="hover:bg-surface-container-low transition-colors">
                        <td className="px-5 py-3">
                          <Badge variant={STATUS_VARIANTS[key] ?? 'default'}>
                            {STATUS_LABELS[key] ?? key}
                          </Badge>
                        </td>
                        <td className="px-5 py-3 text-right font-semibold tabular-nums text-on-surface">
                          {(count as number).toLocaleString('es-GT')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top products */}
            <div className="bg-white border border-outline-variant rounded-xl shadow-soft overflow-hidden">
              <div className="px-5 h-12 flex items-center border-b border-outline-variant">
                <h3 className="text-[14px] font-semibold text-on-surface">Top 5 productos</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-body-md">
                  <thead>
                    <tr className="border-b border-outline-variant bg-surface-container-low">
                      <th className="px-5 h-9 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-on-surface-variant">Producto</th>
                      <th className="px-5 h-9 text-right text-[11px] font-semibold uppercase tracking-[0.06em] text-on-surface-variant">Unidades</th>
                      <th className="px-5 h-9 text-right text-[11px] font-semibold uppercase tracking-[0.06em] text-on-surface-variant">Ingresos</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant">
                    {salesData.topProducts.slice(0, 5).map((p) => (
                      <tr key={p.productId} className="hover:bg-surface-container-low transition-colors">
                        <td className="px-5 py-3 font-medium text-on-surface">{p.productName}</td>
                        <td className="px-5 py-3 text-right tabular-nums text-on-surface-variant">
                          {p.totalQuantity.toLocaleString('es-GT')}
                        </td>
                        <td className="px-5 py-3 text-right tabular-nums font-semibold text-on-surface">
                          {formatCurrency(p.totalRevenue)}
                        </td>
                      </tr>
                    ))}
                    {salesData.topProducts.length === 0 && (
                      <tr>
                        <td colSpan={3} className="px-5 py-8 text-center text-on-surface-variant">
                          Sin datos de productos para este período.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ── Inventory Report ── */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Package size={16} className="text-[#006b58]" />
          <h2 className="text-[16px] font-semibold text-on-surface">Reporte de inventario</h2>
        </div>

        {inventoryLoading ? (
          <SectionLoading />
        ) : inventoryError || !inventoryData ? (
          <SectionError message="No se pudo cargar el reporte de inventario." />
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <StatCard
                label="Total productos"
                value={inventoryData.totalProducts.toLocaleString('es-GT')}
              />
              <StatCard
                label="Valor total de stock"
                value={formatCurrency(inventoryData.totalStockValue)}
              />
            </div>

            {/* Low stock */}
            <div className="bg-white border border-outline-variant rounded-xl shadow-soft overflow-hidden">
              <div className="px-5 h-12 flex items-center gap-2 border-b border-outline-variant">
                <AlertTriangle size={14} className="text-amber-500" />
                <h3 className="text-[14px] font-semibold text-on-surface">Productos con stock bajo</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-body-md">
                  <thead>
                    <tr className="border-b border-outline-variant bg-surface-container-low">
                      <th className="px-5 h-9 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-on-surface-variant">Producto</th>
                      <th className="px-5 h-9 text-right text-[11px] font-semibold uppercase tracking-[0.06em] text-on-surface-variant">Stock actual</th>
                      <th className="px-5 h-9 text-right text-[11px] font-semibold uppercase tracking-[0.06em] text-on-surface-variant">Stock mínimo</th>
                      <th className="px-5 h-9 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-on-surface-variant">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant">
                    {inventoryData.lowStockProducts.map((p) => {
                      const isCritical = p.stock === 0 || p.stock < p.minStock * 0.5;
                      return (
                        <tr key={p.id} className="hover:bg-surface-container-low transition-colors">
                          <td className="px-5 py-3 font-medium text-on-surface">{p.name}</td>
                          <td className="px-5 py-3 text-right tabular-nums font-semibold text-on-surface">
                            {p.stock}
                          </td>
                          <td className="px-5 py-3 text-right tabular-nums text-on-surface-variant">
                            {p.minStock}
                          </td>
                          <td className="px-5 py-3">
                            <Badge variant={isCritical ? 'error' : 'warning'}>
                              {isCritical ? 'Crítico' : 'Advertencia'}
                            </Badge>
                          </td>
                        </tr>
                      );
                    })}
                    {inventoryData.lowStockProducts.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-5 py-8 text-center text-on-surface-variant">
                          No hay productos con stock bajo.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent movements */}
            <div className="bg-white border border-outline-variant rounded-xl shadow-soft overflow-hidden">
              <div className="px-5 h-12 flex items-center gap-2 border-b border-outline-variant">
                <ArrowRightLeft size={14} className="text-[#006b58]" />
                <h3 className="text-[14px] font-semibold text-on-surface">Movimientos recientes</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-body-md">
                  <thead>
                    <tr className="border-b border-outline-variant bg-surface-container-low">
                      <th className="px-5 h-9 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-on-surface-variant">Producto</th>
                      <th className="px-5 h-9 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-on-surface-variant">Tipo</th>
                      <th className="px-5 h-9 text-right text-[11px] font-semibold uppercase tracking-[0.06em] text-on-surface-variant">Cantidad</th>
                      <th className="px-5 h-9 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-on-surface-variant">Fecha</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant">
                    {inventoryData.recentMovements.map((m) => (
                      <tr key={m.id} className="hover:bg-surface-container-low transition-colors">
                        <td className="px-5 py-3 font-medium text-on-surface">{m.productName}</td>
                        <td className="px-5 py-3">
                          <Badge
                            variant={
                              m.type === 'purchase'
                                ? 'success'
                                : m.type === 'sale'
                                ? 'info'
                                : m.type === 'return'
                                ? 'warning'
                                : 'default'
                            }
                          >
                            {m.type === 'purchase'
                              ? 'Compra'
                              : m.type === 'sale'
                              ? 'Venta'
                              : m.type === 'return'
                              ? 'Devolución'
                              : 'Ajuste'}
                          </Badge>
                        </td>
                        <td className="px-5 py-3 text-right tabular-nums font-semibold text-on-surface">
                          {m.quantity}
                        </td>
                        <td className="px-5 py-3 text-on-surface-variant text-label-md">
                          {new Date(m.createdAt).toLocaleDateString('es-GT')}
                        </td>
                      </tr>
                    ))}
                    {inventoryData.recentMovements.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-5 py-8 text-center text-on-surface-variant">
                          No hay movimientos recientes.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
