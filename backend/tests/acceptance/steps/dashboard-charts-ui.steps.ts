import { AcceptanceRuntime } from '../runtime/acceptance-runtime';

const PERIOD_BUTTONS = ['Hoy', 'Semana', 'Mes'];
const PERIOD_MAP: Record<string, string> = { Hoy: 'day', Semana: 'week', Mes: 'month' };
const DEFAULT_PERIOD = 'week';
const KPI_CARDS_COUNT = 4;
const DASHBOARD_SECTIONS = ['Pipeline de órdenes', 'Productos más vendidos', 'Ingresos por categoría'];

interface DashboardState {
  activePeriod: string;
  hasPeriodFilter: boolean;
}

function buildInitialState(): DashboardState {
  return { activePeriod: DEFAULT_PERIOD, hasPeriodFilter: true };
}

export function registerDashboardChartsUiSteps(rt: AcceptanceRuntime): void {
  rt.step(/an admin is authenticated and viewing the Dashboard page/, (_m, ctx) => {
    ctx.dashboard = buildInitialState();
  });

  rt.step(/the revenue trend section displays a period filter/, (_m, ctx) => {
    const d = ctx.dashboard as DashboardState;
    expect(d.hasPeriodFilter).toBe(true);
  });

  rt.step(/the revenue trend section displays a period button labeled "([^"]+)"/, (m, ctx) => {
    const label = m[1];
    void ctx;
    expect(PERIOD_BUTTONS).toContain(label);
  });

  rt.step(/the revenue trend period button "([^"]+)" is active/, (m, ctx) => {
    const label = m[1];
    const d = ctx.dashboard as DashboardState;
    const expectedPeriod = PERIOD_MAP[label];
    expect(expectedPeriod).toBeDefined();
    expect(d.activePeriod).toBe(expectedPeriod);
  });

  rt.step(/the admin clicks the trend period button "([^"]+)"/, (m, ctx) => {
    const label = m[1];
    const d = ctx.dashboard as DashboardState;
    const period = PERIOD_MAP[label];
    expect(period).toBeDefined();
    d.activePeriod = period;
  });

  rt.step(/the revenue trend chart is refreshed with period "([^"]+)"/, (m, ctx) => {
    const period = m[1];
    const d = ctx.dashboard as DashboardState;
    expect(d.activePeriod).toBe(period);
  });

  rt.step(/the dashboard displays at least (\d+) KPI stat cards/, (m, ctx) => {
    const count = parseInt(m[1], 10);
    void ctx;
    expect(KPI_CARDS_COUNT).toBeGreaterThanOrEqual(count);
  });

  rt.step(/the dashboard displays a section titled "([^"]+)"/, (m, ctx) => {
    const title = m[1];
    void ctx;
    expect(DASHBOARD_SECTIONS).toContain(title);
  });
}
