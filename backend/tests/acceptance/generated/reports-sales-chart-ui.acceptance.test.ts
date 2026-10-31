import { AcceptanceRuntime } from '../runtime/acceptance-runtime';
import { registerReportsSalesChartUiSteps } from '../steps/reports-sales-chart-ui.steps';

describe("Reports Sales Chart UI", () => {
  let rt: AcceptanceRuntime;

  beforeEach(() => {
    rt = new AcceptanceRuntime();
    registerReportsSalesChartUiSteps(rt);
  });

  it("Ventas tab shows a revenue trend chart section", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Reportes page`);
    await rt.run(`the admin has selected the "Ventas" tab`);
    await rt.run(`the tab displays a chart section titled "Tendencia de ingresos"`);
  });

  it("Ventas tab revenue trend chart refreshes for each period [label=Hoy, period=day]", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Reportes page`);
    await rt.run(`the admin has selected the "Ventas" tab`);
    await rt.run(`the admin clicks the period button "Hoy"`);
    await rt.run(`the revenue trend chart displays bars for period "day"`);
  });

  it("Ventas tab revenue trend chart refreshes for each period [label=Semana, period=week]", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Reportes page`);
    await rt.run(`the admin has selected the "Ventas" tab`);
    await rt.run(`the admin clicks the period button "Semana"`);
    await rt.run(`the revenue trend chart displays bars for period "week"`);
  });

  it("Ventas tab revenue trend chart refreshes for each period [label=Mes, period=month]", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Reportes page`);
    await rt.run(`the admin has selected the "Ventas" tab`);
    await rt.run(`the admin clicks the period button "Mes"`);
    await rt.run(`the revenue trend chart displays bars for period "month"`);
  });

  it("Ventas tab shows an orders-by-status chart section", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Reportes page`);
    await rt.run(`the admin has selected the "Ventas" tab`);
    await rt.run(`the tab displays a chart section titled "Distribución por estado"`);
  });

  it("Orders-by-status chart shows a bar for each status [status=Confirmado]", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Reportes page`);
    await rt.run(`the admin has selected the "Ventas" tab`);
    await rt.run(`the "Distribución por estado" chart displays a bar labeled "Confirmado"`);
  });

  it("Orders-by-status chart shows a bar for each status [status=Cancelado]", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Reportes page`);
    await rt.run(`the admin has selected the "Ventas" tab`);
    await rt.run(`the "Distribución por estado" chart displays a bar labeled "Cancelado"`);
  });

});
