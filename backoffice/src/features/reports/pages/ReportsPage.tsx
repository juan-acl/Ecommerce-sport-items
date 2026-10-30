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
  Download,
  Truck,
  Users,
} from 'lucide-react';
import {
  useGetSalesReportQuery,
  useGetInventoryReportQuery,
  useGetPurchasesReportQuery,
  useGetClientAnalyticsReportQuery,
  useGetProductsReportQuery,
  type ReportPeriod,
} from '@features/reports/api/reportsApi';
import type { StockStatus } from '@shared/types/common';
import { Badge } from '@shared/components/ui/Badge';
import { Button } from '@shared/components/ui/Button';
import { Spinner } from '@shared/components/ui/Spinner';
import { formatCurrency } from '@shared/utils/formatCurrency';
import { exportToCsv } from '@shared/utils/exportToCsv';
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

const PURCHASE_STATUS_LABELS: Record<string, string> = {
  pending: 'Pendiente',
  partial: 'Parcial',
  received: 'Recibido',
  cancelled: 'Cancelado',
};

const PURCHASE_STATUS_VARIANTS: Record<string, 'success' | 'warning' | 'info' | 'error' | 'default'> = {
  pending: 'warning',
  partial: 'info',
  received: 'success',
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

type ActiveTab = 'sales' | 'inventory' | 'purchases' | 'clients' | 'products';

function isStockCritical(stock: number, minStock: number): boolean {
  return stock === 0 || stock < minStock * 0.5;
}

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

function EmptyRow({ colSpan, message }: Readonly<{ colSpan: number; message: string }>) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-5 py-8 text-center text-on-surface-variant">
        {message}
      </td>
    </tr>
  );
}

function PeriodFilter({
  period,
  onChange,
}: Readonly<{ period: ReportPeriod; onChange: (p: ReportPeriod) => void }>) {
  return (
    <div className="flex items-center gap-1 bg-surface-container rounded-lg p-1 w-fit">
      {PERIOD_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
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
  );
}

export function ReportsPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('sales');
  const [salesPeriod, setSalesPeriod] = useState<ReportPeriod>('month');
  const [purchasesPeriod, setPurchasesPeriod] = useState<ReportPeriod>('month');
  const [clientsPeriod, setClientsPeriod] = useState<ReportPeriod>('month');
  const [statusFilter, setStatusFilter] = useState('all');
  const [movementFilter, setMovementFilter] = useState<MovementFilter>('all');
  const [lowStockSearch, setLowStockSearch] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [productName, setProductName] = useState('');
  const [productStockStatus, setProductStockStatus] = useState<StockStatus | ''>('');

  const { data: salesData, isLoading: salesLoading, isError: salesError } =
    useGetSalesReportQuery({ period: salesPeriod });

  const { data: inventoryData, isLoading: inventoryLoading, isError: inventoryError } =
    useGetInventoryReportQuery();

  const { data: purchasesData, isLoading: purchasesLoading, isError: purchasesError } =
    useGetPurchasesReportQuery({ period: purchasesPeriod });

  const { data: clientsData, isLoading: clientsLoading, isError: clientsError } =
    useGetClientAnalyticsReportQuery({ period: clientsPeriod });

  const { data: productsData, isLoading: productsLoading, isError: productsError } =
    useGetProductsReportQuery({
      ...(productCategory ? { category: productCategory } : {}),
      ...(productName ? { name: productName } : {}),
      ...(productStockStatus ? { stockStatus: productStockStatus } : {}),
    });

  const filteredOrders = salesData
    ? filterOrdersByStatus(salesData.ordersByStatus, statusFilter)
    : {};

  const filteredMovements = inventoryData
    ? filterMovementsByType(inventoryData.recentMovements, movementFilter)
    : [];

  const filteredLowStock = inventoryData
    ? filterLowStockByName(inventoryData.lowStockProducts, lowStockSearch)
    : [];

  const handleExportTopProducts = () => {
    if (!salesData) return;
    exportToCsv(
      `top-productos-${salesPeriod}.csv`,
      ['#', 'Producto', 'Unidades', 'Ingresos (GTQ)'],
      salesData.topProducts.map((p, i) => [
        String(i + 1),
        p.productName,
        String(p.totalQuantity),
        p.totalRevenue.toFixed(2),
      ]),
    );
  };

  const handleExportOrdersByStatus = () => {
    if (!salesData) return;
    exportToCsv(
      `ordenes-por-estado-${salesPeriod}.csv`,
      ['Estado', 'Cantidad'],
      Object.entries(salesData.ordersByStatus).map(([key, count]) => [
        STATUS_LABELS[key] ?? key,
        String(count),
      ]),
    );
  };

  const handleExportLowStock = () => {
    if (!inventoryData) return;
    exportToCsv(
      'stock-bajo.csv',
      ['Producto', 'Stock actual', 'Stock mínimo', 'Estado'],
      inventoryData.lowStockProducts.map((p) => [
        p.name,
        String(p.stock),
        String(p.minStock),
        isStockCritical(p.stock, p.minStock) ? 'Crítico' : 'Advertencia',
      ]),
    );
  };

  const handleExportMovements = () => {
    if (!inventoryData) return;
    exportToCsv(
      'movimientos-inventario.csv',
      ['Producto', 'Tipo', 'Cantidad', 'Fecha'],
      inventoryData.recentMovements.map((m) => [
        m.productName,
        MOVEMENT_LABELS[m.type] ?? m.type,
        String(m.quantity),
        new Date(m.createdAt).toLocaleDateString('es-GT'),
      ]),
    );
  };

  const handleExportTopSuppliers = () => {
    if (!purchasesData) return;
    exportToCsv(
      `top-proveedores-${purchasesPeriod}.csv`,
      ['#', 'Proveedor', 'Compras', 'Gasto total (GTQ)'],
      purchasesData.topSuppliers.map((s, i) => [
        String(i + 1),
        s.supplierName,
        String(s.totalPurchases),
        s.totalSpent.toFixed(2),
      ]),
    );
  };

  const handleExportPurchasesByStatus = () => {
    if (!purchasesData) return;
    exportToCsv(
      `compras-por-estado-${purchasesPeriod}.csv`,
      ['Estado', 'Cantidad'],
      Object.entries(purchasesData.purchasesByStatus).map(([key, count]) => [
        PURCHASE_STATUS_LABELS[key] ?? key,
        String(count),
      ]),
    );
  };

  const handleExportTopClients = () => {
    if (!clientsData) return;
    exportToCsv(
      `top-clientes-${clientsPeriod}.csv`,
      ['#', 'Cliente', 'Órdenes', 'Gasto total (GTQ)'],
      clientsData.topClients.map((c, i) => [
        String(i + 1),
        c.clientName,
        String(c.orderCount),
        c.totalSpent.toFixed(2),
      ]),
    );
  };

  const handleExportProducts = () => {
    if (!productsData) return;
    exportToCsv(
      'reporte-productos.csv',
      ['Producto', 'Categoría', 'Precio (GTQ)', 'Stock', 'Mínimo', 'Estado'],
      productsData.products.map((p) => [
        p.name,
        p.category,
        p.price.toFixed(2),
        String(p.stock),
        String(p.minStock),
        p.stock === 0 ? 'Sin stock' : p.stock < p.minStock ? 'Stock bajo' : 'En stock',
      ]),
    );
  };

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
            Análisis de ventas, inventario, compras y clientes
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-surface-container p-1 rounded-xl w-fit">
        {(
          [
            { id: 'sales', icon: <TrendingUp size={15} />, label: 'Ventas' },
            { id: 'inventory', icon: <Package size={15} />, label: 'Inventario' },
            { id: 'purchases', icon: <Truck size={15} />, label: 'Compras' },
            { id: 'clients', icon: <Users size={15} />, label: 'Clientes' },
            { id: 'products', icon: <Package size={15} />, label: 'Productos' },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 h-9 px-4 rounded-lg text-[13px] font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-on-surface shadow-soft'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Sales tab ── */}
      {activeTab === 'sales' && (
        <div className="space-y-5">
          <PeriodFilter period={salesPeriod} onChange={setSalesPeriod} />

          {salesLoading ? (
            <SectionLoading />
          ) : salesError || !salesData ? (
            <SectionError message="No se pudo cargar el reporte de ventas." />
          ) : (
            <div className="space-y-5">
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
                      {Object.keys(salesData.ordersByStatus).map((key) => (
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

              {/* Top products */}
              <div className="bg-white border border-outline-variant rounded-xl shadow-soft overflow-hidden">
                <div className="px-5 h-12 flex items-center justify-between gap-4 border-b border-outline-variant">
                  <div className="flex items-center gap-2">
                    <h3 className="text-[14px] font-semibold text-on-surface">Top productos</h3>
                    <span className="inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-full bg-surface-container text-[11px] font-semibold text-on-surface-variant tabular-nums">
                      {salesData.topProducts.length}
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

              {/* Low stock */}
              <div className="bg-white border border-outline-variant rounded-xl shadow-soft overflow-hidden">
                <div className="px-5 h-14 flex items-center justify-between gap-4 border-b border-outline-variant">
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={14} className="text-amber-500" />
                    <h3 className="text-[14px] font-semibold text-on-surface">Stock bajo</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={handleExportLowStock}>
                      <Download size={13} />
                      Exportar
                    </Button>
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
                        const critical = isStockCritical(p.stock, p.minStock);
                        return (
                          <tr key={p.id} className="hover:bg-surface-container-low transition-colors">
                            <td className="px-5 py-3 font-medium text-on-surface">{p.name}</td>
                            <td className="px-5 py-3 text-right tabular-nums font-semibold text-on-surface">{p.stock}</td>
                            <td className="px-5 py-3 text-right tabular-nums text-on-surface-variant">{p.minStock}</td>
                            <td className="px-5 py-3">
                              <Badge variant={critical ? 'error' : 'warning'}>
                                {critical ? 'Crítico' : 'Advertencia'}
                              </Badge>
                            </td>
                          </tr>
                        );
                      })}
                      {filteredLowStock.length === 0 && (
                        <EmptyRow
                          colSpan={4}
                          message={lowStockSearch ? `Sin resultados para "${lowStockSearch}".` : 'No hay productos con stock bajo.'}
                        />
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Recent movements */}
              <div className="bg-white border border-outline-variant rounded-xl shadow-soft overflow-hidden">
                <div className="px-5 h-14 flex items-center justify-between gap-4 border-b border-outline-variant">
                  <div className="flex items-center gap-2">
                    <ArrowRightLeft size={14} className="text-[#006b58]" />
                    <h3 className="text-[14px] font-semibold text-on-surface">Movimientos recientes</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={handleExportMovements}>
                      <Download size={13} />
                      Exportar
                    </Button>
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
                          <td className="px-5 py-3 text-right tabular-nums font-semibold text-on-surface">{m.quantity}</td>
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

      {/* ── Purchases tab ── */}
      {activeTab === 'purchases' && (
        <div className="space-y-5">
          <PeriodFilter period={purchasesPeriod} onChange={setPurchasesPeriod} />

          {purchasesLoading ? (
            <SectionLoading />
          ) : purchasesError || !purchasesData ? (
            <SectionError message="No se pudo cargar el reporte de compras." />
          ) : (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard
                  label="Total compras"
                  value={purchasesData.totalPurchases.toLocaleString('es-GT')}
                  icon={<Truck size={18} strokeWidth={1.75} />}
                />
                <StatCard
                  label="Costo total"
                  value={formatCurrency(purchasesData.totalCost)}
                  icon={<DollarSign size={18} strokeWidth={1.75} />}
                  accent="#1a6b3f"
                />
                <StatCard
                  label="Costo promedio"
                  value={formatCurrency(purchasesData.averagePurchaseCost)}
                  icon={<Hash size={18} strokeWidth={1.75} />}
                  accent="#5b5bd6"
                />
              </div>

              {/* Top proveedores */}
              <div className="bg-white border border-outline-variant rounded-xl shadow-soft overflow-hidden">
                <div className="px-5 h-12 flex items-center justify-between gap-4 border-b border-outline-variant">
                  <div className="flex items-center gap-2">
                    <h3 className="text-[14px] font-semibold text-on-surface">Top proveedores</h3>
                    <span className="inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-full bg-surface-container text-[11px] font-semibold text-on-surface-variant tabular-nums">
                      {purchasesData.topSuppliers.length}
                    </span>
                  </div>
                  <Button size="sm" variant="outline" onClick={handleExportTopSuppliers}>
                    <Download size={13} />
                    Exportar
                  </Button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-body-md">
                    <thead>
                      <tr className="border-b border-outline-variant bg-surface-container-low">
                        <th className="px-5 h-9 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-on-surface-variant">#</th>
                        <th className="px-5 h-9 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-on-surface-variant">Proveedor</th>
                        <th className="px-5 h-9 text-right text-[11px] font-semibold uppercase tracking-[0.06em] text-on-surface-variant">Compras</th>
                        <th className="px-5 h-9 text-right text-[11px] font-semibold uppercase tracking-[0.06em] text-on-surface-variant">Gasto total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant">
                      {purchasesData.topSuppliers.map((s, idx) => (
                        <tr key={s.supplierId} className="hover:bg-surface-container-low transition-colors">
                          <td className="px-5 py-3 tabular-nums text-on-surface-variant text-[13px] font-medium w-10">
                            {idx + 1}
                          </td>
                          <td className="px-5 py-3 font-medium text-on-surface">{s.supplierName}</td>
                          <td className="px-5 py-3 text-right tabular-nums text-on-surface-variant">
                            {s.totalPurchases.toLocaleString('es-GT')}
                          </td>
                          <td className="px-5 py-3 text-right tabular-nums font-semibold text-on-surface">
                            {formatCurrency(s.totalSpent)}
                          </td>
                        </tr>
                      ))}
                      {purchasesData.topSuppliers.length === 0 && (
                        <EmptyRow colSpan={4} message="Sin datos de proveedores para este período." />
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Compras por estado */}
              <div className="bg-white border border-outline-variant rounded-xl shadow-soft overflow-hidden">
                <div className="px-5 h-12 flex items-center justify-between gap-4 border-b border-outline-variant">
                  <h3 className="text-[14px] font-semibold text-on-surface">Compras por estado</h3>
                  <Button size="sm" variant="outline" onClick={handleExportPurchasesByStatus}>
                    <Download size={13} />
                    Exportar
                  </Button>
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
                      {Object.entries(purchasesData.purchasesByStatus).map(([key, count]) => (
                        <tr key={key} className="hover:bg-surface-container-low transition-colors">
                          <td className="px-5 py-3">
                            <Badge variant={PURCHASE_STATUS_VARIANTS[key] ?? 'default'}>
                              {PURCHASE_STATUS_LABELS[key] ?? key}
                            </Badge>
                          </td>
                          <td className="px-5 py-3 text-right font-semibold tabular-nums text-on-surface">
                            {count.toLocaleString('es-GT')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Clients tab ── */}
      {activeTab === 'clients' && (
        <div className="space-y-5">
          <PeriodFilter period={clientsPeriod} onChange={setClientsPeriod} />

          {clientsLoading ? (
            <SectionLoading />
          ) : clientsError || !clientsData ? (
            <SectionError message="No se pudo cargar el reporte de clientes." />
          ) : (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <StatCard
                  label="Total clientes"
                  value={clientsData.totalClients.toLocaleString('es-GT')}
                  icon={<Users size={18} strokeWidth={1.75} />}
                />
                <StatCard
                  label="Nuevos clientes"
                  value={clientsData.newClients.toLocaleString('es-GT')}
                  icon={<Users size={18} strokeWidth={1.75} />}
                  accent="#1a6b3f"
                />
              </div>

              {/* Top clientes */}
              <div className="bg-white border border-outline-variant rounded-xl shadow-soft overflow-hidden">
                <div className="px-5 h-12 flex items-center justify-between gap-4 border-b border-outline-variant">
                  <div className="flex items-center gap-2">
                    <h3 className="text-[14px] font-semibold text-on-surface">Top clientes</h3>
                    <span className="inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-full bg-surface-container text-[11px] font-semibold text-on-surface-variant tabular-nums">
                      {clientsData.topClients.length}
                    </span>
                  </div>
                  <Button size="sm" variant="outline" onClick={handleExportTopClients}>
                    <Download size={13} />
                    Exportar
                  </Button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-body-md">
                    <thead>
                      <tr className="border-b border-outline-variant bg-surface-container-low">
                        <th className="px-5 h-9 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-on-surface-variant">#</th>
                        <th className="px-5 h-9 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-on-surface-variant">Cliente</th>
                        <th className="px-5 h-9 text-right text-[11px] font-semibold uppercase tracking-[0.06em] text-on-surface-variant">Órdenes</th>
                        <th className="px-5 h-9 text-right text-[11px] font-semibold uppercase tracking-[0.06em] text-on-surface-variant">Gasto total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant">
                      {clientsData.topClients.map((c, idx) => (
                        <tr key={c.clientId} className="hover:bg-surface-container-low transition-colors">
                          <td className="px-5 py-3 tabular-nums text-on-surface-variant text-[13px] font-medium w-10">
                            {idx + 1}
                          </td>
                          <td className="px-5 py-3 font-medium text-on-surface">{c.clientName}</td>
                          <td className="px-5 py-3 text-right tabular-nums text-on-surface-variant">
                            {c.orderCount.toLocaleString('es-GT')}
                          </td>
                          <td className="px-5 py-3 text-right tabular-nums font-semibold text-on-surface">
                            {formatCurrency(c.totalSpent)}
                          </td>
                        </tr>
                      ))}
                      {clientsData.topClients.length === 0 && (
                        <EmptyRow colSpan={4} message="Sin datos de clientes para este período." />
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Products tab ── */}
      {activeTab === 'products' && (
        <div className="space-y-5">
          {productsLoading ? (
            <SectionLoading />
          ) : productsError || !productsData ? (
            <SectionError message="No se pudo cargar el reporte de productos." />
          ) : (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
                <StatCard
                  label="Total productos"
                  value={productsData.total.toLocaleString('es-GT')}
                  icon={<Package size={18} strokeWidth={1.75} />}
                />
              </div>

              <div className="bg-white border border-outline-variant rounded-xl shadow-soft overflow-hidden">
                <div className="px-5 h-14 flex items-center justify-between gap-4 border-b border-outline-variant">
                  <h3 className="text-[14px] font-semibold text-on-surface">Productos</h3>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={handleExportProducts}>
                      <Download size={13} />
                      Exportar CSV
                    </Button>
                    <input
                      type="text"
                      placeholder="Buscar por nombre…"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      className="h-8 pl-3 pr-3 bg-surface-container border border-outline-variant rounded-md text-[12px] text-on-surface focus:outline-none focus:ring-[3px] focus:ring-[#006b58]/10 focus:border-primary"
                    />
                    <select
                      value={productCategory}
                      onChange={(e) => setProductCategory(e.target.value)}
                      className="h-8 pl-3 pr-7 bg-surface-container border border-outline-variant rounded-md text-[12px] text-on-surface focus:outline-none focus:ring-[3px] focus:ring-[#006b58]/10 focus:border-primary"
                    >
                      <option value="">Todas las categorías</option>
                      <option value="running">Running</option>
                      <option value="football">Fútbol</option>
                      <option value="basketball">Baloncesto</option>
                      <option value="tennis">Tenis</option>
                      <option value="swimming">Natación</option>
                      <option value="cycling">Ciclismo</option>
                      <option value="fitness">Fitness</option>
                      <option value="other">Otro</option>
                    </select>
                    <select
                      value={productStockStatus}
                      onChange={(e) => setProductStockStatus(e.target.value as typeof productStockStatus)}
                      className="h-8 pl-3 pr-7 bg-surface-container border border-outline-variant rounded-md text-[12px] text-on-surface focus:outline-none focus:ring-[3px] focus:ring-[#006b58]/10 focus:border-primary"
                    >
                      <option value="">Todos los estados</option>
                      <option value="in_stock">En stock</option>
                      <option value="low_stock">Stock bajo</option>
                      <option value="out_of_stock">Sin stock</option>
                    </select>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-body-md">
                    <thead>
                      <tr className="border-b border-outline-variant bg-surface-container-low">
                        <th className="px-5 h-9 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-on-surface-variant">Producto</th>
                        <th className="px-5 h-9 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-on-surface-variant">Categoría</th>
                        <th className="px-5 h-9 text-right text-[11px] font-semibold uppercase tracking-[0.06em] text-on-surface-variant">Precio</th>
                        <th className="px-5 h-9 text-right text-[11px] font-semibold uppercase tracking-[0.06em] text-on-surface-variant">Stock</th>
                        <th className="px-5 h-9 text-right text-[11px] font-semibold uppercase tracking-[0.06em] text-on-surface-variant">Mínimo</th>
                        <th className="px-5 h-9 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-on-surface-variant">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant">
                      {productsData.products.map((p) => {
                        const status = p.stock === 0 ? 'out_of_stock' : p.stock < p.minStock ? 'low_stock' : 'in_stock';
                        const statusLabel = status === 'out_of_stock' ? 'Sin stock' : status === 'low_stock' ? 'Stock bajo' : 'En stock';
                        const statusVariant: 'danger' | 'warning' | 'success' = status === 'out_of_stock' ? 'danger' : status === 'low_stock' ? 'warning' : 'success';
                        return (
                          <tr key={p.id} className="hover:bg-surface-container-low transition-colors">
                            <td className="px-5 py-3 font-medium text-on-surface">{p.name}</td>
                            <td className="px-5 py-3 text-on-surface-variant">{p.category}</td>
                            <td className="px-5 py-3 text-right tabular-nums text-on-surface">{formatCurrency(p.price)}</td>
                            <td className="px-5 py-3 text-right tabular-nums text-on-surface">{p.stock.toLocaleString('es-GT')}</td>
                            <td className="px-5 py-3 text-right tabular-nums text-on-surface-variant">{p.minStock.toLocaleString('es-GT')}</td>
                            <td className="px-5 py-3">
                              <Badge variant={statusVariant}>{statusLabel}</Badge>
                            </td>
                          </tr>
                        );
                      })}
                      {productsData.products.length === 0 && (
                        <EmptyRow colSpan={6} message="No hay productos para los filtros seleccionados." />
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
