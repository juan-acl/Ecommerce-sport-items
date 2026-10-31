import { AcceptanceRuntime } from '../runtime/acceptance-runtime';
import { registerReportsInventoryChartUiSteps } from '../steps/reports-inventory-chart-ui.steps';

describe("Reports Inventory Chart UI", () => {
  let rt: AcceptanceRuntime;

  beforeEach(() => {
    rt = new AcceptanceRuntime();
    registerReportsInventoryChartUiSteps(rt);
  });

  it("Inventario tab shows a stock status distribution chart section", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Reportes page`);
    await rt.run(`the admin has selected the "Inventario" tab`);
    await rt.run(`the tab displays a chart section titled "Distribución de stock"`);
  });

  it("Stock distribution chart shows a bar for each stock status [label=En stock]", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Reportes page`);
    await rt.run(`the admin has selected the "Inventario" tab`);
    await rt.run(`the "Distribución de stock" chart displays a bar labeled "En stock"`);
  });

  it("Stock distribution chart shows a bar for each stock status [label=Stock bajo]", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Reportes page`);
    await rt.run(`the admin has selected the "Inventario" tab`);
    await rt.run(`the "Distribución de stock" chart displays a bar labeled "Stock bajo"`);
  });

  it("Stock distribution chart shows a bar for each stock status [label=Sin stock]", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Reportes page`);
    await rt.run(`the admin has selected the "Inventario" tab`);
    await rt.run(`the "Distribución de stock" chart displays a bar labeled "Sin stock"`);
  });

});
