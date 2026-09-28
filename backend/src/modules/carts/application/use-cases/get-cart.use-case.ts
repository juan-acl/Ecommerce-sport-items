import { CartRepository } from '@modules/carts/domain/repositories/cart.repository';

export class GetCartUseCase {
  constructor(private readonly cartRepo: CartRepository) {}

  async execute(userId: string) {
    const cart = await this.cartRepo.getByUserId(userId);
    return cart.toJSON();
  }
}
