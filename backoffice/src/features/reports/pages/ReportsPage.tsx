import { useState } from 'react';
import {
  BarChart2,
  TrendingUp,
  Package,
  AlertTriangle,
  ArrowRightLeft,
  Search,
  ShoppingCart,
  DollarSign,
  Hash,
} from 'lucide-react';
import { useGetSalesReportQuery, useGetInventoryReportQuery, type ReportPeriod } from '@features/reports/api/reportsApi';
import { Badge } from '@shared/components/ui/Badge';
import { Spinner } from '@shared/components/ui/Spinner';
import { formatCurrency } from '@shared/utils/formatCurrency';
import {
  filterMovementsByType,
  filterLowStockByName,
  filterOrdersByStatus,
  type MovementFilter,
} from '../utils/reportFilters';

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

const MOVEMENT_FILTER_OPTIONS: { label: string; value: MovementFilter }[] = [
  { label: 'Todos', value: 'all' },
  { label: 'Compra', value: 'purchase' },
  { label: 'Venta', value: 'sale' },
  { label: 'Devolución', value: 'return' },
  { label: 'Ajuste', value: 'adjustment' },
];

const MOVEMENT_LABELS: Record<string, string> = {
  purchase: 'Compra',
  sale: 'Venta',
  return: 'Devolución',
  adjustment: 'Ajuste',
};

const MOVEMENT_VARIANTS: Record<string, 'success' | 'info' | 'warning' | 'default'> = {
  purchase: 'success',
  sale: 'info',
  return: 'warning',
  adjustment: 'default',
};

type ActiveTab = 'sales' | 'inventory';

interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  icon: React.ReactNode;
  accent?: string;
}

function StatCard({ label, value, sub, icon, accent = '#006b58' }: Readonly<StatCardProps>) {
  return (
    <div className="bg-white border border-outline-variant rounded-xl p-5 shadow-soft flex items-start gap-4">
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
        style={{ backgroundColor: `${accent}18`, color: accent }}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-[0.06em]">{label}</p>
        <p className="text-[22px] font-bold text-on-surface tracking-tight mt-0.5 leading-none">{value}</p>
        {sub && <p className="text-body-sm text-on-surface-variant mt-1">{sub}</p>}
      </div>
    </div>
  );
}

function SectionError({ message }: Readonly<{ message: string }>) {
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

function TableHeader({ count, children }: Readonly<{ count?: number; children: React.ReactNode }>) {
  return (
    <div className="px-5 h-12 flex items-center justify-between gap-4 border-b border-outline-variant">
      <div className="flex items-center gap-2">{children}</div>
      {count !== undefined && (
        <span className="inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-full bg-surface-container text-[11px] font-semibold text-on-surface-variant tabular-nums">
          {count}
        </span>
      )}
    </div>
  );
}

function EmptyRow({ colSpan, message }: Readonly<{ colSpan: number; message: string }>) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-5 py-8 text-center text-on-surface-variant">
        {message}
      </td>
    </tr>
  );
}

export function ReportsPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('sales');
  const [period, setPeriod] = useState<ReportPeriod>('month');
  const [statusFilter, setStatusFilter] = useState('all');
  const [movementFilter, setMovementFilter] = useState<MovementFilter>('all');
  const [lowStockSearch, setLowStockSearch] = useState('');

  const { data: salesData, isLoading: salesLoading, isError: salesError } =
    useGetSalesReportQuery({ period });

  const { data: inventoryData, isLoading: inventoryLoading, isError: inventoryError } =
    useGetInventoryReportQuery();

  const filteredOrders = salesData
    ? filterOrdersByStatus(salesData.ordersByStatus, statusFilter)
    : {};

  const filteredMovements = inventoryData
    ? filterMovementsByType(inventoryData.recentMovements, movementFilter)
    : [];

  const filteredLowStock = inventoryData
    ? filterLowStockByName(inventoryData.lowStockProducts, lowStockSearch)
    : [];

  return (
    <div className="space-y-6">
      {/* Page header */}
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

      {/* Tabs */}
      <div className="flex gap-1 bg-surface-container p-1 rounded-xl w-fit">
        <button
          type="button"
          onClick={() => setActiveTab('sales')}
          className={`flex items-center gap-2 h-9 px-4 rounded-lg text-[13px] font-medium transition-colors ${
            activeTab === 'sales'
              ? 'bg-white text-on-surface shadow-soft'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <TrendingUp size={15} />
          Ventas
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('inventory')}
          className={`flex items-center gap-2 h-9 px-4 rounded-lg text-[13px] font-medium transition-colors ${
            activeTab === 'inventory'
              ? 'bg-white text-on-surface shadow-soft'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <Package size={15} />
          Inventario
        </button>
      </div>

      {/* ── Sales tab ── */}
      {activeTab === 'sales' && (
        <div className="space-y-5">
          {/* Period filter */}
          <div className="flex items-center gap-1 bg-surface-container rounded-lg p-1 w-fit">
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

          {salesLoading ? (
            <SectionLoading />
          ) : salesError || !salesData ? (
            <SectionError message="No se pudo cargar el reporte de ventas." />
          ) : (
            <div className="space-y-5">
              {/* Stat cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard
                  label="Total órdenes"
                  value={salesData.totalOrders.toLocaleString('es-GT')}
                  icon={<ShoppingCart size={18} strokeWidth={1.75} />}
                />
                <StatCard
                  label="Ingresos totales"
                  value={formatCurrency(salesData.totalRevenue)}
                  icon={<DollarSign size={18} strokeWidth={1.75} />}
                  accent="#1a6b3f"
                />
                <StatCard
                  label="Valor promedio"
                  value={formatCurrency(salesData.averageOrderValue)}
                  icon={<Hash size={18} strokeWidth={1.75} />}
                  accent="#5b5bd6"
                />
              </div>

              {/* Orders by status */}
              <div className="bg-white border border-outline-variant rounded-xl shadow-soft overflow-hidden">
                <div className="px-5 h-14 flex items-center justify-between gap-4 border-b border-outline-variant">
                  <h3 className="text-[14px] font-semibold text-on-surface">Órdenes por estado</h3>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="h-8 pl-3 pr-7 bg-surface-container border border-outline-variant rounded-md text-[12px] text-on-surface focus:outline-none focus:ring-[3px] focus:ring-[#006b58]/10 focus:border-primary"
                  >
                    <option value="all">Todos los estados</option>
                    {Object.keys(salesData.ordersByStatus).map((key) => (
                      <option key={key} value={key}>
                        {STATUS_LABELS[key] ?? key}
                      </option>
                    ))}
                  </select>
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
                            {(count as number).toLocaleString('es-GT')}
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

              {/* Top products */}
              <div className="bg-white border border-outline-variant rounded-xl shadow-soft overflow-hidden">
                <TableHeader count={salesData.topProducts.length}>
                  <h3 className="text-[14px] font-semibold text-on-surface">Top productos</h3>
                </TableHeader>
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
                      {salesData.topProducts.slice(0, 5).map((p, idx) => (
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
                      {salesData.topProducts.length === 0 && (
                        <EmptyRow colSpan={4} message="Sin datos de productos para este período." />
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Inventory tab ── */}
      {activeTab === 'inventory' && (
        <div className="space-y-5">
          {inventoryLoading ? (
            <SectionLoading />
          ) : inventoryError || !inventoryData ? (
            <SectionError message="No se pudo cargar el reporte de inventario." />
          ) : (
            <div className="space-y-5">
              {/* Stat cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <StatCard
                  label="Total productos"
                  value={inventoryData.totalProducts.toLocaleString('es-GT')}
                  icon={<Package size={18} strokeWidth={1.75} />}
                />
                <StatCard
                  label="Valor total de stock"
                  value={formatCurrency(inventoryData.totalStockValue)}
                  icon={<DollarSign size={18} strokeWidth={1.75} />}
                  accent="#1a6b3f"
                />
              </div>

              {/* Low stock with search filter */}
              <div className="bg-white border border-outline-variant rounded-xl shadow-soft overflow-hidden">
                <div className="px-5 h-14 flex items-center justify-between gap-4 border-b border-outline-variant">
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={14} className="text-amber-500" />
                    <h3 className="text-[14px] font-semibold text-on-surface">Stock bajo</h3>
                  </div>
                  <div className="relative">
                    <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Buscar producto…"
                      value={lowStockSearch}
                      onChange={(e) => setLowStockSearch(e.target.value)}
                      className="h-8 pl-7 pr-3 bg-surface-container border border-outline-variant rounded-md text-[12px] text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-[3px] focus:ring-[#006b58]/10 focus:border-primary w-44"
                    />
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-body-md">
                    <thead>
                      <tr className="border-b border-outline-variant bg-surface-container-low">
                        <th className="px-5 h-9 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-on-surface-variant">Producto</th>
                        <th className="px-5 h-9 text-right text-[11px] font-semibold uppercase tracking-[0.06em] text-on-surface-variant">Stock</th>
                        <th className="px-5 h-9 text-right text-[11px] font-semibold uppercase tracking-[0.06em] text-on-surface-variant">Mínimo</th>
                        <th className="px-5 h-9 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-on-surface-variant">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant">
                      {filteredLowStock.map((p) => {
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
                      {filteredLowStock.length === 0 && (
                        <EmptyRow
                          colSpan={4}
                          message={
                            lowStockSearch
                              ? `Sin resultados para "${lowStockSearch}".`
                              : 'No hay productos con stock bajo.'
                          }
                        />
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Recent movements with type filter */}
              <div className="bg-white border border-outline-variant rounded-xl shadow-soft overflow-hidden">
                <div className="px-5 h-14 flex items-center justify-between gap-4 border-b border-outline-variant">
                  <div className="flex items-center gap-2">
                    <ArrowRightLeft size={14} className="text-[#006b58]" />
                    <h3 className="text-[14px] font-semibold text-on-surface">Movimientos recientes</h3>
                  </div>
                  <div className="flex items-center gap-1 bg-surface-container rounded-lg p-1">
                    {MOVEMENT_FILTER_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setMovementFilter(opt.value)}
                        className={`h-6 px-2.5 rounded-md text-[11px] font-medium transition-colors ${
                          movementFilter === opt.value
                            ? 'bg-white text-on-surface shadow-soft'
                            : 'text-on-surface-variant hover:text-on-surface'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
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
                      {filteredMovements.map((m) => (
                        <tr key={m.id} className="hover:bg-surface-container-low transition-colors">
                          <td className="px-5 py-3 font-medium text-on-surface">{m.productName}</td>
                          <td className="px-5 py-3">
                            <Badge variant={MOVEMENT_VARIANTS[m.type] ?? 'default'}>
                              {MOVEMENT_LABELS[m.type] ?? m.type}
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
                      {filteredMovements.length === 0 && (
                        <EmptyRow colSpan={4} message="No hay movimientos para el tipo seleccionado." />
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
