import type { ProductRepository } from '@modules/products/domain/repositories/product.repository';

export type StockStatus = 'out_of_stock' | 'low_stock' | 'in_stock';

export interface ProductReportEntry {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  minStock: number;
  stockStatus: StockStatus;
}

export interface ProductsReportResult {
  products: ProductReportEntry[];
  total: number;
  page: number;
  pageSize: number;
}

export class ProductsReportUseCase {
  constructor(private readonly productRepo: ProductRepository) {}

  async execute(input: {
    category?: string;
    name?: string;
    stockStatus?: StockStatus;
    page?: number;
    pageSize?: number;
  }): Promise<ProductsReportResult> {
    const page = input.page ?? 1;
    const pageSize = input.pageSize ?? 20;

    const allProducts: import('@modules/products/domain/entities/product.entity').Product[] = [];
    let cursor: string | undefined;
    do {
      const result = await this.productRepo.listAll({ limit: 100, cursor });
      allProducts.push(...result.items);
      cursor = result.nextCursor;
    } while (cursor);

    let filtered = allProducts;

    if (input.category) {
      filtered = filtered.filter((p) => p.category === input.category);
    }

    if (input.name) {
      const term = input.name.toLowerCase();
      filtered = filtered.filter((p) => p.name.toLowerCase().includes(term));
    }

    if (input.stockStatus) {
      filtered = filtered.filter((p) => {
        switch (input.stockStatus) {
          case 'out_of_stock': return p.stock === 0;
          case 'low_stock': return p.stock > 0 && p.stock < p.minStock;
          case 'in_stock': return p.stock >= p.minStock;
          default: throw new Error(`Unknown stockStatus: ${String(input.stockStatus)}`);
        }
      });
    }

    const total = filtered.length;
    const offset = (page - 1) * pageSize;
    const paged = filtered.slice(offset, offset + pageSize);

    const products: ProductReportEntry[] = paged.map((p) => ({
      id: p.id,
      name: p.name,
      category: p.category,
      price: p.price,
      stock: p.stock,
      minStock: p.minStock,
      stockStatus: p.stock === 0 ? 'out_of_stock' : p.stock < p.minStock ? 'low_stock' : 'in_stock',
    }));

    return { products, total, page, pageSize };
  }
}
