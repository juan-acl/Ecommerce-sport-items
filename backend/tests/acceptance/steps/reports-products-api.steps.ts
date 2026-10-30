import { AcceptanceRuntime } from '../runtime/acceptance-runtime';
import { ProductsReportUseCase } from '../../../src/modules/reports/application/use-cases/products-report.use-case';
import { Product } from '../../../src/modules/products/domain/entities/product.entity';

function makeProduct(overrides: {
  id?: string;
  name?: string;
  category?: string;
  stock?: number;
  minStock?: number;
  price?: number;
}): Product {
  return new Product({
    id: overrides.id ?? 'p1',
    name: overrides.name ?? 'Running Shoe',
    category: overrides.category ?? 'running',
    price: overrides.price ?? 100,
    stock: overrides.stock ?? 10,
    minStock: overrides.minStock ?? 5,
    description: 'Test',
    imageUrl: 'img.jpg',
    createdAt: new Date().toISOString(),
  });
}

function buildMockRepo(products: Product[]) {
  return {
    list: async () => ({ items: products, count: products.length }),
    listAll: async () => ({ items: products, nextCursor: undefined, count: products.length }),
    findById: async () => null,
    save: async () => undefined,
    update: async () => undefined,
    delete: async () => undefined,
    findBelowMinStock: async () => [],
  };
}

export function registerReportsProductsApiSteps(rt: AcceptanceRuntime): void {
  rt.step(/the admin API client is initialized/, (_m, ctx) => {
    const products = [
      makeProduct({ id: 'p1', name: 'Running Shoe', category: 'running', stock: 10, minStock: 5 }),
      makeProduct({ id: 'p2', name: 'Camisa running', category: 'running', stock: 0, minStock: 3 }),
      makeProduct({ id: 'p3', name: 'Balón fútbol', category: 'football', stock: 2, minStock: 5 }),
    ];
    ctx.repo = buildMockRepo(products);
    ctx.useCase = new ProductsReportUseCase(ctx.repo as never);
  });

  rt.step(/the client requests the products report$/, async (_m, ctx) => {
    const uc = ctx.useCase as ProductsReportUseCase;
    ctx.response = await uc.execute({});
  });

  rt.step(/the client requests the products report with category "([^"]+)"/, async (m, ctx) => {
    const category = m[1];
    const uc = ctx.useCase as ProductsReportUseCase;
    ctx.response = await uc.execute({ category });
  });

  rt.step(/the client requests the products report with name "([^"]+)"/, async (m, ctx) => {
    const name = m[1];
    const products = [
      makeProduct({ id: 'a', name: 'Camisa running' }),
      makeProduct({ id: 'b', name: 'Zapato fútbol' }),
    ];
    const repo = buildMockRepo(products);
    const uc = new ProductsReportUseCase(repo as never);
    ctx.response = await uc.execute({ name });
  });

  rt.step(/the client requests the products report with stockStatus "([^"]+)"/, async (m, ctx) => {
    const stockStatus = m[1] as 'out_of_stock' | 'low_stock' | 'in_stock';
    const products = [
      makeProduct({ id: 'a', stock: 0, minStock: 5 }),
      makeProduct({ id: 'b', stock: 3, minStock: 5 }),
      makeProduct({ id: 'c', stock: 10, minStock: 5 }),
    ];
    const repo = buildMockRepo(products);
    const uc = new ProductsReportUseCase(repo as never);
    ctx.response = await uc.execute({ stockStatus });
  });

  rt.step(/each product entry contains field "([^"]+)"/, (m, ctx) => {
    const field = m[1];
    const response = ctx.response as { products: Record<string, unknown>[] };
    expect(response.products.length).toBeGreaterThan(0);
    for (const entry of response.products) {
      expect(entry).toHaveProperty(field);
    }
  });

  rt.step(/the response includes field "([^"]+)"/, (m, ctx) => {
    const field = m[1];
    expect(ctx.response).toHaveProperty(field);
  });

  rt.step(/every product entry has category "([^"]+)"/, (m, ctx) => {
    const category = m[1];
    const response = ctx.response as { products: { category: string }[] };
    expect(response.products.length).toBeGreaterThan(0);
    expect(response.products.every((p) => p.category === category)).toBe(true);
  });

  rt.step(/every product entry name contains "([^"]+)"/, (m, ctx) => {
    const term = m[1];
    const response = ctx.response as { products: { name: string }[] };
    expect(response.products.length).toBeGreaterThan(0);
    expect(response.products.every((p) => p.name.toLowerCase().includes(term.toLowerCase()))).toBe(true);
  });

  rt.step(/every product entry satisfies the "([^"]+)" stock condition/, (m, ctx) => {
    const status = m[1];
    const response = ctx.response as { products: { stock: number; minStock: number }[] };
    expect(response.products.length).toBeGreaterThan(0);
    for (const p of response.products) {
      switch (status) {
        case 'out_of_stock': expect(p.stock).toBe(0); break;
        case 'low_stock': expect(p.stock).toBeGreaterThan(0); expect(p.stock).toBeLessThan(p.minStock); break;
        case 'in_stock': expect(p.stock).toBeGreaterThanOrEqual(p.minStock); break;
        default: throw new Error(`Unknown stockStatus: ${status}`);
      }
    }
  });
}
