import { CartRepository } from '@modules/carts/domain/repositories/cart.repository';

export class RemoveFromCartUseCase {
  constructor(private readonly cartRepo: CartRepository) {}

  async execute(userId: string, productId: string) {
    await this.cartRepo.removeItem(userId, productId);
    const cart = await this.cartRepo.getByUserId(userId);
    return cart.toJSON();
  }
}
