import { v4 as uuid } from 'uuid';
import { Product } from '@modules/products/domain/entities/product.entity';
import { ProductRepository } from '@modules/products/domain/repositories/product.repository';
import { CreateProductDto } from '../dtos/create-product.dto';

export class CreateProductUseCase {
  constructor(private readonly productRepo: ProductRepository) {}

  async execute(dto: CreateProductDto): Promise<ReturnType<Product['toJSON']>> {
    const product = new Product({
      id: uuid(),
      name: dto.name,
      category: dto.category,
      price: dto.price,
      stock: dto.stock,
      minStock: dto.minStock ?? 0,
      description: dto.description,
      imageUrl: dto.imageUrl,
      createdAt: new Date().toISOString(),
    });
    await this.productRepo.save(product);
    return product.toJSON();
  }
}
