import { ProductRepository } from '@modules/products/domain/repositories/product.repository';
import { ProductProps } from '@modules/products/domain/entities/product.entity';

export class GetLowStockUseCase {
  constructor(private readonly productRepo: ProductRepository) {}

  async execute(): Promise<ProductProps[]> {
    const products = await this.productRepo.findBelowMinStock();
    return products.map((p) => p.toJSON());
  }
}
