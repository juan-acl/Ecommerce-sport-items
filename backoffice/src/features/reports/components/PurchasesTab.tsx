import { useState } from 'react';
import { Truck, DollarSign, Hash, Download } from 'lucide-react';
import { useGetPurchasesReportQuery, type ReportPeriod } from '@features/reports/api/reportsApi';
import { Badge } from '@shared/components/ui/Badge';
import { Button } from '@shared/components/ui/Button';
import { formatCurrency } from '@shared/utils/formatCurrency';
import { exportToCsv } from '@shared/utils/exportToCsv';
import { exportToPdf } from '@shared/utils/exportToPdf';
import { StatCard, SectionLoading, SectionError, EmptyRow, PeriodFilter } from './ReportShared';

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

export function PurchasesTab() {
  const [period, setPeriod] = useState<ReportPeriod>('month');

  const { data, isLoading, isError } = useGetPurchasesReportQuery({ period });

  const handleExportTopSuppliers = (format: 'csv' | 'pdf') => {
    if (!data) return;
    const headers = ['#', 'Proveedor', 'Compras', 'Gasto total (GTQ)'];
    const rows = data.topSuppliers.map((s, i) => [
      String(i + 1),
      s.supplierName,
      String(s.totalPurchases),
      s.totalSpent.toFixed(2),
    ]);
    if (format === 'csv') exportToCsv(`top-proveedores-${period}.csv`, headers, rows);
    else exportToPdf(`Top proveedores (${period})`, headers, rows);
  };

  const handleExportPurchasesByStatus = (format: 'csv' | 'pdf') => {
    if (!data) return;
    const headers = ['Estado', 'Cantidad'];
    const rows = Object.entries(data.purchasesByStatus).map(([key, count]) => [
      PURCHASE_STATUS_LABELS[key] ?? key,
      String(count),
    ]);
    if (format === 'csv') exportToCsv(`compras-por-estado-${period}.csv`, headers, rows);
    else exportToPdf(`Compras por estado (${period})`, headers, rows);
  };

  if (isLoading) return <SectionLoading />;
  if (isError || !data) return <SectionError message="No se pudo cargar el reporte de compras." />;

  return (
    <div className="space-y-5">
      <PeriodFilter period={period} onChange={setPeriod} />

      <div className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            label="Total compras"
            value={data.totalPurchases.toLocaleString('es-GT')}
            icon={<Truck size={18} strokeWidth={1.75} />}
          />
          <StatCard
            label="Costo total"
            value={formatCurrency(data.totalCost)}
            icon={<DollarSign size={18} strokeWidth={1.75} />}
            accent="#1a6b3f"
          />
          <StatCard
            label="Costo promedio"
            value={formatCurrency(data.averagePurchaseCost)}
            icon={<Hash size={18} strokeWidth={1.75} />}
            accent="#5b5bd6"
          />
        </div>

        <div className="bg-white border border-outline-variant rounded-xl shadow-soft overflow-hidden">
          <div className="px-5 h-12 flex items-center justify-between gap-4 border-b border-outline-variant">
            <div className="flex items-center gap-2">
              <h3 className="text-[14px] font-semibold text-on-surface">Top proveedores</h3>
              <span className="inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-full bg-surface-container text-[11px] font-semibold text-on-surface-variant tabular-nums">
                {data.topSuppliers.length}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Button size="sm" variant="outline" onClick={() => handleExportTopSuppliers('csv')}>
                <Download size={13} />
                Exportar
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleExportTopSuppliers('pdf')}>
                <Download size={13} />
                PDF
              </Button>
            </div>
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
                {data.topSuppliers.map((s, idx) => (
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
                {data.topSuppliers.length === 0 && (
                  <EmptyRow colSpan={4} message="Sin datos de proveedores para este período." />
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white border border-outline-variant rounded-xl shadow-soft overflow-hidden">
          <div className="px-5 h-12 flex items-center justify-between gap-4 border-b border-outline-variant">
            <h3 className="text-[14px] font-semibold text-on-surface">Compras por estado</h3>
            <div className="flex items-center gap-1">
              <Button size="sm" variant="outline" onClick={() => handleExportPurchasesByStatus('csv')}>
                <Download size={13} />
                Exportar
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleExportPurchasesByStatus('pdf')}>
                <Download size={13} />
                PDF
              </Button>
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
                {Object.entries(data.purchasesByStatus).map(([key, count]) => (
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
    </div>
  );
}
