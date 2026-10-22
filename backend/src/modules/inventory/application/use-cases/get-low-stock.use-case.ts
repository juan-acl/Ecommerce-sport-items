import { ProductRepository } from '@modules/products/domain/repositories/product.repository';
import { PurchaseRepository } from '@modules/purchases/domain/repositories/purchase.repository';
import { InventoryMovementRepository } from '@modules/inventory/domain/repositories/inventory-movement.repository';

export type StockStatus = 'new' | 'low' | 'out';

export interface StockAlertItem {
  id: string;
  name: string;
  category: string;
  imageUrl?: string;
  stock: number;
  minStock: number;
  incomingQty: number;
  status: StockStatus;
}

export class GetLowStockUseCase {
  constructor(
    private readonly productRepo: ProductRepository,
    private readonly purchaseRepo: PurchaseRepository,
    private readonly movementRepo: InventoryMovementRepository,
  ) {}

  async execute(): Promise<StockAlertItem[]> {
    const products = await this.productRepo.findBelowMinStock();
    if (products.length === 0) return [];

    // Get all pending/partial purchases to know what's "en camino"
    const activePurchases = await this.purchaseRepo.listActive();

    // Build incomingQty map: productId → units still to arrive
    const incomingMap = new Map<string, number>();
    for (const purchase of activePurchases) {
      for (const item of purchase.items) {
        const alreadyReceived = purchase.getReceivedQty(item.productId);
        const remaining = item.quantity - alreadyReceived;
        if (remaining > 0) {
          incomingMap.set(item.productId, (incomingMap.get(item.productId) ?? 0) + remaining);
        }
      }
    }

    const results: StockAlertItem[] = [];

    for (const product of products) {
      const p = product.toJSON();
      const incomingQty = incomingMap.get(p.id) ?? 0;
      const available = p.stock + incomingQty;

      // Covered by incoming purchases — no alert needed
      if (available >= p.minStock) continue;

      let status: StockStatus;
      if (p.stock === 0 && incomingQty === 0) {
        // Distinguish "nuevo" (never had stock) from "agotado" (had stock, now zero)
        const hasMovements = await this.movementRepo.hasMovementsForProduct(p.id);
        status = hasMovements ? 'out' : 'new';
      } else {
        status = 'low';
      }

      results.push({
        id: p.id,
        name: p.name,
        category: p.category,
        imageUrl: p.imageUrl,
        stock: p.stock,
        minStock: p.minStock,
        incomingQty,
        status,
      });
    }

    return results;
  }
}
