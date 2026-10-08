import { Product, ProductProps } from '@modules/products/domain/entities/product.entity';

export class ProductMapper {
  static toDomain(item: Record<string, unknown>): Product {
    const props: ProductProps = {
      id: item.id as string,
      name: item.name as string,
      category: item.category as string,
      price: item.price as number,
      stock: item.stock as number,
      minStock: (item.minStock as number) ?? 0,
      description: item.description as string,
      imageUrl: item.imageUrl as string,
      createdAt: item.createdAt as string,
    };
    return new Product(props);
  }

  static toItem(product: Product): Record<string, unknown> {
    return {
      PK: `PRODUCT#${product.id}`,
      SK: 'METADATA',
      GSI1PK: 'PRODUCT',
      GSI1SK: product.id,
      GSI2PK: `CATEGORY#${product.category}`,
      GSI2SK: `PRODUCT#${product.id}`,
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      minStock: product.minStock,
      description: product.description,
      imageUrl: product.imageUrl,
      createdAt: product.createdAt,
    };
  }
}
