export interface ProductProps {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  description: string;
  imageUrl: string;
  createdAt: string;
}

export class Product {
  constructor(private readonly props: ProductProps) {
    if (props.price < 0) throw new Error('El precio no puede ser negativo');
    if (props.stock < 0) throw new Error('El stock no puede ser negativo');
  }

  get id(): string {
    return this.props.id;
  }
  get name(): string {
    return this.props.name;
  }
  get category(): string {
    return this.props.category;
  }
  get price(): number {
    return this.props.price;
  }
  get stock(): number {
    return this.props.stock;
  }
  get description(): string {
    return this.props.description;
  }
  get imageUrl(): string {
    return this.props.imageUrl;
  }
  get createdAt(): string {
    return this.props.createdAt;
  }

  hasStock(quantity: number): boolean {
    return this.props.stock >= quantity;
  }

  toJSON(): ProductProps {
    return { ...this.props };
  }
}
