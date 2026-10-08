import { ProductRepository } from '@modules/products/domain/repositories/product.repository';
import { NotFoundException } from '@shared/domain/exceptions/domain.exception';
import { Product } from '@modules/products/domain/entities/product.entity';
import { UpdateProductDto } from '../dtos/update-product.dto';

export class UpdateProductUseCase {
  constructor(private readonly productRepo: ProductRepository) {}

  async execute(id: string, dto: UpdateProductDto): Promise<ReturnType<Product['toJSON']>> {
    const existing = await this.productRepo.findById(id);
    if (!existing) throw new NotFoundException('Producto no encontrado');

    const updated = new Product({
      id: existing.id,
      name: dto.name ?? existing.name,
      category: dto.category ?? existing.category,
      price: dto.price ?? existing.price,
      stock: dto.stock ?? existing.stock,
      minStock: dto.minStock ?? existing.minStock,
      description: dto.description ?? existing.description,
      imageUrl: dto.imageUrl ?? existing.imageUrl,
      createdAt: existing.createdAt,
    });
    await this.productRepo.update(updated);
    return updated.toJSON();
  }
}
