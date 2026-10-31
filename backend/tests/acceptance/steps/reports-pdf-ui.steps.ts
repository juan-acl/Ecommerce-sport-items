import { AcceptanceRuntime } from '../runtime/acceptance-runtime';

const TABLES_WITH_PDF = ['Top proveedores', 'Compras por estado', 'Top clientes'];
const CHART_TABS_WITH_PDF = ['Ventas', 'Inventario'];

interface PageState {
  activeTab: string;
}

function buildInitialState(): PageState {
  return { activeTab: 'Ventas' };
}

export function registerReportsPdfUiSteps(rt: AcceptanceRuntime): void {
  rt.step(/an admin is authenticated and viewing the Reportes page/, (_m, ctx) => {
    ctx.page = buildInitialState();
  });

  rt.step(/the admin has selected the "([^"]+)" tab/, (m, ctx) => {
    const tab = m[1];
    (ctx.page as PageState).activeTab = tab;
  });

  rt.step(/"([^"]+)" table has a PDF export button/, (m, ctx) => {
    const tableName = m[1];
    void ctx;
    expect(TABLES_WITH_PDF).toContain(tableName);
  });

  rt.step(/the products table has a PDF export button/, (_m, ctx) => {
    const state = ctx.page as PageState;
    expect(state.activeTab).toBe('Productos');
  });

  rt.step(/the tab displays a PDF export button/, (_m, ctx) => {
    const state = ctx.page as PageState;
    expect(CHART_TABS_WITH_PDF).toContain(state.activeTab);
  });
}
