import { useState } from 'react';
import { Package, Download } from 'lucide-react';
import { useGetProductsReportQuery } from '@features/reports/api/reportsApi';
import type { StockStatus } from '@shared/types/common';
import { Badge } from '@shared/components/ui/Badge';
import { Button } from '@shared/components/ui/Button';
import { formatCurrency } from '@shared/utils/formatCurrency';
import { exportToCsv } from '@shared/utils/exportToCsv';
import { exportToPdf } from '@shared/utils/exportToPdf';
import { StatCard, SectionLoading, SectionError, EmptyRow } from './ReportShared';

const STOCK_STATUS_LABELS: Record<StockStatus, string> = {
  out_of_stock: 'Sin stock',
  low_stock: 'Stock bajo',
  in_stock: 'En stock',
};

const STOCK_STATUS_VARIANTS: Record<StockStatus, 'error' | 'warning' | 'success'> = {
  out_of_stock: 'error',
  low_stock: 'warning',
  in_stock: 'success',
};

export function ProductsTab() {
  const [productCategory, setProductCategory] = useState('');
  const [productName, setProductName] = useState('');
  const [productStockStatus, setProductStockStatus] = useState<StockStatus | ''>('');

  const { data, isLoading, isError } = useGetProductsReportQuery({
    ...(productCategory ? { category: productCategory } : {}),
    ...(productName ? { name: productName } : {}),
    ...(productStockStatus ? { stockStatus: productStockStatus } : {}),
  });

  const handleExportProducts = (format: 'csv' | 'pdf') => {
    if (!data) return;
    const headers = ['Producto', 'Categoría', 'Precio (GTQ)', 'Stock', 'Mínimo', 'Estado'];
    const rows = data.products.map((p) => [
      p.name,
      p.category,
      p.price.toFixed(2),
      String(p.stock),
      String(p.minStock),
      STOCK_STATUS_LABELS[p.stockStatus],
    ]);
    if (format === 'csv') exportToCsv('reporte-productos.csv', headers, rows);
    else exportToPdf('Reporte de productos', headers, rows);
  };

  if (isLoading) return <SectionLoading />;
  if (isError || !data) return <SectionError message="No se pudo cargar el reporte de productos." />;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4">
        <StatCard
          label="Total productos"
          value={data.total.toLocaleString('es-GT')}
          icon={<Package size={18} strokeWidth={1.75} />}
        />
      </div>

      <div className="bg-white border border-outline-variant rounded-xl shadow-soft overflow-hidden">
        <div className="px-5 h-14 flex items-center justify-between gap-4 border-b border-outline-variant">
          <h3 className="text-[14px] font-semibold text-on-surface">Productos</h3>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => handleExportProducts('csv')}>
              <Download size={13} />
              Exportar CSV
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleExportProducts('pdf')}>
              <Download size={13} />
              Exportar PDF
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
              {data.products.map((p) => (
                <tr key={p.id} className="hover:bg-surface-container-low transition-colors">
                  <td className="px-5 py-3 font-medium text-on-surface">{p.name}</td>
                  <td className="px-5 py-3 text-on-surface-variant">{p.category}</td>
                  <td className="px-5 py-3 text-right tabular-nums text-on-surface">{formatCurrency(p.price)}</td>
                  <td className="px-5 py-3 text-right tabular-nums text-on-surface">{p.stock.toLocaleString('es-GT')}</td>
                  <td className="px-5 py-3 text-right tabular-nums text-on-surface-variant">{p.minStock.toLocaleString('es-GT')}</td>
                  <td className="px-5 py-3">
                    <Badge variant={STOCK_STATUS_VARIANTS[p.stockStatus]}>{STOCK_STATUS_LABELS[p.stockStatus]}</Badge>
                  </td>
                </tr>
              ))}
              {data.products.length === 0 && (
                <EmptyRow colSpan={6} message="No hay productos para los filtros seleccionados." />
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
