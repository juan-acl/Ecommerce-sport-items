import { AcceptanceRuntime } from '../runtime/acceptance-runtime';
import { registerReportsPdfUiSteps } from '../steps/reports-pdf-ui.steps';

describe("Reports PDF Export UI", () => {
  let rt: AcceptanceRuntime;

  beforeEach(() => {
    rt = new AcceptanceRuntime();
    registerReportsPdfUiSteps(rt);
  });

  it("Compras tab tables have PDF export buttons [table=Top proveedores]", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Reportes page`);
    await rt.run(`the admin has selected the "Compras" tab`);
    await rt.run(`the "Top proveedores" table has a PDF export button`);
  });

  it("Compras tab tables have PDF export buttons [table=Compras por estado]", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Reportes page`);
    await rt.run(`the admin has selected the "Compras" tab`);
    await rt.run(`the "Compras por estado" table has a PDF export button`);
  });

  it("Products table has a PDF export button", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Reportes page`);
    await rt.run(`the admin has selected the "Productos" tab`);
    await rt.run(`the products table has a PDF export button`);
  });

  it("Top clientes table has a PDF export button", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Reportes page`);
    await rt.run(`the admin has selected the "Clientes" tab`);
    await rt.run(`the "Top clientes" table has a PDF export button`);
  });

  it("Chart report tabs have a PDF export button [tab=Ventas]", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Reportes page`);
    await rt.run(`the admin has selected the "Ventas" tab`);
    await rt.run(`the tab displays a PDF export button`);
  });

  it("Chart report tabs have a PDF export button [tab=Inventario]", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Reportes page`);
    await rt.run(`the admin has selected the "Inventario" tab`);
    await rt.run(`the tab displays a PDF export button`);
  });

});
