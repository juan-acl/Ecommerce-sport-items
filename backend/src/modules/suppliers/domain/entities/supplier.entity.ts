export interface SupplierProps {
  id: string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  isActive: boolean;
  createdAt: string;
}

export class Supplier {
  constructor(private readonly props: SupplierProps) {}

  get id(): string { return this.props.id; }
  get name(): string { return this.props.name; }
  get contactName(): string { return this.props.contactName; }
  get email(): string { return this.props.email; }
  get phone(): string { return this.props.phone; }
  get address(): string { return this.props.address; }
  get isActive(): boolean { return this.props.isActive; }
  get createdAt(): string { return this.props.createdAt; }

  deactivate(): Supplier {
    return new Supplier({ ...this.props, isActive: false });
  }

  toJSON(): SupplierProps {
    return { ...this.props };
  }
}
