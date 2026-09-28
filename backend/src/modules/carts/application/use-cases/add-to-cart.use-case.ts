import { CartItem } from '@modules/carts/domain/entities/cart-item.entity';
import { CartRepository } from '@modules/carts/domain/repositories/cart.repository';
import { ProductRepository } from '@modules/products/domain/repositories/product.repository';
import { ProductNotFoundException } from '@modules/products/domain/exceptions/product-not-found.exception';
import { InsufficientStockException } from '@modules/products/domain/exceptions/insufficient-stock.exception';
import { AddToCartDto } from '../dtos/add-to-cart.dto';

export class AddToCartUseCase {
  constructor(
    private readonly cartRepo: CartRepository,
    private readonly productRepo: ProductRepository,
  ) {}

  async execute(userId: string, dto: AddToCartDto) {
    const product = await this.productRepo.findById(dto.productId);
    if (!product) throw new ProductNotFoundException(dto.productId);

    const newQuantity = dto.quantity;

    if (!product.hasStock(newQuantity)) {
      throw new InsufficientStockException(product.name);
    }

    const item = new CartItem({
      productId: product.id,
      productName: product.name,
      unitPrice: product.price,
      quantity: newQuantity,
      imageUrl: product.imageUrl,
      addedAt: new Date().toISOString(),
    });

    await this.cartRepo.upsertItem(userId, item);

    const updatedCart = await this.cartRepo.getByUserId(userId);
    return updatedCart.toJSON();
  }
}
