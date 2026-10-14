import { Supplier, SupplierProps } from '@modules/suppliers/domain/entities/supplier.entity';

export class SupplierMapper {
  static toDomain(item: Record<string, unknown>): Supplier {
    const props: SupplierProps = {
      id: item.id as string,
      name: item.name as string,
      contactName: item.contactName as string,
      email: item.email as string,
      phone: item.phone as string,
      address: item.address as string,
      isActive: item.isActive as boolean,
      createdAt: item.createdAt as string,
    };
    return new Supplier(props);
  }

  static toItem(supplier: Supplier): Record<string, unknown> {
    return {
      PK: `SUPPLIER#${supplier.id}`,
      SK: 'METADATA',
      GSI1PK: 'SUPPLIER',
      GSI1SK: supplier.id,
      GSI2PK: `EMAIL#${supplier.email}`,
      GSI2SK: `SUPPLIER#${supplier.id}`,
      ...supplier.toJSON(),
    };
  }
}
