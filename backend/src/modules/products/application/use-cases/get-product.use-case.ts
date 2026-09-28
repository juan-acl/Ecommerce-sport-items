import { Product } from '@modules/products/domain/entities/product.entity';
import { ProductRepository } from '@modules/products/domain/repositories/product.repository';
import { ProductNotFoundException } from '@modules/products/domain/exceptions/product-not-found.exception';

export class GetProductUseCase {
  constructor(private readonly productRepo: ProductRepository) {}

  async execute(id: string): Promise<ReturnType<Product['toJSON']>> {
    const product = await this.productRepo.findById(id);
    if (!product) throw new ProductNotFoundException(id);
    return product.toJSON();
  }
}
