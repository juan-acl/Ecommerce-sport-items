import type { InventoryReport } from '@shared/types/common';

export interface StockDistribution {
  inStock: number;
  lowStock: number;
  outOfStock: number;
}

export function computeStockDistribution(report: InventoryReport): StockDistribution {
  const outOfStock = report.lowStockProducts.filter((p) => p.isCritical).length;
  const lowStock = report.lowStockProducts.filter((p) => !p.isCritical).length;
  const inStock = report.totalProducts - outOfStock - lowStock;
  return { inStock, lowStock, outOfStock };
}
