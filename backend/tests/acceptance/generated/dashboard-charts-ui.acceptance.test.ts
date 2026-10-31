import { AcceptanceRuntime } from '../runtime/acceptance-runtime';
import { registerDashboardChartsUiSteps } from '../steps/dashboard-charts-ui.steps';

describe("Dashboard Charts UI", () => {
  let rt: AcceptanceRuntime;

  beforeEach(() => {
    rt = new AcceptanceRuntime();
    registerDashboardChartsUiSteps(rt);
  });

  it("Dashboard shows a period filter for the revenue trend chart", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Dashboard page`);
    await rt.run(`the revenue trend section displays a period filter`);
  });

  it("Dashboard trend period filter shows a button for each preset [label=Hoy]", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Dashboard page`);
    await rt.run(`the revenue trend section displays a period button labeled "Hoy"`);
  });

  it("Dashboard trend period filter shows a button for each preset [label=Semana]", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Dashboard page`);
    await rt.run(`the revenue trend section displays a period button labeled "Semana"`);
  });

  it("Dashboard trend period filter shows a button for each preset [label=Mes]", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Dashboard page`);
    await rt.run(`the revenue trend section displays a period button labeled "Mes"`);
  });

  it("Semana is the default selected period on the revenue trend chart", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Dashboard page`);
    await rt.run(`the revenue trend period button "Semana" is active`);
  });

  it("Clicking a trend period button updates the chart for that period [label=Hoy, period=day]", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Dashboard page`);
    await rt.run(`the admin clicks the trend period button "Hoy"`);
    await rt.run(`the revenue trend chart is refreshed with period "day"`);
  });

  it("Clicking a trend period button updates the chart for that period [label=Semana, period=week]", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Dashboard page`);
    await rt.run(`the admin clicks the trend period button "Semana"`);
    await rt.run(`the revenue trend chart is refreshed with period "week"`);
  });

  it("Clicking a trend period button updates the chart for that period [label=Mes, period=month]", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Dashboard page`);
    await rt.run(`the admin clicks the trend period button "Mes"`);
    await rt.run(`the revenue trend chart is refreshed with period "month"`);
  });

  it("Dashboard shows a KPI summary row with at least four stat cards", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Dashboard page`);
    await rt.run(`the dashboard displays at least 4 KPI stat cards`);
  });

  it("Dashboard shows an orders pipeline chart section", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Dashboard page`);
    await rt.run(`the dashboard displays a section titled "Pipeline de órdenes"`);
  });

  it("Dashboard shows a top products chart section", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Dashboard page`);
    await rt.run(`the dashboard displays a section titled "Productos más vendidos"`);
  });

  it("Dashboard shows a revenue by category chart section", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Dashboard page`);
    await rt.run(`the dashboard displays a section titled "Ingresos por categoría"`);
  });

});
