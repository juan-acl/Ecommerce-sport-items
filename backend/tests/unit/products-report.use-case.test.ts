import { ProductsReportUseCase } from '@modules/reports/application/use-cases/products-report.use-case';
import { Product } from '@modules/products/domain/entities/product.entity';

function makeProduct(overrides: {
  id?: string;
  name?: string;
  category?: string;
  stock?: number;
  minStock?: number;
  price?: number;
}): Product {
  return new Product({
    id: overrides.id ?? 'prod-1',
    name: overrides.name ?? 'Running Shoe',
    category: overrides.category ?? 'running',
    price: overrides.price ?? 100,
    stock: overrides.stock ?? 10,
    minStock: overrides.minStock ?? 5,
    description: 'Test product',
    imageUrl: 'img.jpg',
    createdAt: new Date().toISOString(),
  });
}

describe('ProductsReportUseCase', () => {
  const mockRepo = {
    list: jest.fn(),
    findById: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findBelowMinStock: jest.fn(),
    listAll: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockRepo.listAll.mockResolvedValue({ items: [], nextCursor: undefined, count: 0 });
  });

  it('response contains required pagination fields', async () => {
    const uc = new ProductsReportUseCase(mockRepo as never);
    const result = await uc.execute({});
    expect(result).toHaveProperty('products');
    expect(result).toHaveProperty('total');
    expect(result).toHaveProperty('page');
    expect(result).toHaveProperty('pageSize');
  });

  it('each product entry contains required fields', async () => {
    mockRepo.listAll.mockResolvedValueOnce({
      items: [makeProduct({})],
      nextCursor: undefined,
      count: 1,
    });
    const uc = new ProductsReportUseCase(mockRepo as never);
    const result = await uc.execute({});
    const entry = result.products[0];
    expect(entry).toHaveProperty('id');
    expect(entry).toHaveProperty('name');
    expect(entry).toHaveProperty('category');
    expect(entry).toHaveProperty('price');
    expect(entry).toHaveProperty('stock');
    expect(entry).toHaveProperty('minStock');
    expect(entry).toHaveProperty('stockStatus');
  });

  it('stockStatus field is correctly derived for each product', async () => {
    mockRepo.listAll.mockResolvedValueOnce({
      items: [
        makeProduct({ id: 'a', stock: 0, minStock: 5 }),
        makeProduct({ id: 'b', stock: 3, minStock: 5 }),
        makeProduct({ id: 'c', stock: 10, minStock: 5 }),
      ],
      nextCursor: undefined,
      count: 3,
    });
    const uc = new ProductsReportUseCase(mockRepo as never);
    const result = await uc.execute({});
    expect(result.products.find((p) => p.id === 'a')?.stockStatus).toBe('out_of_stock');
    expect(result.products.find((p) => p.id === 'b')?.stockStatus).toBe('low_stock');
    expect(result.products.find((p) => p.id === 'c')?.stockStatus).toBe('in_stock');
  });

  it('category filter returns only matching products', async () => {
    mockRepo.listAll.mockResolvedValueOnce({
      items: [
        makeProduct({ id: 'a', category: 'running' }),
        makeProduct({ id: 'b', category: 'football' }),
      ],
      nextCursor: undefined,
      count: 2,
    });
    const uc = new ProductsReportUseCase(mockRepo as never);
    const result = await uc.execute({ category: 'running' });
    expect(result.products.every((p) => p.category === 'running')).toBe(true);
    expect(result.total).toBe(1);
  });

  it('name filter returns only products whose name contains the term', async () => {
    mockRepo.listAll.mockResolvedValueOnce({
      items: [
        makeProduct({ id: 'a', name: 'Camisa running' }),
        makeProduct({ id: 'b', name: 'Zapato fútbol' }),
      ],
      nextCursor: undefined,
      count: 2,
    });
    const uc = new ProductsReportUseCase(mockRepo as never);
    const result = await uc.execute({ name: 'camisa' });
    expect(result.products.length).toBe(1);
    expect(result.products[0].name.toLowerCase()).toContain('camisa');
  });

  it('stockStatus out_of_stock returns only products with stock === 0', async () => {
    mockRepo.listAll.mockResolvedValueOnce({
      items: [
        makeProduct({ id: 'a', stock: 0, minStock: 5 }),
        makeProduct({ id: 'b', stock: 3, minStock: 5 }),
        makeProduct({ id: 'c', stock: 10, minStock: 5 }),
      ],
      nextCursor: undefined,
      count: 3,
    });
    const uc = new ProductsReportUseCase(mockRepo as never);
    const result = await uc.execute({ stockStatus: 'out_of_stock' });
    expect(result.products.every((p) => p.stock === 0)).toBe(true);
    expect(result.total).toBe(1);
  });

  it('stockStatus low_stock returns products where 0 < stock < minStock', async () => {
    mockRepo.listAll.mockResolvedValueOnce({
      items: [
        makeProduct({ id: 'a', stock: 0, minStock: 5 }),
        makeProduct({ id: 'b', stock: 3, minStock: 5 }),
        makeProduct({ id: 'c', stock: 10, minStock: 5 }),
      ],
      nextCursor: undefined,
      count: 3,
    });
    const uc = new ProductsReportUseCase(mockRepo as never);
    const result = await uc.execute({ stockStatus: 'low_stock' });
    expect(result.products.every((p) => p.stock > 0 && p.stock < p.minStock)).toBe(true);
    expect(result.total).toBe(1);
  });

  it('stockStatus in_stock returns products where stock >= minStock', async () => {
    mockRepo.listAll.mockResolvedValueOnce({
      items: [
        makeProduct({ id: 'a', stock: 0, minStock: 5 }),
        makeProduct({ id: 'b', stock: 3, minStock: 5 }),
        makeProduct({ id: 'c', stock: 10, minStock: 5 }),
      ],
      nextCursor: undefined,
      count: 3,
    });
    const uc = new ProductsReportUseCase(mockRepo as never);
    const result = await uc.execute({ stockStatus: 'in_stock' });
    expect(result.products.every((p) => p.stock >= p.minStock)).toBe(true);
    expect(result.total).toBe(1);
  });
});
