import { AcceptanceRuntime } from '../runtime/acceptance-runtime';
import { registerReportsProductsUiSteps } from '../steps/reports-products-ui.steps';

describe("Reports Products UI", () => {
  let rt: AcceptanceRuntime;

  beforeEach(() => {
    rt = new AcceptanceRuntime();
    registerReportsProductsUiSteps(rt);
  });

  it("Reports page shows a Productos tab", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Reportes page`);
    await rt.run(`the page displays a tab labeled "Productos"`);
  });

  it("Productos tab shows a filter control for each filterable field [field=category]", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Reportes page`);
    await rt.run(`the admin has selected the "Productos" tab`);
    await rt.run(`the tab displays a filter control for "category"`);
  });

  it("Productos tab shows a filter control for each filterable field [field=name]", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Reportes page`);
    await rt.run(`the admin has selected the "Productos" tab`);
    await rt.run(`the tab displays a filter control for "name"`);
  });

  it("Productos tab shows a filter control for each filterable field [field=stockStatus]", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Reportes page`);
    await rt.run(`the admin has selected the "Productos" tab`);
    await rt.run(`the tab displays a filter control for "stockStatus"`);
  });

  it("Productos tab shows required table columns [column=Producto]", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Reportes page`);
    await rt.run(`the admin has selected the "Productos" tab`);
    await rt.run(`the products table has a column "Producto"`);
  });

  it("Productos tab shows required table columns [column=Categoría]", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Reportes page`);
    await rt.run(`the admin has selected the "Productos" tab`);
    await rt.run(`the products table has a column "Categoría"`);
  });

  it("Productos tab shows required table columns [column=Precio]", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Reportes page`);
    await rt.run(`the admin has selected the "Productos" tab`);
    await rt.run(`the products table has a column "Precio"`);
  });

  it("Productos tab shows required table columns [column=Stock]", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Reportes page`);
    await rt.run(`the admin has selected the "Productos" tab`);
    await rt.run(`the products table has a column "Stock"`);
  });

  it("Productos tab shows required table columns [column=Mínimo]", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Reportes page`);
    await rt.run(`the admin has selected the "Productos" tab`);
    await rt.run(`the products table has a column "Mínimo"`);
  });

  it("Productos tab shows required table columns [column=Estado]", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Reportes page`);
    await rt.run(`the admin has selected the "Productos" tab`);
    await rt.run(`the products table has a column "Estado"`);
  });

  it("Productos tab shows total product count", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Reportes page`);
    await rt.run(`the admin has selected the "Productos" tab`);
    await rt.run(`the tab displays a stat card labeled "Total productos"`);
  });

  it("Products table has a CSV export button", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Reportes page`);
    await rt.run(`the admin has selected the "Productos" tab`);
    await rt.run(`the products table has a CSV export button`);
  });

  it("Selecting a category filter requests the products report with that category", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Reportes page`);
    await rt.run(`the admin has selected the "Productos" tab`);
    await rt.run(`the admin selects category "running" in the category filter`);
    await rt.run(`the products report API is called with category "running"`);
  });

  it("Typing in the name filter requests the products report with that name", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Reportes page`);
    await rt.run(`the admin has selected the "Productos" tab`);
    await rt.run(`the admin types "camisa" in the name filter`);
    await rt.run(`the products report API is called with name "camisa"`);
  });

  it("Selecting a stock status filter requests the products report with that status [status=out_of_stock]", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Reportes page`);
    await rt.run(`the admin has selected the "Productos" tab`);
    await rt.run(`the admin selects stockStatus "out_of_stock" in the stock filter`);
    await rt.run(`the products report API is called with stockStatus "out_of_stock"`);
  });

  it("Selecting a stock status filter requests the products report with that status [status=low_stock]", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Reportes page`);
    await rt.run(`the admin has selected the "Productos" tab`);
    await rt.run(`the admin selects stockStatus "low_stock" in the stock filter`);
    await rt.run(`the products report API is called with stockStatus "low_stock"`);
  });

  it("Selecting a stock status filter requests the products report with that status [status=in_stock]", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Reportes page`);
    await rt.run(`the admin has selected the "Productos" tab`);
    await rt.run(`the admin selects stockStatus "in_stock" in the stock filter`);
    await rt.run(`the products report API is called with stockStatus "in_stock"`);
  });

});
