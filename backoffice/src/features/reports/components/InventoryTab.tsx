import { useState, useMemo } from 'react';
import { AlertTriangle, ArrowRightLeft, Search, Package, DollarSign, Download } from 'lucide-react';
import { useGetInventoryReportQuery } from '@features/reports/api/reportsApi';
import { Badge } from '@shared/components/ui/Badge';
import { Button } from '@shared/components/ui/Button';
import { formatCurrency } from '@shared/utils/formatCurrency';
import { exportToCsv } from '@shared/utils/exportToCsv';
import { computeStockDistribution } from '../utils/stockDistribution';
import {
  filterMovementsByType,
  filterLowStockByName,
  type MovementFilter,
} from '../utils/reportFilters';
import { StatCard, SectionLoading, SectionError, EmptyRow } from './ReportShared';

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

export function InventoryTab() {
  const [movementFilter, setMovementFilter] = useState<MovementFilter>('all');
  const [lowStockSearch, setLowStockSearch] = useState('');

  const { data, isLoading, isError } = useGetInventoryReportQuery();

  const filteredMovements = data ? filterMovementsByType(data.recentMovements, movementFilter) : [];
  const filteredLowStock = data ? filterLowStockByName(data.lowStockProducts, lowStockSearch) : [];
  const stockDist = useMemo(() => (data ? computeStockDistribution(data) : null), [data]);

  const handleExportLowStock = () => {
    if (!data) return;
    exportToCsv(
      'stock-bajo.csv',
      ['Producto', 'Stock actual', 'Stock mínimo', 'Estado'],
      data.lowStockProducts.map((p) => [
        p.name,
        String(p.stock),
        String(p.minStock),
        p.isCritical ? 'Crítico' : 'Advertencia',
      ]),
    );
  };

  const handleExportMovements = () => {
    if (!data) return;
    exportToCsv(
      'movimientos-inventario.csv',
      ['Producto', 'Tipo', 'Cantidad', 'Fecha'],
      data.recentMovements.map((m) => [
        m.productName,
        MOVEMENT_LABELS[m.type] ?? m.type,
        String(m.quantity),
        new Date(m.createdAt).toLocaleDateString('es-GT'),
      ]),
    );
  };

  if (isLoading) return <SectionLoading />;
  if (isError || !data) return <SectionError message="No se pudo cargar el reporte de inventario." />;

  const stockBars: { label: string; count: number; barClass: string }[] = stockDist
    ? [
        { label: 'En stock', count: stockDist.inStock, barClass: 'bg-secondary' },
        { label: 'Stock bajo', count: stockDist.lowStock, barClass: 'bg-amber-400' },
        { label: 'Sin stock', count: stockDist.outOfStock, barClass: 'bg-red-400' },
      ]
    : [];
  const totalStockItems = stockDist ? stockDist.inStock + stockDist.lowStock + stockDist.outOfStock : 0;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard
          label="Total productos"
          value={data.totalProducts.toLocaleString('es-GT')}
          icon={<Package size={18} strokeWidth={1.75} />}
        />
        <StatCard
          label="Valor total de stock"
          value={formatCurrency(data.totalStockValue)}
          icon={<DollarSign size={18} strokeWidth={1.75} />}
          accent="#1a6b3f"
        />
      </div>

      {stockDist && (
        <div className="bg-white border border-outline-variant rounded-xl shadow-soft" data-section="Distribución de stock">
          <div className="px-5 pt-4 pb-3.5 border-b border-outline-variant">
            <p className="text-[14px] font-semibold tracking-tight text-on-surface">Distribución de stock</p>
            <p className="text-label-md text-on-surface-variant mt-0.5">{data.totalProducts.toLocaleString('es-GT')} productos en total</p>
          </div>
          <div className="px-5 py-5 space-y-3">
            {stockBars.map(({ label, count, barClass }) => {
              const pct = totalStockItems > 0 ? Math.round((count / totalStockItems) * 100) : 0;
              return (
                <div key={label} data-bar-label={label}>
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
              {filteredLowStock.map((p) => (
                <tr key={p.id} className="hover:bg-surface-container-low transition-colors">
                  <td className="px-5 py-3 font-medium text-on-surface">{p.name}</td>
                  <td className="px-5 py-3 text-right tabular-nums font-semibold text-on-surface">{p.stock}</td>
                  <td className="px-5 py-3 text-right tabular-nums text-on-surface-variant">{p.minStock}</td>
                  <td className="px-5 py-3">
                    <Badge variant={p.isCritical ? 'error' : 'warning'}>
                      {p.isCritical ? 'Crítico' : 'Advertencia'}
                    </Badge>
                  </td>
                </tr>
              ))}
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
  );
}
