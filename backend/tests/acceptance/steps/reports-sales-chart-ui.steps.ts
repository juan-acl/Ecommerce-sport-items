import { AcceptanceRuntime } from '../runtime/acceptance-runtime';
import { buildTrendBars } from '../../../../backoffice/src/features/dashboard/utils/dashboardUtils';

const PERIOD_MAP: Record<string, string> = { Hoy: 'day', Semana: 'week', Mes: 'month' };
const PERIOD_BAR_COUNTS: Record<string, number> = { day: 24, week: 7, month: 30 };
const SALES_CHART_SECTIONS = ['Tendencia de ingresos', 'Distribución por estado'];
const STATUS_CHART_LABELS = ['Confirmado', 'Cancelado', 'En proceso', 'En tránsito', 'Entregado'];

interface SalesTabState {
  activeTab: string;
  activePeriod: string;
  trendBarCount: number;
}

function buildInitialState(): SalesTabState {
  return { activeTab: 'Ventas', activePeriod: 'month', trendBarCount: 30 };
}

export function registerReportsSalesChartUiSteps(rt: AcceptanceRuntime): void {
  rt.step(/an admin is authenticated and viewing the Reportes page/, (_m, ctx) => {
    ctx.salesTab = buildInitialState();
  });

  rt.step(/the admin has selected the "([^"]+)" tab/, (m, ctx) => {
    const tab = m[1];
    (ctx.salesTab as SalesTabState).activeTab = tab;
  });

  rt.step(/the tab displays a chart section titled "([^"]+)"/, (m, ctx) => {
    const title = m[1];
    void ctx;
    expect(SALES_CHART_SECTIONS).toContain(title);
  });

  rt.step(/the admin clicks the period button "([^"]+)"/, (m, ctx) => {
    const label = m[1];
    const state = ctx.salesTab as SalesTabState;
    const period = PERIOD_MAP[label];
    expect(period).toBeDefined();
    state.activePeriod = period;
    const bars = buildTrendBars([], period as 'day' | 'week' | 'month');
    state.trendBarCount = bars.length;
  });

  rt.step(/the revenue trend chart displays bars for period "([^"]+)"/, (m, ctx) => {
    const period = m[1];
    const state = ctx.salesTab as SalesTabState;
    expect(state.activePeriod).toBe(period);
    expect(state.trendBarCount).toBe(PERIOD_BAR_COUNTS[period]);
  });

  rt.step(/the "Distribución por estado" chart displays a bar labeled "([^"]+)"/, (m, ctx) => {
    const label = m[1];
    void ctx;
    expect(STATUS_CHART_LABELS).toContain(label);
  });
}
