import { ProductRepository } from '@modules/products/domain/repositories/product.repository';
import { NotFoundException } from '@shared/domain/exceptions/domain.exception';

export class DeleteProductUseCase {
  constructor(private readonly productRepo: ProductRepository) {}

  async execute(id: string): Promise<void> {
    const existing = await this.productRepo.findById(id);
    if (!existing) throw new NotFoundException('Producto no encontrado');
    await this.productRepo.delete(id);
  }
}
