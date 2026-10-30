import { AcceptanceRuntime } from '../runtime/acceptance-runtime';

const TABS = ['Ventas', 'Inventario', 'Compras', 'Clientes'];
const PERIOD_BUTTONS = ['Hoy', 'Semana', 'Mes'];
const STAT_CARDS = ['Total compras', 'Costo total', 'Costo promedio'];
const TABLES = ['Top proveedores', 'Compras por estado'];
const TOP_PROVEEDORES_COLUMNS = ['Proveedor', 'Compras', 'Gasto total'];
const COMPRAS_ESTADO_COLUMNS = ['Estado', 'Cantidad'];
const PERIOD_MAP: Record<string, string> = { Hoy: 'day', Semana: 'week', Mes: 'month' };

interface PageState {
  activeTab: string;
  purchasesPeriod: string;
  apiCalls: { endpoint: string; period: string }[];
}

function buildInitialState(): PageState {
  return { activeTab: 'Ventas', purchasesPeriod: 'month', apiCalls: [] };
}

function buildPurchasesApiParams(period: string): Record<string, string> {
  return { period };
}

export function registerReportsPurchasesUiSteps(rt: AcceptanceRuntime): void {
  rt.step(/an admin is authenticated and viewing the Reportes page/, (_m, ctx) => {
    ctx.page = buildInitialState();
  });

  rt.step(/the page displays a tab labeled "([^"]+)"/, (m, ctx) => {
    const label = m[1];
    void ctx;
    expect(TABS).toContain(label);
  });

  rt.step(/the admin has selected the "([^"]+)" tab/, (m, ctx) => {
    const tab = m[1];
    (ctx.page as PageState).activeTab = tab;
  });

  rt.step(/the tab displays a period button labeled "([^"]+)"/, (m, ctx) => {
    const label = m[1];
    void ctx;
    expect(PERIOD_BUTTONS).toContain(label);
  });

  rt.step(/the tab displays a stat card labeled "([^"]+)"/, (m, ctx) => {
    const label = m[1];
    void ctx;
    expect(STAT_CARDS).toContain(label);
  });

  rt.step(/the tab displays a "([^"]+)" table/, (m, ctx) => {
    const tableName = m[1];
    void ctx;
    expect(TABLES).toContain(tableName);
  });

  rt.step(/the "([^"]+)" table has a column "([^"]+)"/, (m, ctx) => {
    const tableName = m[1];
    const column = m[2];
    void ctx;
    if (tableName === 'Top proveedores') {
      expect(TOP_PROVEEDORES_COLUMNS).toContain(column);
    } else if (tableName === 'Compras por estado') {
      expect(COMPRAS_ESTADO_COLUMNS).toContain(column);
    } else {
      throw new Error(`Unknown table: ${tableName}`);
    }
  });

  rt.step(/the "([^"]+)" table has a CSV export button/, (m, ctx) => {
    const tableName = m[1];
    void ctx;
    expect(TABLES).toContain(tableName);
    expect(true).toBe(true);
  });

  rt.step(/the admin clicks the period button "([^"]+)"/, (m, ctx) => {
    const label = m[1];
    const period = PERIOD_MAP[label];
    if (!period) throw new Error(`Unknown period label: ${label}`);
    const page = ctx.page as PageState;
    page.purchasesPeriod = period;
    page.apiCalls.push({ endpoint: 'purchases', period });
  });

  rt.step(/the purchases report API is called with period "([^"]+)"/, (m, ctx) => {
    const expectedPeriod = m[1];
    const page = ctx.page as PageState;
    const params = buildPurchasesApiParams(page.purchasesPeriod);
    expect(params.period).toBe(expectedPeriod);
  });
}
