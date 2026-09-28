import { Product, ProductProps } from '@modules/products/domain/entities/product.entity';

export class ProductMapper {
  static toDomain(item: Record<string, unknown>): Product {
    const props: ProductProps = {
      id: item.id as string,
      name: item.name as string,
      category: item.category as string,
      price: item.price as number,
      stock: item.stock as number,
      description: item.description as string,
      imageUrl: item.imageUrl as string,
      createdAt: item.createdAt as string,
    };
    return new Product(props);
  }
}
