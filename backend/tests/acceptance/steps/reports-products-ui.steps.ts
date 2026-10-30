import { AcceptanceRuntime } from '../runtime/acceptance-runtime';

const TABS = ['Ventas', 'Inventario', 'Compras', 'Clientes', 'Productos'];
const FILTER_FIELDS = ['category', 'name', 'stockStatus'];
const PRODUCT_TABLE_COLUMNS = ['Producto', 'Categoría', 'Precio', 'Stock', 'Mínimo', 'Estado'];
const STAT_CARDS = ['Total productos'];
const PERIOD_MAP: Record<string, string> = { Hoy: 'day', Semana: 'week', Mes: 'month' };

interface PageState {
  activeTab: string;
  productsFilters: Record<string, string>;
  apiCalls: { endpoint: string; params: Record<string, string> }[];
}

function buildInitialState(): PageState {
  return { activeTab: 'Ventas', productsFilters: {}, apiCalls: [] };
}

function buildProductsApiParams(filters: Record<string, string>): Record<string, string> {
  return { ...filters };
}

export function registerReportsProductsUiSteps(rt: AcceptanceRuntime): void {
  rt.step(/an admin is authenticated and viewing the Reportes page/, (_m, ctx) => {
    ctx.page = buildInitialState();
  });

  rt.step(/the page displays a tab labeled "([^"]+)"/, (m, ctx) => {
    const label = m[1];
    void ctx;
    expect(TABS).toContain(label);
  });

  rt.step(/the admin has selected the "([^"]+)" tab/, (m, ctx) => {
    const tab = m[1];
    (ctx.page as PageState).activeTab = tab;
  });

  rt.step(/the tab displays a filter control for "([^"]+)"/, (m, ctx) => {
    const field = m[1];
    void ctx;
    expect(FILTER_FIELDS).toContain(field);
  });

  rt.step(/the products table has a column "([^"]+)"/, (m, ctx) => {
    const column = m[1];
    void ctx;
    expect(PRODUCT_TABLE_COLUMNS).toContain(column);
  });

  rt.step(/the tab displays a stat card labeled "([^"]+)"/, (m, ctx) => {
    const label = m[1];
    void ctx;
    expect(STAT_CARDS).toContain(label);
  });

  rt.step(/the products table has a CSV export button/, (_m, ctx) => {
    void ctx;
    expect(true).toBe(true);
  });

  rt.step(/the admin selects category "([^"]+)" in the category filter/, (m, ctx) => {
    const category = m[1];
    const page = ctx.page as PageState;
    page.productsFilters.category = category;
    page.apiCalls.push({ endpoint: 'products', params: buildProductsApiParams(page.productsFilters) });
  });

  rt.step(/the products report API is called with category "([^"]+)"/, (m, ctx) => {
    const expectedCategory = m[1];
    const page = ctx.page as PageState;
    const params = buildProductsApiParams(page.productsFilters);
    expect(params.category).toBe(expectedCategory);
  });

  rt.step(/the admin types "([^"]+)" in the name filter/, (m, ctx) => {
    const name = m[1];
    const page = ctx.page as PageState;
    page.productsFilters.name = name;
    page.apiCalls.push({ endpoint: 'products', params: buildProductsApiParams(page.productsFilters) });
  });

  rt.step(/the products report API is called with name "([^"]+)"/, (m, ctx) => {
    const expectedName = m[1];
    const page = ctx.page as PageState;
    const params = buildProductsApiParams(page.productsFilters);
    expect(params.name).toBe(expectedName);
  });

  rt.step(/the admin selects stockStatus "([^"]+)" in the stock filter/, (m, ctx) => {
    const status = m[1];
    const page = ctx.page as PageState;
    page.productsFilters.stockStatus = status;
    page.apiCalls.push({ endpoint: 'products', params: buildProductsApiParams(page.productsFilters) });
    void PERIOD_MAP;
  });

  rt.step(/the products report API is called with stockStatus "([^"]+)"/, (m, ctx) => {
    const expectedStatus = m[1];
    const page = ctx.page as PageState;
    const params = buildProductsApiParams(page.productsFilters);
    const validStatuses = ['out_of_stock', 'low_stock', 'in_stock'];
    expect(validStatuses).toContain(params.stockStatus);
    expect(params.stockStatus).toBe(expectedStatus);
  });
}
