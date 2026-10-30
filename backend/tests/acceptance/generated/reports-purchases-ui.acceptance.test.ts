import { AcceptanceRuntime } from '../runtime/acceptance-runtime';
import { registerReportsPurchasesUiSteps } from '../steps/reports-purchases-ui.steps';

describe("Reports Purchases UI", () => {
  let rt: AcceptanceRuntime;

  beforeEach(() => {
    rt = new AcceptanceRuntime();
    registerReportsPurchasesUiSteps(rt);
  });

  it("Reports page shows a Compras tab", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Reportes page`);
    await rt.run(`the page displays a tab labeled "Compras"`);
  });

  it("Compras tab shows a period filter button for each preset [label=Hoy]", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Reportes page`);
    await rt.run(`the admin has selected the "Compras" tab`);
    await rt.run(`the tab displays a period button labeled "Hoy"`);
  });

  it("Compras tab shows a period filter button for each preset [label=Semana]", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Reportes page`);
    await rt.run(`the admin has selected the "Compras" tab`);
    await rt.run(`the tab displays a period button labeled "Semana"`);
  });

  it("Compras tab shows a period filter button for each preset [label=Mes]", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Reportes page`);
    await rt.run(`the admin has selected the "Compras" tab`);
    await rt.run(`the tab displays a period button labeled "Mes"`);
  });

  it("Compras tab shows a summary stat card for each KPI [label=Total compras]", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Reportes page`);
    await rt.run(`the admin has selected the "Compras" tab`);
    await rt.run(`the tab displays a stat card labeled "Total compras"`);
  });

  it("Compras tab shows a summary stat card for each KPI [label=Costo total]", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Reportes page`);
    await rt.run(`the admin has selected the "Compras" tab`);
    await rt.run(`the tab displays a stat card labeled "Costo total"`);
  });

  it("Compras tab shows a summary stat card for each KPI [label=Costo promedio]", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Reportes page`);
    await rt.run(`the admin has selected the "Compras" tab`);
    await rt.run(`the tab displays a stat card labeled "Costo promedio"`);
  });

  it("Compras tab shows a top suppliers table", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Reportes page`);
    await rt.run(`the admin has selected the "Compras" tab`);
    await rt.run(`the tab displays a "Top proveedores" table`);
  });

  it("Top proveedores table shows required columns [column=Proveedor]", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Reportes page`);
    await rt.run(`the admin has selected the "Compras" tab`);
    await rt.run(`the "Top proveedores" table has a column "Proveedor"`);
  });

  it("Top proveedores table shows required columns [column=Compras]", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Reportes page`);
    await rt.run(`the admin has selected the "Compras" tab`);
    await rt.run(`the "Top proveedores" table has a column "Compras"`);
  });

  it("Top proveedores table shows required columns [column=Gasto total]", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Reportes page`);
    await rt.run(`the admin has selected the "Compras" tab`);
    await rt.run(`the "Top proveedores" table has a column "Gasto total"`);
  });

  it("Compras tab shows a purchases by status table", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Reportes page`);
    await rt.run(`the admin has selected the "Compras" tab`);
    await rt.run(`the tab displays a "Compras por estado" table`);
  });

  it("Compras por estado table shows required columns [column=Estado]", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Reportes page`);
    await rt.run(`the admin has selected the "Compras" tab`);
    await rt.run(`the "Compras por estado" table has a column "Estado"`);
  });

  it("Compras por estado table shows required columns [column=Cantidad]", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Reportes page`);
    await rt.run(`the admin has selected the "Compras" tab`);
    await rt.run(`the "Compras por estado" table has a column "Cantidad"`);
  });

  it("Top proveedores table has a CSV export button", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Reportes page`);
    await rt.run(`the admin has selected the "Compras" tab`);
    await rt.run(`the "Top proveedores" table has a CSV export button`);
  });

  it("Compras por estado table has a CSV export button", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Reportes page`);
    await rt.run(`the admin has selected the "Compras" tab`);
    await rt.run(`the "Compras por estado" table has a CSV export button`);
  });

  it("Clicking a period button requests the purchases report for that period [label=Hoy, period=day]", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Reportes page`);
    await rt.run(`the admin has selected the "Compras" tab`);
    await rt.run(`the admin clicks the period button "Hoy"`);
    await rt.run(`the purchases report API is called with period "day"`);
  });

  it("Clicking a period button requests the purchases report for that period [label=Semana, period=week]", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Reportes page`);
    await rt.run(`the admin has selected the "Compras" tab`);
    await rt.run(`the admin clicks the period button "Semana"`);
    await rt.run(`the purchases report API is called with period "week"`);
  });

  it("Clicking a period button requests the purchases report for that period [label=Mes, period=month]", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Reportes page`);
    await rt.run(`the admin has selected the "Compras" tab`);
    await rt.run(`the admin clicks the period button "Mes"`);
    await rt.run(`the purchases report API is called with period "month"`);
  });

});
