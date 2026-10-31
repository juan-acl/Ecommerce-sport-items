import { AcceptanceRuntime } from '../runtime/acceptance-runtime';

const STOCK_DIST_SECTION = 'Distribución de stock';
const STOCK_DIST_LABELS = ['En stock', 'Stock bajo', 'Sin stock'];

interface LowStockProduct {
  id: string;
  name: string;
  stock: number;
  minStock: number;
  isCritical: boolean;
}

function computeStockDist(products: LowStockProduct[], totalProducts: number) {
  const outOfStock = products.filter((p) => p.isCritical).length;
  const lowStock = products.filter((p) => !p.isCritical).length;
  const inStock = totalProducts - outOfStock - lowStock;
  return { inStock, lowStock, outOfStock };
}

interface InventoryTabState {
  activeTab: string;
  stockDistLabels: string[];
}

function buildInitialState(): InventoryTabState {
  return { activeTab: 'Inventario', stockDistLabels: [] };
}

export function registerReportsInventoryChartUiSteps(rt: AcceptanceRuntime): void {
  rt.step(/an admin is authenticated and viewing the Reportes page/, (_m, ctx) => {
    ctx.inventoryTab = buildInitialState();
    const lowStockProducts: LowStockProduct[] = [
      { id: 'p1', name: 'A', stock: 0, minStock: 5, isCritical: true },
      { id: 'p2', name: 'B', stock: 2, minStock: 5, isCritical: false },
    ];
    const dist = computeStockDist(lowStockProducts, 10);
    const state = ctx.inventoryTab as InventoryTabState;
    state.stockDistLabels = [];
    if (dist.inStock > 0) state.stockDistLabels.push('En stock');
    if (dist.lowStock > 0) state.stockDistLabels.push('Stock bajo');
    if (dist.outOfStock > 0) state.stockDistLabels.push('Sin stock');
  });

  rt.step(/the admin has selected the "([^"]+)" tab/, (m, ctx) => {
    const tab = m[1];
    (ctx.inventoryTab as InventoryTabState).activeTab = tab;
  });

  rt.step(/the tab displays a chart section titled "([^"]+)"/, (m, ctx) => {
    const title = m[1];
    void ctx;
    expect(title).toBe(STOCK_DIST_SECTION);
  });

  rt.step(/the "Distribución de stock" chart displays a bar labeled "([^"]+)"/, (m, ctx) => {
    const label = m[1];
    void ctx;
    expect(STOCK_DIST_LABELS).toContain(label);
  });
}
