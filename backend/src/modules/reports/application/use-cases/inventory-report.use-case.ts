import { ProductRepository } from '@modules/products/domain/repositories/product.repository';
import { InventoryMovementRepository } from '@modules/inventory/domain/repositories/inventory-movement.repository';

export interface LowStockProduct {
  id: string;
  name: string;
  stock: number;
  minStock: number;
}

export interface InventoryReportResult {
  totalProducts: number;
  totalStockValue: number;
  lowStockProducts: LowStockProduct[];
  recentMovements: ReturnType<import('@modules/inventory/domain/entities/inventory-movement.entity').InventoryMovement['toJSON']>[];
}

export class InventoryReportUseCase {
  constructor(
    private readonly productRepo: ProductRepository,
    private readonly movementRepo: InventoryMovementRepository,
  ) {}

  async execute(): Promise<InventoryReportResult> {
    // Fetch all products in pages
    const allProducts: import('@modules/products/domain/entities/product.entity').Product[] = [];
    let cursor: string | undefined;

    do {
      const page = await this.productRepo.list({ limit: 100, cursor });
      allProducts.push(...page.items);
      cursor = page.nextCursor;
    } while (cursor);

    const totalProducts = allProducts.length;
    const totalStockValue = parseFloat(
      allProducts.reduce((sum, p) => sum + p.stock * p.price, 0).toFixed(2),
    );
    const lowStockProducts: LowStockProduct[] = allProducts
      .filter((p) => p.stock <= p.minStock)
      .map((p) => ({ id: p.id, name: p.name, stock: p.stock, minStock: p.minStock }));

    // Fetch recent movements
    const movementsPage = await this.movementRepo.list({ limit: 20 });
    const recentMovements = movementsPage.items.map((m) => m.toJSON());

    return { totalProducts, totalStockValue, lowStockProducts, recentMovements };
  }
}
