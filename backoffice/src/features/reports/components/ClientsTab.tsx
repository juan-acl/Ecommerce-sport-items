import { useState } from 'react';
import { Users, Download } from 'lucide-react';
import { useGetClientAnalyticsReportQuery, type ReportPeriod } from '@features/reports/api/reportsApi';
import { Button } from '@shared/components/ui/Button';
import { formatCurrency } from '@shared/utils/formatCurrency';
import { exportToCsv } from '@shared/utils/exportToCsv';
import { StatCard, SectionLoading, SectionError, EmptyRow, PeriodFilter } from './ReportShared';

export function ClientsTab() {
  const [period, setPeriod] = useState<ReportPeriod>('month');

  const { data, isLoading, isError } = useGetClientAnalyticsReportQuery({ period });

  const handleExportTopClients = () => {
    if (!data) return;
    exportToCsv(
      `top-clientes-${period}.csv`,
      ['#', 'Cliente', 'Órdenes', 'Gasto total (GTQ)'],
      data.topClients.map((c, i) => [
        String(i + 1),
        c.clientName,
        String(c.orderCount),
        c.totalSpent.toFixed(2),
      ]),
    );
  };

  if (isLoading) return <SectionLoading />;
  if (isError || !data) return <SectionError message="No se pudo cargar el reporte de clientes." />;

  return (
    <div className="space-y-5">
      <PeriodFilter period={period} onChange={setPeriod} />

      <div className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StatCard
            label="Total clientes"
            value={data.totalClients.toLocaleString('es-GT')}
            icon={<Users size={18} strokeWidth={1.75} />}
          />
          <StatCard
            label="Nuevos clientes"
            value={data.newClients.toLocaleString('es-GT')}
            icon={<Users size={18} strokeWidth={1.75} />}
            accent="#1a6b3f"
          />
        </div>

        <div className="bg-white border border-outline-variant rounded-xl shadow-soft overflow-hidden">
          <div className="px-5 h-12 flex items-center justify-between gap-4 border-b border-outline-variant">
            <div className="flex items-center gap-2">
              <h3 className="text-[14px] font-semibold text-on-surface">Top clientes</h3>
              <span className="inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-full bg-surface-container text-[11px] font-semibold text-on-surface-variant tabular-nums">
                {data.topClients.length}
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
                {data.topClients.map((c, idx) => (
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
                {data.topClients.length === 0 && (
                  <EmptyRow colSpan={4} message="Sin datos de clientes para este período." />
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
