import { AcceptanceRuntime } from '../runtime/acceptance-runtime';
import { registerReportsClientAnalyticsUiSteps } from '../steps/reports-client-analytics-ui.steps';

describe("Reports Client Analytics UI", () => {
  let rt: AcceptanceRuntime;

  beforeEach(() => {
    rt = new AcceptanceRuntime();
    registerReportsClientAnalyticsUiSteps(rt);
  });

  it("Reports page shows a Clientes tab", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Reportes page`);
    await rt.run(`the page displays a tab labeled "Clientes"`);
  });

  it("Clientes tab shows a period filter button for each preset [label=Hoy]", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Reportes page`);
    await rt.run(`the admin has selected the "Clientes" tab`);
    await rt.run(`the tab displays a period button labeled "Hoy"`);
  });

  it("Clientes tab shows a period filter button for each preset [label=Semana]", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Reportes page`);
    await rt.run(`the admin has selected the "Clientes" tab`);
    await rt.run(`the tab displays a period button labeled "Semana"`);
  });

  it("Clientes tab shows a period filter button for each preset [label=Mes]", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Reportes page`);
    await rt.run(`the admin has selected the "Clientes" tab`);
    await rt.run(`the tab displays a period button labeled "Mes"`);
  });

  it("Clientes tab shows a summary stat card for each KPI [label=Total clientes]", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Reportes page`);
    await rt.run(`the admin has selected the "Clientes" tab`);
    await rt.run(`the tab displays a stat card labeled "Total clientes"`);
  });

  it("Clientes tab shows a summary stat card for each KPI [label=Nuevos clientes]", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Reportes page`);
    await rt.run(`the admin has selected the "Clientes" tab`);
    await rt.run(`the tab displays a stat card labeled "Nuevos clientes"`);
  });

  it("Clientes tab shows a top clients table", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Reportes page`);
    await rt.run(`the admin has selected the "Clientes" tab`);
    await rt.run(`the tab displays a "Top clientes" table`);
  });

  it("Top clientes table shows required columns [column=Cliente]", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Reportes page`);
    await rt.run(`the admin has selected the "Clientes" tab`);
    await rt.run(`the "Top clientes" table has a column "Cliente"`);
  });

  it("Top clientes table shows required columns [column=Órdenes]", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Reportes page`);
    await rt.run(`the admin has selected the "Clientes" tab`);
    await rt.run(`the "Top clientes" table has a column "Órdenes"`);
  });

  it("Top clientes table shows required columns [column=Gasto total]", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Reportes page`);
    await rt.run(`the admin has selected the "Clientes" tab`);
    await rt.run(`the "Top clientes" table has a column "Gasto total"`);
  });

  it("Top clientes table has a CSV export button", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Reportes page`);
    await rt.run(`the admin has selected the "Clientes" tab`);
    await rt.run(`the "Top clientes" table has a CSV export button`);
  });

  it("Clicking a period button requests the client analytics report for that period [label=Hoy, period=day]", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Reportes page`);
    await rt.run(`the admin has selected the "Clientes" tab`);
    await rt.run(`the admin clicks the period button "Hoy"`);
    await rt.run(`the client analytics report API is called with period "day"`);
  });

  it("Clicking a period button requests the client analytics report for that period [label=Semana, period=week]", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Reportes page`);
    await rt.run(`the admin has selected the "Clientes" tab`);
    await rt.run(`the admin clicks the period button "Semana"`);
    await rt.run(`the client analytics report API is called with period "week"`);
  });

  it("Clicking a period button requests the client analytics report for that period [label=Mes, period=month]", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Reportes page`);
    await rt.run(`the admin has selected the "Clientes" tab`);
    await rt.run(`the admin clicks the period button "Mes"`);
    await rt.run(`the client analytics report API is called with period "month"`);
  });

});
