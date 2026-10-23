export type MovementType = 'purchase' | 'sale' | 'return' | 'adjustment';
export type MovementFilter = MovementType | 'all';

interface Movement {
  id: string;
  productName: string;
  type: MovementType;
  quantity: number;
  createdAt: string;
}

interface LowStockProduct {
  id: string;
  name: string;
  stock: number;
  minStock: number;
}

export function filterMovementsByType(movements: Movement[], filter: MovementFilter): Movement[] {
  if (filter === 'all') return movements;
  return movements.filter((m) => m.type === filter);
}

export function filterLowStockByName(products: LowStockProduct[], search: string): LowStockProduct[] {
  const term = search.trim().toLowerCase();
  if (!term) return products;
  return products.filter((p) => p.name.toLowerCase().includes(term));
}

export function filterOrdersByStatus(
  ordersByStatus: Record<string, number>,
  filter: string,
): Record<string, number> {
  if (filter === 'all') return ordersByStatus;
  if (!(filter in ordersByStatus)) return {};
  return { [filter]: ordersByStatus[filter] };
}
