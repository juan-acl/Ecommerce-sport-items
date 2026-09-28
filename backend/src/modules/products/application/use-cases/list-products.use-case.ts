import { Product } from '@modules/products/domain/entities/product.entity';
import { ProductRepository } from '@modules/products/domain/repositories/product.repository';
import { ListProductsQuery } from '../dtos/list-products.dto';

export interface ListProductsResult {
  products: ReturnType<Product['toJSON']>[];
  pagination: {
    limit: number;
    count: number;
    nextCursor?: string;
  };
}

export class ListProductsUseCase {
  constructor(private readonly productRepo: ProductRepository) {}

  async execute(query: ListProductsQuery): Promise<ListProductsResult> {
    const result = await this.productRepo.list({
      limit: query.limit,
      cursor: query.cursor,
      category: query.category,
    });

    return {
      products: result.items.map((p) => p.toJSON()),
      pagination: {
        limit: query.limit,
        count: result.count,
        nextCursor: result.nextCursor,
      },
    };
  }
}
