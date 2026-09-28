import { CartItem } from '@modules/carts/domain/entities/cart-item.entity';
import { CartRepository } from '@modules/carts/domain/repositories/cart.repository';
import { ProductRepository } from '@modules/products/domain/repositories/product.repository';
import { ProductNotFoundException } from '@modules/products/domain/exceptions/product-not-found.exception';
import { InsufficientStockException } from '@modules/products/domain/exceptions/insufficient-stock.exception';
import { NotFoundException } from '@shared/domain/exceptions/domain.exception';

export class UpdateCartItemUseCase {
  constructor(
    private readonly cartRepo: CartRepository,
    private readonly productRepo: ProductRepository,
  ) {}

  async execute(userId: string, productId: string, newQuantity: number) {
    const cart = await this.cartRepo.getByUserId(userId);
    const existing = cart.getItems().find((i) => i.productId === productId);

    if (!existing) {
      throw new NotFoundException(`El producto no está en el carrito`);
    }

    const product = await this.productRepo.findById(productId);
    if (!product) throw new ProductNotFoundException(productId);

    if (!product.hasStock(newQuantity)) {
      throw new InsufficientStockException(product.name);
    }

    const updated = new CartItem({
      productId: existing.productId,
      productName: existing.productName,
      unitPrice: existing.unitPrice,
      quantity: newQuantity,
      imageUrl: existing.imageUrl,
      addedAt: existing.addedAt,
    });

    await this.cartRepo.upsertItem(userId, updated);

    const updatedCart = await this.cartRepo.getByUserId(userId);
    return updatedCart.toJSON();
  }
}
